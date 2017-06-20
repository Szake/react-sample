import React from 'react';
import UploaderPreviewImage from './uploader-preview-image.jsx';


const UploaderPreviewList = (props) => {

  let Items = props.items.map((item, i) => {
    return (<li className={"b-uploadedList__item js-sortable" + (item.id === props.cover && props.cover.id ? ' -state_current' : '')} key={item.id || i} data-id={item.id} data-position={item.position} >
      <UploaderPreviewImage item={item} controls={props.controls} />
    </li>);
  });

  return (
    <ul className="b-uploadedList">
      {Items}

      <li className="b-uploadedList__item">
        <div className="b-uploadedMore" onClick={props.controls.uploadFile}>
          <span className="b-uploadedMore__placeholder">Add Photos</span>
          <span className="b-uploadedMore__loader"></span>
        </div>
      </li>
    </ul>
  );

}

export default UploaderPreviewList;