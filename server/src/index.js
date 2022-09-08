import "../config/config.js";
import { connectDb } from "../config/config.js";
import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";

import { registerUser } from "../account/registerUser.js";
import { logUserIn } from "../account/logUserIn.js";
import { authorizeUser } from "../account/authorizeUser.js";
import { logOut } from "../account/logOut.js";
import {
  createVefiyEmailLink,
  validateVerifyEmail,
} from "../account/verifyEmail.js";
import { mailInit, sendEmail } from "../mail/index.js";
import { getUserFromCookie, changePassword } from "../account/userCookie.js";
import {
  createResetLink,
  validateResetPassword,
} from "../account/resetPassword.js";
import { User } from "../models/User.js";

const app = fastify();
const port = process.env.PORT;

async function statrtApp() {
  try {
    // Initialize mail service
    await mailInit();
    // Test Route
    app.get("/test", {}, (req, res) => {
      res.send("Hello World");
    });

    // register cors use
    app.register(fastifyCors, {
      origin: [/\.hari.dev/, "https://hari.dev"],
      credentials: true,
    });

    // register cookie use
    app.register(fastifyCookie, {
      secret: process.env.COOKIE_SIGNATURE,
    });

    app.post("/register", {}, async (req, res) => {
      try {
        const { email, password } = req.body;
        const userId = await registerUser(email, password, res);
        const link = await createVefiyEmailLink(email);

        //log userIn
        if (userId) {
          await sendEmail({
            subject: "Email verification",
            text: `${link}`,
            html: `<a href="${link}">Verify link</h3>`,
          });
          await logUserIn(userId, req, res);
          res.send({
            data: {
              message: "login successful",
              userId,
            },
          });
        }
      } catch (e) {
        console.error(e);
        res.send({
          data: {
            status: "Failed",
          },
        });
      }
    });

    app.post("/verify", {}, async (req, res) => {
      try {
        const { email, token } = req.body;
        const isValid = await validateVerifyEmail(token, email);
        console.log(isValid);
        if (isValid) {
          return res.code(200).send({
            data: {
              status: "Success",
            },
          });
        }
        return res.code(401).send({
          data: {
            status: "Failed",
            message: "Unauthorized access",
          },
        });
      } catch (error) {
        return res.code(401).send({
          statu: "Failed",
        });
      }
    });

    app.post("/login", {}, async (req, res) => {
      try {
        const { email, password } = req.body;
        const { isAuthroized, userId } = await authorizeUser(email, password);

        if (isAuthroized) {
          await logUserIn(userId, req, res);
          res.code(200).send({
            data: {
              message: "login successful",
            },
          });
        }
        res.code(401).send({
          data: {
            message: "credentials mismatch",
          },
        });
      } catch (error) {
        console.error(error);
        res.code(401).send();
      }
    });

    app.post("/logout", {}, async (req, res) => {
      try {
        const out = await logOut(req, res);
        res.send({
          data: {
            status: "Success",
            message: "User loged out",
          },
        });
      } catch (error) {
        console.error(error);
        res.send({
          data: {
            status: "Failed",
            message: "User not loged out",
          },
        });
      }
    });

    app.post("/changePassword", {}, async (req, res) => {
      try {
        const { oldPassword, newPassword } = req.body;
        const user = await getUserFromCookie(req, res);
        if (user?.email?.address) {
          const { isAuthroized, userId } = await authorizeUser(
            user.email.address,
            oldPassword
          );
          console.log(isAuthroized);
          if (isAuthroized) {
            const changedPass = await changePassword(userId, newPassword);
            return res.code(200).send("All good");
          }
        }
        return res.code(401).send("password not changed");
      } catch (error) {
        return res.code(401).send("password not changed");
      }
    });
    app.post("/forgot-password", {}, async (req, res) => {
      try {
        const { email } = req.body;
        //createResetLink checks for user and creates link if exists otherwise returns empty string
        const link = await createResetLink(email);
        if (link) {
          // linkemail containes user email, expiration time, token
          // send email with link
          await sendEmail({
            subject: "Reset Password",
            text: `${link}`,
            html: `<a href="${link}">Reset password link</h3>`,
          });

          res.code(200).send();
        }
      } catch (error) {
        console.log(error);
        res.code(200).send();
      }
    });
    app.post("/reset", {}, async (req, res) => {
      console.log("rest route");
      try {
        const { password, email, expTime, token } = req.body;
        const resetValidation = await validateResetPassword(
          password,
          email,
          expTime,
          token
        );
        console.log("Validation", resetValidation);
        if (resetValidation) {
          // find user using email,
          const foundUser = await User.findOne({
            "email.address": email,
          });
          // call change password
          if (foundUser) {
            await changePassword(foundUser._id, password);
            return res.code(200).send("Password updated");
          }
        }
        return res.code(401).send("Reset failed");
      } catch (error) {
        console.log(error);
        return res.code(401).send("Reset failed");
      }
    });

    app.get("/", {}, async (req, res) => {
      res.send("Testing route");
    });

    await app.listen({ port: port });
    console.log(`Listening to port ${port}`);
  } catch (error) {
    console.error(error);
  }
}

connectDb().then(() => statrtApp());
