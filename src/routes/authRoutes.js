const express = require("express");
const admin = require("firebase-admin");
const router = express.Router();

// Signup endpoint (remains the same)
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  console.log("Signup request received:", { email });

  try {
    const user = await admin.auth().createUser({ email, password });
    const token = await admin.auth().createCustomToken(user.uid);
    console.log("Signup successful. User UID:", user.uid);
    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// Login endpoint for email/password
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("Email/password login request received:", { email });

  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Email and password are required." });
  }

  try {
    // Verify email/password with Firebase
    const user = await admin.auth().getUserByEmail(email);
    const token = await admin.auth().createCustomToken(user.uid);
    console.log("Email/password login successful. Token created for UID:", user.uid);
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Email/password login error:", error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// Google login endpoint (remains the same)
router.post("/google-login", async (req, res) => {
  const { idToken } = req.body;

  console.log("Google login request received.");

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const token = await admin.auth().createCustomToken(decodedToken.uid);
    console.log("Google login successful. Token created for UID:", decodedToken.uid);
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;