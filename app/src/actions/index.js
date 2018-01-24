export const select = (client) => {
  return {
    type: 'CLIENT_SELECTED',
    // data
    payload: client
  }
};
