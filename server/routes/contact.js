const express = require("express");
const router = express.Router();

// ✅ IMPORTANT: correct path + filename
const Contact = require("../models/contact");

// POST contact
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newContact = new Contact({
      name,
      email,
      message,
    });

    await newContact.save();

    res.status(201).json({ msg: "Contact saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
