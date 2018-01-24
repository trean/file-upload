import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import allReducers from './reducers';
import {BrowserRouter} from 'react-router-dom';
import App from './components/App';


const store = createStore(allReducers);

//import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Provider>

  , document.getElementById('root'));

//registerServiceWorker();

