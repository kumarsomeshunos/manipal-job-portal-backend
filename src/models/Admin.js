import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
