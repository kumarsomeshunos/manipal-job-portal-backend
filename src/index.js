import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'

import openingsRouter from "./routes/Openings.js";
import adminAuthRouter from "./routes/AdminAuth.js";
import applicationRouter from "./routes/Application.js";
import imageRouter from "./routes/Images.js"
import cors from 'cors';
// import dashboardRouter from "./routes/Dashboard.js";


dotenv.config({path:'./.env'})
const app = express();

app.use(cors({
    origin: true,
}));

mongoose.set('strictQuery', true);

mongoose
  .connect(process.env.DB_URI)
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

app.use("/image", imageRouter);

app.use("/applications", applicationRouter);

app.use("/openings", openingsRouter);

app.use("/", adminAuthRouter);

app.get("/contact", (req, res) => {
  res.send("Contact");
});
app.get("/about", (req, res) => {
  res.send("About");
});

app.listen(3001, () => {
  {
    console.log("Listening on port 3001");
  }
});
