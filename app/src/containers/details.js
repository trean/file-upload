import React, {Component} from 'react';
import {connect} from 'react-redux';
import Dropzone from 'dropzone';

class Details extends Component {

  componentDidMount() {
    function fileParamName() {
      return 'files'
    }
    Dropzone.options.detDropzone = {
      paramName       : fileParamName,
      url             : 'http://localhost:8090/upload',
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
    if (!this.props.client) {
      return (<p>Choose client.</p>);
    }

    // prepare files to view
    const files          = this.props.client.files;
    const filesListItems = files.map((file, idx) => {
      let fileName = file.path.match(/[^\\]*\.(\w+)$/)[0] + '.' + file.path.match(/[^\\]*\.(\w+)$/)[1];
      return <li key={idx}><span>{fileName}</span><input type="checkbox"/></li>
    });

    return (
      <div>
        <h3>{this.props.client.name}</h3>
        <form action="/delete-file" method="POST">
          <ul>
            {filesListItems}
          </ul>
          <button type="submit" onClick={(e) => e.preventDefault()}>Delete</button>
        </form>

        <form action="/upload" enctype="multipart/form-data" method="POST">
          <input id="userName" type="text" name="userName" placeholder="Client Name"
                 defaultValue={this.props.client.name} hidden/>
          <div className="dropzone" id="detDropzone"></div>
          <button type="submit" id="submit-all"> upload</button>

        </form>
      </div>
    )
  }
}


// from state to property
function mapStateToProps(state) {
  return {
    client: state.active
  }
}

export default connect(mapStateToProps)(Details);
