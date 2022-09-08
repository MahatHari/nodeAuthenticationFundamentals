import dotenv from "dotenv";
import mongodb from "mongodb";
dotenv.config();

// Configuration for mongodb
const { MongoClient } = mongodb;
const { MONGO_URL } = process.env;

export const client = new MongoClient(MONGO_URL, { useNewUrlParser: true });

// connect to mongoDb in mongocloud
export async function connectDb() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("DB Connection Succesfful");
  } catch (error) {
    console.error(error);
    // On error close connection
    client.close;
  }
}
