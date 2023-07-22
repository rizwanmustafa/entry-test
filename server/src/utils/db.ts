import mongoose from "mongoose";
import logger from "./logger";

const DB_URI = process.env.DB_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "entry-test";

export const establishConnection = async (retryCount = 1) => {


  if (retryCount >= 4) {
    logger.error(`Could not establish connection with MongoDB after trying ${retryCount} times!`)
    logger.error("I give up!");
    logger.error("Wait a minute! If I can't run, nobody can!!!")
    process.exit(1);
  };

  try {
    logger.info(`Trying to establish connection with Mongoose! Attempt Number: ${retryCount}`);
    await mongoose.connect(DB_URI, { dbName: DB_NAME });

    logger.success("Successfully established connection with Mongoose!");
  }
  catch (error) {
    logger.error("Unable to connect to Mongodb!");
    await establishConnection(retryCount + 1);
    throw error;
  }

  // try {
  //   mongoClient = await MongoClient.connect(DB_URI);
  //   console.log(mongoClient);
  //   logger.success("Successfully established connection with MongoDB!");
  //   mongoDb = mongoClient.db(DB_NAME);
  //   console.log(mongoDb);
  // }
  // catch (error) {
  //   logger.error("Unable to connect to Mongodb!");
  //   logger.info(`Retrying to establish connection with Mongodb! Retry Count: ${retryCount}`);
  //   await establishConnection(retryCount + 1);
  //   throw error;
  // }
}
// export const getMongooseClient = async (): Promise<Mongoose> => {
//   try {
//     if (mongooseClient === null || mongooseClient === undefined) await establishConnection();

//     return mongooseClient;
//   }
//   catch (error) {
//     logger.error("An error occurred while accessing mongoose client!");
//     logger.error((error as Error).message);
//     throw error;
//   }
// }