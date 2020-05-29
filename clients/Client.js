const express = require('express');
// cors for allowing cross origin resource sharing between different localhosts
const cv = require('opencv4nodejs')
const axios = require('axios')
const cors = require("cors")
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)
const fetch = require("node-fetch")
const getIp = require("./network");
var sleep = require('sleep');

// allow cross origin resource sharing
app.use(cors());
// dont need body parser anymore just do this
app.use(express.json());

const vCap = new cv.VideoCapture(0)
vCap.set(3, 300);
vCap.set(4, 300);
vCap.get(cv.CAP_PROP_FRAME_WIDTH);
vCap.get(cv.CAP_PROP_FRAME_HEIGHT);

const FPS = 10;


function writeVedio(time,count){

  var video_name = "motion";
  video_name += count.toString();
  video_name += ".avi";

  var start_time = new Date();
  var end_time;
  var stop = false;
  var frame,gray;
  var writer =new cv.VideoWriter(video_name, cv.VideoWriter.fourcc('MJPG'),24.0,new cv.Size(352,288));
   {
     while(stop == false){
      frame = vCap.read()
      gray = frame.cvtColor(cv.COLOR_BGR2GRAY);
      gray = gray.gaussianBlur(new cv.Size(21, 21),0);
      //console.log(vCap.CAP_PROP_FRAME_HEIGHT)
      writer.write(frame);
      end_time = new Date();
      if((end_time - start_time) > time*1000){

        stop = true;
      }
  }
}
}

function algorithm(){
  var firstFrame, frameDelta, gray, thresh;

  var write = false;
  var video_count = 0;
  frame = vCap.read();
  firstFrame = frame;
  //convert to grayscale
  firstFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
  firstFrame = firstFrame.gaussianBlur(new cv.Size(21, 21),0);
  

  interval = setInterval(function() {
    if(write == false){
          frame = vCap.read();
          gray = frame.cvtColor(cv.COLOR_BGR2GRAY);
          gray = gray.gaussianBlur(new cv.Size(21, 21),0);
  
          //compute difference between first frame and current frame
          frameDelta = firstFrame.absdiff(gray);
          thresh = frameDelta.threshold(25,255, cv.THRESH_BINARY);
          thresh = thresh.dilate(new cv.Mat(), new cv.Vec(-1, -1), 2);

          var cnts = thresh.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
          for(i = 0; i < cnts.length; i++) {
  
              if(cnts[i].area < 500) {
                  continue;
              }
              write = true;
              console.log("motion detected");
          }
          frame = vCap.read();
          firstFrame = frame;
          //convert to grayscale
          firstFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
          firstFrame = firstFrame.gaussianBlur(new cv.Size(21, 21),0);
        }
      else{
        writeVedio(10,video_count);
        video_count +=1;
        write = false;



        frame = vCap.read();
        firstFrame = frame;
        //convert to grayscale
        firstFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
        firstFrame = firstFrame.gaussianBlur(new cv.Size(21, 21),0);

      }
           //   clearInterval(interval);
          
  
  }, 20);

}

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
}

// Change to PORT constant once deployed online
server.listen(5100, () => {
  console.log(`Client Server Successfully Started on Port ${5100}`);

  // run function to setup adding cameras and clients to mongoDB
  //doSetup()
  algorithm()

  // this code runs and tests a client webcam and uses socket.io to send frame data to server with a fake id
  setInterval(() => {
    // vCap.read returns a mat file
    // instead of IO maybe we need to start using POST request to send frames to server.
    const frame = vCap.read();
    const image = cv.imencode('.jpg', frame).toString('base64')
    io.emit('buildingAFrame', image)
  }, 1000 / FPS)
})