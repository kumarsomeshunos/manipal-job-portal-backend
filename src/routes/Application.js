import express from "express";

import Application from "../models/Application.js";

const router = express.Router();

router.get("/t", (req, res) => {
	res.send(process.env.S3_BUCKET);
})

router.get("/", (req, res) => {
  // Fetch applications with pagination
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  Application.find()
    .limit(limit)
    .skip(startIndex)
    .exec()
    .then((applications) => {
      results.results = applications;
      results.count = applications.length;
      if (endIndex < results.count) {
        results.next = {
          page: page + 1,
          limit: limit,
        };
      }
      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit,
        };
      }
      res.json(results);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

// router for getting specific application
router.get("/:id", (req, res) => {
  Application.findById(req.params.id)
    .then((application) => {
      res.json(application);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.post("/", async (req, res) => {
  const apply = new Application(req.body);
  await apply
    .save()
    .then((apply) => {
        res.send(apply);
    //   return res.json({ success: true, applyId: apply._id });
    })
    .catch((error) => {
      return res.status(500).json({ success: false, error: error });
    });
});

export default router;
