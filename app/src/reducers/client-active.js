export default function (state = null, action) {
  switch (action.type) {
    case 'CLIENT_SELECTED':
      return action.payload; // one client obj
    case 'SAVE_CLIENT':
      return action.payload;
    case 'FETCH_CLIENT':
      console.log('fetched state');
      return action.client;
    case 'DELETE_FILE':
      return action.client;
    default:
      return state;
  }
}