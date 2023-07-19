import { Db, MongoClient } from "mongodb";
import logger from "./logger";

const DB_URI = process.env.DB_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "entry-test";

let mongoClient: MongoClient;
let mongoDb: Db;


export const establishConnection = async (retryCount = 0) => {
  console.log("asdfa')")
  logger.info("Trying to establish connection with MongoDB!");

  if (retryCount >= 3) {

    logger.error("Could not establish connection with MongoDB after trying ${retryCount} times!")
    logger.error("I give up!");

    throw new Error("Could not connect to MongoDB!");
  };

  try {
    mongoClient = await MongoClient.connect(DB_URI);
    console.log(mongoClient);
    logger.success("Successfully established connection with MongoDB!");
    mongoDb = mongoClient.db(DB_NAME);
    console.log(mongoDb);
  }
  catch (error) {
    logger.error("Unable to connect to Mongodb!");
    logger.info(`Retrying to establish connection with Mongodb! Retry Count: ${retryCount}`);
    await establishConnection(retryCount + 1);
    throw error;
  }
}

export const getMongoDb = async (): Promise<Db> => {
  try {
    if (mongoDb === null || mongoDb === undefined) await establishConnection();

    return mongoDb;
  }
  catch (error) {
    logger.error("An error occurred while accessing mongoDb object!");
    logger.error((error as Error).message);
    throw error;
  }
}