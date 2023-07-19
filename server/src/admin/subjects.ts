import { Router } from "express";
import logger from "../utils/logger";
import { Subject as SubjectModel } from "../models/subjects";
import { v4 as uuid } from "uuid";

const subjectsRouter = Router();

// TODO: Create a validation middleware
// TODO: Separate the data part, the route part and the control part

subjectsRouter.get("/", async (req, res) => {
  if (req.body.id) {
    const reqSubject = await SubjectModel.findOne({ id: req.body.id });

    if (reqSubject) {
      return res.json({ ...reqSubject, _id: undefined }) // TODO: Create a remove _id function
    }
    else {
      return res.status(404);
    }
  }

  return res.json(await SubjectModel.find());
})

subjectsRouter.post("/", async (req, res) => {
  // TODO: Add case insensitive search check to prevent different case same name subjects
  try {
    console.log(req.body);
    const subjectName = req.body.name;
    console.log("Subject Name: ", subjectName);

    if (await SubjectModel.findOne({ name: subjectName }))
      return res.status(409).json({ message: "Another subject with the same name already exists!" })

    // Generate a unique id
    let newId = uuid();
    while (await SubjectModel.findOne({ id: newId }))
      newId = uuid();

    const newSubject = new SubjectModel({ name: subjectName, id: newId });
    await newSubject.save();

    return res.json({ id: newId });
  }
  catch (error) {
    logger.error("An error occurred while adding a new subject!");
    logger.error((error as Error).message);
    return res.sendStatus(500);
  }

})


subjectsRouter.delete("/", async (req, res) => {
  const subjectId = req.body.id;

  try {
    await SubjectModel.deleteOne({ id: subjectId });

    return res.sendStatus(200);
  }
  catch (error) {
    logger.error(`There was an error while deleteing a subject with id '${subjectId}' :`);
    logger.error((error as Error).message);
  }
})


export default subjectsRouter;