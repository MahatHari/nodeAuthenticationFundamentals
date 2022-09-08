import crypto from "crypto";
import { User } from "../models/User.js";

const { ROOT_DOMAIN, JWT_SIGNATURE } = process.env;

function createResetPasswordToken(email, expTimeStamp) {
  try {
    // create auth string, using JWT signature and email
    const authString = `${JWT_SIGNATURE}:${email}:${expTimeStamp}`;
    return crypto.createHash("sha256").update(authString).digest("hex");
  } catch (error) {
    console.error(error);
  }
}

export async function createResetLink(email) {
  try {
    //check if there is user with given email
    const foundUser = await User.findOne({
      "email.address": email,
    });
    if (foundUser) {
      // encode url string
      const expirationTime = Date.now() + 24 * 60 * 60 * 1000;
      const URIencodedEmail = encodeURIComponent(email);
      // create token
      const token = createResetPasswordToken(email, expirationTime);

      // return link for verification
      return `https://${ROOT_DOMAIN}/reset-password/${URIencodedEmail}/${expirationTime}/${token}`;
    }
    return "";
  } catch (error) {
    console.error(error);
  }
}

export async function validateResetPassword(password, email, expTime, token) {
  try {
    // create has token with passed email
    const emailToken = await createResetPasswordToken(email, expTime);
    // compare has with token
    const isValid = emailToken === token;
    const isNotExpired = validateExpTimeStamp(expTime);
    console.log(isNotExpired);
    // if they are same, update user, to make them verified
    if (isValid && isNotExpired) {
      return true;
    }
    // return true or false
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

function validateExpTimeStamp(time) {
  let d2 = new Date().getTime();
  return time > d2;
}
