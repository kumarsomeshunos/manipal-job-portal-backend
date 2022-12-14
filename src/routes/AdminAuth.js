import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import Admin from "../models/Admin.js";

const router = express.Router();

// dotenv
dotenv.config();

router.get("/login", (req, res) => {
  res.send("Login Get");
});


// Complete register function
router.post("/register", async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await Admin.create({
      name,
      username,
      password: hashedPassword,
    });

    console.log(result);
    res.status(201).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

// Complete login function
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Admin.findOne({ username });

    if (user) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (isPasswordCorrect) {
        const token = jwt.sign(
          { username: user.username, id: user._id },
          process.env.TOKEN_SECRET,
          { expiresIn: "1h" }
        );
        // TEMP
          res.redirect("https://job-portal-olive.vercel.app/admin/dashboard")
        res.status(200).json({ token });
      } else {
        res.status(404).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

export default router;
