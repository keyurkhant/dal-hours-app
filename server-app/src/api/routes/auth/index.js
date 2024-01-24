const express = require("express");
const authController = require("../../controllers/auth/index");
const router = express.Router();

router.post("/login", authController.login);
router.post("/forgotpassword", authController.forgotPassword);
router.post("/resetpassword", authController.resetPassword);

module.exports = router;
