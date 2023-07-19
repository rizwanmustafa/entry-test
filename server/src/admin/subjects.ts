import { Router } from "express";
import logger from "../utils/logger";
import { getMongoDb } from "../utils/db";

const subjectsRouter = Router();

// TODO: Remove this and actually get them from the database
let demoSubjects = [
  {
    id: "1",
    name: "Mathematics"
  },
  {
    id: "2",
    name: "Physics"
  },
  {
    id: "3",
    name: "Computer Science"
  },
  {
    id: "4",
    name: "Biology"
  }
];

subjectsRouter.get("/", (req, res) => {
  res.json(demoSubjects);
})

subjectsRouter.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const subjectName = req.body.name;
    console.log("Subject Name: ", subjectName);

    const db = await getMongoDb();
    console.log(db);
    const subjectCollection = db.collection("subjects");

    const result = await subjectCollection.insertOne({ name: subjectName });
    res.json(result);
  }
  catch (error) {
    logger.error("An error occurred while adding a new subject!");
    logger.error((error as Error).message);
    res.sendStatus(500);
  }

})

subjectsRouter.delete("/", (req, res) => {
  console.log(req.body);
  demoSubjects = demoSubjects.filter(subject => {
    return subject.id === req.body.id ? false : true;
  })
  console.log(demoSubjects);

  res.send();
})


export default subjectsRouter;