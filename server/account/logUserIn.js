import { createSession } from "./createSession.js";
import { refreshTokens } from "./userCookie.js";

export async function logUserIn(userId, req, res) {
  // get connection information and create session and add cookie
  const connectionInfo = {
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  };

  // create session
  const sessionToken = await createSession(userId, connectionInfo);

  // refresh refreshToken
  await refreshTokens(sessionToken, userId, res);
}
