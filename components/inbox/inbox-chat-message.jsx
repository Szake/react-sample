import React from 'react';


const Avatar = (props) => {

  if (props.self) return null;

  return (
    <figure className={'b-message__user' + (props.user.photo && props.user.photo.length ? '' : ' no-avatar')}>
      { props.user.photo && props.user.photo.length > 0 ? <img className="b-message__avatar" src={props.user.photo} /> : null }
    </figure>
  );
};
const Content = (props) => {
  return (
    <div className="b-message__content">
      <p className="b-message__txt" dangerouslySetInnerHTML={{__html: props.text}} />
      {/*<p className="b-message__txt" dangerouslySetInnerHTML={{__html: '111 <br> 222 <br/> 333 </br> 4444'}} />*/}
      {/*<p className="b-message__txt">{props.text}</p>*/}
      <span className="b-message__date">{props.date}</span>
    </div>
  );
};
const Message = (props) => {
  return (
    <div className={'b-message' + (props.data.isMine ? ' -type_self' : '')}>
      <Avatar self={props.data.isMine} user={props.user} />
      <Content text={props.data.text} date={props.data.date} />
    </div>
  );
};


export default (props) => {
  if (!props.show) return null;

  let Items = props.list.map(function(item, i) {
    return (
      <div className="b-inbox__message" key={i}>
        <Message data={item} user={item.isMine ? props.users.self : props.users.other[item.user]} />
      </div>
    );
  });

  return (
    <div className="b-inbox__messages">
      <div className="b-inbox__messagesInner">
        {Items}
      </div>
    </div>
  );
}