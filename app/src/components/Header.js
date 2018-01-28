import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import UploadNew from './UploadNew';
import ClientsContainer from '../components/ClientsList';
import Details from '../components/Details';


class Header extends Component {
  render() {
    return (
      <Router>
      <div>
        <ul>
          <li><Link to="/">Add new client</Link></li>
          <li><Link to="/list">List of clients</Link></li>
        </ul>
        <hr/>

        <Route exact path="/" component={UploadNew}/>
        <Route exact path="/list" component={ClientsContainer}/>
        <Route exact path="/details/:clientId" component={Details}/>
        <Route exact path="/details" render={() => (
          <h3>Please select <Link to="/list">a client</Link>.</h3>
        )}/>
      </div>
      </Router>
    )
  }
}

export default Header
