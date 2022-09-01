import { client } from "../db.js";

// its for model, as we not using mongoose
export const session = client.db("test").collection("session");
session.createIndex({ sessionToken: 1 });
