import express from "express";
import dotenv from "dotenv";
dotenv.config();

import logger from "./utils/logger";

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.success(`The server has started running at port ${PORT}!`);
  logger.success(`The server URL is: http://localhost:${PORT}`)
})