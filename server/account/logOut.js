import jwt from "jsonwebtoken";
import { Session } from "../models/Session.js";

export async function logOut(req, res) {
  const { JWT_SIGNATURE } = process.env;
  const { ROOT_DOMAIN } = process.env;
  try {
    if (req?.cookies?.refreshToken) {
      const { refreshToken } = req.cookies;

      const { sessionToken } = jwt.verify(refreshToken, JWT_SIGNATURE);

      const delete_currentSession = await Session.findOneAndDelete({
        sessionToken,
      });
    }
    res
      .clearCookie("accessToken", { path: "/", domain: ROOT_DOMAIN })
      .clearCookie("refreshToken", { path: "/", domain: ROOT_DOMAIN });
  } catch (error) {
    console.error(error);
  }
}
