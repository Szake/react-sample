import FSBO from '../../../main/';
import React from 'react';

import InboxFoldersComponent from './inbox-folders.jsx';
import InboxSearchComponent from './inbox-users-search.jsx';
import InboxUsersComponent from './inbox-users-list.jsx';
import InboxChatPanelComponent from './inbox-chat-panel.jsx';
import InboxChatMessageComponent from './inbox-chat-message.jsx';
import InboxChatFormComponent from './inbox-chat-form.jsx';
import InboxChatNoDataComponent from './inbox-chat-nodata.jsx';


export const COMPONENT_DOM_NODE_CLASS = '.js-inbox';
export const ComponentName = 'InboxComponent';


class InboxComponent extends React.Component {

  constructor() {
    super();
    this.state = {
      folders: [],
      foldersLoad: false, // boolean
      foldersUpdateId: null, // timeout
      folderActiveId: null, // /[a-z]+(\-([0-9]+|all))?/  --> inbox || inbox-4 || inbox-all

      addFolderState: 'link',

      users: [],
      usersLoad: false, // boolean
      usersUpdateId: null, // timeout
      userActiveId: null, // /\d+/  --> 10 || 100 || ...

      chatUsers: {},
      chatSubject: {},
      chatMessages: [],
      chatLoad: false, // boolean
      chatMove: false, // boolean
      chatMoveError: false, // boolean
      chatTrashError: false, // boolean
      chatUpdateId: null, // timeout
      chatFolderId: null,
      chatUserId: null,

      messageText: '',
      messageLength: 0,
      messageMaxLength: 2500,
      messageError: false, // boolean
      messageSend: false,

      searched: '',
      searchedUsers: [],
      moveToListStatus: false
    };

    this.settings = {
      update: {
        folders: 30000,
        users: 30000,
        messages: 10000
      }
    }
  }

  render() {

    return (
      <div className="b-inbox">
        <aside className="b-inbox__aside">
          <InboxFoldersComponent list={this.state.folders}
                                 activeId={this.state.folderActiveId}
                                 selectEvent={this.selectFolder.bind(this)}
                                 addState={this.state.addFolderState}
                                 addClickEvent={this.addFolderLink.bind(this)}
                                 addSubmitEvent={this.addFolderSubmit.bind(this)}
                                 toggleAsideEvent={this.toggleFoldersMenu} />
        </aside>
        <div className="b-inbox__main">

          <div className="b-inbox__contacts">
            <div className="b-contactList">
              <InboxSearchComponent searched={this.state.searched}
                                    searchEvent={this.searchUsers.bind(this)} />

              <InboxUsersComponent list={this.state.searchedUsers}
                                   active={this.state.userActiveId}
                                   selectEvent={this.selectUser.bind(this)} />
            </div>
          </div>

          <div className="b-inbox__chat">
            <InboxChatPanelComponent users={this.state.chatUsers}
                                     subject={this.state.chatSubject}
                                     show={!!this.state.chatMessages.length}
                                     folders={this.state.folders}
                                     parentFolderId={this.state.chatFolderId}
                                     changeFolderEvent={this.moveToFolder.bind(this)}
                                     trashEvent={this.trashDiscuss.bind(this)}
                                     toggleEvent={this.toggleMoveList.bind(this)}
                                     moveToListStatus={this.state.moveToListStatus}
                                     changeTrashError={this.state.chatTrashError}
                                     changeFolderError={this.state.chatMoveError}
                                     backEvent={this.navToList.bind(this)} />

            <InboxChatMessageComponent users={this.state.chatUsers}
                                       list={this.state.chatMessages}
                                       show={!!this.state.chatMessages.length} />

            <InboxChatFormComponent users={this.state.chatUsers}
                                    text={this.state.messageText}
                                    length={this.state.messageLength}
                                    maxlength={this.state.messageMaxLength}
                                    disabled={!this.state.userActiveId}
                                    error={this.state.messageError}
                                    typePressEvent={this.typeMessagePress.bind(this)}
                                    typeChangeEvent={this.typeMessageChange.bind(this)}
                                    submitEvent={this.sendMessage.bind(this)}
                                    activeId={this.state.folderActiveId}
                                    show={!!this.state.chatMessages.length} />

            <InboxChatNoDataComponent show={!this.state.chatMessages.length} />
          </div>
        </div>
      </div>
    );

  }


  /* Component States: */

  componentDidMount() {
    FSBO.reactComponents = FSBO.reactComponents || {};
    FSBO.reactComponents[ComponentName] = this;

    this.getFolders();
    this.urlHashChange();
    this.mailUrl();
  }
  // componentWillUpdate(nextProps, nextState) {}
  componentDidUpdate(prevProps, prevState) {
    // Scroll chat area immediately down when component update:
    if (prevState.userActiveId !== this.state.userActiveId) {
      this.scrollMessage();
    }

    // When got new messages or new users REQUEST FOLDERS again:
    if ((this.state.folderActiveId === prevState.folderActiveId) && (this.state.users.length !== prevState.users.length)) {
      this.getFolders();
    }
    else if ((this.state.userActiveId === prevState.userActiveId) && (this.state.chatMessages.length !== prevState.chatMessages.length)) {
      this.getFolders();
    }
  }


  mailUrl(){

    $(document).on('click', '[rel=mailto]', '.js-inbox', (e) => {
      e.preventDefault();
      const userId = Object.keys(this.state.chatUsers.other)[0];
      const prodId = this.state.chatSubject.id;


      let popup = KCMS.findWidget('ActivePopup', '.js-mailbox');
      if (popup) {
        let form = popup.assocWidget();
        if (form instanceof KcmsActiveForm) {
          form.url(form.widget().attr('action') + `/${prodId}/${userId}`);
          form.onResult( (data) =>  {
            if (data.result) {
              if (data.link) document.location.href = data.link;
              //   // REQUEST DATA:
              // document.location.href  = `${document.location.href.split('#')[0]}#${data.link('#')[1]}`;
              this.urlHashChange(e);
            }
          });

          popup.open();
        }
      }
    });

    // $(document).on('click', 'a[rel=mailto]', (e) => {
    //   e.preventDefault();
    //   const el = e.target;
    //   const data = el.getAttribute('href').replace('#', '');
    //   const url = '/mailbox/thread_find';
    //   let successCallback = (responseData) => {
    //
    //     if (responseData.result) {
    //       document.location.href  = `${document.location.href.split('#')[0]}#${responseData.link.split('#')[1]}`;
    //       this.urlHashChange(e);
    //     } else {
    //       FSBO.dev && console.log(`Error: ${responseData.message}`);
    //     }
    //
    //   };
    //   let errorCallback = (error) => {
    //     FSBO.dev && console.log('success', error);
    //   };
    //
    //   // REQUEST DATA:
    //   this.sendData(url, data,  successCallback, errorCallback, null);
    // });

  }

  /* Custom: */

  selectFolder(folderId) { // "type" + "-" + "id"
    if (this.state.folderActiveId === folderId ) return;
    // console.log('Folder is selected...', folderId);


    // CLEAR USERS DATA:
    this.state.userActiveId = null;
    // CLEAR USERS DEFERRED CALL:
    clearTimeout(this.state.usersUpdateId);


    // CLEAR CHAT DATA:
    this.state.chatUsers = {};
    this.state.chatSubject = {};
    this.state.chatMessages = [];
    // this.state.chatFolderId = null,
    // this.state.chatUserId = null,
    // CLEAR CHAT MESSAGES DEFERRED CALL:
    clearTimeout(this.state.chatUpdateId);


    // CLEAR MESSAGES DATA:
    this.state.messageText = '';
    this.state.messageLength = 0;
    this.state.messageError = false;
    this.state.chatMoveError = false;

    this.getUsers(folderId, () => { this.toggleFoldersMenu(false); });
  }
  selectUser(userId) { // "id"
    this.navToChat(); // for mobile view

    if (this.state.userActiveId === userId ) return;
    // console.log('User is selected...', userId);

    this.state.messageError = false;
    this.state.chatMoveError = false;
    this.getMessages(userId, () => { this.navToChat(); });

    this.setState({
      moveToListStatus: false
    });
  }

  getFolders() {
    const url = '/mailbox/folder';
    // console.log('FOLDERS by URL: ', url);

    // PREVENT if REQUEST is already DONE:
    if (this.state.foldersLoad) return;

    // CLEAR previous DEFERRED CALL:
    clearTimeout(this.state.foldersUpdateId);

    // MARK the REQUEST is STARTED:
    this.state.foldersLoad = true;

    // Callbacks:
    let successCallback = (responseData) => {
      if (!responseData.result) return false;

      let newState = { ...this.state};
      newState.folders = responseData.data;

      // Set first FOLDER as current if current was not set:
      if (this.state.folderActiveId === null && responseData.data.length) {
        newState.folderActiveId = responseData.data[0].type + (responseData.data[0].id ? ('-' + responseData.data[0].id) : '');
        // Load users of the FIRST FOLDER:
        this.getUsers(newState.folderActiveId); // State is updated again with loaded Users
      }

      this.setState(newState);

      // console.log('FOLDERS: ', this.state.folders);
    };
    let errorCallback = (error) => {};
    let alwaysCallback = () => {
      // MARK the REQUEST is FINISHED:
      this.state.foldersLoad = false;

      // Call 'getFolders' function again w/o any parameters':
      // console.log('DEFERRED CALL FOLDERS: no params);
      this.state.foldersUpdateId = setTimeout(() => { this.getFolders() }, this.settings.update.folders);
    };

    // REQUEST DATA:
    this.getData(url, successCallback, null, alwaysCallback);
  }
  getUsers(params, callback, isSucceed) {
    // Folder 'ALL' is able to have substring '-all'. Get rid of it:
    const url = `/mailbox/folder/${params}`;
    // console.log('USERS by URL: ', url);

    // PREVENT if REQUEST is already DONE:
    if (this.state.usersLoad) return;

    // CLEAR previous DEFERRED CALL:
    clearTimeout(this.state.usersUpdateId);

    // MARK the REQUEST is STARTED:
    this.state.usersLoad = true;

    // Callbacks:
    let successCallback = (responseData) => {
      if (!responseData.result || !responseData.data) return false;
      this.setState({
        users: responseData.data,
        searched: '',
        searchedUsers: responseData.data,
        folderActiveId: params
      });

      // console.log('USERS in FOLDER: ', responseData.data);

      // And finally CALLBACK:
      if (isSucceed) {
        responseData.result && responseData.data && responseData.data.length && callback && callback();
      }
      else {
        callback && callback();
      }
    };
    let errorCallback = (error) => {};
    let alwaysCallback = () => {
      // MARK the REQUEST is FINISHED:
      this.state.usersLoad = false;

      // Call 'getUsers' function again with current 'folderActiveId':
      // console.log('DEFERRED CALL USERS with ID: ', this.state.folderActiveId);
      !!this.state.folderActiveId && (this.state.usersUpdateId = setTimeout(() => { this.getUsers(this.state.folderActiveId) }, this.settings.update.users));
    };

    // REQUEST DATA:
    this.getData(url, successCallback, null, alwaysCallback);
  }
  getMessages(params, callback, isSucceed) {
    const url = `/mailbox/thread/${params}`;
    // console.log('MESSAGES by URL: ', url);

    // PREVENT if REQUEST is already DONE:
    if (this.state.chatLoad) return;

    // CLEAR previous DEFERRED CALL:
    clearTimeout(this.state.chatUpdateId);

    // MARK the REQUEST is STARTED:
    this.state.chatLoad = true;

    // Callbacks:
    let successCallback = (responseData) => {
      if (!responseData.result || !responseData.data) return false;
      this.setState({
        chatUsers: responseData.data.users,
        chatSubject: responseData.data.subject,
        chatMessages: responseData.data.thread,
        chatFolderId: this.state.folderActiveId,
        chatUserId: params,
        userActiveId: params
      });

      // console.log('MESSAGES for USER: ', responseData.data);

      // And finally CALLBACK:
      if (isSucceed) {
        responseData.result && responseData.data && responseData.data.length && callback && callback();
      }
      else {
        callback && callback();
      }
    };
    let errorCallback = (error) => {};
    let alwaysCallback = () => {
      // MARK the REQUEST is FINISHED:
      this.state.chatLoad = false;

      // Call 'getMessages' function again with current 'userActiveId':
      // console.log('DEFERRED CALL MESSAGES with ID: ', this.state.userActiveId);
      !!this.state.userActiveId && (this.state.chatUpdateId = setTimeout(() => { this.getMessages(this.state.userActiveId) }, this.settings.update.messages));
    };

    // REQUEST DATA:
    this.getData(url, successCallback, null, alwaysCallback);
  }

  // For 'getUsers' and 'getMessages' CALLBACK means some logic that should be done after all tasks and requests are done
  // Like scroll when new message is added

  addFolderLink(e) {
    e.preventDefault();

    this.setState({
      addFolderState: 'form'
    });
  }
  addFolderSubmit(e) {
    e.preventDefault();

    let form = e.target,
        field = form.elements['addfolder-field'],
        folder_title = field.value;
    let url = '/mailbox/folder_ctl',
        url_data = `action=add&name=${folder_title}`;

    if (!folder_title) return;
    // console.log('ADD FOLDER by URL with TITLE: ', url, folder_title);

    // Callbacks:
    let successCallback = (responseData) => {
      if (responseData.result) {
        this.setState({
          folders: this.state.folders.concat(responseData.data),
          addFolderState: 'link'
        });
      }
      else {
        throw new Error('The message was not sent.');
      }
    };
    let errorCallback = () => {
      this.setState({
        addFolderState: 'error'
      });
    };
    let alwaysCallback = () => {};

    // SEND DATA to add NEW FOLDER:
    this.sendData(url, url_data, successCallback, errorCallback, null);
  }

  searchUsers(e) {
    let searchString = e.target.value.toLowerCase();

    if (!this.state.users.length) return;

    if (searchString.length === 0) {
      this.setState({ searched: '', searchedUsers: [...this.state.users] });
      // console.log('SEARCH EMPTY: ', this.state.searchedUsers, searchString);
    }
    else {
      let filteredUsers = this.state.users.filter(function(user, i) {
        return user.title.toLowerCase().indexOf(searchString) !== -1 || user.subject.toLowerCase().indexOf(searchString) !== -1;
      });
      this.setState({ searched: searchString, searchedUsers: filteredUsers });
      // console.log('SEARCH STRING: ', this.state.searchedUsers, searchString);
    }
  }

  toggleMoveList(e){
    this.setState({moveToListStatus: !this.state.moveToListStatus});
  }

  trashDiscuss(e){
    let select = e.target,
        message_id = this.state.chatUserId;

    let url = '/mailbox/message_ctl',
        url_data = `action=trash&id=${message_id}`;

    FSBO.dev && console.log('TRASHED!!!!!!!!!!', message_id);

    let successCallback = (responseData) => {
      if (responseData.result) {
        // Clear Chat area:
        this.state.chatUsers = {};
        this.state.chatSubject = {};
        this.state.chatMessages = [];
        this.state.chatTrashError = false;

        // Update Folders and Users:
        this.getFolders();
        this.getUsers(this.state.folderActiveId);
        this.navToList(); // for mobile view
      }
      else {
        throw new Error('Message wasn\'t trashed. An error occurred. Try again later.');
      }
    };
    let errorCallback = () => {
      this.setState({
        chatTrashError: true,
        moveToListStatus: false
      });

      setTimeout(() => {
        this.setState({
          chatTrashError: false
        });
      }, 3000);
    };

    let alwaysCallback = () => {
      this.state.chatTrashError = false;
    };

    // SEND DATA:
    this.sendData(url, url_data, successCallback, errorCallback, alwaysCallback);

  }

  moveToFolder(e) {
    let select = e.target,
        message_id = this.state.chatUserId,
        // folder_id = select.value;
        folder_id = select.getAttribute('data-value');

    let url = `/mailbox/message_ctl`,
        url_data = `action=move&id=${message_id}&folder=${folder_id}`;

    if (!message_id || !folder_id) return;
    // console.info('CHANGE FOLDER by URL with VALUE: ', url, url_data);

    // Disable select:
    select.disabled = true;

    // MARK the REQUEST is STARTED:
    this.state.chatMove = false;

    // Callbacks:
    let successCallback = (responseData) => {
      if (responseData.result) {
        // Clear Chat area:
        this.state.chatUsers = {};
        this.state.chatSubject = {};
        this.state.chatMessages = [];
        this.state.chatMoveError = false;

        // Update Folders and Users:
        this.getFolders();
        this.getUsers(this.state.folderActiveId);
        this.navToList();
      }
      else {
        throw new Error('The message was not moved to another folder.');
      }
    };
    let errorCallback = () => {
      this.setState({
        chatMoveError: true,
        moveToListStatus: false
      });

      setTimeout(() => {
        this.setState({
          chatMoveError: false
        });
      }, 3000);
    };
    let alwaysCallback = () => {
      // MARK the REQUEST is FINISHED:
      this.state.chatMove = false;

      // Enable select:
      select.disabled = false;
    };

    // SEND DATA:
    this.sendData(url, url_data, successCallback, errorCallback, alwaysCallback);
  }
  typeMessagePress(e) {
    if (!e.ctrlKey && e.key.toLowerCase() === 'enter') {
      e.preventDefault();
      this.sendMessage(e);
    }
    else if (e.ctrlKey && e.key.toLowerCase() === 'enter') {
      e.preventDefault();

      let message = e.target.value + '\n',
          message_length = message.length;

      this.setState({
        messageText: message,
        messageLength: message_length
      });
    }
  }
  typeMessageChange(e) {
    let field = e.target,
        message_text = field.value,
        message_length = field.value.length;

    if (message_length > this.state.messageMaxLength) return;

    this.setState({
      messageText: message_text,
      messageLength: message_length,
      messageError: false
    });
  }
  sendMessage(e) {
    e.preventDefault();

    // PREVENT if REQUEST is already DONE:
    if (this.state.messageSend) return;

    let form = e.target.form || e.target,
        textarea = form.elements['chatform-field'],
        button = form.elements['chatform-submit'],
        message = textarea.value;
    let url = `/mailbox/message/${this.state.userActiveId}`,
        url_data = `text=${message}`;

    if (!message.length) return;
    // console.log('POST MESSAGE by URL with MESSAGE: ', url, message);

    // Clear textarea value:
    // Seems like REQUEST is much faster than COMPONENT UPDATE !!!
    textarea.value = '';

    // Disable button:
    button.disabled = true;

    // MARK the REQUEST is STARTED:
    this.state.messageSend = false;

    // Callbacks:
    let successCallback = (responseData) => {
      if (responseData.result) {
        this.state.messageText = '';
        this.state.messageLength = 0;
        this.getMessages(this.state.userActiveId, this.scrollMessage);
      }
      else {
        throw new Error('The message was not sent.');
      }
    };
    let errorCallback = () => {
      // Mark FORM with ERROR:
      this.setState({
        messageText: '',
        messageLength: 0,
        messageError: true
      });
    };
    let alwaysCallback = () => {
      // MARK the REQUEST is FINISHED:
      this.state.messageSend = false;

      // Enable button:
      button.disabled = false;
    };

    // SEND DATA:
    this.sendData(url, url_data, successCallback, errorCallback, alwaysCallback);
  }
  scrollMessage() {
    let chatArea = document.querySelector('.b-inbox__messagesInner');
    chatArea.scrollTop = chatArea.scrollHeight - chatArea.clientHeight;
  }
  toggleFoldersMenu(state) {
    let block = document.querySelector('.b-inbox__aside');

    if (!block) return;

    if (!state || block.classList.contains('-state_expanded')) {
      block.classList.remove('-state_expanded');
      block.classList.add('-state_collapsed');
    }
    else {
      block.classList.remove('-state_collapsed');
      block.classList.add('-state_expanded');
    }
  }
  navToList() {
    let inbox = document.querySelector('.b-inbox');
    if (!inbox) return;
    inbox.classList.remove('-view_chat');
    inbox.classList.add('-view_list');
  }
  navToChat() {
    let inbox = document.querySelector('.b-inbox');
    if (!inbox) return;
    inbox.classList.remove('-view_list');
    inbox.classList.add('-view_chat');
  }

  urlHashChange(e) {
    let data = window.location.hash.replace('#', '').split('/');
    if (data.length < 2 || !data[0] || !data[1]) return;

    this.getUsers(data[0], () => { this.getMessages(data[1]); }, true);
  }

  /* Helpers: */
  getData(url, successCallback, errorCallback, alwaysCallback) {
    fetch(url, {
        method: 'GET',
        headers: new Headers({
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': -1
        }),
        credentials: 'same-origin'
      })
      .then(response => {
        if (response.status !== 200) {
          console.log(`Looks like there was a problem. Status Code: ${response.status}`);
          return;
        }
        return response.json();
      })
      .then(responseData => {
        successCallback && successCallback(responseData);
        alwaysCallback && alwaysCallback();
      })
      .catch(error => { console.log(error);
        errorCallback && errorCallback(error);
        alwaysCallback && alwaysCallback();
      });
  }
  sendData(url, data, successCallback, errorCallback, alwaysCallback) {
    fetch(url, {
        method: 'POST',
        headers: new Headers({
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': -1
        }),
        credentials: 'same-origin',
        body: data
      })
      .then(response => {
        if (response.status !== 200) {
          console.log(`Looks like there was a problem. Status Code: ${response.status}`);
          return;
        }
        return response.json();
      })
      .then((responseData) => {
        successCallback && successCallback(responseData);
        alwaysCallback && alwaysCallback();
      })
      .catch(error => { console.log(error);
        errorCallback && errorCallback(error);
        alwaysCallback && alwaysCallback();
      });
  }
}

export let Component = InboxComponent;