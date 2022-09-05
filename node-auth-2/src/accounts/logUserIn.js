import { createSession } from "./createSession.js";
import { refreshTokens } from "./user.js";

export async function logUserIn(userId, req, res) {
  // connection information for creating session
  const connectionInformation = {
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  };

  // create session, add to databse table session
  const sessionToken = await createSession(userId, connectionInformation);
  await refreshTokens(sessionToken, userId, res);
}
