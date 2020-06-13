/*
Created by Cheng Zeng
Modified by Terence
Updated on 13/06/2020
In this file, operations of the Clip collection are implemented.
*/

const Clip = require('../models/MotionClip');
const mongoose = require('mongoose');

/**
 * Retrieve all clip documents from the Clip collection
 * The 'camera' is populated from its ID to its document
 * The 'cameraClient' is populated from its ID to its document
 * @param {HTTP Request} req The HTTP request
 * @param {HTTP Response} res The HTTP respond, it will either contain an error statement or an array of clip json object
 */
const getAll = (req, res) => {
    Clip.find().populate({
        path: 'camera',
        populate: {
            path: 'cameraClient',
            model: 'Client'
        }
    }).exec((err, clips) => {
        if (err) res.status(400).json(err);
        res.json(clips);
    })
}

// A function that creates a new document and save it in Clip collection
/**
 * Create a new Clip document
 * @param {HTTP Request} req The HTTP request, it contains a clip json object
 * @param {HTTP Response} res The HTTP respond, it will contain either an error statement or the result
 */
const createOne = (req, res) => {
    let newClipDetails = req.body;
    newClipDetails._id = new mongoose.Types.ObjectId();
    Clip.create(newClipDetails, (err, clip) => {
        if (err) res.status(400).json(err);
        res.json(clip);
    });
}

/**
 * Search for a Clip document
 * @param {HTTP Request} req The HTTP request, it contains a parameter which is a clip ID
 * @param {HTTP Response} res The HTTP respond, it will contain either an error statement or a clip json object
 */
const getOne = (req, res) => {
    Clip.findOne({ _id: req.params.id }, (err, clip) => {
        if (err) res.status(400).json(err);
        if (!clip) return res.status(400).json();
        res.json(clip);
    })
}

/**
 * Find a Clip document and update its content
 * @param {HTTP Request} req The HTTP request, it contains a parameter which is a clip ID, and a clip json object
 * @param {HTTP Response} res The HTTP respond, it will contain either an error statement or a clip json object
 */
const updateOne = (req, res) => {
    Clip.findOneAndUpdate({ _id: req.params.id }, req.body, (err, clip) => {
        if (err) res.status(400).json(err);
        if (!clip) return res.status(400).json();
        res.json(clip);
    })
}

/**
 * Delete a Clip document
 * @param {HTTP Request} req The HTTP request, it contains a parameter which is a clip ID
 * @param {HTTP Response} res The HTTP respond, it will contain either an error statement or nothing
 */
const deleteOne = (req, res) => {
    Clip.findOneAndRemove({ _id: req.params.id }, (err) => {
        if (err) res.status(400).json(err);
        res.json();
    })
}


module.exports = {
    getAll,
    createOne,
    getOne,
    updateOne,
    deleteOne
};