const Camera = require('../models/camera');
const mongoose = require('mongoose');

module.exports = {
    getAll: function(req, res) {
        Camera.find(function(err, cameras) {
            if (err) return res.status(400).json(err);
            res.json(cameras);
        });
    },

    createOne: function(req, res) {
        let newCameraDetails = req.body;
        newCameraDetails._id = new mongoose.Types.ObjectId();
        Camera.create(newCameraDetails, function(err, camera) {
            if (err) return res.status(400).json(err);
            res.json(camera);
        });
    },

    getOne: function(req, res) {
        Camera.findOne({_id: req.params.id}, function(err, camera) {
            if (err) return res.status(400).json(err);
            if (!camera) return res.status(400).json();
            res.json(camera);
        })
    },

    updateOne: function(req, res) {
        Camera.findOneAndUpdate({_id: req.params.id}, req.body, function(err, camera) {
            if (err) return res.status(400).json(err);
            if (!camera) return res.status(400).json();
            res.json(camera);
        });
    }
};
