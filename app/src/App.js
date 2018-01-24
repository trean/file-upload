import React, {Component} from 'react';
import './App.css';
//import {BrowserRouter as Router, Route} from 'react-router-dom';
import {createStore} from 'react-redux';
import allReducers from './reducers';


import Images from './Images';

const store = createStore(allReducers);

const Root = () => (
  <Router>
    <Route path="/" component={App}/>
  </Router>
)

class App extends Component {
  render() {
    return (
      <div className="App">
        <Images/>
      </div>
    );
  }
}


export default App;
