const express = require('express');
const mongoose = require('mongoose');
const cv = require('opencv4nodejs')
const path = require('path');
// cors for allowing cross origin resource sharing between different localhosts
const cors = require("cors")
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)
// bcrypt for hashing passwords
const bcrypt = require("bcrypt-nodejs");
// allow cross origin resource sharing
app.use(cors());
// dont need body parser anymore just do this
app.use(express.json());

const vCap = new cv.VideoCapture(0)
vCap.set(cv.CAP_PROP_FRAME_WIDTH, 300);
vCap.set(cv.CAP_PROP_FRAME_HEIGHT, 300);
const FPS = 10;

// create a fake mongo client
let cameraClient = new CameraClient({
  _id: new mongoose.Types.ObjectId(),
  cameraID: 1,
  cameraLocation: "Melbourne",
  cameraClient: "Monash University",
  startTime: {
    hour: 13,
    minute: 30
  },
  endTime: {
    hour: 23,
    minute: 30
  }
});
// call register API to make server store the new client data
// assume that clientName is the primary key
// we assume that if client has multiple webcams, we can identify them via unique id.



// this code runs and tests a client webcam and uses socket.io to send frame data to server with a fake id