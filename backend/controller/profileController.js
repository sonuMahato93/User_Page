const catchAsyncError = require("../middleware/catchAsyncError");
const Profile = require("../model/profileModel");
const memberDetails = require("../model/userModel");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

exports.createProfile = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    throw createError.Forbidden("Please Login");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded) {
    const name = decoded.name;
    const user = decoded.user_id;

    // if (req.file) {
    const newProfile = await Profile.create({
      name: name,
      user: user,
      image: { data: req.file.filename, contentType: "image/png" },
    });

    newProfile.save();

    return res.status(201).json({ newProfile });
    // }
    // return res.send("Required file to upload Image ");
  }

  throw createError.BadRequest("invalid");
});

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
exports.getProfile = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    throw createError.Forbidden("Please Login");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded) {
    const profile = await Profile.find({});

    return res.json(profile);
  }
  return res.send("invalid");
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
exports.getProfileById = catchAsyncError(async (req, res, next) => {
  const profile = await Profile.findById(req.params.id);

  if (profile) {
    res.json(profile);
  } else {
    res.status(404);
    throw new Error("Profile not found");
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createProfileReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment } = req.body;
  const token = req.cookies.access_token;

  if (!token) {
    throw createError.Forbidden("Please Login");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user_id = await memberDetails.findById(decoded.user_id);

  const profile = await Profile.findById(req.params.id);

  if (profile) {
    const alreadyReviewed = profile.reviews.find(
      (r) => r.user.toString() === user_id.id.toString()
    );
    //console.log(alreadyReviewed);

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("User already reviewed");
    }

    const review = {
      name: user_id.name,
      rating: Number(rating),
      comment,
      user: user_id,
    };

    profile.reviews.push(review);

    profile.numReviews = profile.reviews.length;

    profile.rating =
      profile.reviews.reduce((acc, item) => item.rating + acc, 0) /
      profile.reviews.length;

    await profile.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Profile not found");
  }
});
