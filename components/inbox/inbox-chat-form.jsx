import React from 'react';


const Error = (props) => {
  if (!props.show) return null;

  return (
      <div className="b-inboxForm__error">Message was not sent. Please try again later.</div>
  );
};

export default (props) => {
  if (!props.show) return null;
  if (props.activeId.split('-')[0] == 'system' ) return null;

  // OTHER and SELF are type of OBJECT:
  // Loop the keys as users IDs
  let members_list = props.users.other ? Object.keys(props.users.other).map((userId, i) => {
        let user = props.users.other[userId];
        return `${user.firstName} ${user.lastName}`;
      }) : [];

  return (

      <form className={'b-inboxForm b-form' + (props.error ? ' -state_error' : '')} name="chatform" onSubmit={ props.submitEvent }>
        <Error show={props.error}/>
        <textarea className="b-inboxForm__input" name="chatform-field" value={props.text} onKeyDown={ props.typePressEvent } onChange={ props.typeChangeEvent } placeholder={ members_list.join(', ') } maxLength={props.maxlength}></textarea>
        <div className="b-inboxForm__control">
          <div className="b-inboxForm__calc">{props.length || 0} of {props.maxlength || 0} symbols</div>
          <input className="b-inboxForm__btn b-button" name="chatform-submit" value="Send" type="submit" disabled={props.disabled} />
        </div>
      </form>

  );
}