import { User } from "../models/User.js";
import bcrypt from "bcryptjs";

export async function registerUser(email, password, res) {
  try {
    /* if (userInDb(email)) {
      res.send({
        data: {
          message: "user already exists",
        },
      });
    } */

    // create salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await User.insertOne({
      email: {
        address: email,
        verified: false,
      },
      password: hashedPassword,
    });
    return result.insertedId;
  } catch (err) {
    console.error(err);
  }
}

export async function userInDb(email) {
  const user = await User.findOne({
    "email.address": email,
  });
  return user ? true : false;
}
