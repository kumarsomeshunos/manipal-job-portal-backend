import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'

import openingsRouter from "./routes/Openings.js";
import adminAuthRouter from "./routes/AdminAuth.js";
import applicationRouter from "./routes/Application.js";
import cors from 'cors';
// import dashboardRouter from "./routes/Dashboard.js";


dotenv.config()
const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));


mongoose
  .connect(process.env.DB_URI || "mongodb+srv://event:event@jobportalcluster.amjyw4q.mongodb.net/jobportal?retryWrites=true&w=majority")
  .then(() => {
    console.log("Mongo Connection Successful");
  })
  .catch((error) => {
    console.log(error);
    console.log("Mongo Connection Failed");
  });

const saltRounds = 10;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Homepage");
});

app.use("/applications", applicationRouter);

app.use("/openings", openingsRouter);

app.get("/contact", (req, res) => {
  res.send("Contact");
});
app.get("/about", (req, res) => {
  res.send("About");
});

app.use("/", adminAuthRouter);

app.listen(3000, () => {
  {
    console.log("Listening on port 3000");
  }
});
