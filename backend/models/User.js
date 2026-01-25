import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  name: String,
  registerNumber: String
});

export default mongoose.model("User", userSchema);
