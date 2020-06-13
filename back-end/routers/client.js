/*
Created by Cheng Zeng
Modified by Terence
Updated on 13/06/2020
In this file, operations of the Client collection are implemented.
*/

const validate = require("../form-validation");
const Client = require('../models/Client')

// Not used in the project
// Can be used to develop authentication
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

/**
 * Retrieves all documents from the Client collection
 * The 'cameras' is populated from their ID to their document
 * @param {HTTP Request} req The HTTP request
 * @param {HTTP Response} res The HTTP respond, it will either contain an error statement or an array of client json objects
 */
const getAll = (req, res) => {
  Client.find({})
    .populate('cameras')
    .exec((err, clients) => {
      if (err) res.json(err)
      res.json(clients)
    })
}

/**
 * Create a new Client document
 * @param {HTTP Request} req The HTTP request, it contains a client json object
 * @param {HTTP Response} res The HTTP respond, it will contain either an error statement or the result
 */
const createOne = (req, res) => {
  let { clientName } = req.body
  // Search for a client using clientName
  // Create a new one if not exists otherwise do nothing
  Client.findOneAndUpdate({ clientName }, { clientName }, {
    new: true,
    upsert: true
  }, (err, result) => {
    if (err) res.json(err)
    res.json(result)
  })
}

/**
 * Search for a Client document
 * @param {HTTP Request} req The HTTP request, it contains a parameter which is a client ID
 * @param {HTTP Response} res The HTTP respond, it will contain either an error statement or a client json object
 */
const getOne = (req, res) => {
  Client.findOne({ _id: req.params.id }, (err, client) => {
    if (err) res.status(400).json(err);
    if (!client) return res.status(400).json();
    res.json(client);
  })
}


/**
 * Find a client document and update its content
 * @param {HTTP Request} req The HTTP request, it contains a parameter which is a client ID, and a client json object
 * @param {HTTP Response} res The HTTP respond, it will contain either an error statement or a client json object
 */
const updateOne = (req, res) => {
  Client.findOneAndUpdate({ _id: req.params.id }, req.body, (err, client) => {
    if (err) res.status(400).json(err);
    if (!client) return res.status(400).json();
    res.json(client);
  });
}

/**
 * Add a camera object to a client document
 * @param {HTTP Request} req The HTTP request, it contains a client json object including clientId and cameraId
 * @param {HTTP Response} res The HTTP respond, it will contain either an error statement or a clinet json object
 */
const addCamera = (req, res) => {
  let { clientId, cameraId } = req.body
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
};
