'use strict';
let Client = require('./client-schema');

module.exports.Client = function () {
  let that = this;

  /**
   * @returns {string} - generated id
   */
  that.generateId = function () {
    return Math.random().toString(16).substr(2);
  };

  that.saveNewClientByName = function (name) {
    // TODO: save only Name
    let newClient = new Client();

    newClient.name = name;

    newClient.save(function (err, client) {
      if (err) {
        return err;
      } else {
        console.log(client);
      }
    }

    )
  };

  that.getId = function () {
    // TODO: should return ID from db
  };


  return that;
};