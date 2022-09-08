import { client } from "../config/config.js";
import bcrypt from "bcryptjs";

export const User = client.db("authentication").collection("user");
User.createIndex({ "email.address": 1 });
