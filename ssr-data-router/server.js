let path = require("path");
let fsp = require("fs/promises");
let fastify = require("fastify");

process.env.NODE_ENV = "production";

let root = process.cwd();
let isProduction = process.env.NODE_ENV === "production";

function resolve(p) {
  return path.resolve(__dirname, p);
}

async function createServer() {
  let app = fastify();
  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;

  if (!isProduction) {
    vite = await require("vite").createServer({
      root,
      server: { middlewareMode: "ssr" },
    });

    app.use(vite.middlewares);
  } else {
    app.use(require("compression")());
    app.register(require("fastify-static"), { root: resolve("dist/client") });
  }

  app.route({
    method: "*",
    url: "/",
    handler: async (req, res) => {
      let url = req.raw.originalUrl;

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
          res.header("Content-Type", "text/html");
          return res.status(200).send(html);
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
        res.status(500).send(error.stack);
      }
    },
  });

  return app;
}

if (require.main === module) {
  // called directly i.e. "node app"
  createServer().then((app) => {
    app.listen(3000, () => {
      console.log("HTTP server is running at http://localhost:3000");
    });
  });
} else {
  // required as a module => executed on aws lambda
  module.exports = createServer;
}
