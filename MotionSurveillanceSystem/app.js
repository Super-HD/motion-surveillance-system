const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const Camera = require('./models/camera');
const camera = require('./routers/camera');
const mongoURI = "mongodb://" + process.argv[2] + ":27017/mssDB";

mongoose.connect(mongoURI, function(err){
    if (err) {
        console.log(err);
        process.exit(1);
    }
    console.log("Database connected successfully");
    app.listen(4200, function() {
        console.log("Web App is running on port 4200");
    });

    let camera1 = new Camera({
        _id: new mongoose.Types.ObjectId(),
        cameraID: 1,
        cameraLocation: "Melbourne",
        cameraClient: "Monash University",
        startTime: {
            hour: 13,
            minute: 30
        },
        endTime: {
            hour: 23,
            minute: 30
        }
    });

    camera1.save(function(err){
        if (err) throw err;
        console.log("Camera successfully added to DB");
        
    });
})

app.get('/cameras', camera.getAll);
app.post('/cameras', camera.createOne);

app.put('/cameras/:id', camera.updateOne);


