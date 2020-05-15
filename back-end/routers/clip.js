const Clip = require('../models/MotionClip');
const mongoose = require('mongoose');

module.exports = {
    getAll: (req, res) => Clip.find().populate({
        path: 'camera',
        populate: {
            path: 'cameraClient',
            model: 'Client'
        }
    }).exec((err, clips) => {
        if (err) res.status(400).json(err);
        res.json(clips);
    }),

    createOne: (req, res) => {
        let newClipDetails = req.body;
        newClipDetails._id = new mongoose.Types.ObjectId();
        Clip.create(newClipDetails, (err, clip) => {
            if (err) return res.status(400).json(err);
            res.json(clip);
        });
    },

    getOne: (req, res) => Clip.findOne({ _id: req.params.id }, (err, clip) => {
        if (err) res.status(400).json(err);
        if (!clip) return res.status(400).json();
        res.json(clip);
    }),

    updateOne: (req, res) => Clip.findOneAndUpdate({ _id: req.params.id }, req.body, (err, clip) => {
        if (err) res.status(400).json(err);
        if (!clip) return res.status(400).json();
        res.json(clip);
    })
};