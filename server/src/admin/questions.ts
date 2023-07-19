import { Router } from "express";
import logger from "../utils/logger";
import { Question as QuestionModel } from "../models/questions";
import { Subject as SubjectModel } from "../models/subjects";
import { v4 as uuid } from "uuid";

const questionsRouter = Router();

// TODO: Create a validation middleware
// TODO: Separate the data part, the route part and the control part

questionsRouter.get("/", async (req, res) => {
  if (req.body.id) {
    const reqQuestion = await QuestionModel.findOne({ id: req.body.id }).exec();

    if (reqQuestion) {
      return res.json(reqQuestion);
    }
    else {
      return res.status(404);
    }
  }

  return res.json(await QuestionModel.find().exec());
})

questionsRouter.post("/", async (req, res) => {
  // TODO: Add case insensitive search check to prevent different case same name 
  try {
    console.log(req.body);

    const { statement, type, options, correctOption, subjectId, difficulty } = req.body;

    if (await QuestionModel.findOne({ statement }).exec())
      return res.status(409).json({ message: "Another question with the same statement already exists!" })

    if (!(await SubjectModel.findOne({ id: subjectId }).exec()))
      return res.status(400).json({ message: "No subject with the given id exists!" })

    // Generate a unique id
    let newId = uuid();
    while (await QuestionModel.findOne({ id: newId }).exec())
      newId = uuid();

    const newQuestion = new QuestionModel({ id: newId, statement, type, options, correctOption, subjectId, difficulty });
    await newQuestion.save();

    return res.json({ id: newId });
  }
  catch (error) {
    logger.error("An error occurred while adding a new subject!");
    logger.error((error as Error).message);
    return res.sendStatus(500);
  }

})


questionsRouter.delete("/", async (req, res) => {
  const questionId = req.body.id;

  try {
    await QuestionModel.deleteOne({ id: questionId }).exec();

    return res.sendStatus(200);
  }
  catch (error) {
    logger.error(`There was an error while deleteing a question with id '${questionId}' :`);
    logger.error((error as Error).message);
  }
})


export default questionsRouter;