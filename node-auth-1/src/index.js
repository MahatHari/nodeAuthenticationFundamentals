import "./env.js";
import { fastify } from "fastify";
import path from "path";
import { fileURLToPath } from "url";
import fastifyStatic from "@fastify/static";
import cookie from "@fastify/cookie";

import { connectDb } from "./db.js";
import { regisesterUser } from "./accounts/register.js";
import { authorizeUser } from "./accounts/authorize.js";
import { logUserIn } from "./accounts/logUserIn.js";
import { getUserFromCookies } from "./accounts/user.js";
import { logUserOut } from "./accounts/logUserOut.js";

//ESM Specific features to get access to dir name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();
async function startApp() {
  try {
    app.register(cookie, {
      secret: process.env.COOKIE_SIGNATURE,
    });
    app.register(fastifyStatic, {
      root: path.join(__dirname, "public"),
    });
    app.get("/", {}, (request, res) => {
      res.send({
        data: "hello world",
      });
    });

    // Register route
    app.post("/api/register", {}, async (req, res) => {
      try {
        const userId = await regisesterUser(req.body.email, req.body.password);
        if (userId) {
          await logUserIn(userId, req, res);
          res.send({
            data: {
              status: "SUCCESS",
              userId,
            },
          });
        }
      } catch (error) {
        console.error(error);
        res.send({
          data: {
            status: "FAILED",
          },
        });
      }
    });

    // Authorize Route
    app.post("/api/authorize", {}, async (req, res) => {
      try {
        const { isAuthorized, userId } = await authorizeUser(
          req.body.email,
          req.body.password
        );
        if (isAuthorized) {
          await logUserIn(userId, req, res);
          res.send({
            data: {
              status: "SUCCESS",
              userId,
            },
          });
        }
      } catch (error) {
        console.error(error);
        res.send({
          data: {
            status: "FAILED",
          },
        });
      }
    });

    app.post("/api/logout", {}, async (req, res) => {
      try {
        const userId = await logUserOut(req, res);
        res.send({
          data: "User logged Out",
        });
      } catch (error) {
        console.error(error);
      }
    });

    app.get("/test", {}, async (request, response) => {
      try {
        // Verify user login
        const user = await getUserFromCookies(request, response);
        // Return user email if it exists otherwise return unauthoriezed
        if (user?._id) {
          response.send({
            data: {
              status: "SUCCESS",
              user,
            },
          });
        } else {
          response.send({
            data: {
              status: "FAILED",
            },
          });
        }
      } catch (e) {
        console.error(e);
        res.send({
          data: {
            status: "FAILED",
          },
        });
      }
    });

    await app.listen({ port: 3000 });
    console.log("🚀 Server listening to port 3000");
  } catch (e) {
    console.error(e);
  }
}

connectDb().then(() => {
  startApp();
});
