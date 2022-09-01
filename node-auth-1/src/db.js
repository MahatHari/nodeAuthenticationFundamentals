import mongo from "mongodb";

const { MongoClient } = mongo; // destructing MongoClient from mongo

const url = process.env.MONGO_URL;

export const client = new MongoClient(url, { useNewUrlParser: true });

export async function connectDb() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("💻 : Connected to DB Success");
  } catch (e) {
    console.error(e);

    // if there is a prbolem close connectioin to db
    await client.close();
  }
}
