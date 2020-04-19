const Camera = require('../models/Camera')

const getAll = (req, res) => Camera.find((err, cameras) => {
    if (err) res.status(400).json(err);
    res.json(cameras);
})

const createOne = (req, res) => {
    let newCamera = req.body
    // check if exists already, if yes then return and do nothing
    Camera.findOneAndUpdate({ cameraClient: newCamera.cameraClient, cameraLocation: newCamera.cameraLocation }, newCamera, {
        new: true,
        upsert: true
    }, (err, result) => {
        if (err) res.json(err)
        res.json("Camera added or already exists.")
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
