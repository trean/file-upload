import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchClientsList} from '../actions/index';
import Dropzone from 'dropzone';

Dropzone.autoDiscover = false;

class UploadNewContainer extends Component {

  componentDidMount() {
    let context = this;
    this.props.fetchClientsList();
    this.uploadUrl = '/upload';

    function fileParamName() {
      return 'files'
    }

    console.log("DROPZONE PARAMS");

    const dropzone = new Dropzone("#myDropzone", {
      paramName       : fileParamName,
      url             : this.uploadUrl,
      autoProcessQueue: false,
      uploadMultiple  : true,
      parallelUploads : 5,
      maxFiles        : 5,
      maxFilesize     : 60,
      acceptedFiles   : '.doc,.docx,.pdf',
      addRemoveLinks  : true,
      init            : function () {
        let dzClosure = this; // Makes sure that 'this' is understood inside the functions below.

        console.log("INIT DROPZONE");

        // for Dropzone to process the queue (instead of default form behavior):
        document.getElementById("submit-all").addEventListener("click", function (e) {
          // Make sure that the form isn't actually being sent.
          e.preventDefault();
          e.stopPropagation();
          dzClosure.processQueue();
        });

        //send all the form data along with the files:
        this.on("sendingmultiple", function (data, xhr, formData) {
          formData.append("userName", document.getElementById("userName").value);
        });

        this.on("complete", function (file) {
          document.getElementById("uploadNew").reset();
          dzClosure.removeFile(file);

          context.props.fetchClientsList();
        });
      }
    });

  }

  render() {
    console.log("RENDER");
    return (
      <div>
        <form id="uploadNew" action={this.uploadUrl} encType="multipart/form-data" method="POST">
          <input id="userName" type="text" name="userName" placeholder="Client Name"/>
          <div className="dropzone" id="myDropzone"></div>
          <button type="submit" id="submit-all"> Save</button>
        </form>
      </div>
    )
  }
}

// from state to property
function mapStateToProps(state) {
  return {
    clients: state.clients
  }
}

export default connect(mapStateToProps, {fetchClientsList})(UploadNewContainer);

