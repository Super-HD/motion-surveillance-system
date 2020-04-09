const mongoose = require('mongoose');

//password value is hashed
const signinSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userType: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },

});

module.exports = mongoose.model('User', signinSchema);