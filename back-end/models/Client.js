/*
Created by Cheng Zeng
Updated on 25/05/2020
This file defines Client schema. The client collection contains all client register in the system.
Client contains 3 entities: _id, cameraLocation, cameraClient, cameraURL, startTime, endTime and motionClips. 
_id: ObjectID in mongoose. It is an identify of a client record.
clientName: String. It is the client's name.
cameras: An array of camera object in database. It contains all cameras that belong to the client.
*/

const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  clientName: {
    type: String,
    required: true
  },
  // Link to Camera Model
  cameras: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Camera'
  }]
});

module.exports = mongoose.model('Client', clientSchema);