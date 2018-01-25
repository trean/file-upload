import {DELETE_FILE} from '../actions/index';
import {FETCH_CLIENT} from '../actions/index';

export default function (state = null, action) {
  switch (action.type) {
    case 'CLIENT_SELECTED':
      return action.payload; // one client obj
      break;
    case 'SAVE_CLIENT':
      return action.payload;
      break;
    case 'FETCH_CLIENT':
      return action.client;
      break;
    case 'DELETE_FILE':
      return action.client;
      break;
    default:
      return state;
  }
}