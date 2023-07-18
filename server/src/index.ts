import express from "express";
import dotenv from "dotenv";
import cors from "cors"
dotenv.config();

import logger from "./utils/logger";

// * Importing routers
import adminRouter from "./admin";

const app = express();

app.use(cors());
app.use("/admin/", adminRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.success(`The server has started running at port ${PORT}!`);
  logger.success(`The server URL is: http://localhost:${PORT}`)
})