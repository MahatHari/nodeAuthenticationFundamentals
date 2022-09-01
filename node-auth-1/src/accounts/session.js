import { randomBytes } from "crypto";
export async function createSession(userId, connection) {
  try {
    // Generate a session token
    const sessionToken = randomBytes(43).toString("hex");
    // retrieve connection information
    const { ip, userAgent } = connection;
    // database insert for session
    const { session } = await import("../sessions/sessions.js");

    const result = await session.insertOne({
      sessionToken,
      userId,
      valid: true,
      userAgent,
      ip,
      updatedAt: new Date(),
      createdAt: new Date(),
    });
    // return session token
    return sessionToken;
  } catch (e) {
    console.error(e);
    throw new Error("Session Creation Failed");
  }
}
