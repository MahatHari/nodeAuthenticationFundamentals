import bcrypt from "bcryptjs";
import { User } from "../models/User.js";

export async function authorizeUser(email, password) {
  try {
    const user = await User.findOne({
      "email.address": email,
    });

    const savedPassword = user.password;
    const isAuthroized = await bcrypt.compare(password, savedPassword);
    return { isAuthroized, userId: user._id };
  } catch (error) {
    console.error(error);
  }
}
