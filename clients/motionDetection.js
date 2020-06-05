const aws = require('./s3-file-upload')
const cv = require('opencv4nodejs')

function writeVideo(time, count, axios, cameraId, vCap) {

  var video_name = cameraId;
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + " " + today.getHours() + ":" + today.getMinutes()+":" + today.getSeconds();
  video_name = video_name + "-" + date +".avi";

  var start_time = new Date();
  var end_time;
  var stop = false;
  var frame, gray;
  var writer = new cv.VideoWriter(video_name, cv.VideoWriter.fourcc('MJPG'), 24.0, new cv.Size(vCap.get(cv.CAP_PROP_FRAME_WIDTH), vCap.get(cv.CAP_PROP_FRAME_HEIGHT)));

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
  console.log(file)
  aws.uploadToS3(file, axios, cameraId)

}

function generateTime(timeObj) {
  time = timeObj.hour + timeObj.minute
  return Number(time)
}

function motionAlgorithm(axios, cameraId, vCap) {

  // var start_time, end_time, start_time_hr, start_time_min, end_time_hr, end_time_min;
  var today = new Date();
  var current_time = Number(today.getHours().toString() + today.getMinutes().toString());
  var firstFrame, frameDelta, gray, thresh;
  var start_time, end_time;
  start_time;
  end_time;
    
  var write = false;
  var video_count = 0;
  var video_len = 5;
  frame = vCap.read();
  firstFrame = frame;
  //convert to grayscale
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
        frame = vCap.read();
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
          if (cnts[i].area < 500) { continue; }
          write = true;
          console.log("motion detected");
        }
        // frame = vCap.read();
        // const image = cv.imencode('.jpg', frame).toString('base64')
        // io.emit('buildingAFrame', image)
        firstFrame = frame;
        //convert to grayscale
        firstFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
        firstFrame = firstFrame.gaussianBlur(new cv.Size(21, 21), 0);
      }
      else {
        writeVideo(video_len, video_count, axios, cameraId, vCap);
        video_count += 1;
        write = false;
        frame = vCap.read();
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
          frame = vCap.read();
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
            if (cnts[i].area < 500) { continue; }
            write = true;
            console.log("motion detected");
          }
          // frame = vCap.read();
          // const image = cv.imencode('.jpg', frame).toString('base64')
          // io.emit('buildingAFrame', image)
          firstFrame = frame;
          //convert to grayscale
          firstFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
          firstFrame = firstFrame.gaussianBlur(new cv.Size(21, 21), 0);
        }
        else {
          writeVideo(video_len, video_count, axios, cameraId, vCap);
          video_count += 1;
          write = false;
          frame = vCap.read();
          // const image = cv.imencode('.jpg', frame).toString('base64')
          // io.emit('buildingAFrame', image)
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
            if (cnts[i].area < 500) { continue; }
            write = true;
            console.log("motion detected");
          }
          // frame = vCap.read();
          // const image = cv.imencode('.jpg', frame).toString('base64')
          // io.emit('buildingAFrame', image)
          firstFrame = frame;
          //convert to grayscale
          firstFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
          firstFrame = firstFrame.gaussianBlur(new cv.Size(21, 21), 0);
        }
        else {
          writeVideo(video_len, video_count, axios, cameraId, vCap);
          video_count += 1;
          write = false;
          frame = vCap.read();
          // const image = cv.imencode('.jpg', frame).toString('base64')
          // io.emit('buildingAFrame', image)
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