/*
Created by Terence Ng
Updated on 12/06/2020
This file defines the AWS Logic when uploading video files to AWS. Environment variables are
configured here to access and store videos to an S3 Bucket.
*/

const AWS = require('aws-sdk');
const fs = require('fs');

// define an AWS S3 Bucket using configured environment variables
let s3bucket = new AWS.S3({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET,
  Bucket: process.env.BUCKET_NAME
});

/**
 * Performs the action of uploading a motion video file to AWS
 * @param {*} videoFile The name of the video currently stored in local directory
 * @param {*} axios The HTTP Client which performs requests to the web server
 * @param {*} cameraId The camera ID who is performing the video upload
 */
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
    console.log(data)
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
