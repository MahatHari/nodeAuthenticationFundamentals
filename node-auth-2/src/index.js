import "./env.js";
import { fastify } from "fastify";
import fastifyStatic from "@fastify/static";
import cookie from "@fastify/cookie";
import path from "path";
import { fileURLToPath } from "url";
import fastifyCors from "@fastify/cors";

import { connectDb } from "./db.js";
import { registerUser } from "./accounts/registerUser.js";
import { logUserIn } from "./accounts/logUserIn.js";
import { authorizeUser } from "./accounts/authorizeUser.js";
import { logOut } from "./accounts/logOut.js";
import { getUserFromCookies } from "./accounts/user.js";
import { sendEmail, mailInit } from "./mail/index.js";
import { createVeifyEmailLink } from "./accounts/verifyEmail.js";

// ESM specifi features to get access to dir nmae
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// create fastify app
const app = fastify();

// start fastify app
async function startApp() {
  try {
    await mailInit();
    // register fastifyCors to app
    app.register(fastifyCors, {
      origin: [/\.nodeauth.dev/, "https://nodeauth.dev"],
      credentials: true,
    });

    // register static files to app
    app.register(fastifyStatic, {
      root: path.join(__dirname, "public"),
    });

    //  register cookie to be used
    app.register(cookie, {
      secret: process.env.COOKIE_SIGNATURE,
    });

    // // add routes to app
    // app.get("/", {}, (req, res) => {
    //   res.send({
    //     data: "Hello World",
    //   });
    // });

    // route to register user
    app.post("/api/register", {}, async (request, response) => {
      try {
        // adding user to database
        const { email, password } = request.body;
        const userId = await registerUser(email, password);
        const link = await createVeifyEmailLink(email);
        // If user is created, log user in
        if (userId) {
          await sendEmail({
            subject: "Email verification ",
            text: `${link}`,
            html: `<a href="${link}">link</h3>`,
          });
          await logUserIn(userId, request, response);
          response.send({
            data: {
              status: "Success",
              userId,
            },
          });
        }
      } catch (error) {
        console.error(error);
        response.send({
          data: {
            status: "Failure",
          },
        });
      }
    });

    // route to authorise user
    app.post("/api/login", {}, async (request, response) => {
      try {
        const { email, password } = request.body;

        const { isAuthorized, userId } = await authorizeUser(email, password);
        console.log(isAuthorized);
        if (isAuthorized) {
          await logUserIn(userId, request, response);
          response.send({
            data: {
              status: "Success",
              userId,
            },
          });
        } else {
          response.send({
            data: {
              status: "Failed",
              userId,
            },
          });
        }
      } catch (error) {
        console.log(error);
        response.send({
          data: {
            status: "Failed",
            userId,
          },
        });
      }
    });

    // route to log user out
    app.post("/api/logout", {}, async (req, res) => {
      try {
        const out = await logOut(req, res);
        res.send({
          data: {
            status: "Success",
            message: "User logged out",
          },
        });
      } catch (error) {
        console.log(error);
        res.send({
          data: {
            status: "Failed",
            message: "logout failed",
          },
        });
      }
    });

    // New Route to display logged user
    app.get("/test", {}, async (req, res) => {
      try {
        const user = await getUserFromCookies(req, res);

        // Return user email if it exist otherwise return unatuthorized
        if (user?._id) {
          res.send({
            data: {
              status: "Success",
              user,
            },
          });
        } else {
          res.send({
            data: {
              success: "Failed",
            },
          });
        }
      } catch (e) {
        console.error(e);
        res.send({
          data: {
            success: "Failed",
          },
        });
      }
    });
    // starting listening to port 3000
    await app.listen({ port: 3000 });
    console.log("🚀 Server listening at port 3000");
  } catch (error) {
    console.error(error);
  }
}

// starting app with connection to database server
connectDb().then(() => startApp());
