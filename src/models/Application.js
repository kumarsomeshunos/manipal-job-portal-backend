import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
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
    mobile: { 
        type: String,
        required: [true, "Mobile Number is required"]
    },
    email: { 
        type: String, 
        lowercase: true,
        required: [true, "Email is required"]
    },

    // Current Residence information
    


})

const Applicaton = mongoose.model("Application", applicationSchema);

export default Applicaton;