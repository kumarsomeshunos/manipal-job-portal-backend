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

// TODO: Restrict access by permission
router.post("/", async (req, res) => {
  const opening = new Opening(req.body);

  await opening
    .save()
    .then((opening) => {
      return res.json({ success: true, openingId: opening._id });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ success: false, error: error });
    });
});


export default router;