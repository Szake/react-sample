import React from 'react';


export default (props) => {
  if (!props.show) return null;

  return (
      <div className="b-contactList__noData">No messages to review...</div>
  );
}