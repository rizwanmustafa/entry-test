import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
  name: String,
  id: String
})

export const Subject = mongoose.model("Subject", SubjectSchema);