import { session } from "../sessions/sessions.js";
import { user } from "../user/user.js";
import jwt from "jsonwebtoken";
import mongo from "mongodb";
import { createTokens } from "./tokens.js";

const { ObjectId } = mongo;

const JWTSignature = process.env.JWT_SIGNATURE;
export async function getUserFromCookies(request, response) {
  try {
    // check to make sure access toekn exists
    // using optional chaining here
    if (request?.cookies?.accessToken) {
      // if access token esits
      const { accessToken } = request.cookies;
      // decode acces token
      const decodedAccessToken = jwt.verify(accessToken, JWTSignature);
      console.log(decodedAccessToken);
      // return user from record
      return user.findOne({
        _id: ObjectId(decodedAccessToken?.userId),
      });
    }
    // Get access and refresh tokens
    if (request?.cookies?.refreshToken) {
      // refresh tokens
      const { refreshToken } = request.cookies;

      // decode refresh token
      const decodedRefreshToken = jwt.verify(refreshToken, JWTSignature);
      console.log(decodedRefreshToken);
      // look up session
      const currentSession = await session.findOne({
        sessionToken: decodedRefreshToken?.sessionToken,
      });
      // confirm session is valid
      if (currentSession?.valid) {
        const currentUser = await user.findOne({
          _id: ObjectId(currentSession.userId),
        });
        console.log(currentUser);
        await refreshTokens(
          currentSession.sessionToken,
          currentUser._id,
          response
        );
        return currentUser;
      }
    }
    // return current user
  } catch (error) {
    console.error(error);
  }
}

export async function refreshTokens(sessionToken, userId, response) {
  try {
    const { accessToken, refreshToken } = await createTokens(
      sessionToken,
      userId
    );
    // Set Cookie,
    const now = new Date();
    // get date 30 days into future
    const refreshExpires = now.setDate(now.getDate() + 30);
    response
      .setCookie("accessToken", accessToken, {
        path: "/",
        domain: "localhost",
        httpOnly: true,
      })
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        domain: "localhost",
        httpOnly: true,
        expires: refreshExpires,
      });
  } catch (e) {
    console.error(e);
  }
}
