import {DELETE_FILE} from '../actions/index';

export default function (state = null, action) {
  switch (action.type) {
    case 'CLIENT_SELECTED':
      return action.payload; // one client obj
      break;
    case 'SAVE_CLIENT':
      return action.payload;
    case 'DELETE_FILE':
      return action.client;
    default:
      return state;
  }
}