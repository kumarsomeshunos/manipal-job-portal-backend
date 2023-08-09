import express from "express";

import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import Application from "../models/Application.js";
import { SendEmail } from "../utils.js";
import facultiesList from "../faculties.js";
import auth from "../middleware/auth.js";

import { createObjectCsvWriter as createCsvWriter } from "csv-writer";
import { createObjectCsvStringifier as createCsvStringifier } from "csv-writer";
import moment from "moment";
import csvStringifier from "./csvStringifier.js";
import * as fs from "fs";
import path from "path";

dotenv.config();
const router = express.Router();

// FILE UPLOAD CONFIG START
const app = express();
app.use(bodyParser.json());

const upload = await multer({
  limits: {
    // limit 3 mb
    fileSize: 3 * 1024 * 1024,
  },
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads');
    },
    filename: function (req, file, callback) {
      callback(null, req.params.id + '-' + Date.now() + '-' + file.originalname);
    }
  }),
}).fields([
  {name: "picture", maxCount: 1},
  {name: "resume", maxCount: 1},
]);

// FILE UPLOAD CONFIG END

router.put("/:id", async (req, res) => {
  console.log(req.body);

  Application.findOne({ _id: req.params.id }, async (err, application) => {
    if (err) {
      console.log(err);
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(500).json({
          msg: "File size is too large. Allowed file size is 3MB Each File",
        });
      } else {
        res.status(500).json({ msg: "Error while uploading file" });
      }
    } else {
      if (application) {
        upload(req, res, async function (err) {
          if (err) {
            console.log(err);
            res.status(500).send(err);
          } else {
            console.log(req.files);
            console.log(req.files.picture);
            console.log(req.files.resume);
            application.photo = req.files.picture[0].filename;
            application.resume = req.files.resume[0].filename;
            application.status = "submitted";
            application.save();
            res.status(200).send("File uploaded successfully");
          }
        });
      } else {
        res.status(404).send("Application " + req.params.id + " not found");
      }
    }
  });
});

// serve facultiesList json to frontend
router.get("/faculties", async (req, res) => {
  res.status(200).json(facultiesList);
});

router.get("/stats", async (req, res) => {
  let month = new Date().getMonth();
  const results = {};

  results.stats = {};
  results.stats.total = await Application.countDocuments();
  results.stats.totalSubmitted = await Application.countDocuments({
  });
  results.stats.totalAcademic = await Application.countDocuments({
    jobType: "academic",
  });
  results.stats.totalNonAcademic = await Application.countDocuments({
    jobType: "non_academic",
  });
  results.stats.totalAdmin = await Application.countDocuments({
    jobType: "administration",
  });

  // results.stats.thisDay

  results.stats.thisMonth = await Application.countDocuments({
    createdAt: { $gte: new Date(new Date().setDate(1)) },
  });
  results.stats.thisYear = await Application.countDocuments({
    createdAt: { $gte: new Date(new Date().setMonth(1)) },
  });

  // 1 to 12 array of month with number of applications using aggregate

  results.stats.monthly = await Application.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        count: { $sum: 1 },
      },
    },
  ]);

  // let months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // results.stats.monthly = await Application.aggregate([
  // {
  //     $group: {
  //     _id: {
  //         year: { $year: "$createdAt" },
  //         month: { $month: "$createdAt" }
  //     },
  //     numShops: { $sum: 1 }
  //     }
  // },
  // {
  //     $project: {
  //     _id: 0,
  //     numShops: 1,
  //     date: {
  //         $concat: [
  //         { $arrayElemAt: [months, "$_id.month"] },
  //         "-",
  //         { $toString: "$_id.year" }
  //         ]
  //     }
  //     }
  // }
  // ])

  res.json(results);
});

router.get("/graph", async (req, res) => {

  const currentDate = moment().toDate();
  const academic = {};
  const nonAcademic = {}
  const counter = (date, jobType) => {
    return Application.countDocuments({
      createdAt: {
        $gte: moment(date).startOf('day').toDate(),
        $lte: moment(date).endOf('day').toDate()
      },
      jobType: jobType,
    })
  }

  for (let i = 6; i >= 0; i--) {
    academic[(moment(currentDate).subtract(i, 'days')).toISOString()] = await counter(moment().subtract(i, 'days').toDate(), "academic");
    nonAcademic[(moment(currentDate).subtract(i, 'days')).toISOString()] = await counter(moment().subtract(i, 'days').toDate(), "non_academic");
  }

  res.status(200).json({
    academic: academic,
    non_academic: nonAcademic
  });

})

router.get("/", async (req, res) => {
  // Fetch applications with pagination and filtering
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;

  let filter = {};
  req.query.jobType ? (filter.jobType = req.query.jobType) : null;
  req.query.faculty ? (filter.faculty = req.query.faculty) : null;
  req.query.school ? (filter.school = req.query.school) : null;
  req.query.department ? (filter.department = req.query.department) : null;
  req.query.status ? (filter.status = req.query.status) : null;

  if (req.query.startDate && req.query.endDate) {
    filter.createdAt = {
      $gte: new Date(parseInt(req.query.startDate)),
      $lte: new Date(parseInt(req.query.endDate)),
    };
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  var filter_final = null;
  if (req.query.searchName) {
    filter_final = {
      ...filter,
      applicant: { firstName: { $regex: req.query.searchName, $options: "i" } },
    };
  } else {
    filter_final = filter;
  }

  console.log(filter_final);
  Application.find(filter_final)
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
    .exec((err, application) => {
      if (err) {
        res.status(500).json(err)
      } else if (!application) {
        res.status(404).json({ message: "Application not found" })
      } else {
        res.json(application);
        application.viewCount += 1;
        application.save();
      }
    })
});

router.post("/", async (req, res) => {
  const apply = new Application(req.body);
  await apply
    .save()
    .then((apply) => {
      SendEmail(
        apply.applicant.email,
        "Form submitted",
        "Thank you for submitting the form. We will get back to you soon."
      );
      return res.json({ success: true, applyId: apply._id });
      // res.redirect(`http://172.17.101.106:3000/${apply._id}`);
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ success: false, error: error });
    });
});

router.post("/:id/udpate", (req, res) => {
  Application.findByIdAndUpdate(req.params.id, req.body)
    .then((application) => {
      res.json({ message: "Application Updated", application });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.delete("/:id", (req, res) => {
  Application.findByIdAndDelete(req.params.id)
    .then((application) => {
      res.json({ message: "Application deleted" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.post("/downloadcsv", async (req, res) => {
  if (!req.body.ids) {
    return res.status(500).json({ message: "No ids provided" });
  }

  // req.body.ids.forEach((element) => {
  //   console.log(element);
  // });
  const records = [];

  const fixData = (data, currentPath, obj) => {
    Object.keys(data).forEach((key) => {
      if (data[key] && typeof data[key] === "object") {
        fixData(data[key], [...currentPath, key], obj);
      } else {
        let valuePath = currentPath.join(".")
        if (valuePath === "") valuePath = key
        else valuePath = `${valuePath}.${key}`
        obj[valuePath] = data[key];
      }
    })
    return obj;
  }

  for (const id of req.body.ids) {
    await Application.findById(id.toString())
      .then((application) => {
        console.log("Application")
        console.log(application);
        console.log(application.toJSON);
        const data = fixData(application.toJSON(), [], {});
        console.log(data);
        records.push(data);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  }

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=data.csv");
  res.write(csvStringifier().getHeaderString());
  res.write(csvStringifier().stringifyRecords(records));
  res.end();
});

router.get("/reject/:id", (req, res) => {
  Application.findById(req.params.id)
    .then((application) => {
      // increment seen count
      application.status = "rejected";
      application.save();
      res.json(200);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.get("/accept/:id", (req, res) => {
  Application.findById(req.params.id)
    .then((application) => {
      // increment seen count
      application.status = "accepted";
      application.save();
      res.json(200);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.get("/view/:id", (req, res) => {
    Application.findById(req.params.id)
        .then((application) => {
          res.json(application);
          // increment seen count
          application.viewCount += 1;
          application.save();
      }).catch((error) => {
        res.status(500).json({ message: error.message });
      });
})

router.get("/uploads/:filename", (req, res) => {
    const filename = req.params.filename;
    const file = "./uploads/" + filename;
    console.log(file);
    res.download(file);
})

// router.delete("/delete/:id", (req, res) => {
//   Application.findByIdAndDelete(req.params.id)
//     .then((application) => {
//       // increment seen count
//       res.json(200);
//     })
//     .catch((error) => {
//       res.status(500).json({ message: error.message });
//     });
// });
export default router;
