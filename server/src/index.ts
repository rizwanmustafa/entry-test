import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

dotenv.config();
const PORT = process.env.PORT || 5000;
const MODE = process.env.MODE === "production" ? "production" : "development";


import logger, { loggerStream } from "./utils/logger";

// * Importing routers
import adminRouter from "./admin";

const app = express();

app.use(cors());
app.use(morgan(MODE === 'production' ? 'combined' : 'dev', { stream: loggerStream }))
app.use(express.json());
app.use("/admin/", adminRouter);


app.listen(PORT, () => {
  logger.success(`The server has started running at port ${PORT}!`);
  logger.success(`The server URL is: http://localhost:${PORT}`)
})