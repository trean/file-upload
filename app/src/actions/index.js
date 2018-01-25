export const SET_CLIENTS = 'SET_CLIENTS';
export const DELETE_FILE = 'DELETE_FILE';

export const select = (client) => {
  return {
    type: 'CLIENT_SELECTED',
    // data
    payload: client
  }
}

/** get list of clients */
export function setClients(clients) {
  return {
    type: 'SET_CLIENTS',
    clients
  }
}

export const fetchClientsList = () => {
  return dispatch => {
    fetch('/clients', {method: 'GET'})
      .then(res => res.json())
      .then(data => dispatch(setClients(data)))
      .catch(e => console.error(e));
  }
}


/** delete file */
export function updateClient(client) {
  return {
    type: 'DELETE_FILE',
    client
  }
}

export const deliteFile = (client, file) => {
  const deleteUrt = '/client/' + client._id + '/file/' + file;
  return dispatch => {
    fetch(deleteUrt, {method: 'DELETE'})
      .then(data => {
        let idx = client.files.findIndex(item => item._id === file);
        client.files.splice(idx, 1);

        dispatch(updateClient(client));

      })
      //.then(data => dispatch(setClients(data)))
      .catch(e => console.error(e));
  }
}