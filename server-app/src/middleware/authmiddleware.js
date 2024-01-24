const jwt = require("jsonwebtoken");
const user = require("../models/user");
const response = require("../utils/response");

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return response(res, 401, false, {
        message: "Fail to authenticate token.",
      });
    }

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        return response(res, 403, false, {
          message: "Failed to authenticate token",
        });
      }

      req.user = await user.findById(decoded.id);
      next();
    });
  } catch (error) {
    return response(res, 401, false, { message: "No token provided" });
  }
};

const authenticateAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return response(res, 401, false, {
        message: "Fail to authenticate token.",
      });
    }

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        return response(res, 403, false, {
          message: "Failed to authenticate token",
        });
      }
      const dbresponseUser = await user.findById(decoded.id);
      if (dbresponseUser.role !== "ADMIN") {
        return response(res, 403, false, {
          message: "Invalid Authorization",
        });
      }
      req.user = dbresponseUser;
      next();
    });
  } catch (error) {
    return response(res, 401, false, { message: "No token provided" });
  }
};

module.exports = {
  authenticateUser,
  authenticateAdmin,
};
