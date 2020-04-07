const mongoose = require('mongoose');

const clipSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // clipID: {
    //     type: Number,
    //     required: true
    // },
    cameraID: {
        type: Number,
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

module.exports = mongoose.model('Clip', clipSchema);
