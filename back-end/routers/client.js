/*
Created by Cheng Zeng
Modified by Terence
Updated on 25/05/2020
In this file, operations of the Client collection are implemented.
*/

const validate = require("../form-validation");
const Client = require('../models/Client')

// not needed at this stage
const handleSignIn = (bcrypt) => (req, res) => {

  // data is sent via req body
  const { email, password, userType } = req.body;

  // VALIDATION CHECK FOR VALID EMAIL & PASSWORD
  validateResult = validate.checkSignIn(email, password);

  if (validateResult !== "Success") {
    return res.status(400).json(validateResult);
  }
  // we perform a database request to check if the sign in details from POST request matches a user in the login table.
  // Jason, I need you to create front end Angular sign in page to key in the info, then respond after POST request is done, if supervisor, go to main page. If Client, go to another page where they can approve upload their webcam stream.
  User.findOne({ userType, email }, (err, user) => {

    if (!user) return res.status(400).json("Wrong Credentials. Please double-check and try again.");

    // user found, but need to check if password is correct
    const isValid = bcrypt.compareSync(password, user.password)

    if (isValid) { return res.json(user) }
    if (err) { return res.status(400).json(err) }
    else { return res.status(400).json("Wrong Credentials. Please double-check and try again.") };
  })
}

// A function retrieves all the documents from the Client collection and sens them back as a response.
// Populate replaces each ID in the array 'cameras' with its camera document.
const getAll = (req, res) => {
  Client.find({})
    .populate('cameras')
    .exec((err, clients) => {
      if (err) { return res.json(err) }
      if (!clients) { return res.json() }
      res.json(clients)
    })
}

// A function that creates a new document and save it in Client collection if the parsed data in 'req.body' does not exists
// otherwise update the client
const createOne = (req, res) => {
  let { clientName } = req.body
  // check if exists already, if yes then return and do nothing
  Client.findOneAndUpdate({ clientName }, { clientName }, {
    new: true,
    upsert: true
  }, (err, result) => {
    if (err) res.json(err)
    console.log(result)
    res.json(result)
  })
}

// A function finds one Client document by an ID
// const getOne = (req, res) => {
//   Client.findOne({ _id: req.params.id })
//     .populate('cameras')
//     .exec((err, clients) => {
//       if (err) { return res.json(err) }
//       if (!clients) { return res.json() }
//       res.json(clients)
//     })
// }
const getOne = (req, res) => Client.findOne({ _id: req.params.id }, (err, client) => {
  if (err) res.status(400).json(err);
  if (!client) return res.status(400).json();
  res.json(client);
})

// A function finds a Client document by its ID and update its content using data retrieved from 'req.body'
const updateOne = (req, res) => {
  Client.findOneAndUpdate({ _id: req.params.id }, req.body, (err, client) => {
    if (err) return res.status(400).json(err);
    if (!client) return res.status(404).json();
    res.json(client);
  });
}

// A function add a Camera document to Client document's 'cameras' array
const addCamera = (req, res) => {
  let { clientId, cameraId } = req.body
  // check if exists already, if yes then return and do nothing
  Client.findByIdAndUpdate(clientId, {
    $addToSet: {
      "cameras": cameraId
    }
  }, { new: true, upsert: true }, (err, client) => {
    if (err) res.json(err)
    res.json(client)
  })
}

module.exports = {
  getAll,
  createOne,
  getOne,
  updateOne,
  addCamera
  // I WILL ADD MORE IF NECESSARY e.g. deleteOne etc.
};
