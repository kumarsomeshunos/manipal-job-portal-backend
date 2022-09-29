import mongoose from "mongoose";

const ApplicantDetailsSchema = new mongoose.Schema({
    firstName: { 
        type: String,
        required: [true, "Firstname is required"]
    },
    lastName: {
        type: String,
        required: [true, "Lastname is required"] 
    },
    dob: { 
        type: Date,
        required: [true, "Date of Birth is required"] 
    },
    gender: { 
        type: String, 
        enum: ['Male', 'Female'],
        required: [true, "Gender is required"]
    },
    religion: { 
        type: String,
        required: [true, "Religion is required"]
    },
    marital_status: {
        type: String,
        required: [true, "Marital Status is required"]
    },
    mobile: { 
        type: String,
        required: [true, "Mobile Number is required"]
    },
    email: { 
        type: String, 
        lowercase: true,
        required: [true, "Email is required"]
    },
});


const higherSecondarySchema = new mongoose.Schema({
    country: String,
    mode: String,
    school: String,
    board: String,
    passingYear: Number,
    division: String,
    percentage: Number,
});

const graduationSchema = new mongoose.Schema({
    country: String,
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
    mode: String,
    institute: String,
    college: String,
    year: Number,
    area: String,
    teachingExperience: Boolean,
    year2: Number
});

const postDoctoralSchema = new mongoose.Schema({
    country: String,
    mode: String,
    institute: String,
    college: String,
    year: Number,
    area: String,
    course: String,
    division: String,
    percentage: Number,
});

const qualificationSchema = new mongoose.Schema({
    // IF not empty, then assume qualified with given year
    gate: Number,
    ugcNet: Number,
    ugcJrf: Number,
    urcCsir: Number,
    icmr: Number,
    icar: Number,
});

    

const applicationSchema = new mongoose.Schema({
    

    // Application Information
    faculty: {
        type: String,
        required: [true, "Faculty is required"]
    },

    school: {
        type: String,
        required: [true, "School is required"]
    },

    department: {
        type: String,
        required: [true, "Department is required"]
    },
    
    acad_domain: {
        type: String,
        required: [true, "Academic Domain is required"]
    },

    nature_of_job: {
        type: String,
        required: [true, "Nature of Job is required"]
    },

    // Current Residence information
    cr_country: {
        type: String,
        required: [true, "Country is required"]
    },
    cr_state: {
        type: String,
        required: [true, "State is required"]
    },
    cr_city: {
        type: String,
        required: [true, "City is required"]
    },
    
    // Native place Information
    native_country: {
        type: String,
        required: [true, "Country is required"]
    },
    native_state: {
        type: String,
        required: [true, "State is required"]
    },

    // ID Proof Information
    aadhaar_card: {
        type: String,
        required: [true, "Aadhaar Number is required"]
    },
    pan_card: {
        type: String,
        required: [true, "PAN Number is required"]
    },  

    // Academic Qualifications
    aq_higher_secondary: {
        type: higherSecondarySchema,
        required: [true, "Higher Secondary Details are required"]
    },

    aq_graduation: [{
        type: graduationSchema,
        required: [true, "Graduation Details are required"]
    }],

    aq_post_graduation: [{
        type: postGraduationSchema,
        required: [true, "Post Graduation Details are required"]
    }],

    aq_mphil: [{
        type: mPhilSchema,
    }],

    aq_phd: [{
        type: phdSchema,
    }],

    aq_post_doctoral: [{
        type: postDoctoralSchema,
    }],

    // Qualification Details
    qualifications: qualificationSchema
    


});



/*
*   Export all the models
*/
const Applicaton = mongoose.model("Application", applicationSchema);

export default Applicaton;