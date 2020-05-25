/*
Created by Cheng Zeng
Updated on 25/05/2020
In this file, operations of the Clip collection are implemented.
*/

const Clip = require('../models/MotionClip');
const mongoose = require('mongoose');

module.exports = {
    // A function retrieves all the documents from the Clip collection and sens them back as a response.
    // Populate replaces ID in the 'camera' with its camera document 
    // Populate replaces ID in the 'cameraClient' with its client document
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

    // A function that creates a new document and save it in Clip collection
    createOne: (req, res) => {
        let newClipDetails = req.body;
        newClipDetails._id = new mongoose.Types.ObjectId();
        Clip.create(newClipDetails, (err, clip) => {
            if (err) return res.status(400).json(err);
            res.json(clip);
        });
    },

    // A function finds one Clip document by an ID
    getOne: (req, res) => Clip.findOne({ _id: req.params.id }, (err, clip) => {
        if (err) res.status(400).json(err);
        if (!clip) return res.status(400).json();
        res.json(clip);
    }),

    // A function finds a Clip document by its ID and update its content using data retrieved from 'req.body'
    updateOne: (req, res) => Clip.findOneAndUpdate({ _id: req.params.id }, req.body, (err, clip) => {
        if (err) res.status(400).json(err);
        if (!clip) return res.status(400).json();
        res.json(clip);
    })
};