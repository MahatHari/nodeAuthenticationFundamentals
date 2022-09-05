import { user } from "../models/user.js";
import bcrypt from "bcryptjs";

const { genSalt, hash } = bcrypt;
export async function registerUser(email, password) {
  try {
    //create salt
    const salt = await genSalt(10);

    // hash with salt
    const hashedPassword = await hash(password, salt);

    const result = await user.insertOne({
      email: {
        address: email,
        verify: false,
      },
      password: hashedPassword,
    });
    return result.insertedId;
  } catch (error) {
    console.error(error);
  }
}
