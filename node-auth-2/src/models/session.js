import { client } from "../db.js";

export const session = client.db("node2").collection("session");
session.createIndex({ sessionToken: 1 });
