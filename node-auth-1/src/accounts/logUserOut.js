import { session } from "../sessions/sessions.js";
import jwt from "jsonwebtoken";

export async function logUserOut(request, response) {
  const JWTSignature = process.env.JWT_SIGNATURE;
  try {
    if (request?.cookies?.refreshToken) {
      // Get refresh token
      const { refreshToken } = request.cookies;
      // Decode SessionToken from refreshToken
      const { sessionToken } = jwt.verify(refreshToken, JWTSignature);
      // look up session and Delete database record for session
      const delete_currentSession = await session.findOneAndDelete({
        sessionToken,
      });
    }
    // remove cookies
    response.clearCookie("refreshToken").clearCookie("accessToken");
  } catch (e) {
    console.error(e);
  }
}
