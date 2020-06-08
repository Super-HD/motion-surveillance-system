const AWS = require('aws-sdk');
const fs = require('fs');

let s3bucket = new AWS.S3({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET,
  Bucket: process.env.BUCKET_NAME
});
// fix s3 url to never expire
function uploadToS3(videoFile, axios, cameraId) {
  const fileContent = fs.readFileSync(videoFile)
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: videoFile.slice(2, videoFile.length),
    // 1 Week
    Expires: 604800
  }
  // upload video file to S3 first
  s3bucket.upload({ ...params, Body: fileContent }, (err, data) => {
    // Get current date
    // var today = new Date();
    // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + " " + today.getHours() + ":" + today.getMinutes()+":"+today.getSeconds();
    if (err) {
      console.log('error in callback');
      console.log(err);
    }
    console.log('successfully uploaded video.')
    s3bucket.getSignedUrl('getObject', params, function (err, url) {
      if (err) {
        console.log('error in callback');
        console.log(err);
      }
      console.log('successfully generated download URL.')
      // delete local file at client side
      fs.unlinkSync(videoFile.slice(2, videoFile.length))
      var today = new Date();
      var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      const newClip = {
        camera: cameraId,
        recordingDate: date,
        clipLink: url
      }
      // POST Request to DigitalOcean Server to store in MongoDB
      axios.post('http://161.35.110.201:4200/clip', { ...newClip })
    })
  })
}

module.exports = {
  uploadToS3
}
