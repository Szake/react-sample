import React from 'react';


export default (props) => {

  return (

      <div className="b-contactList__search">
        <label className="b-contactList__searchWrapper">
          <input className="b-contactList__searchInput" onChange={props.searchEvent} value={props.searched} placeholder="Search contacts" type="search" />
        </label>
      </div>

  );
}