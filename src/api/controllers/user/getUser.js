const response = require("../../../utils/response");
const User = require("../../../models/user");

const getUser = (req, res) => {
  const { user } = req;

  return response(res, 200, true, user);
};

const getUserById = (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).send("User ID is required");
  }

  User.find({ _id: userId })
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }
      return response(res, 200, true, user);
    })
    .catch((err) => {
      return response(res, 500, false, { message: "No data found" });
    });
};

const getInstructorList = (req, res) => {
  User.find({ role: "INSTRUCTOR" })
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

const getTAMarkerList = (req, res) => {
  User.find({ role: "TA_MARKER" })
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

module.exports = { getUser, getInstructorList, getTAMarkerList, getUserById };
