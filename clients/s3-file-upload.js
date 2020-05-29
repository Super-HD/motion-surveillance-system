const AWS = require('aws-sdk');
const fs = require('fs');

const BUCKET_NAME = 'terencenghan-bucket';
const IAM_USER_KEY = 'AKIAJ3TN3GAGU5DQGHFA';
const IAM_USER_SECRET = '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';

let s3bucket = new AWS.S3({
  accessKeyId: IAM_USER_KEY,
  secretAccessKey: IAM_USER_SECRET,
  Bucket: BUCKET_NAME
});

function uploadToS3(videoFile, axios, cameraId) {

  const fileContent = fs.readFileSync(videoFile)
  const params = {
    Bucket: BUCKET_NAME,
    Key: 'testvideo.mp4',
    Body: fileContent
  }

  s3bucket.getSignedUrl('putObject', params, function (err, url) {
    if (err) {
      console.log('error in callback');
      console.log(err);
    }
    console.log('success')
    console.log('The URL is', url);

    const newClip = {
      camera: cameraId,
      recordingDate: "testing",
      clipLink: url
    }

    // POST Request to DigitalOcean Server to store in MongoDB
    axios.post('http://161.35.110.201:4200/clip', { ...newClip })
  })

  // s3bucket.upload(params, (err, data) => {
  //   if (err) {
  //     console.log('error in callback');
  //     console.log(err);
  //   }
  //   console.log('success')
  //   console.log(data)
  //   console.log(data.Location)

  //   const newClip = {
  //     camera: cameraId,
  //     recordingDate: "testing",
  //     clipLink: data.Key
  //   }
  //   // POST Request to DigitalOcean Server to store in MongoDB
  //   axios.post('http://161.35.110.201:4200/clip', { ...newClip })
  // })
}

module.exports = {
  uploadToS3
}
