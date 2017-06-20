import FSBO from '../../../main/';
import React from 'react';

import UploaderDropzone from './uploader-dropzone.jsx';
import UploaderPreview from './uploader-preview.jsx';
import UploaderErrors from './uploader-errors.jsx';

export const COMPONENT_DOM_NODE_CLASS = '.js-react-uploader';
export const ComponentName = 'UploaderImages';


const UploadListJson = window.UploadListJson || [];
const uploader = document.getElementById('uploader');
const uploader_request_url =  uploader && uploader.dataset.url;


class UploaderImages extends React.Component {

  constructor(){
    super();
    this.state = {
      cover: UploadListJson.cover || {},
      gallery: UploadListJson.gallery || [],
      loadState: false, // boolean
      controls: {
        useAsCover: this.useAsCover.bind(this),
        addItem: this.addItem.bind(this),
        deleteItem: this.deleteItem.bind(this),
        uploadFile: this.uploadFile.bind(this),

        loadStart: this.loadStart.bind(this),
        loadFinish: this.loadFinish.bind(this),

        showErrors: this.showErrors.bind(this),
        hideErrors: this.hideErrors.bind(this)
      },
      errors: {
        show: false,
        text: ''
      }
    };
  }

  render(){

    return (

      <div>
        <UploaderErrors   hidden={!this.state.errors.show}
                          errors={this.state.errors.text}/>
        <UploaderDropzone hidden={this.state.gallery.length || this.state.cover.src}
                          controls={this.state.controls}/>
        <UploaderPreview  hidden={!this.state.gallery.length && !this.state.cover.src}
                          controls={this.state.controls}
                          cover={this.state.cover}
                          gallery={this.state.gallery}
                          load={this.state.loadState} />
      </div>

    );

  }

  componentDidMount(){
    FSBO.reactComponents = FSBO.reactComponents || {};
    FSBO.reactComponents[ComponentName] = this;
    FSBO.modules.fancybox.update();
  }
  componentDidUpdate(){
    FSBO.modules.fancybox.update();
  }

  sort(photoId, index, callback){

    let galleryItems = this.state.gallery;
    let sortItemIndex;
    let sortItemContent;
    galleryItems.map( (item, i)=> {
      if (item.id == photoId){
        sortItemIndex = i;
        sortItemContent = item;
      }
    });

    galleryItems.splice(sortItemIndex, 1);
    galleryItems.splice(index-1, 0, sortItemContent);


    this.setState({
      gallery: galleryItems
    });

    fetch(uploader_request_url, {
      method: 'POST',
      body: `position=${index}&resid=${photoId}`,
      headers: new Headers({
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache',
        'Expires': -1
      }),
      credentials: 'same-origin'
    })
        .then(response => {
          if (response.status !== 200) {
            console.log(`Looks like there was a problem. Status Code: ${response.status}`);
            return;
          }
          return response.json();
        })
        .then(responseData => {

          if (!responseData.result) {
            this.setState({
              gallery: responseData.list.gallery || []
            });
          }
          callback && callback();
        })
        .catch(error => {
          console.log(error);
        });

  }

  // File Upload Events:
  useAsCover(item){
    $.post(uploader_request_url, { 'cover': item.id }, (data) => {
      data = JSON.parse(data);
      data.result && this.setState({ cover: data.list.cover || {}, gallery: data.list.gallery || [] });
    });
  }
  addItem(item, isCover){
    if (isCover) {
      this.setState({ cover: item });
    }
    else {
      let updated_gallery = this.state.gallery;
      updated_gallery.push(item);
      this.setState({ gallery: updated_gallery });
    }

    // Hide Errors:
    this.hideErrors();
  }
  deleteItem(item){
    $.post(uploader_request_url, { 'delete': item.id }, (data) => {
      data = JSON.parse(data);
      this.setState({ cover: data.list.cover || {}, gallery: data.list.gallery || [] });
    });
  }
  uploadFile() {
    // const trigger = new Event('click');
    // dropzoneObject && (dropzoneObject.element).dispatchEvent(trigger);
    if (this.state.loadState) return; // prevent if other are loading
    dropzoneObject && (dropzoneObject.element).click();
  }


  // Loading:
  loadStart() {
    if (this.state.loadState) return;
    this.setState({
      loadState: true
    });
  }
  loadFinish() {
    if (!this.state.loadState) return;
    this.setState({
      loadState: false
    });
  }


  // Errors:
  showErrors(message) {
    this.setState({
      errors: {
        show: true,
        text: message || this.state.errors.text
      }
    });
  }
  hideErrors() {
    this.setState({
      errors: {
        show: false,
        text: ''
      }
    });
  }

};

export let Component = UploaderImages;