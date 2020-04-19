const mongoose = require('mongoose');
const cameraSchema = require('./Camera')

//password value is hashed
const clientSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  clientName: {
    type: String,
    required: true
  },
  // LINK to Camera Model
  cameras: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Camera'
  }]
});

module.exports = mongoose.model('Client', clientSchema);