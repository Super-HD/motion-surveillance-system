const mongoose = require('mongoose');

const cameraSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    cameraID: {
        type: Number,
        required: true
    },
    cameraLocation: {
        type: String,
        required: true
    },
    cameraClient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Client',
        required: true
    },
    // stores the start and end time whenever a camera has started and ended
    deployTimes: [{
        startTime: {
            type: Date
        },
        endTime: {
            type: Date
        }
    }],
    // LINK to MotionClip Model
    motionClips: [{
        type: mongoose.Schema.ObjectId,
        ref: 'MotionClip'
    }]
});

module.exports = mongoose.model('Camera', cameraSchema);