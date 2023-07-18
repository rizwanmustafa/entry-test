import { Router } from "express";
import logger from "../utils/logger";

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

subjectsRouter.post("/", (req, res) => { })

subjectsRouter.delete("/", (req, res) => {
  console.log(req.body);
  demoSubjects = demoSubjects.filter(subject => {
    return subject.id === req.body.id ? false : true;
  })
  console.log(demoSubjects);

  res.send();
})


export default subjectsRouter;