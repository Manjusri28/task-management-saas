const express = require("express");

const {
  registerUser,
  loginUser,
  updateProfile,
  changePassword,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// =========================
// PUBLIC ROUTES
// =========================

router.post("/register", registerUser);

router.post("/login", loginUser);

// =========================
// PROTECTED ROUTES
// =========================

router.get("/me", protect, (req, res) => {
  res.status(200).json({
    message: "You are authenticated",
    user: req.user,
  });
});

router.put(
  "/profile",
  protect,
  updateProfile
);

router.put(
  "/change-password",
  protect,
  changePassword
);

module.exports = router;