import mongoose from "mongoose";

const openingSchema = new mongoose.Schema({
  jobType: {
    type: String,
    enum: ["academic", "non_academic", "administration"],
    required: [false, "Position Type is required"],
  },

  faculty: {
    type: String,
    required: [false, "Faculty is required"],
  },

  school_main: {
    type: String,
    required: [false, "School is required"],
  },

  department: {
    type: String,
    required: [false, "Department is required"],
  },

  acad_domain: {
    type: String,
    required: [false, "Academic Domain is required"],
  },

  nature_of_job: {
    type: String,
    required: [false, "Nature of Job is required"],
  },

  title: {
    type: String,
    required: [true, "Title is required"],
  },

  description: {
    type: String,
    required: [true, "Body of the Opening is required"],
  },

  date_start: {
    type: Date,
    required: [true, "Starting date is required"],
  },

  date_end: {
    type: Date,
    required: false,
  },

  status: {
    type: String,
    required: [true, "Status is required"],
    enum: ["draft", "Open", "Closed"],
  },
});

const Opening = mongoose.model("Opening", openingSchema);

export default Opening;
