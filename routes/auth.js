const express = require("express");
const User = require("../models/User");
const { generateToken } = require("./jwtoken");
const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password and hash it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      birthday: req.body.birthday,
      phone: req.body.phone,
      email: req.body.email,
      profileImage: req.body.profileImage,
      // Hash/encrypt the password using CryptoJS and cypher algorithm
      password: hashedPassword,
    });

    // Check is there is user already with the same email
    const userEmail = await User.findOne({ email: req.body.email });

    if (userEmail) {
      res.status(500).json("User already exists");
    } else {
      const user = await newUser.save();
      res.status(201).json(user);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).json("User doesnot exist");
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("Passwords didnt match");

    // Token payload
    const tokenPayload = {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const { password, ...otherUserDetails } = user._doc;

    return res.status(200).json({
      message: "Login Suceessful",
      ...otherUserDetails,
      token: generateToken(tokenPayload),
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
