import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  id: String,
  statement: String,
  type: String,
  options: Array<String>,
  correctOption: Number,
  subjectId: String,
  difficulty: String
})

export const Question = mongoose.model("Question", QuestionSchema);