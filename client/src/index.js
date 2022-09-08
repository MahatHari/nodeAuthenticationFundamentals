import https from "https";
import fastify from "fastify";
import { fetch } from "cross-fetch";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();
async function statrtApp() {
  try {
    app.register(fastifyStatic, {
      root: path.join(__dirname, "public"),
    });

    app.get("/verify/:email/:token", {}, async (req, res) => {
      try {
        const { email, token } = req.params;
        const values = { email, token };

        const httpsAgent = new https.Agent({
          rejectUnauthorized: false,
        });
        const result = await fetch("https://api.hari.dev/verify", {
          method: "POST",
          body: JSON.stringify(values),
          credentials: "include",
          agent: httpsAgent,
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        console.log(result.status, result.statusText);
        console.log(result);
        if (result.status === 200) {
          return res.redirect("/");
        }
        return res.code(401).send();
      } catch (error) {
        console.error(error);
        return res.code(401).send();
      }
    });
    app.get("/reset-password/:email/:expTime/:token", {}, async (req, res) => {
      return res.sendFile("reset.html");
    });

    const PORT = 3002;
    await app.listen({ port: PORT });
    console.log(`Listening at point ${PORT}`);
  } catch (error) {
    console.error(error);
  }
}

statrtApp();
