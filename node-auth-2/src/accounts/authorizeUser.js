import bcrypt from "bcryptjs";
import { user } from "../models/user.js";

export async function authorizeUser(email, password) {
  try {
    // check if email exists in user table
    const userData = await user.findOne({
      "email.address": email,
    });
    // get password
    const savedPassword = userData.password;
    // compare password with one in database
    const isAuthorized = await bcrypt.compare(password, savedPassword);

    return { isAuthorized, userId: userData._id };
  } catch (error) {
    console.error(error);
  }
}
