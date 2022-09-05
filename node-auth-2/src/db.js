import mongodb from "mongodb";

const { MongoClient } = mongodb;

const url = process.env.MONGO_URL;

// create mongo client
export const client = new MongoClient(url, { useNewUrlParser: true });

// connect to mongo Db
export async function connectDb() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 3 });
    console.log("🗄 Connected to DB Sucess");
  } catch (error) {
    console.error(error);

    // close connection if problem
    client.close();
  }
}
