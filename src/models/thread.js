let mongoose = require('mongoose');
// let validator = require('validator');

let threadSchema = new mongoose.Schema({
  board: {
    type: String,
    // required: true,
  },
  text: {
    type: String,
    // required: true,
  },
  created_on: {
    type: Date,
    // required: true,
  },
  bumped_on: {
    type: Date,
    // required: true,
  },
  reported : {
    type: Boolean,
    // required: true,
  },
  delete_password: {
    type: String,
    // required: true,
  },
  replies : {
    type: [{
          text : String,
          delete_password : String,
          created_on : Date,
          reported : Boolean,
       }],
    // required: true,
  },
});

module.exports = mongoose.model('Thread', threadSchema);