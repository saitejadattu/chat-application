const express = require("express");
const router = express.Router();
const userQueries = require("../Controllers/userController");

router.get("/users", userQueries.getUsers);
router.post("/register", userQueries.registerUser);
router.post("/login", userQueries.loginUser);
router.delete("/delete/:id", userQueries.deleteUser);
module.exports = router;
