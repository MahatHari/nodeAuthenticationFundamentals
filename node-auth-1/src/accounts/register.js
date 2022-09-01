import bcrypt from "bcryptjs";
const { genSalt, hash } = bcrypt;
import { user } from "../user/user.js";

export async function regisesterUser(email, password) {
  //generate salt
  const salt = await genSalt(10);

  // hash with salt
  const hashedPassword = await hash(password, salt);

  // store in database
  const result = await user.insertOne({
    email: {
      address: email,
      verified: false,
    },
    password: hashedPassword,
  });
  // return user from database
  return result.insertedId;
}
