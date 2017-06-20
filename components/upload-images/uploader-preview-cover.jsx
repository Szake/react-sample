import React from 'react';


const UploaderPreviewCover = (props) => {

  return (
    <div className={"b-uploadedCover js-uploaded__cover" + (props.item && props.item.id ? " -state_selected" : "")}>
      <div className="b-uploadedCover__image js-uploaded__coverImage" style={props.item ? {backgroundImage: `url(\'${props.item.thumbnail}\')`} : null}></div>
      <div className="b-uploadedCover__placeholder">
        <div className="b-uploadedCover__placeholder-title">Cover Photo</div>
        <div className="b-uploadedCover__placeholder-descr">Please select the cover photo below</div>
      </div>
      <div className="b-uploadedCover__controls b-uploadedControls">
        <a className="b-uploadedControls__item -type_delete" onClick={(e) => { e.preventDefault(); props.controls.deleteItem(props.item); }} href="#">Delete</a>
      </div>
    </div>
  );

};

export default UploaderPreviewCover;