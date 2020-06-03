const express = require('express');
require('dotenv').config();
const busboy = require('connect-busboy')
const busboyBodyParser = require('busboy-body-parser')
// cors for allowing cross origin resource sharing between different localhosts
const cv = require('opencv4nodejs')
const axios = require('axios')
const cors = require("cors")
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)
const fetch = require("node-fetch")
const getIp = require("./network");
const aws = require('./s3-file-upload')
const motionDetection = require('./motionDetection');


app.use(busboy())
app.use(busboyBodyParser());

// allow cross origin resource sharing
app.use(cors());
// dont need body parser anymore just do this
app.use(express.json());

const vCap = new cv.VideoCapture(0)
vCap.set(cv.CAP_PROP_FRAME_WIDTH, 300);
vCap.set(cv.CAP_PROP_FRAME_HEIGHT, 300);
const FPS = 10;

async function doSetup() {
  const testClient = {
    clientName: "Melbourne University",
    cameras: []
  }

  const ip = await fetch('https://api.ipify.org/?format=json')
    .then(result => result.json())
    .then(data => data.ip)

  const testCameraOne = {
    cameraLocation: "Building A",
    cameraURL: `http://${ip}:5100`,
    // cameraClient: clientRes.data._id,
    startTime: {
      hour: "00",
      minute: "00"
    },
    endTime: {
      hour: "00",
      minute: "00"
    },
    motionClips: []
  }

  const client = await axios.post('http://161.35.110.201:4200/client', testClient)
  console.log("Client Added: ", client.data._id)

  const cameraOne = await axios.post('http://161.35.110.201:4200/camera', { ...testCameraOne, cameraClient: client.data._id })
  console.log("Camera 1 Added: ", cameraOne.data._id)

  // add camera1 to client camera array
  const camToClientOne = await axios.post('http://161.35.110.201:4200/addcamera', { clientId: client.data._id, cameraId: cameraOne.data._id })

  console.log("Camera 1 Added to Client Camera Array ", camToClientOne.data.cameras)

  let file = '../front-end/src/assets/video/recording.mp4'
  // test uploading to AWS
  console.log("Uploading file to S3")

  aws.uploadToS3(file, axios, cameraOne.data._id)
}

// Change to PORT constant once deployed online
server.listen(5100, () => {
  console.log(`Client Server Successfully Started on Port ${5100}`);

  // run function to setup adding cameras and clients to mongoDB
  doSetup()
  // deploy motion detection algorithm which records video files
  // algorithm()

  // this code runs and tests a client webcam and uses socket.io to send frame data to server with a fake id
  setInterval(() => {
    // vCap.read returns a mat file
    // instead of IO maybe we need to start using POST request to send frames to server.
    const frame = vCap.read();
    const image = cv.imencode('.jpg', frame).toString('base64')
    io.emit('buildingAFrame', image)
  }, 1000 / FPS)
})