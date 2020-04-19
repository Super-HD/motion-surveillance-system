const mongoose = require('mongoose');

const clipSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    camera: {
        type: mongoose.Schema.ObjectId,
        ref: 'Camera',
        required: true
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
