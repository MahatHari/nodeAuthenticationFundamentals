import { createSession } from "./session.js";
import { refreshTokens } from "./user.js";

export async function logUserIn(userId, request, response) {
  const connectionInformation = {
    ip: request.ip,
    userAgent: request.headers["user-agent"],
  };
  // Create Session
  const sessionToken = await createSession(userId, connectionInformation);

  // Create JWT,
  // Set Cookie,
  // get date 30 days into future
  await refreshTokens(sessionToken, userId, response);

  // Follwing is done by refreshTokens methods, in user.js
  /*   const { accessToken, refreshToken } = await createTokens(
    sessionToken,
    userId
  );

  const now = new Date();
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
    }); */
}
