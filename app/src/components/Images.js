import React, {Component} from 'react';
import Dropzone from 'dropzone';


class Images extends Component {

  componentDidMount() {
    this.uploadUrl = 'http://localhost:8090/upload';

    function fileParamName() {
      return 'files'
    }

    Dropzone.options.myDropzone = {
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
      }

    }
  }

  render() {
    return (
      <div>
        <form action={this.uploadUrl} enctype="multipart/form-data" method="POST">
          <input id="userName" type="text" name="userName" placeholder="Client Name"/>
          <div className="dropzone" id="myDropzone"></div>
          <button type="submit" id="submit-all"> Save</button>

        </form>
      </div>
    )
  }
}

export default Images
