const aws = require('./s3-file-upload')
const cv = require('opencv4nodejs')

//function header comment: This function is to write a fixed-length video and upload onto the server
//parameter1: time - the length of the video, it is an interger
//parameter2: count - The count of all the videos
//parameter3: axios - to upload the file onto server
//parameter4: cameraId - The ID of the camera
//parameter5: vCap - the camera that we get frames from
function writeVideo(time, count, axios, cameraId, vCap) {

  //video_name will be a genarated string to make sure there are no files with same names.
  var video_name = cameraId;
  count += 1
  var today = new Date();
  var date = today.getFullYear() + (today.getMonth() + 1) + today.getDate() + today.getHours() + today.getMinutes() + today.getSeconds();

  video_name = video_name + date + ".avi";
  // video_name = video_name + date + ".mp4";
  var start_time = new Date();
  var end_time;
  var stop = false;
  var frame, gray;
  // var writer = new cv.VideoWriter(video_name, cv.VideoWriter.fourcc('mp4v'), 24.0, new cv.Size(vCap.get(cv.CAP_PROP_FRAME_WIDTH), vCap.get(cv.CAP_PROP_FRAME_HEIGHT)));

  //VideoWriter (const String &filename, int fourcc, double fps, Size frameSize, bool isColor=true)
  // fourcc is the format of forming/editing the videos
  var writer = new cv.VideoWriter(video_name, cv.VideoWriter.fourcc('MJPG'), 24.0, new cv.Size(vCap.get(cv.CAP_PROP_FRAME_WIDTH), vCap.get(cv.CAP_PROP_FRAME_HEIGHT)));


  //this loop write frames into the videowriter to write a video, the video has a length, if the video reaches the length, we will stop the  recording
  while (stop == false) {

    frame = vCap.read()
    gray = frame.cvtColor(cv.COLOR_BGR2GRAY);
    gray = gray.gaussianBlur(new cv.Size(21, 21), 0);
    //console.log(vCap.CAP_PROP_FRAME_HEIGHT)
    writer.write(frame);
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


//function header comment: To tranfer the time from string into integer
//parameter 1: timeObj: The time object including 2 strings: hour and minute
function generateTime(timeObj) {

  time = timeObj.hour + timeObj.minute

  return Number(time)

}

////function header comment: The algorithm todetect motion and call the function above to write videos
//parameter 1: axios - To achieve functions of uploading video onto server
//parameter 2: cameraId - The ID number of the  camera

function motionAlgorithm(axios, cameraId) {

  //vCap - The camera that we get frames from
  const motionCap = new cv.VideoCapture(0)
  motionCap.set(cv.CAP_PROP_FRAME_WIDTH, 300);
  motionCap.set(cv.CAP_PROP_FRAME_HEIGHT, 300);

  // var start_time, end_time, start_time_hr, start_time_min, end_time_hr, end_time_min;
  var today = new Date();
  //The current_time, start_time, end_time variables will be used to determine whether we should stop/start the motion detecting progress based on the time the users put in
  var current_time;

  try {
    current_time = Number(today.getHours().toString() + today.getMinutes().toString());
  } catch (error) {
    console.log("Initialising current time failed")
  }
  //The firstframe and frameDelta will be used to be compared to determine whether a motion is detected, between 2 frames
  var firstFrame, frameDelta, gray, thresh;
  var start_time, end_time;
  start_time;
  end_time;
  var write = false; //a boolean to determine whether we are writing a video
  var video_count = 0;
  var video_len = 5;
  frame = motionCap.read();
  firstFrame = frame;
  //convert to grayscale and set the first frame
  firstFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
  firstFrame = firstFrame.gaussianBlur(new cv.Size(21, 21), 0);
  url = 'http://161.35.110.201:4200/camera/' + cameraId;

  interval = setInterval(function () {

    axios.get(url)
      .then(function (response) {
        // handle success
        // console.log(response.data)
        // console.log(response.startTime)
        // console.log(response.endTime)
        start_time = generateTime(response.data.startTime)

        end_time = generateTime(response.data.endTime)

      })
      .catch(function (error) {
        // handle error
        //console.log(error);
      })
      .finally(function () {
        // console.log(start_time)
        // console.log(end_time)
      });

    if (today.getMinutes() == 0) {
      current_time = Number(today.getHours().toString() + today.getMinutes().toString() + "0");
    }
    else if (today.getMinutes().toString().length == 1) {
      current_time = Number(today.getHours().toString() + "0" + today.getMinutes().toString());
    }
    else {
      current_time = Number(today.getHours().toString() + today.getMinutes().toString());
    }
    if (start_time == end_time) {
      if (write == false) {
        frame = motionCap.read();
        // const image = cv.imencode('.jpg', frame).toString('base64')
        // io.emit('buildingAFrame', image)
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
        // frame = vCap.read();
        // const image = cv.imencode('.jpg', frame).toString('base64')
        // io.emit('buildingAFrame', image)
        firstFrame = frame;
        //reset the first frame to the current frame
        firstFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);

        firstFrame = firstFrame.gaussianBlur(new cv.Size(21, 21), 0);
      }
      else {
        writeVideo(video_len, video_count, axios, cameraId, motionCap);
        video_count += 1;
        write = false;
        frame = motionCap.read();
        // const image = cv.imencode('.jpg', frame).toString('base64')
        // io.emit('buildingAFrame', image)
        firstFrame = frame;
        //convert to grayscale
        firstFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
        firstFrame = firstFrame.gaussianBlur(new cv.Size(21, 21), 0);

      }
    }
    else if (start_time < end_time) {
      if (current_time > start_time && current_time < end_time) {
        if (write == false) {
          frame = motionCap.read();
          // const image = cv.imencode('.jpg', frame).toString('base64')
          // io.emit('buildingAFrame', image)
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
          writeVideo(video_len, video_count, axios, cameraId, motionCap);
          video_count += 1;
          write = false;
          frame = motionCap.read();
          firstFrame = frame;
          firstFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
          firstFrame = firstFrame.gaussianBlur(new cv.Size(21, 21), 0);
        }
      }
    } else if (start_time > end_time) {
      if ((current_time > start_time) || (current_time < end_time)) {
        if (write == false) {
          frame = motionCap.read();
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
          writeVideo(video_len, video_count, axios, cameraId, motionCap);
          video_count += 1;
          write = false;
          frame = motionCap.read();
          firstFrame = frame;
          firstFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
          firstFrame = firstFrame.gaussianBlur(new cv.Size(21, 21), 0);
        }
      }
    }
  }, 20);
}

module.exports = {
  motionAlgorithm,
  writeVideo
}