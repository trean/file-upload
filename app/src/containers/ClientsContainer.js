import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

class ClientsContainer extends Component {
  showList() {
    return this.props.clients.map(client => {
      return (
        <li key={client.id}><a href="#">{client.name}</a></li>
      )
    })
  }
  render() {
    return (
      <ul>
        {this.showList()}
      </ul>
    );
  }
}

function mapStateToProps(state) {
  return {
    clients: state.clients
  }
}

export default connect(mapStateToProps)(ClientsContainer);