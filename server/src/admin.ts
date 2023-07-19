import { Router } from "express";

const adminRouter = Router();

// * Importing sub-routers
import subjectsRouter from "./admin/subjects";
import questionsRouter from "./admin/questions";

adminRouter.use("/subjects/", subjectsRouter);
adminRouter.use("/questions/", questionsRouter);

export default adminRouter;