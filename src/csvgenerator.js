import { createObjectCsvWriter as createCsvWriter } from "csv-writer";
const csvWriter = createCsvWriter({
  path: "./file.csv",
  header: [
    { id: "name", title: "NAME" },
    { id: "dob", title: "DOB" },
    { id: "gender", title: "GENDER" },
    { id: "religion", title: "RELIGION" },
    { id: "marital_status", title: "MARITAL STATUS" },
    { id: "mobile", title: "MOBILE" },
    { id: "email", title: "EMAIL" },
  ],
});

const records = [
  {
    name: "Somesh",
    dob: "French, English",
    gender: "Male",
    religion: "Hindu",
    marital_status: "Married",
    mobile: "9142428071",
    email: "kumarsomesh.unos@gmail.com",
  },
  {
    name: "Somesh",
    dob: "English",
    gender: "Male",
    religion: "Hindu",
    marital_status: "Married",
    mobile: "9142428071",
    email: "kumarsomesh.unos@gmail.com",
  },
];

csvWriter
  .writeRecords(records) // returns a promise
  .then(() => {
    console.log(records);
    console.log("...Done");
  });

// This will produce a file path/to/file.csv with following contents:
//
//   NAME,LANGUAGE
//   Bob,"French, English"
//   Mary,English
