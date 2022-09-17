import express from "express";

import Apply from "../models/Apply.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Apply Get");
});

router.post("/", async (req, res) => {
  const apply = new Apply(req.body);
  await apply
    .save()
    .then((apply) => {
      return res.json({ success: true, applyId: apply._id });
    })
    .catch((error) => {
      return res.status(500).json({ success: false, error: error });
    });
});

export default router;
