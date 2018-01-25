export const SET_CLIENTS = 'SET_CLIENTS';
export const DELETE_FILE = 'DELETE_FILE';
export const FETCH_CLIENT = 'DELETE_FILE';

export const select = (client) => {
  return {
    type: 'CLIENT_SELECTED',
    // data
    payload: client
  }
}


/** fetch one client */
export function updateClient(client) {
  return {
    type: 'FETCH_CLIENT',
    client
  }
}

export const fetchClient = (clientId) => {
  const deleteUrt = '/client/' + clientId;
  return dispatch => {
    fetch(deleteUrt, {method: 'GET'})
      .then(client => {
        console.log('fetched', client);
        dispatch(updateClient(client));

      })
      .catch(e => console.error(e));
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
      .then(data => {
        console.log(data);
        dispatch(setClients(data))
      })
      .catch(e => console.error(e));
  }
}


/** delete file */
export function updateClientAfterDelete(client) {
  return {
    type: 'DELETE_FILE',
    client
  }
}

export const deleteFile = (client, file) => {
  const deleteUrt = '/client/' + client._id + '/file/' + file;
  return dispatch => {
    fetch(deleteUrt, {method: 'DELETE'})
      .then(data => {
        let idx = client.files.findIndex(item => item._id === file);
        client.files.splice(idx, 1);

        console.log(client)
        dispatch(updateClientAfterDelete(client));

      })
      //.then(data => dispatch(setClients(data)))
      .catch(e => console.error(e));
  }
}
