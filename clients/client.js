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
const internalIp = require('internal-ip');
app.use(busboy())
app.use(busboyBodyParser());
// allow cross origin resource sharing
app.use(cors());
// dont need body parser anymore just do this
app.use(express.json());
// get camera location from input arguments
var myArgs = process.argv.slice(2);
if (myArgs.length == 0) {
  cameraLocation = "None"
} else {
  cameraLocation = myArgs[0];
}
const vCap = new cv.VideoCapture(0)
vCap.set(cv.CAP_PROP_FRAME_WIDTH, 300);
vCap.set(cv.CAP_PROP_FRAME_HEIGHT, 300);
const FPS = 10;
doSetup();

async function doSetup() {

  const testClient = {
    clientName: "Monash University",
    cameras: []
  }
  // const ip = getIp.getPrivateIPs()[0]
  // console.log(ip);
  const ip = internalIp.v4.sync()
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
    var write = false; //a boolean to determine whether we are writing a video
    var video_len = 5;

    // define the interval to continuously send frame data to server
    setInterval(() => {
      console.log("interval1")
      // vCap.read returns a mat file
      let frame = vCap.read();
      const image = cv.imencode('.jpg', frame).toString('base64')
      io.emit('buildingAFrame', image)
    }, 1000 / FPS)

    // define the interval for motion detection
    setInterval(() => {
      console.log("interval2")
      // vCap.read returns a mat file
      let frame = vCap.read();
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
        if (start_time == end_time) {
          if (write == false) {
            gray = frame.cvtColor(cv.COLOR_BGR2GRAY);
            gray = gray.gaussianBlur(new cv.Size(21, 21), 0);
            //compute difference between first frame and current frame
            frameDelta = firstFrame.absdiff(gray);
            thresh = frameDelta.threshold(25, 255, cv.THRESH_BINARY);
            thresh = thresh.dilate(new cv.Mat(), new cv.Vec(-1, -1), 2);
            var cnts = thresh.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
            for (i = 0; i < cnts.length; i++) {
              //if there are 500 pixels different from the first frame in a single contour, this will be seen as a "motion"
              //We set the switch - write to be true  to write and upload a video
              if (cnts[i].area < 500) { continue; }
              write = true;
              console.log("motion detected");
            }
            firstFrame = frame;
            //reset the first frame to the current frame
            firstFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
            firstFrame = firstFrame.gaussianBlur(new cv.Size(21, 21), 0);
          }
          else {
            writeVideo(video_len, axios, cameraOne.data._id, vCap);
            console.log("finished writing")
            write = false;
            firstFrame = frame;
            //convert to grayscale
            firstFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
            firstFrame = firstFrame.gaussianBlur(new cv.Size(21, 21), 0);
          }
        }
        else if (start_time < end_time) {
          if (current_time > start_time && current_time < end_time) {
            if (write == false) {
              gray = frame.cvtColor(cv.COLOR_BGR2GRAY);
              gray = gray.gaussianBlur(new cv.Size(21, 21), 0);
              frameDelta = firstFrame.absdiff(gray);
              thresh = frameDelta.threshold(25, 255, cv.THRESH_BINARY);
              thresh = thresh.dilate(new cv.Mat(), new cv.Vec(-1, -1), 2);
              var cnts = thresh.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
              for (i = 0; i < cnts.length; i++) {
                if (cnts[i].area < 500) { continue; }
                write = true;
                console.log("motion detected");
              }
              firstFrame = frame;
              firstFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
              firstFrame = firstFrame.gaussianBlur(new cv.Size(21, 21), 0);
            }
            else {
              writeVideo(video_len, axios, cameraOne.data._id, vCap);
              console.log("finished writing")
              write = false;
              firstFrame = frame;
              firstFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
              firstFrame = firstFrame.gaussianBlur(new cv.Size(21, 21), 0);
            }
          }
        }
        else if (start_time > end_time) {
          if ((current_time > start_time) || (current_time < end_time)) {
            if (write == false) {
              gray = frame.cvtColor(cv.COLOR_BGR2GRAY);
              gray = gray.gaussianBlur(new cv.Size(21, 21), 0);
              frameDelta = firstFrame.absdiff(gray);
              thresh = frameDelta.threshold(25, 255, cv.THRESH_BINARY);
              thresh = thresh.dilate(new cv.Mat(), new cv.Vec(-1, -1), 2);
              var cnts = thresh.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

              for (i = 0; i < cnts.length; i++) {
                if (cnts[i].area < 500) { continue; }
                write = true;
                console.log("motion detected");
              }
              firstFrame = frame;
              firstFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
              firstFrame = firstFrame.gaussianBlur(new cv.Size(21, 21), 0);
            }
            else {
              writeVideo(video_len, axios, cameraOne.data._id, vCap);
              console.log("finished writing")
              write = false;
              firstFrame = frame;
              firstFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
              firstFrame = firstFrame.gaussianBlur(new cv.Size(21, 21), 0);
            }
          }
        }
      })
    }, 1000 / FPS)
  })
}


// run writeVideo asynchronously in the background to write a video to upload to s3 upon motion detection.
//function header comment: This function is to write a fixed-length video and upload onto the server
//parameter1: time - the length of the video, it is an interger
//parameter2: count - The count of all the videos
//parameter3: axios - to upload the file onto server
//parameter4: cameraId - The ID of the camera
//parameter5: vCap - the camera that we get frames from
function writeVideo(time, axios, cameraId, motionCap) {
  //video_name will be a genarated string to make sure there are no files with same names.
  var video_name = cameraId;
  var today = new Date();
  var date = today.getFullYear() + (today.getMonth() + 1) + today.getDate() + today.getHours() + today.getMinutes() + today.getSeconds();
  video_name = video_name + date + ".avi";
  // video_name = video_name + date + ".mp4";
  var start_time = new Date();
  var end_time;
  var stop = false;
  var frame, gray;
  //VideoWriter (const String &filename, int fourcc, double fps, Size frameSize, bool isColor=true)
  // fourcc is the format of forming/editing the videos
  var writer = new cv.VideoWriter(video_name, cv.VideoWriter.fourcc('MJPG'), 24.0, new cv.Size(motionCap.get(cv.CAP_PROP_FRAME_WIDTH), motionCap.get(cv.CAP_PROP_FRAME_HEIGHT)));
  //this loop write frames into the videowriter to write a video, the video has a length, if the video reaches the length, we will stop the  recording
  while (stop == false) {
    // frame = motionCap.read()
    // gray = frame.cvtColor(cv.COLOR_BGR2GRAY);
    // gray = gray.gaussianBlur(new cv.Size(21, 21), 0);
    // //console.log(vCap.CAP_PROP_FRAME_HEIGHT)
    // cv.waitKey(1)
    writer.write(frame)
    end_time = new Date();
    if ((end_time - start_time) > time * 1000) {
      stop = true;
    }
  }
  // writer file is done here
  // call upload to s3 here using video file, axios + cameraId
  let file = `./${video_name}`
  // test uploading to AWS
  console.log(`Uploading ${file} to S3`)
  console.log(file)
  //upload the video onto server
  aws.uploadToS3(file, axios, cameraId)
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