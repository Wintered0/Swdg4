// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/ManagementAccount");
const login = require("../controllers/authController");



// Quản lí acc
router.get("/users/:id", userController.getUserById);

router.get("/users", userController.getUsers);
router.post("/users", userController.createUser);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);
// ---
router.post("/login", login.login);

module.exports = router;
