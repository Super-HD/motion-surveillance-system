const express = require('express');
const mongoose = require('mongoose');

// bcrypt for hashing passwords
const bcrypt = require("bcrypt-nodejs");

// cors for allowing cross origin resource sharing between different localhosts
const cors = require("cors")

// // Port Number for once server is deployed online - Ignore for now
// const PORT = process.env.PORT;

let path = require('path');

const app = express();
// allow cross origin resource sharing
app.use(cors());
// dont need body parser anymore just do this
app.use(express.json());

app.use('/', express.static(path.join(__dirname, '../front-end/dist/MotionSurveillanceSystem')))


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

// TODO
// Create login page for Supervisor + Client Computers who upload their webcam stream

//signin --> POST Request --> Success/Fail
app.post("/signin", signin.handleSignIn(bcrypt));

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
app.listen(4200, () => {
    console.log(`Server Successfully Started on Port ${4200}`);
})