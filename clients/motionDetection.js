const express = require('express');
// cors for allowing cross origin resource sharing between different localhosts
const cv = require('opencv4nodejs')
const aws = require('./s3-file-upload')

const vCap = new cv.VideoCapture(0)
vCap.set(3, 300);
vCap.set(4, 300);
vCap.get(cv.CAP_PROP_FRAME_WIDTH);
vCap.get(cv.CAP_PROP_FRAME_HEIGHT);

function writeVideo(time, count, axios, cameraId) {

  var video_name = "motion";
  video_name += count.toString();
  video_name += ".avi";

  var start_time = new Date();
  var end_time;
  var stop = false;
  var frame, gray;
  var writer = new cv.VideoWriter(video_name, cv.VideoWriter.fourcc('MJPG'), 10.0, new cv.Size(vCap.get(cv.CAP_PROP_FRAME_WIDTH), vCap.get(cv.CAP_PROP_FRAME_HEIGHT)));

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
  console.log("Uploading file to S3")
  aws.uploadToS3(file, axios, cameraId)

}

function motionAlgorithm(axios, cameraId) {

  var start_time, end_time, start_time_hr, start_time_min, end_time_hr, end_time_min;
  var today = new Date();
  var current_time = Number(today.getHours().toString() + today.getMinutes().toString());
  var firstFrame, frameDelta, gray, thresh;

  start_time_hr = 20
  start_time_min = 29
  end_time_hr = 12
  end_time_min = 0
  if (start_time_min == 0) {
    start_time = Number(start_time_hr.toString() + start_time_min.toString() + "0");
  }
  else if (start_time_min.toString().length == 1) {
    start_time = Number(start_time_hr.toString() + "0" + start_time_min.toString());
  }
  else {
    start_time = Number(start_time_hr.toString() + start_time_min.toString());
  }

  if (end_time_min == 0) {
    end_time = Number(end_time_hr.toString() + end_time_min.toString() + "0");
  }
  else if (end_time_min.toString().length == 1) {
    end_time = Number(end_time_hr.toString() + "0" + end_time_min.toString());
  }
  else {
    end_time = Number(end_time_hr.toString() + end_time_min.toString());
  }

  if (today.getMinutes() == 0) {
    current_time = Number(today.getHours().toString() + today.getMinutes().toString() + "0");
  }
  else if (today.getMinutes().toString().length == 1) {
    current_time = Number(today.getHours().toString() + "0" + today.getMinutes().toString());
  }
  else {
    current_time = Number(today.getHours().toString() + today.getMinutes().toString());
  }


  console.log(start_time)
  console.log(end_time)
  console.log(current_time)
  var write = false;
  var video_count = 0;
  frame = vCap.read();
  firstFrame = frame;
  //convert to grayscale
  firstFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
  firstFrame = firstFrame.gaussianBlur(new cv.Size(21, 21), 0);

  interval = setInterval(function () {

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
        frame = vCap.read();
        gray = frame.cvtColor(cv.COLOR_BGR2GRAY);
        gray = gray.gaussianBlur(new cv.Size(21, 21), 0);
        //compute difference between first frame and current frame
        frameDelta = firstFrame.absdiff(gray);
        thresh = frameDelta.threshold(25, 255, cv.THRESH_BINARY);
        thresh = thresh.dilate(new cv.Mat(), new cv.Vec(-1, -1), 2);
        var cnts = thresh.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
        for (i = 0; i < cnts.length; i++) {
          if (cnts[i].area < 500) { continue; }
          write = true;
          console.log("motion detected");
        }
        frame = vCap.read();
        firstFrame = frame;
        //convert to grayscale
        firstFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
        firstFrame = firstFrame.gaussianBlur(new cv.Size(21, 21), 0);
      }
      else {
        writeVideo(10, video_count, axios, cameraId);
        video_count += 1;
        write = false;
        frame = vCap.read();
        firstFrame = frame;
        //convert to grayscale
        firstFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
        firstFrame = firstFrame.gaussianBlur(new cv.Size(21, 21), 0);
      }
    }
    else if (start_time < end_time) {
      if (current_time > start_time && current_time < end_time) {
        if (write == false) {
          frame = vCap.read();
          gray = frame.cvtColor(cv.COLOR_BGR2GRAY);
          gray = gray.gaussianBlur(new cv.Size(21, 21), 0);
          //compute difference between first frame and current frame
          frameDelta = firstFrame.absdiff(gray);
          thresh = frameDelta.threshold(25, 255, cv.THRESH_BINARY);
          thresh = thresh.dilate(new cv.Mat(), new cv.Vec(-1, -1), 2);
          var cnts = thresh.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
          for (i = 0; i < cnts.length; i++) {
            if (cnts[i].area < 500) { continue; }
            write = true;
            console.log("motion detected");
          }
          frame = vCap.read();
          firstFrame = frame;
          //convert to grayscale
          firstFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
          firstFrame = firstFrame.gaussianBlur(new cv.Size(21, 21), 0);
        }
        else {
          writeVideo(10, video_count, axios, cameraId);
          video_count += 1;
          write = false;
          frame = vCap.read();
          firstFrame = frame;
          //convert to grayscale
          firstFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
          firstFrame = firstFrame.gaussianBlur(new cv.Size(21, 21), 0);
        }
      }
    } else if (start_time > end_time) {
      if ((current_time > start_time) || (current_time < end_time)) {
        if (write == false) {
          frame = vCap.read();
          gray = frame.cvtColor(cv.COLOR_BGR2GRAY);
          gray = gray.gaussianBlur(new cv.Size(21, 21), 0);
          //compute difference between first frame and current frame
          frameDelta = firstFrame.absdiff(gray);
          thresh = frameDelta.threshold(25, 255, cv.THRESH_BINARY);
          thresh = thresh.dilate(new cv.Mat(), new cv.Vec(-1, -1), 2);
          var cnts = thresh.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
          for (i = 0; i < cnts.length; i++) {
            if (cnts[i].area < 500) { continue; }
            write = true;
            console.log("motion detected");
          }
          frame = vCap.read();
          firstFrame = frame;
          //convert to grayscale
          firstFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
          firstFrame = firstFrame.gaussianBlur(new cv.Size(21, 21), 0);
        }
        else {
          writeVideo(10, video_count, axios, cameraId);
          video_count += 1;
          write = false;
          frame = vCap.read();
          firstFrame = frame;
          //convert to grayscale
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