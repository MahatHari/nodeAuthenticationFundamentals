import { randomBytes } from "crypto";
import { Session } from "../models/Session.js";

export async function createSession(userId, connectionInfo) {
  try {
    // generate session token using randomBytes,
    const sessionToken = randomBytes(43).toString("hex");

    const { ip, userAgent } = connectionInfo;
    await Session.insertOne({
      sessionToken,
      userId,
      valid: true,
      ip,
      userAgent,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return sessionToken;
  } catch (e) {
    console.error(e);
    throw new Error("Session Creation Failed");
  }
}
