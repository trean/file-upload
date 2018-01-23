'use strict';

const mongoose = require('mongoose'),
      Schema   = mongoose.Schema;

let ClientSchema = new Schema({
  clientName: {
    type    : String,
    required: true
  },
  files     : [{path: String}]
});


module.exports = mongoose.model('Client', ClientSchema);