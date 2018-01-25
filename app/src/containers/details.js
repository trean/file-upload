import React, {Component} from 'react';
import {connect} from 'react-redux';
import Dropzone from 'dropzone';
import {Link} from 'react-router-dom';
import {deliteFile} from '../actions/index';

class Details extends Component {
  componentDidMount() {
    let context = this;

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


    this.disableGoAway = function (e, client) {
      e.preventDefault();
      e.stopPropagation();
      [].forEach.call(document.querySelectorAll("#deleteFile input"), function (element) {
        context.props.deliteFile(client, element.value);
      });
    }
  }


  render() {
    const context        = this;

    if (!this.props.client) {
      return (<p>Choose <Link to="/list">client</Link>.</p>);
    }

    // prepare files to view
    const files          = this.props.client.files;
    const filesListItems = files.map((file, idx) => {
      context.deleteUrt = '/client/' + context.props.client._id + '/file/' + file._id;
      let fileName      = file.path.replace(/^.*[\\\/]/, '');
      return <li key={idx}><a href={file.path}>{fileName}</a><input value={file._id} type="checkbox"/></li>
    });

    return (
      <div>
        <h3>{this.props.client.name}</h3>
        <form id="deleteFile" action={this.deleteUrt} encType="multipart/form-data" method="DELETE">
          <ul>
            {filesListItems}
          </ul>
          <button type="submit" onClick={(e) => this.disableGoAway(e, this.props.client)}>Delete</button>
        </form>

        <form action="/upload" encType="multipart/form-data" method="POST">
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
    client : state.active
  }
}

export default connect(mapStateToProps, {deliteFile})(Details);
