const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchError = (res, err) => {
  res.status(500).json({ message: err.message });
};
const sendResponse = (res, status, message) => {
  res.status(status).json({ message });
};
const userQueries = {
  registerUser: async (req, res) => {
    try {
      const { email, name, password } = req.body;
      const isUser = await User.findOne({ email });
      if (!isUser) {
        const hashedPass = await bcrypt.hash(password, 10);
        const registerUser = await User({ ...req.body, password: hashedPass });
        const response = await registerUser.save();
        if (response) sendResponse(res, 200, "registration successful");
      } else {
        sendResponse(res, 404, "email already in user");
      }
    } catch (err) {
      catchError(res, err);
    }
  },
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      const isUser = await User.findOne({ email });
      if (isUser) {
        const isPassword = await bcrypt.compare(password, isUser.password);
        if (isPassword) {
          const payload = { email: isUser.email, id: isUser._id };
          const jwtToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: 1,
          });
          sendResponse(res, 200, jwtToken);
        } else {
          sendResponse(res, 400, "incorrect password or email :)");
        }
      }
    } catch (err) {
      catchError(res, err);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const deleteUser = await User.findByIdAndDelete(id);
      if (deleteUser) {
        sendResponse(res, 200, "deleted successful");
      } else {
        sendResponse(res, 500, "user Not Found");
      }
    } catch (err) {
      catchError(res, err);
    }
  },
  getUsers: async (req, res) => {
    const users = await User.find();
    res.send(users);
  },
};

module.exports = userQueries;
