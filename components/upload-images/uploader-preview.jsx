import React from 'react';
import UploaderPreviewCover from './uploader-preview-cover.jsx';
import UploaderPreviewList from './uploader-preview-list.jsx';


const UploaderPreview = (props) => {
  let state_hidden = props.hidden ? ' -state_hidden' : '';
  let state_loading = props.load ? ' -state_loading' : '';

  return (
    <div className={"b-uploaded" + state_hidden + state_loading}>
      <UploaderPreviewCover item={props.cover} controls={props.controls}/>
      <UploaderPreviewList cover={props.cover} items={props.gallery} controls={props.controls}/>
    </div>
  );

};

export default UploaderPreview;