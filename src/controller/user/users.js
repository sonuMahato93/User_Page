const UserDetails = require("../model/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const catchAsyncError = require("../middleware/catchAsyncError");
const createError = require("http-errors");



const salt = bcrypt.genSaltSync(10);

exports.register = catchAsyncError(async (req, res, next) => {
  // Our register logic starts here
  // Get user input
  const { name, email, password,confirmPassword } = req.body;

  // Validate user input
  if (!(email && password && name && confirmPassword)) {
    throw createError.BadRequest("All input is required");
  }

if(password != confirmPassword){
  throw createError.BadRequest("Please enter the Confirm password correct")
}
  // check if user already exist
  // Validate if user exist in our database
  const oldUser = await UserDetails.findOne({ email });

  if (oldUser) {
    throw createError.Conflict("User Already Exist. Please Login");
    // return res.status(409).send("User Already Exist. Please Login");
  }

  //Encrypt user password

  //const salt = bcrypt.genSaltSync(10);
  const hash = await bcrypt.hash(password, salt);
  const confirmPasswordHash = await bcrypt.hash(confirmPassword, salt);






  // Create user in our database
  const user = await UserDetails.create({
    name: name,
    email: email, 
    password: hash,
    confirmPassword: confirmPasswordHash
  });

  // Create token
  let jwtSecretKey = `${process.env.JWT_SECRET}`;
  const token = jwt.sign({ user_id: user._id, email }, jwtSecretKey, {
    expiresIn: "2h",
  });
  // save user token
  user.token = token;
  user.save();
  return res.status(201).json({ user, token });
});




exports.login = catchAsyncError(async (req, res, next) => {
  // Our login logic starts here

  // Get user input
  const { email, password } = req.body;

  // Validate user input
  if (!(email && password)) {
    throw createError.BadRequest("All input is required");
  }
  // Validate if user exist in our database
  const user = await UserDetails.findOne({ email });

  const validPassword = await bcrypt.compare(password, user.password);

  if (user && validPassword) {
    // Create token

    let jwtSecretKey = `${process.env.JWT_SECRET}`;
    const token = jwt.sign({ user_id: user._id, email }, jwtSecretKey, {
      expiresIn: "2h",
    });

    // save user token
    user.token = token;

    // user
    // return res.status(200).json(user);
    return res
    .cookie("access_token", token, {
      httpOnly: true
    })
    .status(200)
    .json({ message: "Logged in successfully 😊 👌" ,  user});
  }
  throw createError.BadRequest("Invalid Credentials");
});



exports.home = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.access_token;
  console.log(token);
  if (!token) {
    throw createError.Forbidden("Please Login");
  }
    const data = jwt.verify(token, process.env.JWT_SECRET);
    // Almost done
    return res.send(data)


})







exports.logout = catchAsyncError(async (req, res, next) => {
// app.get("/logout", authorization, (req, res) => {
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Successfully logged out 😏 🍀" });
});