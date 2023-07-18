import { Router } from "express";

const subjectsRouter = Router();

// TODO: Remove this
const demoSubjects = [
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

subjectsRouter.post("/", (req, res) => {

})

export default subjectsRouter;