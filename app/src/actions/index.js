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
    fetch(deleteUrt, {method: 'GET'}).then(res => res.json()).then(client => {
        dispatch(updateClient(client));
    }).catch(e => console.error(e));
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
    fetch('/clients', {method: 'GET'}).then(res => res.json()).then(data => {
        dispatch(setClients(data))
    }).catch(e => console.error(e));
  }
}


/** delete file */
export function updateClientAfterDelete(client) {
  return {
    type: 'DELETE_FILE',
    client
  }
}

export const deleteFile = (client, filesObj) => {
  const deleteUrt = '/client/' + client._id + '/delete_many';
  return dispatch => {
    fetch(deleteUrt, {
      method : 'POST',
      headers: {
        'Accept'      : 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body   : JSON.stringify(filesObj)
    }).then(data => {
      filesObj.files.forEach(file => {
        let idx = client.files.findIndex(item => item._id === file);
        client.files.splice(idx, 1);
      });
      dispatch(updateClientAfterDelete(client));
    }).catch(e => console.error(e));
  }
}
