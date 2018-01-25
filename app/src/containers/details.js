import React, {Component} from 'react';
import {connect} from 'react-redux';
import Dropzone from 'dropzone';
import {Link} from 'react-router-dom';
import {deleteFile} from '../actions/index';
import {fetchClient} from '../actions/index';
import '../index.css';

class Details extends Component {

  componentDidMount() {
    let context = this;
    if (this.props['client']) {
      this.updateUrl = '/client/' + this.props.client._id + '/upload';

    function fileParamName() {
      return 'files'
    }

      const dropzone = new Dropzone("#detDropzone", {
        paramName       : fileParamName,
        url             : context.updateUrl,
        autoProcessQueue: true,
        maxFilesize     : 60,
        acceptedFiles   : '.doc,.docx,.pdf',
        addRemoveLinks  : true,
        init            : function () {
          this.on("complete", function (file) {
            context.props.fetchClient(context.props.client);
          })
        }
      });
    }

    this.disableGoAway = function (e, client) {
      e.preventDefault();
      e.stopPropagation();
      [].forEach.call(document.querySelectorAll("#deleteFile input"), function (element) {
        if (element.checked) {
          context.props.deleteFile(client, element.value);
          //element.parentElement.remove();
          //console.log(context.props.client);
          context.props.fetchClient(client);
        }
      });
    }
  }


  render() {

    if (!this.props.client) {
      return (<p>Choose <Link to="/list">client</Link>.</p>);
    }

    // prepare files to view
    const files          = this.props.client.files || [],
          filesListItems = files.map((file, idx) => {
            this.deleteUrt = '/client/' + this.props.client._id + '/file/' + file._id;
            let fileName   = file.path.replace(/^.*[\\\/]/, '');
      return <li key={idx}><a href={file.path}>{fileName}</a><input value={file._id} type="checkbox"/></li>
    });

    return (
      <div>
        <h3>{this.props.client.clientName}</h3>
        <form id="deleteFile" action={this.deleteUrt} encType="multipart/form-data" method="DELETE">
          <ul>


            {files.map((file, idx) => {
              this.deleteUrt = '/client/' + this.props.client._id + '/file/' + file._id;
              let fileName   = file.path.replace(/^.*[\\\/]/, '');
              return <li key={idx}><a href={file.path}>{fileName}</a><input value={file._id} type="checkbox"/></li>
            })}

          </ul>
          {filesListItems.length > 0 ?
            <button type="submit" onClick={(e) => this.disableGoAway(e, this.props.client)}>Delete</button> : null}
        </form>

        <form action={this.updateUrl} encType="multipart/form-data" method="POST">
          <div className="dropzone" id="detDropzone"></div>
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

export default connect(mapStateToProps, {deleteFile: deleteFile, fetchClient: fetchClient})(Details);
