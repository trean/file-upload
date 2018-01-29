import React, {Component} from 'react';
import {connect} from 'react-redux';
import Dropzone from 'dropzone';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router-dom';
import {deleteFile} from '../actions/index';
import {fetchClient} from '../actions/index';
import {withRouter} from 'react-router-dom';
import '../index.css';

class Details extends Component {

  constructor(props) {
    super(props);
    this.updateClient = this.updateClient.bind(this);
    this.dropzone = null;
  }


  updateClient(id = this.props.client._id) {
    return this.props.fetchClient(id);
  }


  componentDidMount() {
    let context = this;
    // if client object is not at props:
    // case when we start the app from details screen and don't have a history yet
    if (!this.props['client']) {
      let id = this.props.match.params.clientId;
      this.updateClient(id);
      // TODO: it would be good, if this block uses React way to create the dropzone after rerender of the component
      setTimeout(() => {
        createDropzone(this.props.client, this);
      }, 500);
    } else {
      // else part for usual case, when we have props
      createDropzone(this.props.client, this);
    }

    /**
     * Handler of event to request deleting files chose at form
     * @param {object} e - event
     */
    this.deleteFiles = function (e) {
      e.preventDefault();
      e.stopPropagation();
      let obj   = {};
      obj.files = [];
      const fileCheckboxes = document.querySelectorAll("#deleteFile input");
      [].forEach.call(fileCheckboxes, function (element) {
        if (element.checked) obj.files.push(element.value);
      });
      if (obj.files.length > 0) {
        context.props.deleteFile(context.props.client, obj);
        context.updateClient();
      } else {
        console.warn('No selected files to delete');
      }
    }
  }


  render() {

    // if we have not client object by any reason
    if (!this.props.client) {
      return (<p>Choose <Link to="/list">client</Link>.</p>);
    }

    const files = this.props.client.files || [];
    return (
      <div>
        <h3>{this.props.client.clientName}</h3>
        <form id="deleteFile" action={this.deleteUrt}>
          <ul>
            {files.map((file, idx) => {
              this.deleteUrt = '/client/' + this.props.client._id + '/file/' + file._id;
              let fileName   = file.path.replace(/^.*[\\\/]/, '');
              return <li key={idx}><a href={'../' + file.path}>{fileName}</a><input value={file._id} type="checkbox"/></li>
            })}
          </ul>
          {files.length > 0 ?
            <button type="submit" onClick={(e) => this.deleteFiles(e)}>Delete</button> : null}
        </form>

        <form action={this.updateUrl} encType="multipart/form-data" method="POST">
          <div className="dropzone" id="detDropzone"></div>
        </form>
      </div>
    )
  }
}


function createDropzone(client, t) {

  const updateUrl = '/client/' + client._id + '/upload';

  function fileParamName() {
    return 'files'
  }

  t.dropzone = new Dropzone("#detDropzone", {
    paramName       : fileParamName,
    url             : updateUrl,
    autoProcessQueue: true,
    maxFilesize     : 500,
    acceptedFiles   : '.doc,.docx,.pdf',
    addRemoveLinks  : true,
    init            : function () {
      this.on("complete", function () {
        t.updateClient(client._id);
      })
    }
  });
}

// from state to property
function mapStateToProps(state) {
  return {
    client : state.active
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({deleteFile: deleteFile, fetchClient: fetchClient}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(withRouter(Details));
