import {combineReducers} from 'redux';
import ClientsReducer from './clients';
import ActiveClient from './client-active';

const allReducers = combineReducers({
  clients: ClientsReducer,
  active: ActiveClient
});

export default allReducers;
