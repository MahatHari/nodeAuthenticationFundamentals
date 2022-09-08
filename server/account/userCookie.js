import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Session } from "../models/Session.js";

import { createTokens } from "./tokens.js";
import mongo from "mongodb";

const { JWT_SIGNATURE, ROOT_DOMAIN } = process.env;
const { ObjectId } = mongo;
export async function getUserFromCookie(req, res) {
  try {
    //check for accessToken cookies
    if (req?.cookies?.accessToken) {
      const { accessToken } = req.cookies;
      // using deconstructor here,
      /* 
                const decodedAccessToken= jwt.verify(accessToken, jwtSignature)
                const userId= decodedAccessToke?.userId
             */
      const { userId } = jwt.verify(accessToken, JWT_SIGNATURE);

      // find user using userId
      return await User.findOne({
        _id: ObjectId(userId),
      });
    }

    // check for refreshToken Cookies
    if (req?.cookies?.refreshToken) {
      const { refreshToken } = req.cookies;

      const { sessionToken } = jwt.verify(refreshToken, JWT_SIGNATURE);

      // find session from sessionToken
      const currentSession = await Session.findOne({
        sessionToken,
      });

      if (currentSession?.valid) {
        return await User.findOne({
          _id: ObjectId(currentSession.userId),
        });
      }
      refreshTokens(currentSession.sessionToken, currentSession.userId, res);
    }
  } catch (e) {
    console.error(e);
  }
}

export async function refreshTokens(sessionToken, userId, response) {
  try {
    const { accessToken, refreshToken } = await createTokens(
      sessionToken,
      userId
    );

    const now = new Date();
    const expires = now.setDate(now.getDate() + 30);

    // setCookie
    response
      .setCookie("accessToken", accessToken, {
        path: "/",
        domain: ROOT_DOMAIN,
        httpOnly: true,
      })
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        domain: ROOT_DOMAIN,
        httpOnly: true,
        expires,
      });
  } catch (error) {
    console.error(error);
  }
}

export async function changePassword(userId, newPassword) {
  try {
    // create salt and hash password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    return await User.updateOne(
      { _id: userId },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );
  } catch (error) {}
}
