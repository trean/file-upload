import React, {Component} from 'react';
import {connect} from 'react-redux';

class Details extends Component {
  render() {
    if (!this.props.client) {
      return (<p>Choose client.</p>);
    }


    //function NumberList(props) {
    const files          = this.props.client.files;
    const filesListItems = files.map((file) => {
      let fileName = file.path.match(/[^\\]*\.(\w+)$/)[0] + '.' + file.path.match(/[^\\]*\.(\w+)$/)[1];
      return <li><span>{fileName}</span></li>
    });
    //}

    return (
      <div>
        <h3>{this.props.client.name}</h3>
        <ul>
          {filesListItems}
        </ul>
        <div>
          I'm dropzone!
        </div>
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
