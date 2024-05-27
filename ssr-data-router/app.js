let path = require("path");
let fsp = require("fs/promises");
let express = require("express");
const fastify = require("fastify")();
const router = express.Router();

process.env.NODE_ENV = "production";

let root = process.cwd();
let isProduction = process.env.NODE_ENV === "production";

function resolve(p) {
  return path.resolve(__dirname, p);
}

async function createServer() {
  // let app = express();
  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;

  if (!isProduction) {
    vite = await require("vite").createServer({
      root,
      server: { middlewareMode: "ssr" },
    });

    router.use(vite.middlewares);
  } else {
    router.use(require("compression")());
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
        render = require(resolve("dist/server/entry.server.mjs")).render;
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
  fastify.register(require("@fastify/express")).after(() => {
    fastify.use(express.urlencoded({ extended: false })); // for Postman x-www-form-urlencoded
    fastify.use(express.json());

    fastify.use(router);
  });
  return fastify;
}

if (require.main === module) {
  // called directly i.e. "node app"
  createServer().then((fastify) => {
    fastify.listen({ port: 3000 }, () => console.log("listening on port 3000"));
  });
} else {
  // required as a module => executed on aws lambda
  module.exports = createServer;
}
