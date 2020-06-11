const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
// cors for allowing cross origin resource sharing between different localhosts
const cors = require("cors")
const app = express();
const server = require('http').Server(app)
// allow cross origin resource sharing
app.use(cors());
app.use(express.json());

app.use('/', express.static(path.join(__dirname, '../front-end/dist/MotionSurveillanceSystem')))

//const Camera = require('./models/camera');
const client = require("./routers/client")
const camera = require('./routers/camera');
const clip = require('./routers/clip');

// testing models for initial add
const Client = require('./models/Client')
const MotionClip = require('./models/MotionClip')
const Camera = require('./models/Camera')

// change once we deploy ONLINE
const mongoURI = process.env.MONGO_URI;
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
