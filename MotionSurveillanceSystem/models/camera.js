import { truncate } from 'fs';
import { stringify } from 'querystring';

const mongoose = require('mongoose');

const cameraSchema = new mongoose.Schema({
    _id: mongoose.model.Schema.Types.ObjectID,
    cameraID: {
        type: Number,
        required: true
    },
    cameraLocation: {
        type: String,
        required: true
    },
    cameraClient: {
        type: String,
        required: true
    },
    startTime: {
        type: Object
    },
    endTime: {
        type: Object
    }
});

module.exports = mongoose.model('Camera', cameraSchema);