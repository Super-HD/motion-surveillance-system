/*
Created by Cheng Zeng
Modified by Terence
Updated on 05/06/2020
In this file, operations of the Camera collection are implemented.
*/

const Camera = require('../models/Camera')

// TODOS: MAYBE IMPLEMENT an 'isOperating' type for Camera Schema so Server can always know from mongoDB which clients are currently ON and which are OFF.

// A function retrieves all the documents from the Camera collection and sends them back as a response.
// Populate replaces the ID in 'cameraClient' with its client document.
const getAll = (req, res) => Camera.find().populate('cameraClient').exec((err, cameras) => {
    if (err) res.status(400).json(err);
    res.json(cameras);
})

// A function that creates a new document and save it in Camera collection if the parsed data in 'req.body' does not exists
// otherwise update the camera
const createOne = (req, res) => {
    let { cameraClient, cameraLocation } = req.body
    // check if exists already, if yes then return and do nothing
    Camera.findOneAndUpdate({ cameraClient, cameraLocation }, req.body, {
        new: true,
        upsert: true
    }, (err, result) => {
        if (err) res.json(err)
        res.json(result)
    })
}

// A function finds one Camera document by an ID
const getOne = (req, res) => Camera.findOne({ _id: req.params.id }, (err, camera) => {
    if (err) res.status(400).json(err);
    if (!camera) return res.status(400).json();
    res.json(camera);
})

// A function finds a Camera document by its ID and update its content using data retrieved from 'req.body'
const updateOne = (req, res) => Camera.findOneAndUpdate({ _id: req.params.id }, req.body, (err, camera) => {
    if (err) res.status(400).json(err);
    if (!camera) return res.status(400).json();
    res.json(camera);
})

module.exports = {
    getAll,
    createOne,
    getOne,
    updateOne
};
