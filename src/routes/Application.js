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

dotenv.config();
const router = express.Router();

// FILE UPLOAD CONFIG START
const app = express();
app.use(bodyParser.json());

const spacesEndpoint = new AWS.Endpoint(
  process.env.S3_ENDPOINT || "s3.us-west-000.backblazeb2.com"
);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
});

var upload = await multer({
  limits: {
    // limit 3 mb
    fileSize: 3 * 1024 * 1024,
  },
  storage: multerS3({
    s3: s3,
    acl: "public-read",
    bucket: process.env.S3_BUCKET || "portaldev",
    key: function (req, file, cb) {
      console.log(file);
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
}).fields([
  { name: "picture", maxCount: 1 },
  { name: "resume", maxCount: 1 },
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
            application.photo = req.files.picture[0].location;
            application.resume = req.files.resume[0].location;
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
    status: { $ne: "draft" },
  });
  results.stats.totalAcademic = await Application.countDocuments({
    jobType: "academic",
    status: { $ne: "draft" },
  });
  results.stats.totalNonAcademic = await Application.countDocuments({
    jobType: "non_academic",
    status: { $ne: "draft" },
  });
  results.stats.totalAdmin = await Application.countDocuments({
    jobType: "administration",
    status: { $ne: "draft" },
  });

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
    .then((application) => {
      res.json(application);
      // increment seen count
      application.viewCount += 1;
      application.save();
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.post("/", async (req, res) => {
  console.log(req.body);
  const apply = new Application(req.body);
  await apply
    .save()
    .then((apply) => {
      SendEmail(apply.applicant.email, "Form submitted", "Thank you for submitting the form. We will get back to you soon.");
      // return res.json({ success: true, applyId: apply._id });
      res.redirect(`http://localhost:3001/${apply._id}`);
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ success: false, error: error });
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
  req.body.ids.forEach((element) => {
    console.log(element);
  });
  const records = [];
  const csvWriter = createCsvWriter({
    path: "./file.csv",
    header: [
      { id: "firstName", title: "APPLICANT FIRST NAME" },
      { id: "lastName", title: "APPLICANT LAST NAME" },
      { id: "dob", title: "APPLICANT DOB" },
      { id: "gender", title: "APPLICANT GENDER" },
      { id: "religion", title: "APPLICANT RELIGION" },
      { id: "marital_status", title: "APPLICANT MARITAL STATUS" },
      { id: "mobile", title: "APPLICANT MOBILE" },
      { id: "email", title: "APPLICANT EMAIL" },

      { id: "status", title: "STATUS" },
      { id: "viewCount", title: "VIEW COUNT" },
      { id: "jobType", title: "JOB TYPE" },
      { id: "faculty", title: "FACULTY" },
      { id: "school_main", title: "SCHOOL" },
      { id: "department", title: "DEPARTMENT" },
      { id: "acad_domain", title: "ACADEMIC DOMAIN" },
      { id: "nature_of_job", title: "NATURE OF JOB" },
      { id: "cr_country", title: "CURRENT COUNTRY" },
      { id: "cr_state", title: "CURRENT STATE" },
      { id: "cr_city", title: "CURRENT CITY" },
      { id: "native_country", title: "NATIVE COUNTRY" },
      { id: "native_state", title: "NATIVE STATE" },
      { id: "aadhaar_card", title: "AADHAAR CARD" },
      { id: "pan_card", title: "PAN CARD" },
      { id: "photo", title: "PHOTO" },
      { id: "resume", title: "RESUME" },
      { id: "createdAt", title: "APPLIED DATE" },
      { id: "updatedAt", title: "UPDATED DATE" },
      { id: "id", title: "ID" },

      { id: "aqhs_country", title: "AQ HIGHER SECONDARY COUNTRY" },
      { id: "aqhs_mode", title: "AQ HIGHER SECONDARY MODE" },
      { id: "aqhs_school", title: "AQ HIGHER SECONDARY SCHOOL" },
      { id: "aqhs_board", title: "AQ HIGHER SECONDARY BOARD" },
      { id: "aqhs_passingYear", title: "AQ HIGHER SECONDARY PASSING YEAR" },
      { id: "aqhs_division", title: "AQ HIGHER SECONDARY DIVISION" },
      { id: "aqhs_percentage", title: "AQ HIGHER SECONDARY PERCENTAGE" },

      { id: "aqgr_country", title: "AQ GRADUATION COUNTRY" },
      { id: "aqgr_mode", title: "AQ GRADUATION MODE" },
      { id: "aqgr_institute", title: "AQ GRADUATION INSTITUTE" },
      { id: "aqgr_college", title: "AQ GRADUATION COLLEGE" },
      { id: "aqgr_year", title: "AQ GRADUATION YEAR" },
      { id: "aqgr_area", title: "AQ GRADUATION AREA" },
      { id: "aqgr_course", title: "AQ GRADUATION COURSE" },
      { id: "aqgr_division", title: "AQ GRADUATION DIVISION" },
      { id: "aqgr_percentage", title: "AQ GRADUATION PERCENTAGE" },

      { id: "aqpg_country", title: "AQ POST GRADUATION COUNTRY" },
      { id: "aqpg_mode", title: "AQ POST GRADUATION MODE" },
      { id: "aqpg_institute", title: "AQ POST GRADUATION INSTITUTE" },
      { id: "aqpg_college", title: "AQ POST GRADUATION COLLEGE" },
      { id: "aqpg_year", title: "AQ POST GRADUATION YEAR" },
      { id: "aqpg_area", title: "AQ POST GRADUATION AREA" },
      { id: "aqpg_course", title: "AQ POST GRADUATION COURSE" },
      { id: "aqpg_division", title: "AQ POST GRADUATION DIVISION" },
      { id: "aqpg_percentage", title: "AQ POST GRADUATION PERCENTAGE" },

      { id: "aqphd_country", title: "AQ PHD COUNTRY" },
      { id: "aqphd_mode", title: "AQ PHD MODE" },
      { id: "aqphd_institute", title: "AQ PHD INSTITUTE" },
      { id: "aqphd_college", title: "AQ PHD COLLEGE" },
      { id: "aqphd_year", title: "AQ PHD YEAR" },
      { id: "aqphd_area", title: "AQ PHD AREA" },
      { id: "aqphd_teachingExperience", title: "AQ PHD TEACHING EXPERIENCE" },
      { id: "aqphd_year2", title: "AQ PHD YEAR 2" },
    ],
  });

  for (const id of req.body.ids) {
    await Application.findById(id.toString())
      .then((application) => {
        console.log(application);

        var data = {
          firstName: application.applicant.firstName,
          lastName: application.applicant.lastName,
          dob: application.applicant.dob,
          gender: application.applicant.gender,
          religion: application.applicant.religion,
          marital_status: application.applicant.marital_status,
          mobile: application.applicant.mobile,
          email: application.applicant.email,

          status: application.status,
          viewCount: application.viewCount,
          jobType: application.jobType,
          faculty: application.faculty,
          school_main: application.school_main,
          department: application.department,
          acad_domain: application.acad_domain,
          nature_of_job: application.nature_of_job,
          cr_country: application.cr_country,
          cr_state: application.cr_state,
          cr_city: application.cr_city,
          native_country: application.native_country,
          native_state: application.native_state,
          aadhaar_card: application.aadhaar_card,
          pan_card: application.pan_card,
          photo: application.photo,
          resume: application.resume,
          createdAt: application.createdAt,
          updatedAt: application.updatedAt,
          id: application.id,

          aqhs_country: application.aq_higher_secondary.country,
          aqhs_mode: application.aq_higher_secondary.mode,
          aqhs_school: application.aq_higher_secondary.school,
          aqhs_board: application.aq_higher_secondary.board,
          aqhs_passingYear: application.aq_higher_secondary.passingYear,
          aqhs_division: application.aq_higher_secondary.division,
          aqhs_percentage: application.aq_higher_secondary.percentage,

          // aqgr_country: application.aq_graduation[0].country,
          // aqgr_mode: application.aq_graduation[0].mode,
          // aqgr_institute: application.aq_graduation[0].institute,
          // aqgr_college: application.aq_graduation[0].college,
          // aqgr_year: application.aq_graduation[0].year,
          // aqgr_area: application.aq_graduation[0].area,
          // aqgr_course: application.aq_graduation[0].course,
          // aqgr_division: application.aq_graduation[0].division,
          // aqgr_percentage: application.aq_graduation[0].percentage,

          // aqpg_country: application.aq_post_graduation[0].country,
          // aqpg_mode: application.aq_post_graduation[0].mode,
          // aqpg_institute: application.aq_post_graduation[0].institute,
          // aqpg_college: application.aq_post_graduation[0].college,
          // aqpg_year: application.aq_post_graduation[0].year,
          // aqpg_area: application.aq_post_graduation[0].area,
          // aqpg_course: application.aq_post_graduation[0].course,
          // aqpg_division: application.aq_post_graduation[0].division,
          // aqpg_percentage: application.aq_post_graduation[0].percentage,

          // aqphd_country: application.aq_phd[0].country,
          // aqphd_mode: application.aq_phd[0].mode,
          // aqphd_institute: application.aq_phd[0].institute,
          // aqphd_college: application.aq_phd[0].college,
          // aqphd_year: application.aq_phd[0].year,
          // aqphd_area: application.aq_phd[0].area,
          // aqphd_teachingExperience: application.aq_phd[0].teachingExperience,
          // aqphd_year2: application.aq_phd[0].year2,
        };
        console.log(data);
        records.push(data);
        // console.log("akhfiafnais892374892374892374982374", application.aq_graduation);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  }
  await csvWriter
    .writeRecords(records) // returns a promise
    .then(() => {
      console.log(records);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
  res.download("./file.csv", "applicants_data.csv", (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Download link sent");
    }
  });
});

export default router;
