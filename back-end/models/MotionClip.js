/*
Created by Cheng Zeng
Updated on 25/05/2020
This file defines motion clip schema. The motion clip collection contains all clips are recorded in the system.
MotionClip contains 4 entities: _id, camera, recording Date, clipLink.
_id: ObjectID in mongoose. It is an identify of a motion clip record.
camera: a camera object in database. It is the camera that records the clip.
recordingDate: String. It is the time when the clip is recorded.
clipLink: String. It is a url linking to the clip that is stored in a cloud storage.
*/

const mongoose = require('mongoose');

const clipSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    camera: {
        type: mongoose.Schema.ObjectId,
        ref: 'Camera',
        //required: true
    },
    recordingDate: {
        type: String,
        required: true
    },
    clipLink: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('MotionClip', clipSchema);
