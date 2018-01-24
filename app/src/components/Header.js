import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import Images from './Images';
//import ClientsContainer from '../containers/clients-container';
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

        <Route exact path="/" component={Images}/>
        <Route exact path="/list" component={ClientsContainer}/>
        <Route exact path="/details" component={Details}/>
      </div>
      </Router>
    )
  }
}

export default Header
