import crypto from "crypto";
import { User } from "../models/User.js";

const { ROOT_DOMAIN, JWT_SIGNATURE } = process.env;

export async function createVerifyEmailToken(email) {
  try {
    // create auth string, using JWT signature and email
    const authString = `${JWT_SIGNATURE}:${email}`;
    return crypto.createHash("sha256").update(authString).digest("hex");
  } catch (error) {
    console.error(error);
  }
}

export async function createVefiyEmailLink(email) {
  try {
    // create token
    const emailToken = await createVerifyEmailToken(email);

    // encode url string
    const URIencodedEmail = encodeURIComponent(email);
    console.log(URIencodedEmail);
    // return link for verification
    return `https://${ROOT_DOMAIN}/verify/${URIencodedEmail}/${emailToken}`;
  } catch (error) {
    console.error(error);
  }
}

export async function validateVerifyEmail(token, email) {
  try {
    // create has token with passed email
    const emailToken = await createVerifyEmailToken(email);
    // compare has with token
    const isValid = emailToken === token;

    // if they are same, update user, to make them verified
    if (isValid) {
      const updated = await User.updateOne(
        {
          "email.address": email,
        },
        {
          $set: { "email.verified": true },
        }
      );
      return true;
    }
    // return true or false
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}
