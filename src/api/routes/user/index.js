const express = require("express");
const userController = require("../../controllers/user/index");
const router = express.Router();
const {
  authenticateUser,
  authenticateAdmin,
} = require("../../../middleware/authmiddleware");

router.post("/add-user", authenticateAdmin, userController.addUser);
router.get("/", authenticateUser, userController.getUser);
router.get("/user", authenticateUser, userController.getUserById);
router.get("/instructor-list", authenticateUser, userController.getInstructorList);
router.get("/ta-marker-list", authenticateUser, userController.getTAMarkerList);

module.exports = router;
