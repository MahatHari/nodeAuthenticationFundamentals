import { randomBytes } from "crypto";
import { session } from "../models/session.js";

export async function createSession(userId, connectionInfo) {
  try {
    // Generate a session token
    const sessionToken = randomBytes(43).toString("hex");
    // retrive connection infromatin from connectionInfo
    const { ip, userAgent } = connectionInfo;

    await session.insertOne({
      sessionToken,
      userId,
      valid: true,
      ip,
      userAgent,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return sessionToken;
  } catch (error) {
    console.error(error);
    throw new Error("Session Creation Failed");
  }
}
