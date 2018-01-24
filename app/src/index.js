import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import allReducers from './reducers';
import ClientsList from './components/ClientsList';


const store = createStore(allReducers);

//const Root = () => (
//  <Router>
//    <Route path="/" component={App}/>
//  </Router>
//)

//import App from './App';
//import registerServiceWorker from './registerServiceWorker';

{/*ReactDOM.render(<App />, document.getElementById('root'));*/
}
//registerServiceWorker();

ReactDOM.render(
  <Provider store={store}>
    <ClientsList />
  </Provider>
  , document.getElementById('root'));
