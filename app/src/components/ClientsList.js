import React from 'react';
import ClientsContainer from '../containers/clients-container';
import Details from '../containers/details';
//TODO: css

const ClientsList = () => (
  <div>
    <h3>Clients:</h3>
    <ClientsContainer />
    <h3>Details:</h3>
    <Details />
  </div>
);

export default ClientsList;