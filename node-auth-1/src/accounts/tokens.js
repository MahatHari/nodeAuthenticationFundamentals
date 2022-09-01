import jwt from "jsonwebtoken";

const JWTSignature = process.env.JWT_SIGNATURE;

export async function createTokens(sessionToken, userId) {
  try {
    // create a refresh token
    //needs session id
    const refreshToken = jwt.sign(
      {
        sessionToken,
      },
      JWTSignature
    );
    // create access token
    // needs session id, userId
    const accessToken = jwt.sign(
      {
        sessionToken,
        userId,
      },
      JWTSignature
    );
    // return refreshToken and accessToken
    return { accessToken, refreshToken };
  } catch (e) {
    console.error(e);
  }
}
