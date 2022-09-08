import jwt from "jsonwebtoken";

const { JWT_SIGNATURE } = process.env;

export async function createTokens(sessionToken, userId) {
  try {
    const refreshToken = jwt.sign(
      {
        sessionToken,
      },
      JWT_SIGNATURE
    );

    const accessToken = jwt.sign(
      {
        sessionToken,
        userId,
      },
      JWT_SIGNATURE
    );
    return { refreshToken, accessToken };
  } catch (error) {
    console.error(error);
  }
}
