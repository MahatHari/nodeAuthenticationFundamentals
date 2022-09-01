import bcrypt from "bcryptjs";
import { user } from "../user/user.js";
const { compare } = bcrypt;

export async function authorizeUser(email, password) {
  //Import user collection
  //look up user
  const userData = await user.findOne({
    "email.address": email,
  });
  // get user password
  const savedPassword = userData.password;
  // compare pasword with one in database
  const isAuthorized = await compare(password, savedPassword);
  // return boolean of if password is correct

  return { isAuthorized, userId: userData._id };
}
