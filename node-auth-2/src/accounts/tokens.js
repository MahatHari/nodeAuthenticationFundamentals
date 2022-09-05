import jwt from "jsonwebtoken";

const JWTSignature = process.env.JWT_SIGNATURE;
export async function createTokens(sessionToken, userId) {
  try {
    // create a refresh token, needs sessionToken

    const refreshToken = jwt.sign(
      {
        sessionToken,
      },
      JWTSignature
    );

    const accessToken = jwt.sign(
      {
        sessionToken,
        userId,
      },
      JWTSignature
    );
    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
  }
}
