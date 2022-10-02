import mongoose from "mongoose";

const openingSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, "Title is required"]
    },

    description: {
        type: String,
        required: [true, "Body of the Opening is required"]
    },

    date_start: {
        type: Date,
        required: [true, "Starting date is required"]
    },

    date_end: {
        type: Date,
        required: false
    },

    status: {
        type: String,
        required: [true, "Status is required"],
        enum: ['draft', 'Open', 'Closed']
    }


    
})

const Opening = mongoose.model("Opening", openingSchema);

export default Opening;