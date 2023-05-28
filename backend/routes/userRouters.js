const express = require("express");
const router = express.Router();
const controller = require("../controller/usersController");
const profileController = require("../controller/profileController");
const upload = require("../middleware/multer");

//@ USER ROUTES
router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/home", controller.home);
router.get("/logout", controller.logout);

// @PROFILE ROUTES

router.get("/", profileController.getProfile);
router.post("/create", upload.single("image"), profileController.createProfile);
router.post("/:id/reviews", profileController.createProfileReview);
router.get("/:id", profileController.getProfileById);


module.exports = router;
