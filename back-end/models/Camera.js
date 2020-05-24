/*
Created by Cheng Zeng
Updated on 25/05/2020
This file defines camera schema. The camera collecion contains all cameras that register in the system.
Camera contains 7 entities: _id, cameraLocation, cameraClient, cameraURL, startTime, endTime and motionClips. 
_id: ObjectID in mongoose. It is an identify of a camera record.
cameraLocation: String. It indicates where the camera is located.
cameraClient: Client object in database. It indicates who owns the camera.
cameraURL: String. It is used to identify streaming source.
startTime: JavaScript Object. It stores the start time of activiation of motion detection. 
endTime: JavaScript Object. It stores the end time of activiation of motion detection. 
motionClips: MotionClip object in database. It links to a motionClip object.
*/

const mongoose = require('mongoose');

const cameraSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    cameraLocation: {
        type: String,
        required: true
    },
    // Link to CameraClint Model
    cameraClient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Client',
        required: true
    },
    cameraURL: {
        type: String,
        reuqired: true
    },
    startTime: {
        type: Object
    },
    endTime: {
        type: Object
    },
    // Link to MotionClip Model
    motionClips: [{
        type: mongoose.Schema.ObjectId,
        ref: 'MotionClip'
    }]
});

module.exports = mongoose.model('Camera', cameraSchema);