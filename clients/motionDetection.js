const vCap = new cv.VideoCapture(0)
vCap.set(3, 300);
vCap.set(4, 300);
vCap.get(cv.CAP_PROP_FRAME_WIDTH);
vCap.get(cv.CAP_PROP_FRAME_HEIGHT);

const FPS = 10;

function writeVideo(time, count) {

  var video_name = "motion";
  video_name += count.toString();
  video_name += ".avi";

  var start_time = new Date();
  var end_time;
  var stop = false;
  var frame, gray;
  var writer = new cv.VideoWriter(video_name, cv.VideoWriter.fourcc('MJPG'), 24.0, new cv.Size(vCap.get(cv.CAP_PROP_FRAME_WIDTH), vCap.get(cv.CAP_PROP_FRAME_HEIGHT)));
  {
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

  }
}

function motionAlgorithm() {
  var firstFrame, frameDelta, gray, thresh;

  var write = false;
  var video_count = 0;
  frame = vCap.read();
  firstFrame = frame;
  //convert to grayscale
  firstFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
  firstFrame = firstFrame.gaussianBlur(new cv.Size(21, 21), 0);


  interval = setInterval(function () {
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

        if (cnts[i].area < 500) {
          continue;
        }
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
      writeVideo(10, video_count);
      video_count += 1;
      write = false;



      frame = vCap.read();
      firstFrame = frame;
      //convert to grayscale
      firstFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
      firstFrame = firstFrame.gaussianBlur(new cv.Size(21, 21), 0);

    }
    //   clearInterval(interval);


  }, 20);

}

module.exports = {
  motionAlgorithm,
  writeVideo
}