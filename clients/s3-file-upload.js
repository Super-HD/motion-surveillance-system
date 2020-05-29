const AWS = require('aws-sdk');
const fs = require('fs');

let s3bucket = new AWS.S3({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET,
  Bucket: process.env.BUCKET_NAME
});

function uploadToS3(videoFile, axios, cameraId) {

  const fileContent = fs.readFileSync(videoFile)
  const params = {
    Bucket: process.env.BUCKET_NAME,
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
<<<<<<< HEAD
      clipLink: url
=======
      clipName: data.Key
>>>>>>> 9aded6f9788fa896629fbf5f272a2dac9e6437f5
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
