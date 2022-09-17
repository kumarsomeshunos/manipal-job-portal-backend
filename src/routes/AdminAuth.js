import express from "express";
import bcrypt from "bcrypt";

import Admin from "../models/Admin.js";

const router = express.Router();

router.get("/login", (req, res) => {
  res.send("Login Get");
});

router.post("/login", async (req, res) => {
  const admin = await Admin.findOne({ username: req.body.username });
  if (!admin) {
    return res
      .status(401)
      .json({ success: false, message: "Username not found!" });
  }
  const validPass = await bcrypt.compare(req.body.password, admin.password);
  if (!validPass) {
    return res
      .status(401)
      .json({ success: false, message: "Password is incorrect" });
  } else {
    res.send({ success: true, admin: { username: admin.username } });
  }
});

router.post("/register", async (req, res) => {
  req.body.password = await bcrypt.hash(req.body.password, saltRounds);
  const admin = new Admin(req.body);
  await admin
    .save()
    .then((admin) => {
      return res.json({ success: true, adminId: admin._id });
    })
    .catch((error) => {
      return res.status(500).json({ success: false, error: error });
    });
});

export default router;
