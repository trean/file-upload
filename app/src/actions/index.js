export const select = (client) => {
  //alert('Client is: ' + client.id);
  return {
    type: 'CLIENT_SELECTED',
    // data
    payload: client
  }
};
