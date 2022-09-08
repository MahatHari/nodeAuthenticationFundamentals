import { client } from "../config/config.js";

export const Session = client.db("authentication").collection("session");
Session.createIndex({ sessionToken: 1 });
