import mongoose from "mongoose";

const openingSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    
})

const Opening = mongoose.model("Opening", openingSchema);

export default Opening;