import { client } from "../db.js";

export const user = client.db("node2").collection("user");
user.createIndex({ "email.address": 1 });
