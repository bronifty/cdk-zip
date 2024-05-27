import path from "node:path";
import fsp from "node:fs/promises";
import express from "express";
import fastify from "fastify";
import { createServer as createViteServer } from "vite";
import compression from "compression";
// import { tsImport } from "tsx/esm/api";

const router = express.Router();

process.env.NODE_ENV = "production";

let root = process.cwd();
let isProduction = process.env.NODE_ENV === "production";

function resolve(p) {
  return path.join(import.meta.dirname, p);
}

async function createServer() {
  // let app = express();
  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;

  if (!isProduction) {
    vite = await createViteServer({
      root,
      server: { middlewareMode: "ssr" },
    });

    router.use(vite.middlewares);
  } else {
    router.use(compression());
    router.use(express.static(resolve("dist/client")));
  }

  router.use("*", async (req, res) => {
    let url = req.originalUrl;

    try {
      let template;
      let render;

      if (!isProduction) {
        template = await fsp.readFile(resolve("index.html"), "utf8");
        template = await vite.transformIndexHtml(url, template);
        render = await vite
          .ssrLoadModule("src/entry.server.tsx")
          .then((m) => m.render);
      } else {
        template = await fsp.readFile(
          resolve("dist/client/index.html"),
          "utf8"
        );

        template = await fsp.readFile(
          resolve("dist/client/index.html"),
          "utf8"
        );
        render = import(resolve("dist/server/entry.server.mjs")).then(
          (data) => data.render
        );
      }

      try {
        let appHtml = await render(req, res);
        let html = template.replace("<!--app-html-->", appHtml);
        res.setHeader("Content-Type", "text/html");
        return res.status(200).end(html);
      } catch (e) {
        if (e instanceof Response && e.status >= 300 && e.status <= 399) {
          return res.redirect(e.status, e.headers.get("Location"));
        }
        throw e;
      }
    } catch (error) {
      if (!isProduction) {
        vite.ssrFixStacktrace(error);
      }
      console.log(error.stack);
      res.status(500).end(error.stack);
    }
  });

  const registerFastify = await import("./registerFastify.js", import.meta.url);
  const fastify = registerFastify(router);
  return fastify;
}

if (require.main === module) {
  // called directly i.e. "node app"
  createServer().then((fastify) => {
    fastify.listen({ port: 3000 }, () => console.log("listening on port 3000"));
  });
}
export { createServer };

// import https from "https";
// function fetchData(url) {
//   return new Promise((resolve, reject) => {
//     https.get(url, (res) => {
//       let data = "";
//       res.on("data", (chunk) => {
//         data += chunk;
//       });
//       res.on("end", () => {
//         resolve(data);
//       });
//       res.on("error", (err) => {
//         reject(err);
//       });
//     });
//   });
// }
// // Usage
// fetchData("https://domain.tld/file.js")
//   .then((data) => {
//     console.log(data); // Process data here
//   })
//   .catch((error) => {
//     console.error("Error fetching data:", error);
//   });
