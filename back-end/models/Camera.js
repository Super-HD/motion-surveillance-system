const mongoose = require('mongoose');

const cameraSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    cameraLocation: {
        type: String,
        required: true
    },
    cameraClient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Client',
        required: true
    },
    cameraURL: {
        type: String,
        reuqired: true
    },
    // stores the start and end time whenever a camera has started and ended
    // do not modify start time and end time
    startTime: {
        type: Object
    },
    endTime: {
        type: Object
    },
    // LINK to MotionClip Model
    motionClips: [{
        type: mongoose.Schema.ObjectId,
        ref: 'MotionClip'
    }]
});

module.exports = mongoose.model('Camera', cameraSchema);