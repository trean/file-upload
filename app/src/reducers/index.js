import {combineReducers} from 'redux';
import ClientsReducer from './clients';

const allReducers = combineReducers({
  clients: ClientsReducer
});

export default allReducers;
