// creating instant validation

const checkSignIn = (email, password) => {
  if (!email || !password) {
    return "Please fill in all fields and try again.";
  }

  return "Success";
};

const checkRegister = (fname, lname, email, password, confirmPass) => {

  const errorList = [];

  if (!fname || !lname || !email || !password || !confirmPass) {
    errorList.push("Please fill in all fields.")
  }

  const firstNameCheck = validName(fname, "first name");
  if (firstNameCheck !== "Success") {
    errorList.push(firstNameCheck)
  }

  const lastNameCheck = validName(lname, "last name");
  if (lastNameCheck !== "Success") {
    errorList.push(lastNameCheck)
  }

  const emailCheck = validEmail(email);
  if (emailCheck !== "Success") {
    errorList.push(emailCheck)
  }

  const passCheck = validPassword(password);
  if (passCheck !== "Success") {
    errorList.push(passCheck)
  }

  if (password !== confirmPass) {
    errorList.push("Please make sure your two passwords match.")
  }

  return errorList.length ? errorList : "Success"
};

const validEmail = email => {
  // regex taken from https://www.w3resource.com/javascript/form/email-validation.php
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return "Success";
  }
  return "Please enter a valid email address.";
};

// EXTREMELY BASIC - SUBJECT TO IMPROVEMENTS IN FUTURE
const validPassword = password => {
  if (password.length < 6) {
    return "Please enter a valid password - Password must contain at least six characters.";
  }
  return "Success";
};

// for checking names upon register - max length is 50, first letter must be Capital.
const validName = (name, type) => {

  // remove all whitespaces and check if empty string
  if (!name.replace(/\s/g, '').length) {
    return `Please enter a valid ${type} with characters.`
  }

  if (!(/^[a-zA-Z\s]*$/.test(name))) {
    return `Please ensure you only entered alphabets in the ${type} field`
  }

  return "Success"
};

module.exports = {
  checkSignIn,
  checkRegister
};
