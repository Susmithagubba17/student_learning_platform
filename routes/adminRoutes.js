const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const roleAuth = require("../middleware/roleAuth");

// Admin Only Route
router.get("/admin", auth, roleAuth(["admin"]), (req, res) => {
    res.json({ message: "Welcome Admin 👑" });
});

// User + Admin Route
router.get("/profile", auth, roleAuth(["admin", "user"]), (req, res) => {
    res.json({ message: "Profile data" });
});

module.exports = router;