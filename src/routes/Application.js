import express from "express";

import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import Application from "../models/Application.js";
import { SendEmail } from '../utils.js'

dotenv.config()
const router = express.Router();

// FILE UPLOAD CONFIG START
const app = express();
app.use(bodyParser.json());

const spacesEndpoint = new AWS.Endpoint(process.env.S3_ENDPOINT || "s3.us-west-000.backblazeb2.com");
const s3 = new AWS.S3({
    endpoint: spacesEndpoint
});

var upload = await multer({
    limits: {
        // limit 3 mb
        fileSize: 3 * 1024 * 1024
    },
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: process.env.S3_BUCKET || "portaldev",
        key: function (req, file, cb) {
            console.log(file);
            cb(null, Date.now() + '-' + file.originalname);
        }
    })
}).fields([{ name: 'picture', maxCount: 1 }, { name: 'resume', maxCount: 1 }]);



// FILE UPLOAD CONFIG END

router.post("/upload", async (req, res) => {

    Application.findOne({ id: req.body.id }, async (err, application) => {
        if (err) {
            console.log(err);
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(500).json({ msg: 'File size is too large. Allowed file size is 3MB Each File' });
            }
            else {
                res.status(500).json({ msg: 'Error while uploading file' });
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
                        application.save();
                        res.status(200).send("File uploaded successfully");
                    }
                });
            } else {
                res.status(404).send("Application not found");
            }
        }
    });

});


router.get("/", async (req, res) => {

    // Fetch applications with pagination and filtering
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    let filter = {};
    (req.query.jobType) ? filter.jobType = req.query.jobType : null;
    (req.query.faculty) ? filter.faculty = req.query.faculty : null;
    (req.query.school) ? filter.school = req.query.school : null;
    (req.query.department) ? filter.department = req.query.department : null;

    if (req.query.startDate && req.query.endDate) {
        filter.createdAt = {
            $gte: new Date(parseInt(req.query.startDate)),
            $lte: new Date(parseInt(req.query.endDate))
        }
    }

    // if (req.query.searchName) {
    //     // // search fullname in firstname and lastname
    //     // filter.$or = [
    //     //     { applicant: { firstName: { $regex: req.query.searchName, $options: 'i' } } },
    //     //     { applicant: { lastName: { $regex: req.query.searchName, $options: 'i' } } }
    //     // ]
    //     filter.firstName = {applicant: { $regex: '.*' + req.query.searchName + '.*' } }}
    // }




    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    results.stats = {};
    results.stats.totalSubmitted = await Application.countDocuments({ "status": { $ne: "draft" } });
    results.stats.totalAcademic = await Application.countDocuments({ "jobType": "academic", "status": { $ne: "draft" } });
    results.stats.totalNonAcademic = await Application.countDocuments({ "jobType": "non_academic", "status": { $ne: "draft" } });
    results.stats.totalAdmin = await Application.countDocuments({ "jobType": "administration", "status": { $ne: "draft" } });

    var filter_final = null;
    if (req.query.searchName){
        filter_final = {...filter, applicant: {firstName: {$regex: req.query.searchName, $options: 'i'}}}
    }
    else{
        filter_final = filter
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

    const apply = new Application(req.body);
    await apply
        .save()
        .then((apply) => {
            SendEmail(apply.applicant.email, "Form submitted", "Thank you for submitting the form. We will get back to you soon.");
            return res.json({ success: true, applyId: apply._id });
        })
        .catch((error) => {
            console.log(error);
            return res.status(500).json({ success: false, error: error });
        });
});

export default router;
