const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const AWS = require('aws-sdk')
// cors for allowing cross origin resource sharing between different localhosts
const cors = require("cors")
const app = express();
const server = require('http').Server(app)
// allow cross origin resource sharing
app.use(cors());
app.use(express.json());

app.use('/', express.static(path.join(__dirname, '../front-end/dist/MotionSurveillanceSystem')))


let s3bucket = new AWS.S3({
    accessKeyId: process.env.IAM_USER_KEY,
    secretAccessKey: process.env.IAM_USER_SECRET,
    Bucket: process.env.BUCKET_NAME
});

//const Camera = require('./models/camera');
const client = require("./routers/client")
const camera = require('./routers/camera');
const clip = require('./routers/clip');

// testing models for initial add
const Client = require('./models/Client')
const MotionClip = require('./models/MotionClip')
const Camera = require('./models/Camera')

// change once we deploy ONLINE
const mongoURI = "mongodb+srv://Terence:v9nzSDSVtkA1USXO@cluster0-hllvg.mongodb.net/test?retryWrites=true&w=majority";
mongoConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}
mongoose.connect(mongoURI, mongoConfig, (err) => {
    if (err) {
        console.log('Mongoose connection error: ', err);
        process.exit(1);
    }
    console.log("Database connected successfully");
})

// Configuring Endpoints
app.get("/", (req, res) => {
    res.send("App is working!");
});

// Client RESTFul endpoints
app.get('/clients', client.getAll);
app.post('/client', client.createOne);
app.get('/client/:id', client.getOne);
app.put('/client/:id', client.updateOne);
app.post('/addcamera', client.addCamera);

// Camera RESTFul endpoints
app.get('/cameras', camera.getAll);
app.post('/camera', camera.createOne);
app.get('/camera/:id', camera.getOne);
app.put('/camera/:id', camera.updateOne);
app.delete('/camera/:id', camera.deleteOne);

// Clip RESTFul endpoints
app.get('/clips', clip.getAll);
app.post('/clip', clip.createOne);
app.get('/clip/:id', clip.getOne);
app.put('/clip/:id', clip.updateOne);
app.delete('/clip/:id', clip.deleteOne);

// Change to PORT constant once deployed online
server.listen(4200, () => {
    console.log(`Server Successfully Started on Port ${4200}`);
})

//signin --> POST Request --> Success/Fail
// Signin for checking if user is supervisor in login page.
// temporarily dont do first.
// app.post("/signin", signin.handleSignIn(bcrypt));

// retrieve motion snapshot video clip mp4 by specific camera id
app.post('/motion/:id')

// server will store live stream data every 30 minutes into the file storage server (localhost at first then digitalOcean)

function getClip(clipName) {
    s3.getObject(
        { Bucket: process.env.BUCKET_NAME, Key: clipName },
        function (error, data) {
            if (error != null) {
                alert("Failed to retrieve an object: " + error);
            } else {
                console.log(data.body)
                // do something with data.Body
            }
        }
    );
}