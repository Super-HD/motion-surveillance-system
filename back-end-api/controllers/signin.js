const validate = require("../form-validation");

const handleSignIn = (db, bcrypt) => (req, res) => {

  // data is sent via req body
  const { email, password } = req.body;

  // VALIDATION CHECK FOR VALID EMAIL & PASSWORD
  validateResult = validate.checkSignIn(email, password);

  if (validateResult !== "Success") {
    return res.status(400).json(validateResult);
  }

  // check email & password against database
  // Jason, I will need your mongoDB Settings so i can update this code to work for MongoDB.
  // This Code is my code for PostgreSQL database, not for MongoDB

  // There should be a login table containing
  // user email for signin
  // hashed value of user password
  // user type: Supervisor or Client?

  // we perform a database request to check if the sign in details from POST request matches a user in the login table.

  // You will then need to update your front end Angular App code to respond after POST request is done, if supervisor, go to main page. If Client, go to another page where they can approve upload their webcam stream.

  db.select("email", "hash")
    .from("login")
    // first check email
    .where("email", "=", email)
    .then(userData => {
      // check the password against its hashed value
      const isValid = bcrypt.compareSync(password, userData[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("user")
          .where("email", "=", email)
          .then(user => res.json(user[0]))
          .catch(err =>
            res
              .status(400)
              .json(
                "User Exists but we are currently unable to get user data. Please try another time."
              )
          );
      } else {
        // Email exists but password is wrong
        res
          .status(400)
          .json("Wrong Credentials. Please double-check and try again.");
      }
    })
    // Email entered does not Exist
    .catch(err =>
      res
        .status(400)
        .json("Wrong Credentials. Please double-check and try again.")
    );
};

module.exports = {
  handleSignIn
};
