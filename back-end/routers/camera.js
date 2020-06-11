/*
Created by Cheng Zeng
Modified by Terence
Updated on 11/06/2020
In this file, operations of the Camera collection are implemented.
*/

const Camera = require('../models/Camera')

/**
 * Retrieve all camera documents from the Camera collection
 * The 'cameraClient' is populated from its ID to its document
 * @param {*} req The HTTP request
 * @param {*} res The HTTP respond, it will either contain an error statement or an array of camera json objects
 */
const getAll = (req, res) => Camera.find().populate('cameraClient').exec((err, cameras) => {
    if (err) res.status(400).json(err);
    res.json(cameras);
})

/**
 * Create a new Camera document
 * @param {*} req The HTTP request, it contains a camera json object
 * @param {*} res The HTTP respond, it will contain either an error statement or the result
 */
const createOne = (req, res) => {
    let { cameraClient, cameraURL } = req.body
    // Search for a camera using cameraClient and cameraURL
    // Create a new one if not exists otherwise update the camera
    Camera.findOneAndUpdate({ cameraClient, cameraURL }, req.body, {
        new: true,
        upsert: true
    }, (err, result) => {
        if (err) res.json(err)
        res.json(result)
    })
}

/**
 * Search for a Camera document
 * @param {*} req The HTTP request, it contains a parameter which is a camera ID
 * @param {*} res The HTTP respond, it will contain either an error statement or a camera json object
 */
const getOne = (req, res) => Camera.findOne({ _id: req.params.id }, (err, camera) => {
    if (err) res.status(400).json(err);
    if (!camera) return res.status(400).json();
    res.json(camera);
})

/**
 * Find a Camera document and update its content
 * @param {*} req The HTTP request, it contains a parameter which is a camera ID, and a camera json object
 * @param {*} res The HTTP respond, it will contain either an error statement or a camera json object
 */
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
