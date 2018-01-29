import React, {Component} from 'react';
import Dropzone from 'dropzone';

Dropzone.autoDiscover = false;

class UploadNewContainer extends Component {

  constructor(props) {
    super(props);
    this.dropzone = null;
  }

  componentDidMount() {
    this.uploadUrl = '/upload';

    function fileParamName() {
      return 'files'
    }

    this.dropzone = new Dropzone("#myDropzone", {
      paramName       : fileParamName,
      url             : this.uploadUrl,
      autoProcessQueue: false,
      uploadMultiple  : true,
      parallelUploads : 5,
      maxFiles        : 5,
      maxFilesize     : 500,
      acceptedFiles   : '.doc,.docx,.pdf',
      addRemoveLinks  : true,
      init            : function () {
        let dzClosure = this; // Makes sure that 'this' is understood inside the functions below.

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
        });
      }
    });

  }

  render() {
    return (
      <div>
        <form id="uploadNew" action={this.uploadUrl} encType="multipart/form-data" method="POST">
          <div className="form-group">
            <input className="form-control" id="userName" type="text" name="userName" placeholder="Client Name"/>
          </div>
          <div className="form-group">
            <div className="dropzone" id="myDropzone"></div>
          </div>
          <button className="btn btn-primary" type="submit" id="submit-all"> Save</button>
        </form>
      </div>
    )
  }
}

export default UploadNewContainer;
