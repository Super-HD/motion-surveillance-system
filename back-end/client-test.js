const express = require('express');
// cors for allowing cross origin resource sharing between different localhosts
const cv = require('opencv4nodejs')
const axios = require('axios')
const cors = require("cors")
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)
// allow cross origin resource sharing
app.use(cors());
// dont need body parser anymore just do this
app.use(express.json());

const vCap = new cv.VideoCapture(0)
vCap.set(cv.CAP_PROP_FRAME_WIDTH, 300);
vCap.set(cv.CAP_PROP_FRAME_HEIGHT, 300);
const FPS = 10;

// do async call register API to make server store the new client & camera data
const testClient = {
  clientName: "Monash University",
  cameras: []
}

axios.post('http://localhost:4200/client', testClient)
  .then(res => {

    // res.data is the id of the client
    const clientRef = res.data

    const testCameraOne = {
      cameraLocation: "Building A",
      cameraClient: clientRef,
      deployTimes: [],
      motionClips: []
    }
    const testCameraTwo = {
      cameraLocation: "Building B",
      cameraClient: clientRef,
      deployTimes: [],
      motionClips: []
    }

    axios.post('http://localhost:4200/camera', testCameraOne)
      .then(res => {
        console.log("Success")
      })
      .catch(error => {
        console.log(error)
      })

    axios.post('http://localhost:4200/camera', testCameraTwo)
      .then(res => {
        console.log("Success")
      })
      .catch(error => {
        console.log(error)
      })
  })
  .catch(error => {
    console.log(error)
  })

// Change to PORT constant once deployed online
server.listen(4300, () => {
  console.log(`Client Server Successfully Started on Port ${4300}`);
  // this code runs and tests a client webcam and uses socket.io to send frame data to server with a fake id
  setInterval(() => {
    // vCap.read returns a mat file
    const frame = vCap.read();
    const image = cv.imencode('.jpg', frame).toString('base64')
    io.emit('buildingAFrame', image)
  }, 1000 / FPS)
})