const express = require('express');
const mongoose = require('mongoose');
const cv = require('opencv4nodejs')
const path = require('path');
// cors for allowing cross origin resource sharing between different localhosts
const cors = require("cors")
const app = express();
const fs = require('fs')
const server = require('http').Server(app)
const io = require('socket.io')(server)
// bcrypt for hashing passwords
const bcrypt = require("bcrypt-nodejs");
// allow cross origin resource sharing
app.use(cors());
app.use(express.json());

app.use('/', express.static(path.join(__dirname, '../front-end/dist/MotionSurveillanceSystem')))

// // Port Number for once server is deployed online - Ignore for now
// const PORT = process.env.PORT;

// THERE IS NO REGISTER - We assume that we give clients their login details personally for them to login to upload webcam stream

//const Camera = require('./models/camera');
const client = require("./routers/client")
const camera = require('./routers/camera');
const clip = require('./routers/clip');

// testing models for initial add
const Client = require('./models/Client')
const MotionClip = require('./models/MotionClip')
const Camera = require('./models/Camera')

// change once we deploy ONLINE
const mongoURI = "mongodb://localhost:27017/mssDB";
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

// TESTING LIVE STREAM ON A STATIC HTML PAGE
// retrieve video frames by specific camera id later app.get('/stream/:id')
app.get('/stream', (req, res) => {
    fs.readFile("./livestream.html", (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
    });
})

// Client RESTFul endpoints
app.get('/clients', client.getAll);
app.post('/client', client.createOne);
app.get('/client/:id', client.getOne);
app.put('/client/:id', client.updateOne);

// Camera RESTFul endpoints
app.get('/cameras', camera.getAll);
app.post('/camera', camera.createOne);
app.get('/camera/:id', camera.getOne);
app.put('/camera/:id', camera.updateOne);

// Clip RESTFul endpoints
app.get('/clips', clip.getAll);
app.post('/clip', clip.createOne);
app.get('/clip/:id', clip.getOne);
app.put('/clip/:id', clip.updateOne);

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
