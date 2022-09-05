import crypto from "crypto";
const { ROOT_DOMAIN } = process.env;
const { JWT_SIGNATURE } = process.env;
export async function createVeifyEmailToken(email) {
  try {
    // create auth string, using JWT signature and email
    const authString = `${JWT_SIGNATURE}:${email}`;
    return crypto.createHash("sha256").update(authString).digest("hex");
  } catch (error) {
    console.error(error);
  }
}

export async function createVeifyEmailLink(email) {
  try {
    // create token
    const emailToken = await createVeifyEmailToken(email);
    // ecode url string
    const URIencodedEmail = encodeURIComponent(email);
    //return link for verification
    return `https://${ROOT_DOMAIN}/verify/${URIencodedEmail}/${emailToken}`;
  } catch (error) {
    console.error(error);
  }
}
