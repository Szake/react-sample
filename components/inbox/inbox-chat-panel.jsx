import React from 'react';


const InboxPanelDescr = (props) => {
  if (!props.subject) return <div></div>;

  let subject_name = props.subject.address ? `${props.subject.address.building} ${props.subject.address.address}` : '',
      subject_state = props.subject.address ? `${props.subject.address.city}, ${props.subject.address.state} ${props.subject.address.zip}` : '',
      subject_price = props.subject.price ? `$${props.subject.price}` : '';

  return (
      <a className="b-inboxPanel__desc" href={props.subject.url.view} target="_blank">
        <span className="b-inboxPanel__name">{subject_name}</span>
        <span className="b-inboxPanel__info">{subject_state + (subject_state && subject_price ? ` | ${subject_price}` : '')}</span>
      </a>
  );
};
const InboxPanelOffer = (props) => {
  if (!props.subject || !props.subject.url || !props.subject.url.offer || !props.subject.url.title) return null;
  return  <a className="b-button b-inboxPanel__btn" href={props.subject.url.offer}>{props.subject.url.title}</a>;
};
const InboxPanelMore = (props) => {
  if (!props.parentFolderId || ~props.parentFolderId.indexOf('system')) return null;

  // INBOX:
  let Options = props.folders
      .slice(0) // copy and then sort
      .sort(function(folder, i, folders) {
        if (folder.type === 'trash') { return 1; } // TRASH should be the last one
        else { return 0; } // Do not sort other
      })
      .filter(function(folder, i, folders) {
        let folderId = folder.type + (folder.id ? '-' + folder.id : '');

        // Set folderId as property not to duplicate it below:
        folder.folderId = folderId;

        return folder.type === 'custom' && folderId !== props.parentFolderId; // no inbox, sent, trash, system
      })
      .map(function(folder, i, folders) {
        return <li data-value={folder.folderId} key={i} onClick={props.changeFolderEvent}>{folder.title}</li>;
      });

  // Push first empty OPTION if there are custom folders:
  if (Options.length > 0) {
    Options.unshift(<li className="-type_title" data-value="default" key={-1}>Move to...</li>);
  }
  // Add trash link if letter is not already trashed:
  if (!~props.parentFolderId.indexOf('trash')) {
    Options.push(<li className="-type_trash" data-value="trash" key={-2} onClick={props.trashDiscuss}>Move to trash</li>);
  }

  // Return NULL if no Options set:
  if (Options.length === 0) return null;

  // RESULT:
  return (
      <div className="b-inboxPanel__control">
        <div className="b-inboxPanel__controlDropdown b-dropdown">
          <div className="b-dropdown__toggle" onClick={props.toggleEvent}></div>
          <div className={props.moveToListStatus ? 'b-dropdown__wrap -state_open' : 'b-dropdown__wrap'}>
            <ul className="b-dropdown__list">
              {Options}
            </ul>
          </div>
        </div>
        { props.changeFolderError ? <div className="b-inboxPanel__control-error">Message wasn't moved. An error occurred. Try again later.</div> : null }
        { props.changeTrashError ? <div className="b-inboxPanel__control-error">Message wasn't trashed. An error occurred. Try again later.</div> : null }
      </div>
  );
};

export default (props) => {
  if (!props.show) return null;

  // OTHER and SELF are type of OBJECT:
  // Loop the keys as users IDs
  let members_list = props.users.other ? Object.keys(props.users.other).map((userId, i) => {
        let user = props.users.other[userId];
        return `${user.firstName} ${user.lastName}`;
      }) : [];

  return (

      <div className="b-inboxPanel">
        <div className="b-inboxPanel__back" onClick={props.backEvent}>Back to all messages</div>
        <div className="b-inboxPanel__wrapper">
          <div className="b-inboxPanel__to">{ members_list.join(', ') }</div>

          <InboxPanelDescr subject={props.subject} />
          <InboxPanelOffer subject={props.subject} />
          <InboxPanelMore moveToListStatus={props.moveToListStatus} folders={props.folders} parentFolderId={props.parentFolderId} changeFolderEvent={props.changeFolderEvent} changeFolderError={props.changeFolderError} changeTrashError={props.changeTrashError} toggleEvent={props.toggleEvent} trashDiscuss={props.trashEvent} />

        </div>
      </div>

  );
}