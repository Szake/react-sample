import React from 'react';
import DropzoneComponent from 'react-dropzone-component';


// const uploader = document.getElementById('uploader');

const UploaderDropzone = (props) => {

  if (!uploader) return false;

  let componentConfig, eventHandlers, djsConfig;

  if (uploader) {
    componentConfig = {
      allowedFiletypes: ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
      showFiletypeIcon: false,
      postUrl: uploader.dataset.url || ''
    };
    eventHandlers = {
      init: function(dropzone) {
        window.dropzoneObject = dropzone;
      },
      addedfile: function(uploaded_file) {
        let counter = document.getElementById('_newPhoto');
        if (counter) {
          counter.value = +counter.value || 0;
          counter.value++;
        }

        // Update progress flag:
        props.controls.loadStart();
      },
      success: function(uploader_data, server_data) {
        let { id, src, thumbnail } = server_data;

        if (server_data.result && server_data.id) {
          FSBO.dev && console.info("New image is added to the list.");
          props.controls.addItem({ id, src, thumbnail }, server_data.isCover);
          return;
        }

        if (!server_data.success && server_data.error) {
          FSBO.dev && console.error(server_data.error);
          props.controls.showErrors(server_data.error);
          return;
        }

        // Stupid solution, but SYSTEM WORKS PERFECTLY!
        FSBO.dev && console.error('File was not uploaded.');
        props.controls.showErrors('An error occurred. Please try again later.');
        return;
      },
      queuecomplete: function() {
        dropzoneObject.removeAllFiles();

        // Update progress flag:
        props.controls.loadFinish();
      }
    };
    djsConfig = {
      addRemoveLinks: true,
      paramName: 'activeuploader_file',
      uploadMultiple: false
    };
  }

  return (
    <DropzoneComponent className={"b-dropzone -type_images" + ( props.hidden ? ' -state_hidden' : '' )} config={componentConfig} eventHandlers={eventHandlers} djsConfig={djsConfig} >
      <div className="b-dropzone__placeholder dz-default dz-message">
        <span className="button">Upload Photos</span>
        <span className="text">or Drag them In</span>
      </div>
    </DropzoneComponent>
  );

}

export default UploaderDropzone;