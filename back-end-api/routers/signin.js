const validate = require("../form-validation");
const User = require('../models/Client')

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

module.exports = {
  handleSignIn
};
