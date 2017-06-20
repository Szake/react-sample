import React from 'react';


const Link = (props) => {

  if (!props.data) return null;

  // Unique TYPE + ID:
  let linkID = props.data.type + (props.data.id ? ('-' + props.data.id) : '');
  let classActive = (linkID === props.activeId && !props.isAll) ? ' -state_active' : '';

  let classActiveParents = '';

  if (props.data.folders && props.data.folders.length) {
    props.data.folders.map(function (item) {
      if (item.type == props.activeId || item.type + '-' + item.id  == props.activeId || props.activeId == 'inbox') {
        classActiveParents = ' -state_activeParents';
      }
    });
  }


  return (

      <div className={'b-inboxMenu__link' + classActive + classActiveParents}
           data-id={linkID + ' ' + props.data.letterCount}
           onClick={ props.isAll ? false : () => props.selectEvent(linkID) }>
        {props.data.title} {props.data.letterCount ? `(${props.data.letterCount})` : '' }
      </div>
  );
};

const SubFolders = (props) => {
  if (!props.data.folders || !props.data.folders.length) return null;

  let ItemAll = () => {
    if (!props.isAll) return null;

    let data = {
      type: props.data.type, // + '-all',
      title: 'All',
      letterCount: props.data.letterCount
    };

    return (
        <Item data={data} activeId={props.activeId} selectEvent={props.selectEvent} />
    );
  };

  return (
      <ul className="b-inboxMenu__sub">
        <ItemAll />
        { props.data.folders.map(function (item, i, items) {
          return <Item data={item} activeId={props.activeId} selectEvent={props.selectEvent} key={i} />;
        }) }
      </ul>
  );
};

const Item = (props) => {
  if (!props.data) return null;

  return (
      <li className="b-inboxMenu__item">
        <Link data={props.data} activeId={props.activeId} selectEvent={props.selectEvent} isAll={props.isAll} />
        <SubFolders data={props.data} activeId={props.activeId} selectEvent={props.selectEvent} isAll={props.isAll} />
      </li>
  );
};

const Folders = (props) => {
  if (!props.list || !props.list.length) return null;

  return (
      <nav className="b-inboxMenu">
        <div className="b-inboxMenu__close" onClick={props.toggleAsideEvent} />
        <ul className="b-inboxMenu__list">
          { props.list.map(function (item, i, items) {
              return <Item data={item} activeId={props.activeId} selectEvent={props.selectEvent} isAll={i === 0} key={i} />;
          }) }
        </ul>
      </nav>
  );
};

const AddNewFolder = (props) => {

  const Content = ((state) => {
    switch (state) {
      case 'form': {
        return (
            <form className="b-inboxAddFolder__form" name="addfolder" onSubmit={ props.addSubmitEvent }>
              <div className="b-inboxAddFolder__label">Type the title:</div>
              <div className="b-inboxAddFolder__control">
                <input className="b-inboxAddFolder__field" name="addfolder-field" type="text" />
                <input className="b-inboxAddFolder__submit" name="addfolder-submit" type="submit" value="Add" />
              </div>
            </form>
        );
      }
      case 'error': {
        return (
            <div className="b-inboxAddFolder__error">New folder wasn't created. Please try again later.</div>
        );
      }
      case 'link': {
        return (
            <div className="b-inboxAddFolder__link" onClick={ props.addClickEvent }>+ Add folder</div>
        );
      }
    };
  })(props.state);

  return (
      <div className="b-inboxAddFolder">
        {Content}
      </div>
  );
};

export default (props) => {

  return (
      <div className="b-inbox__aside-inner">
        <div className="b-inbox__aside-toggle" onClick={props.toggleAsideEvent}>Select folder...</div>
        <div className="b-inbox__aside-content">
          <Folders list={props.list} activeId={props.activeId} selectEvent={props.selectEvent} toggleAsideEvent={props.toggleAsideEvent} />
          <AddNewFolder state={props.addState} addClickEvent={props.addClickEvent} addSubmitEvent={props.addSubmitEvent} />
        </div>
      </div>
  );
}