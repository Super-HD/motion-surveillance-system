const Clip = require('../models/clip');
const mongoose = require('mongoose');

module.exports = {
    getAll: function(req, res) {
        Clip.find(function(err, clips) {
            if (err) return res.status(400).json(err);
            res.json(clips);
        });
    },

    createOne: function(req, res) {
        let newClipDetails = req.body;
        newClipDetails._id = new mongoose.Types.ObjectId();
        Clip.create(newClipDetails, function(err, clip) {
            if (err) return res.status(400).json(err);
            res.json(clip);
        });
    },

    getOne: function(req, res) {
        Clip.findOne({_id: req.params.id}, function(err, clip) {
            if (err) return res.status(400).json(err);
            if (!clip) return res.status(400).json();
            res.json(clip);
        })
    },

    updateOne: function(req, res) {
        Clip.findOneAndUpdate({_id: req.params.id}, req.body, function(err, clip) {
            if (err) return res.status(400).json(err);
            if (!clip) return res.status(400).json();
            res.json(clip);
        });
    } 
};