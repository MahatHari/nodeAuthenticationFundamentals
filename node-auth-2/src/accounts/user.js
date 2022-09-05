import jwt from "jsonwebtoken";

import { user } from "../models/user.js";
import mongo from "mongodb";
import { session } from "../models/session.js";
import { createTokens } from "./tokens.js";
//This file handles Cookies

const { ObjectId } = mongo;
const JWTSignature = process.env.JWT_SIGNATURE;
const { ROOT_DOMAIN } = process.env;

export async function getUserFromCookies(request, response) {
  try {
    // check if request has cookie, named accessToken
    if (request?.cookies?.accessToken) {
      // if access token exists
      const { accessToken } = request.cookies;
      // decode accessToken
      const decodedAccessToken = jwt.verify(accessToken, JWTSignature);
      // return user from recod
      return user.findOne({
        _id: ObjectId(decodedAccessToken?.userId),
      });
    }

    // check if request has cookie named refreshToken
    if (request?.cookies?.refreshToken) {
      const { refreshToken } = request.cookies;
      const decodedRefreshToken = jwt.verify(refreshToken, JWTSignature);

      // look up for session in session table
      const currentSession = await session.findOne({
        sessionToken: decodedRefreshToken?.sessionToken,
      });

      // confirm session is valid
      if (currentSession?.valid) {
        const currentUser = await user.findOne({
          _id: ObjectId(currentSession.userId),
        });

        // refresh Tokens for session
        await refreshTokens(
          currentSession.sessionToken,
          currentSession.userId,
          response
        );
      }
    }
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
    const now = new Date();
    const refreshExpires = now.setDate(now.getDate() + 30);

    // Set Cookie
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
        expires: refreshExpires,
      });
  } catch (error) {
    console.error(error);
  }
}
