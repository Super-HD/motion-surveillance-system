const express = require("express")
// bcrypt for hashing passwords
const bcrypt = require("bcrypt-nodejs");
// cors for allowing cross origin resource sharing between different localhosts
const cors = require("cors")
// Port Number for once server is deployed online - Ignore for now
const PORT = process.env.PORT;

// TODO
// Confirm login page for Supervisor + Client Computers who upload their webcam stream

// DB Settings - Jason, Can you tell me your MongoDB connection & also configure the settings here?
const db = null;


// THERE IS NO REGISTER - We assume that we give clients their login details personally for them to login to upload webcam stream

const signin = require("./controllers/signin")

const app = express()
// allow cross origin resource sharing
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("App is working!");
});

//signin --> POST Request --> Success/Fail
app.post("/signin", signin.handleSignIn(db, bcrypt));

app.listen(PORT || 3000, () => {
  console.log(`Server Successfully Started on Port ${PORT}`);
});