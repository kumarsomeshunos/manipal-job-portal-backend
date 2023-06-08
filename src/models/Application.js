import mongoose, { mongo } from "mongoose";
import moment from "moment";
import Inc from "mongoose-sequence";

const AutoIncrement = Inc(mongoose);

const ApplicantDetailsSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Firstname is required"],
  },
  middleName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: [true, "Lastname is required"],
  },
  dob: {
    type: Date,
    required: [true, "Date of Birth is required"],
  },
  gender: {
    type: String,
    enum: ["male", "female", "transgender"],
    required: [false, "Gender is required"],
  },
  religion: {
    type: String,
    required: [true, "Religion is required"],
  },
  marital_status: {
    type: String,
    required: [true, "Marital Status is required"],
  },
  mobile: {
    type: String,
    required: [true, "Mobile Number is required"],
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, "Email is required"],
  },
});

const secondarySchema = new mongoose.Schema({
  country: String,
  state: String,
  city: String,
  mode: String,
  school: String,
  board: String,
  passingYear: Number,
  division: String,
  percentage: Number,
});

const higherSecondarySchema = new mongoose.Schema({
  country: String,
  state: String,
  city: String,
  mode: String,
  school: String,
  board: String,
  stream: String,
  passingYear: Number,
  division: String,
  percentage: Number,
});

const graduationSchema = new mongoose.Schema({
  country: String,
  state: String,
  city: String,
  mode: String,
  institute: String,
  college: String,
  year: Number,
  area: String,
  course: String,
  division: String,
  percentage: Number,
});

const postGraduationSchema = new mongoose.Schema({
  country: String,
  state: String,
  city: String,
  mode: String,
  institute: String,
  college: String,
  year: Number,
  area: String,
  course: String,
  division: String,
  percentage: Number,
});

const mPhilSchema = new mongoose.Schema({
  country: String,
  state: String,
  city: String,
  mode: String,
  institute: String,
  college: String,
  year: Number,
  area: String,
  course: String,
  division: String,
  percentage: Number,
});

const phdSchema = new mongoose.Schema({
  status: String,
  country: String,
  state: String,
  city: String,
  mode: String,
  institute: String,
  college: String,
  year: Number,
  area: String,
  teachingExperience: Boolean,
  year2: Number,
});

const postDoctoralSchema = new mongoose.Schema({
  country: String,
  state: String,
  city: String,
  mode: String,
  institute: String,
  college: String,
  year: Number,
  area: String,
  course: String,
  division: String,
  percentage: Number,
});

const academicQualificationSchema = new mongoose.Schema({
  // IF not empty, then assume qualified with given year
  gate: Number,
  ugcNet: Number,
  ugcJrf: Number,
  urcCsir: Number,
  icmr: Number,
  icar: Number,
  gate_score: Number,
  ugcNet_score: Number,
  ugcJrf_score: Number,
  urcCsir_score: Number,
  icmr_score: Number,
  icar_score: Number,
});

const academicExperienceSchema = new mongoose.Schema({
  natureOfJob: String,
  country: String,
  state: String,
  city: String,
  university: String,
  college: String,
  position: String,
  academicDomain: String,
  dateFrom: Date,
  dateTo: Date,
});

const nonAcademicExperienceSchema = new mongoose.Schema({
  natureOfJob: String,
  country: String,
  state: String,
  city: String,
  organization: String,
  designation: String,
  department: String,
  dateFrom: Date,
  dateTo: Date,
});

const fellowshipsAchieved = new mongoose.Schema({
  fellowshipDetail: String,
  year: Number,
  amount: Number,
  fellowshipStatus: String,
});

const booksAuthored = new mongoose.Schema({
  detail: String,
  ISBNNumber: Number,
  writtenAs: String,
});

const patentDetails = new mongoose.Schema({
  patentDetail: String,
  year: Number,
  status: String,
});

const peerRecog = new mongoose.Schema({
  awards: String,
  agency: String,
  year: Number,
});

const knowInManipal = new mongoose.Schema({
  name: String,
  designation: String,
  department: String,
  relation: String,
  givenOffer: Boolean,
  joined: Boolean,
  offerJoined: Boolean,
  reason: String,
});

const interviewed = new mongoose.Schema({
  date: Date,
  designation: String,
  department: String,
  result: String,
});


const applicationSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        "draft",
        "submitted",
        "under_consideration",
        "accepted",
        "rejected",
      ],
      default: "draft",
    },

    viewCount: {
      type: Number,
      default: 0,
    },

    applicant: {
      type: ApplicantDetailsSchema,
      required: [false, "Applicant Details are required"],
    },

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

    // Current Residence information
    cr_country: {
      type: String,
      required: [false, "Country is required"],
    },
    cr_state: {
      type: String,
      required: [false, "State is required"],
    },
    cr_city: {
      type: String,
      required: [false, "City is required"],
    },
    cr_address: {
      type: String,
      required: [false, "Current Address is required"],
    },

    // Native place Information
    native_country: {
      type: String,
      required: [false, "Country is required"],
    },
    native_state: {
      type: String,
      required: [false, "State is required"],
    },
    native_city: {
      type: String,
      required: [false, "City is required"],
    },
    native_address: {
      type: String,
      required: [false, "Native Address is required"],
    },

    // ID Proof Information
    aadhaar_card: {
      type: String,
      required: [false, "Aadhaar Number is required"],
    },
    pan_card: {
      type: String,
      required: [false, "PAN Number is required"],
    },

    // Academic Qualifications
    aq_secondary: {
      type: secondarySchema,
      required: [false, "Secondary Details are required"],
    },
    aq_higher_secondary: {
      type: higherSecondarySchema,
      required: [false, "Higher Secondary Details are required"],
    },

    aq_graduation: [
      {
        type: [graduationSchema],
        required: [false, "Graduation Details are required"],
      },
    ],

    aq_post_graduation: [
      {
        // type: postGraduationSchema,
        // array of post graduation schema
        type: [postGraduationSchema],
        required: [false, "Post Graduation Details are required"],
      },
    ],

    aq_mphil: [
      {
        type: [mPhilSchema],
      },
    ],

    aq_phd: [
      {
        type: [phdSchema],
      },
    ],

    aq_post_doctoral: [
      {
        type: [postDoctoralSchema],
      },
    ],

    // Qualification Details
    // qualifications: qualificationSchema,
    academicQualification: academicQualificationSchema,

    // Experience Details
    academicExperience: [
      {
        type: [academicExperienceSchema],
        required: false,
      },
    ],

    nonAcademicExperience: [
      {
        type: [nonAcademicExperienceSchema],
        required: false,
      },
    ],

    // Fellowships Achieved
    fellowships: [
      {
        type: fellowshipsAchieved,
      },
    ],

    // Research Work
    orcid: String,
    hIndexSCOPUS: String,
    hIndexScience: String,
    CIF: String,

    orcid: {
      type: String,
    },

    hIndexSCOPUS: {
      type: String,
    },

    hIndexScience: {
      type: String,
    },

    CIF: {
      type: String,
    },

    researchPaperPublishedTotal: {
      type: Number,
    },
    researchPaperPublishedTotalUGCCareList: {
      type: Number,
    },
    researchPaperPublishedTotalSCI: {
      type: Number,
    },
    researchPaperPublishedTotalWebScience: {
      type: Number,
    },
    researchPaperPublishedTotalScopus: {
      type: Number,
    },
    researchPaperPublishedThree: {
      type: Number,
    },
    researchPaperPublishedThreeUGCCareList: {
      type: Number,
    },
    researchPaperPublishedThreeSCI: {
      type: Number,
    },
    researchPaperPublishedThreeWebScience: {
      type: Number,
    },
    researchPaperPublishedThreeScopus: {
      type: Number,
    },
    nOfCitationsThree: {
      type: Number,
    },
    nOfFundedProjectsCompletedThree: {
      type: Number,
    },
    amountOfFundedProjectsCompletedThree: {
      type: Number,
    },
    nOfFundedProjectsOngoingThree: {
      type: Number,
    },
    amountOfFundedProjectsOngoingThree: {
      type: Number,
    },
    nOfCSWTPresentedTotal: {
      type: Number,
    },
    nOfCSWTPresentedNational: {
      type: Number,
    },
    nOfCSWTPresentedInternational: {
      type: Number,
    },
    nOfCSWTAttendedTotal: {
      type: Number,
    },
    nOfCSWTAttendedNational: {
      type: Number,
    },
    nOfCSWTAttendedInternational: {
      type: Number,
    },
    nOfCSWTOrganisedTotal: {
      type: Number,
    },
    nOfCSWTOrganisedNational: {
      type: Number,
    },
    nOfCSWTOrganisedInternational: {
      type: Number,
    },
    researchGuidSuccCompMPhilIndep: {
      type: Number,
    },
    researchGuidSuccCompMPhDIndep: {
      type: Number,
    },
    researchGuidSuccCompMPhilCoSupervisor: {
      type: Number,
    },
    researchGuidSuccCompMPhDCoSupervisor: {
      type: Number,
    },
    researchGuidUnderSupervMPhilIndep: {
      type: Number,
    },
    researchGuidUnderSupervMPhDIndep: {
      type: Number,
    },
    researchGuidUnderSupervMPhilCoSupervisor: {
      type: Number,
    },
    researchGuidUnderSupervMPhDCoSupervisor: {
      type: Number,
    },

    // Books Authored
    books: [
      {
        type: booksAuthored,
      },
    ],

    // Patent Details
    patent: [
      {
        type: patentDetails,
      },
    ],

    // Consultancy
    nOfAssignmentsConsultancyCompleted: {
      type: Number,
    },
    amountForNOfAssignmentsConsultancyCompleted: {
      type: Number,
    },
    nOfAssignmentsConsultancyOngoing: {
      type: Number,
    },
    amountForNOfAssignmentsConsultancyOngoing: {
      type: Number,
    },

    // Peer Recognition
    peerRecognition: [
      {
        type: peerRecog,
      },
    ],

    // Other Information
    presentSalary: {
      type: Number,
    },
    noticePeriod: {
      type: Number,
    },
    knowAnyoneInManipal: {
      type: Boolean,
    },
    detailsOfKnown: {
      type: knowInManipal,
    },

    interviewed: {
      type: interviewed,
    },
    interviewedInManipal: {
      type: Boolean,
    },
    givenOfferToJoin: {
      type: Boolean,
    },
    joinInManipal: {
      type: Boolean,
    },
    joinedInManipalFrom: {
      type: Date,
    },
    joinedInManipalTo: {
      type: Date,
    },
    caseAgainstYou: {
      type: Boolean,
    },
    caseDetails: {
      type: String,
    },

    // FILES
    resume: {
      type: String,
    },
    photo: {
      type: String,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

applicationSchema.plugin(AutoIncrement, { inc_field: "id" });

// Virtual field for formatting date time using built in libraries
applicationSchema.virtual("createdDate").get(function () {
  return moment(this.createdAt).format("MMMM Do, YYYY");
});

// Virtual field for full name
applicationSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

/*
 *   Export all the models
 */
const Applicaton = mongoose.model("Application", applicationSchema);

export default Applicaton;
