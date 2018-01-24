export default function (state = null, action) {
  switch (action.type) {
    case 'CLIENT_SELECTED':
      return action.payload; // one client obj
      break;
    default:
      return state;
  }
}