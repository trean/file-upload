import React, {Component} from 'react';
import {connect} from 'react-redux';
import Dropzone from 'dropzone';
import {Link} from 'react-router-dom';
import {deleteFile} from '../actions/index';
import '../index.css';

class Details extends Component {
  componentDidMount() {
    let context = this;
    this.updateUrl = '/client/' + this.props.client._id + '/upload';

    function fileParamName() {
      return 'files'
    }
    Dropzone.options.detDropzone = {
      paramName       : fileParamName,
      url             : '/upload',
      autoProcessQueue: true,
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
        context.props.deleteFile(client, element.value);
        element.parentElement.remove();
        console.log(context.props.client);
      });
    }
  }


  render() {
    const context        = this;

    if (!this.props.client) {
      return (<p>Choose <Link to="/list">client</Link>.</p>);
    }

    // prepare files to view
    const files          = this.props.client.files,
          filesListItems = files.map((file, idx) => {
      context.deleteUrt = '/client/' + context.props.client._id + '/file/' + file._id;
      let fileName      = file.path.replace(/^.*[\\\/]/, '');
      return <li key={idx}><a href={file.path}>{fileName}</a><input value={file._id} type="checkbox"/></li>
    });

    return (
      <div>
        <h3>{this.props.client.clientName}</h3>
        <form id="deleteFile" action={this.deleteUrt} encType="multipart/form-data" method="DELETE">
          <ul>
            {filesListItems}
          </ul>
          <button type="submit" onClick={(e) => this.disableGoAway(e, this.props.client)}>Delete</button>
        </form>

        <form action={this.updateUrl} encType="multipart/form-data" method="POST">
          <input id="userName" type="text" name="userName" placeholder="Client Name"
                 defaultValue={this.props.client.name} hidden/>
          <div className="dropzone" id="detDropzone"></div>
          {/*<button type="submit" id="submit-all"> upload</button>*/}

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

export default connect(mapStateToProps, {deleteFile})(Details);
