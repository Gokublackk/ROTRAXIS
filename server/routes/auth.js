const router = require("express").Router();
const User = require("../Models/User");
const bcrypt = require("bcryptjs");

// Register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = new User({ email, password: hashed });
  await user.save();

  res.json({ message: "User Registered" });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json("User not found");

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) return res.status(400).json("Wrong password");

  res.json({ message: "Login successful" });
});

module.exports = router;