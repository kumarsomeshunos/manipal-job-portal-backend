import mongoose from "mongoose";

const applySchema = new mongoose.Schema({
    name: {
        type: String
    }
})

const Apply = mongoose.model("Apply", applySchema);

export default Apply;