import { Router } from "express";

const adminRouter = Router();

// * Importing routes
import subjectsRouter from "./admin/subjects";

adminRouter.use("/subjects/", subjectsRouter);

export default adminRouter;