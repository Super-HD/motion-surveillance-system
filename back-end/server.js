const express = require('express');
const mongoose = require('mongoose');
const cv = require('opencv4nodejs')
const path = require('path');
// cors for allowing cross origin resource sharing between different localhosts
const cors = require("cors")
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)
// bcrypt for hashing passwords
const bcrypt = require("bcrypt-nodejs");
// allow cross origin resource sharing
app.use(cors());
// dont need body parser anymore just do this
app.use(express.json());

const vCap = new cv.VideoCapture(0)
vCap.set(cv.CAP_PROP_FRAME_WIDTH, 300);
vCap.set(cv.CAP_PROP_FRAME_HEIGHT, 300);
const FPS = 10;

app.use('/', express.static(path.join(__dirname, '../front-end/dist/MotionSurveillanceSystem')))

// // Port Number for once server is deployed online - Ignore for now
// const PORT = process.env.PORT;

// THERE IS NO REGISTER - We assume that we give clients their login details personally for them to login to upload webcam stream

//const Camera = require('./models/camera');
const signin = require("./routers/signin")
const camera = require('./routers/camera');
const clip = require('./routers/clip');


// testing models for initial add
// const CameraClient = require('./models/CameraClient')
// const CameraClip = require('./models/CameraClip')
// const User = require('./models/User')

// change once we deploy ONLINE
const mongoURI = "mongodb://localhost:27017/mssDB";
mongoConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(mongoURI, mongoConfig, (err) => {

    if (err) {
        console.log(err);
        process.exit(1);
    }
    console.log("Database connected successfully");

    // let cameraClient = new CameraClient({
    //     _id: new mongoose.Types.ObjectId(),
    //     cameraID: 1,
    //     cameraLocation: "Melbourne",
    //     cameraClient: "Monash University",
    //     startTime: {
    //         hour: 13,
    //         minute: 30
    //     },
    //     endTime: {
    //         hour: 23,
    //         minute: 30
    //     }
    // });

    // cameraClient.save(function (err) {
    //     if (err) throw err;
    //     console.log("Camera successfully added to DB");
    // });

    // let supervisor = new User({
    //     _id: new mongoose.Types.ObjectId(),
    //     userType: "Supervisor",
    //     email: "supervisor@testing.com",
    //     // hash password
    //     password: bcrypt.hashSync("123456"),
    // });

    // supervisor.save(function (err) {
    //     if (err) throw err;
    //     console.log("Supervisor successfully added to DB");
    // });

    // let client = new User({
    //     _id: new mongoose.Types.ObjectId(),
    //     userType: "Client",
    //     email: "client@testing.com",
    //     // hash password
    //     password: bcrypt.hashSync("123456"),
    // });

    // client.save(function (err) {
    //     if (err) throw err;
    //     console.log("Client successfully added to DB");
    // });
})
app.get("/", (req, res) => {
    res.send("App is working!");
});

//signin --> POST Request --> Success/Fail
// Signin for checking if user is supervisor in login page.
// temporarily dont do first.
// app.post("/signin", signin.handleSignIn(bcrypt));

// TESTING LIVE STREAM ON A STATIC HTML PAGE
// retrieve video frames by specific camera id later app.get('/stream/:id')
app.get('/stream', (req, res) => {
    res.sendFile(path.join(__dirname, 'livestream.html'))
    // This code sets up repeating frame callback to send live stream data
    setInterval(() => {
        // vCap.read returns a mat file
        const frame = vCap.read();
        const image = cv.imencode('.jpg', frame).toString('base64')
        io.emit('image', image)
    }, 1000 / FPS)
})



// retrieve motion snapshot video clip mp4 by specific camera id
app.post('/motion/:id')

// server will store live stream data every 30 minutes into the file storage server (localhost at first then digitalOcean)

// Camera RESTFul endpoints
app.get('/cameras', camera.getAll);
app.post('/cameras', camera.createOne);
app.get('/cameras/:id', camera.getOne);
app.put('/cameras/:id', camera.updateOne);

// Clip RESTFul endpoints
app.get('/clips', clip.getAll);
app.post('/clips', clip.createOne);
app.get('/clips/:id', clip.getOne);
app.put('/clips/:id', clip.updateOne);

// Change to PORT constant once deployed online
server.listen(4200, () => {
    console.log(`Server Successfully Started on Port ${4200}`);
})