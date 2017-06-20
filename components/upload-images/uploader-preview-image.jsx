import React from 'react';


const UploaderPreviewImage = (props) => {

  return (
    <div className="b-uploadedImage">
      <div className="b-uploadedImage__img" style={{backgroundImage: `url(\'${props.item.thumbnail}\')`}}></div>
      <div className="b-uploadedControls">
        <a className="b-uploadedControls__item -type_delete" onClick={(e) => { e.preventDefault(); props.controls.deleteItem(props.item); }} href="#">Delete</a>
        <a className="b-uploadedControls__item -type_use" onClick={(e) => { e.preventDefault(); props.controls.useAsCover(props.item); }} href="#">Use as cover</a>
        <a className="b-uploadedControls__item -type_preview js-galleryPopup" rel="uploaded-photos" href={props.item.src}>Preview</a>
      </div>
    </div>
  );

};

export default UploaderPreviewImage;