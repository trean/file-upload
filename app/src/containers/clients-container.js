import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {select} from '../actions/index';

class ClientsContainer extends Component {
  showList() {
    return this.props.clients.map(client => {
      return (
        <li onClick={() => this.props.select(client)} key={client.id}>{client.name}</li>
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

// from state to property
function mapStateToProps(state) {
  return {
    clients: state.clients
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({select: select}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(ClientsContainer);