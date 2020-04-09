const Camera = require('../models/CameraClient')

module.exports = {
    getAll: (req, res) => Camera.find((err, cameras) => {
        if (err) res.status(400).json(err);
        res.json(cameras);
    }),

    createOne: (req, res) => {
        let newCameraDetails = req.body;
        newCameraDetails._id = new mongoose.Types.ObjectId();
        Camera.create(newCameraDetails, (err, camera) => {
            if (err) return res.status(400).json(err);
            res.json(camera);
        });
    },

    getOne: (req, res) => Camera.findOne({ _id: req.params.id }, (err, camera) => {
        if (err) res.status(400).json(err);
        if (!camera) return res.status(400).json();
        res.json(camera);
    }),

    updateOne: (req, res) => Camera.findOneAndUpdate({ _id: req.params.id }, req.body, (err, camera) => {
        if (err) res.status(400).json(err);
        if (!camera) return res.status(400).json();
        res.json(camera);
    })
};
