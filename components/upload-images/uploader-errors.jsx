import React from 'react';


const UploaderErrors = (props) => {

  return (
    <div className={"b-uploaderErrors" + ( props.hidden ? ' -state_hidden' : '' )}>{props.errors}</div>
  );

}

export default UploaderErrors;