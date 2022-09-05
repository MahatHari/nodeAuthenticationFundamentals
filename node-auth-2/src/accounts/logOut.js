import { session } from "../models/session.js";
import jwt from "jsonwebtoken";

export async function logOut(request, response) {
  const JWTSignature = process.env.JWT_SIGNATURE;
  const { ROOT_DOMAIN } = process.env;
  try {
    if (request?.cookies?.refreshToken) {
      //Get resresh token
      const { refreshToken } = request.cookies;

      const { sessionToken } = jwt.verify(refreshToken, JWTSignature);
      // look up session table and remove data that mateches sessionToken

      const delete_currentSession = await session.findOneAndDelete({
        sessionToken,
      });
    }

    response
      .clearCookie("refreshToken", { path: "/", domain: ROOT_DOMAIN })
      .clearCookie("accessToken", { path: "/", domain: ROOT_DOMAIN });
  } catch (error) {
    console.error(error);
  }
}
