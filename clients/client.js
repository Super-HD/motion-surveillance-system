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
const aws = require('./s3-file-upload')
const internalIp = require('internal-ip');
var assert = require('assert');
app.use(busboy())
app.use(busboyBodyParser());
// allow cross origin resource sharing
app.use(cors());
// dont need body parser anymore just do this
app.use(express.json());

// get camera location from input arguments
var myArgs = process.argv.slice(2);
// Assert camera location is provided, otherwise an error is report
assert(cameraLocation = myArgs[0], "Please provide the camera's location")


let vCap
// Try to open capture from webcam
try {
  vCap = new cv.VideoCapture(0)
}
catch (err) {
  console.log("Camera is not avaiable")
  return
}

vCap.set(cv.CAP_PROP_FRAME_WIDTH, 300);
vCap.set(cv.CAP_PROP_FRAME_HEIGHT, 300);
const FPS = 10;
doSetup();

async function doSetup() {

  const testClient = {
    clientName: "Monash University",
    cameras: []
  }
  const ip = internalIp.v4.sync()
  console.log(internalIp.v4.sync())
  const testCameraOne = {
    cameraLocation: cameraLocation,
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
  console.log("Camera Added: ", cameraOne.data._id)
  // add camera1 to client camera array
  const camToClientOne = await axios.post('http://161.35.110.201:4200/addcamera', { clientId: client.data._id, cameraId: cameraOne.data._id })
  console.log("Camera Added to Client Camera Array ")

  server.listen(5100, () => {
    console.log(`Client Server Successfully Started on Port ${5100}`);
    // run function to setup adding cameras and clients to mongoDB

    //The firstframe and frameDelta will be used to be compared to determine whether a motion is detected, between 2 frames
    var firstFrame, frameDelta, gray, thresh;
    var writing = false; //a boolean to determine whether we are writing a video
    var videoLength = 100;
    // time to write when writing a motion clip
    var currentWrittenTime = 0;
    // writerFile for when motion is detected
    var writerObject;
    // videoName of motion clip file.
    var videoName;
    // define the interval to continuously send frame data to server
    setInterval(() => {
      // vCap.read returns a mat file
      let frame = vCap.read();
      const image = cv.imencode('.jpg', frame).toString('base64')
      io.emit('buildingAFrame', image)

      // perform motion detection algorithm
      // set up variables for motion Detection algorithm
      var today = new Date();
      //The current_time, start_time, end_time variables will be used to determine whether we should stop/start the motion detecting progress based on the time the users put in
      var current_time;
      var start_time, end_time;
      try {
        current_time = Number(today.getHours().toString() + today.getMinutes().toString());
      } catch (error) {
        console.log("Initialising current time failed")
      }
      firstFrame = frame;
      //convert to grayscale and set the first frame
      firstFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
      firstFrame = firstFrame.gaussianBlur(new cv.Size(21, 21), 0);
      let url = 'http://161.35.110.201:4200/camera/' + cameraOne.data._id;
      axios.get(url).then(res => {
        start_time = generateTime(res.data.startTime)
        end_time = generateTime(res.data.endTime)
        current_time = modifyCurrentDate(today)

        // check if previously motion was detected then keep writing
        if (writing) {
          writeFrame(writerObject, frame)
          currentWrittenTime++;
          if (currentWrittenTime == videoLength) {
            // // writer file is done here
            // reset variables
            let clipName = videoName
            writing = false;
            videoName = undefined;
            writerObject = undefined;
            currentWrittenTime = 0;

            // call upload to s3 here using video file, axios + cameraId
            let file = `./${clipName}`
            // test uploading to AWS
            console.log(`Uploading ${file} to S3`)
            console.log(file)
            //upload the video onto server
            aws.uploadToS3(file, axios, cameraOne.data._id)

          }
        }
        else {
          if (start_time == end_time) {
            if (writing == false) {
              if (motionDetected(frame, firstFrame, gray, frameDelta)) {
                console.log("motion detected");
                writing = true
                var date = today.getFullYear() + (today.getMonth() + 1) + today.getDate() + today.getHours() + today.getMinutes() + today.getSeconds();
                videoName = cameraOne.data._id + date + ".avi";
                writerObject = new cv.VideoWriter(videoName, cv.VideoWriter.fourcc('MJPG'), 10.0, new cv.Size(vCap.get(cv.CAP_PROP_FRAME_WIDTH), vCap.get(cv.CAP_PROP_FRAME_HEIGHT)));
              }
              //reset the first frame to the current frame
              firstFrame = resetFirstFrame(frame);
            }
          }
          else if (start_time < end_time) {
            if (current_time > start_time && current_time < end_time) {
              if (writing == false) {
                if (motionDetected(frame, firstFrame, gray, frameDelta)) {
                  console.log("motion detected");
                  writing = true
                  var date = today.getFullYear() + (today.getMonth() + 1) + today.getDate() + today.getHours() + today.getMinutes() + today.getSeconds();
                  videoName = cameraOne.data._id + date + ".avi";
                  writerObject = new cv.VideoWriter(videoName, cv.VideoWriter.fourcc('MJPG'), 10.0, new cv.Size(vCap.get(cv.CAP_PROP_FRAME_WIDTH), vCap.get(cv.CAP_PROP_FRAME_HEIGHT)));
                }
                firstFrame = resetFirstFrame(frame);
              }
            }
          }
          else if (start_time > end_time) {
            if ((current_time > start_time) || (current_time < end_time)) {
              if (writing == false) {
                if (motionDetected(frame, firstFrame, gray, frameDelta)) {
                  console.log("motion detected");
                  writing = true
                  var date = today.getFullYear() + (today.getMonth() + 1) + today.getDate() + today.getHours() + today.getMinutes() + today.getSeconds();
                  videoName = cameraOne.data._id + date + ".avi";
                  writerObject = new cv.VideoWriter(videoName, cv.VideoWriter.fourcc('MJPG'), 10.0, new cv.Size(vCap.get(cv.CAP_PROP_FRAME_WIDTH), vCap.get(cv.CAP_PROP_FRAME_HEIGHT)));
                }
                firstFrame = resetFirstFrame(frame);
              }
            }
          }
        }
      })
    }, 1000 / FPS)
  })
}
function writeFrame(writerObject, frame) {
  writerObject.write(frame)
}

function modifyCurrentDate(today) {
  if (today.getMinutes() == 0) {
    return Number(today.getHours().toString() + today.getMinutes().toString() + "0");
  }
  else if (today.getMinutes().toString().length == 1) {
    return Number(today.getHours().toString() + "0" + today.getMinutes().toString());
  }
  else {
    return Number(today.getHours().toString() + today.getMinutes().toString());
  }
}

//function header comment: To tranfer the time from string into integer
//parameter 1: timeObj: The time object including 2 strings: hour and minute
function generateTime(timeObj) {
  time = timeObj.hour + timeObj.minute
  return Number(time)
}

function motionDetected(frame, firstFrame, gray, frameDelta) {
  gray = frame.cvtColor(cv.COLOR_BGR2GRAY);
  gray = gray.gaussianBlur(new cv.Size(21, 21), 0);
  frameDelta = firstFrame.absdiff(gray);
  thresh = frameDelta.threshold(25, 255, cv.THRESH_BINARY);
  thresh = thresh.dilate(new cv.Mat(), new cv.Vec(-1, -1), 2);
  var cnts = thresh.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
  for (i = 0; i < cnts.length; i++) {
    if (cnts[i].area < 500) { continue }
    return true
  }
  return false
}

function resetFirstFrame(frame) {
  return frame.cvtColor(cv.COLOR_BGR2GRAY).gaussianBlur(new cv.Size(21, 21), 0);
}