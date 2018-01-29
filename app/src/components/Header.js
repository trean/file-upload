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
      <div  className="navbar justify-content-between">
        <ul className="nav justify-content-end">
          <li className="nav-item"><span className="nav-link text-dark"><Link to="/">Add new client</Link></span></li>
          <li className="nav-item"><span className="nav-link text-dark"><Link to="/list">List of clients</Link></span></li>
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
