import React, {Component} from 'react';
import {connect} from 'react-redux';
import Dropzone from 'dropzone';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router-dom';
import {deleteFile} from '../actions/index';
import {fetchClient} from '../actions/index';
import '../index.css';

class Details extends Component {

  constructor(props) {
    super(props);
    this.updateClient = this.updateClient.bind(this);
  }


  updateClient(id = this.props.client._id) {
    return this.props.fetchClient(id);
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.client !== this.props.client) {
      this.setState({client: nextProps.client});
      console.log('nextProps', nextProps);
    }
  }


  componentDidMount() {
    let context = this;
    if (!this.props['client']) {
      // TODO: there should be more elegant way to do this
      let id = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
      console.log(id);
      this.updateClient(id);
      // TODO: and this
      setTimeout(() => {
        createDropzone(this.props.client, this.updateClient);
      }, 500);
    } else {
      try {
        createDropzone(this.props.client, this.updateClient);
      } catch (e) {
        console.warn(e.message);
      }
    }

    this.disableGoAway = function (e) {
      e.preventDefault();
      e.stopPropagation();
      [].forEach.call(document.querySelectorAll("#deleteFile input"), function (element) {
        if (element.checked) {
          context.props.deleteFile(context.props.client, element.value);
          context.updateClient();
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
              return <li key={idx}><a href={'../' + file.path}>{fileName}</a><input value={file._id} type="checkbox"/></li>
            })}

          </ul>
          {filesListItems.length > 0 ?
            <button type="submit" onClick={(e) => this.disableGoAway(e)}>Delete</button> : null}
        </form>

        <form action={this.updateUrl} encType="multipart/form-data" method="POST">
          <div className="dropzone" id="detDropzone"></div>
        </form>
      </div>
    )
  }
}


function createDropzone(client, cb) {

  const updateUrl = '/client/' + client._id + '/upload';

  function fileParamName() {
    return 'files'
  }

  const dropzone = new Dropzone("#detDropzone", {
    paramName       : fileParamName,
    url             : updateUrl,
    autoProcessQueue: true,
    maxFilesize     : 60,
    acceptedFiles   : '.doc,.docx,.pdf',
    addRemoveLinks  : true,
    init            : function () {
      this.on("complete", function () {
        cb(client._id);
        console.log('props.client!!!', client);
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

export default connect(mapStateToProps, matchDispatchToProps)(Details);
