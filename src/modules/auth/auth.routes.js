const express = require("express");
const { signupUser, loginUser } = require("./auth.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const router = express.Router();

router.post("/register", signupUser);
router.post("/login", loginUser);
router.get("/test", authMiddleware, async (req, res) => {
  res.send(req.user);
});

module.exports = router;
