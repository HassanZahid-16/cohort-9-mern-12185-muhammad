const express = require("express");
const authController = require("../controllers/authController");
const authenticate = require("../middlewares/authMiddleware");
const { csrfMiddleware } = require("../middlewares/csrfMiddleware");
const originMiddleware = require("../middlewares/originMiddleware");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authenticate, authController.me);
router.post("/logout",authenticate,originMiddleware,csrfMiddleware,authController.logout);

module.exports = router;