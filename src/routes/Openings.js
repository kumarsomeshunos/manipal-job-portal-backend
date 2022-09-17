import express from "express";

import Opening from "../models/Opening.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const openings = await Opening.find({});
  if (!openings) {
    return res
      .status(401)
      .json({ success: false, message: "No openings found!" });
  }
  res.send({ success: true, openings: openings });
});

router.get("/:id", async (req, res) => {
  const opening = await Opening.findById(req.params.id);
  if (!opening) {
    return res
      .status(401)
      .json({ success: false, message: "Something went wrong!" });
  }
  res.send({ success: true, opening: opening });
});

export default router;