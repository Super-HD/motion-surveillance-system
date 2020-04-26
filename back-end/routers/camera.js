const Camera = require('../models/Camera')

// TODOS: MAYBE IMPLEMENT an 'isOperating' type for Camera Schema so Server can always know from mongoDB which clients are currently ON and which are OFF.

const getAll = (req, res) => Camera.find((err, cameras) => {
    if (err) res.status(400).json(err);
    res.json(cameras);
})

const createOne = (req, res) => {
    let { cameraClient, cameraLocation, cameraURL } = req.body
    // check if exists already, if yes then return and do nothing
    Camera.findOneAndUpdate({ cameraClient, cameraLocation, cameraURL}, { cameraClient, cameraLocation, cameraURL }, {
        new: true,
        upsert: true
    }, (err, result) => {
        if (err) res.json(err)
        res.json(result)
    })
}

const getOne = (req, res) => Camera.findOne({ _id: req.params.id }, (err, camera) => {
    if (err) res.status(400).json(err);
    if (!camera) return res.status(400).json();
    res.json(camera);
})

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
