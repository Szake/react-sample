import React from 'react';


export default (props) => {

  let Items = props.list.map(function(item, i) {

    return (
      <div className={'b-contactList__item' + (item.id === props.active ? ' -state_active' : '') + (item.unread ? ' -state_unread' : '')} onClick={ () => props.selectEvent(item.id) } key={i}>
        <figure className={'b-contactList__avatarWrapper' + (item.user.photo && item.user.photo.length ? '' : ' no-avatar')}>
          { item.user.photo && item.user.photo.length > 0 ? <img className="b-contactList__avatar" src={item.user.photo}/> : null }
        </figure>
        <div className="b-contactList__info">
          <div className="b-contactList__head">
            <span className="b-contactList__name">{item.title}</span>
            <span className="b-contactList__date">{item.date}</span>
          </div>
          <div className="b-contactList__msg">
            <p className="b-contactList__msgTxt">{item.subject}</p>
          </div>
        </div>
      </div>
    );

  });

  let NoData = <div className="b-contactList__noData">No contacts to review...</div>;

  return (

    <div className="b-contactList__usr">
      <div className="b-contactList__usrInner">
        {props.list.length ? Items : NoData}
      </div>
    </div>

  );
}
