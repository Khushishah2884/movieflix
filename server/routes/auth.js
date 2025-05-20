const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const Saved = require("../models/Saved");

const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  try {
    console.log("Received signup request:", req.body);
    const { name, email, number, password } = req.body;
    const existing = await User.findOne({ email });
    console.log(existing);
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, number, password: hashedPassword });
    await user.save();
    console.log("User saved:", user);
    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Check for JWT_SECRET
    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ message: "JWT secret not set in environment" });
    }

    // Create JWT token
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      user: { name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get user profile (for frontend profile page)
router.get("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const email = decoded.email;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      name: user.name,
      email: user.email,
      number: user.number,
      savedMovies: user.savedMovies || [],
      plan: user.plan || { type: "", expiry: "" },
      devices: user.devices || [],
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Save movie for logged-in user (also save in Saved table)
router.post("/save-movie", async (req, res) => {
  console.log("Received save-movie request:", req.body);
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Unauthorized access attempt");
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const email = decoded.email;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("User found:", user);
    console.log("Request body:", req.body);
    const { imdbID, movieTitle, moviePoster } = req.body;
    if (!imdbID) return res.status(400).json({ message: "imdbID required" });

    // Save to user's savedMovies array if not already present
    if (!user.savedMovies) user.savedMovies = [];
    if (!user.savedMovies.includes(imdbID)) {
      user.savedMovies.push(imdbID);
      await user.save();
    }

    // Save to Saved table if not already present for this user and movie
    const alreadySaved = await Saved.findOne({ userEmail: email, imdbID });
    if (!alreadySaved) {
      await Saved.create({
        userEmail: email,
        imdbID,
        movieTitle: movieTitle || "",
        moviePoster: moviePoster || "",
      });
    }
    console.log("Saved movies:", user.savedMovies);
    console.log("Saved movie in Saved table:", alreadySaved);
    res.json({ success: true, savedMovies: user.savedMovies });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get saved movies for logged-in user (from Saved table)
router.get("/saved-movies", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json([]);
    }
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json([]);
    }
    const email = decoded.email;
    const saved = await Saved.find({ userEmail: email });
    res.json(saved);
  } catch (err) {
    res.status(500).json([]);
  }
});

// Store/update plan details for logged-in user
router.post("/plan", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const email = decoded.email;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { plan, price, period } = req.body;
    user.plan = { type: plan, price, period };
    await user.save();

    res.json({ success: true, plan: user.plan });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
