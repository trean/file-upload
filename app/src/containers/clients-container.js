import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {select} from '../actions/index';
import {Link} from 'react-router-dom';
import {fetchClientsList} from '../actions/index';

class ClientsContainer extends Component {
  showList() {
    return this.props.clients.map(client => {
      return (
        <li onClick={() => this.props.select(client)} key={client.id}><Link
          to={'/details/' + client._id}>{client.clientName}</Link></li>
      )
    })
  }

  componentDidMount() {
    this.props.fetchClientsList();
  }

  render() {
    return (
      <div>
        <ul>
          {this.showList()}
        </ul>
      </div>
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
  return bindActionCreators({select: select, fetchClientsList: fetchClientsList}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(ClientsContainer);