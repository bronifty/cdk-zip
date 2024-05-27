var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// registerFastify.js
var require_registerFastify = __commonJS({
  "registerFastify.js"() {
    "use strict";
  }
});

// app.js
import path from "node:path";
import fsp from "node:fs/promises";
import express from "express";
import { createServer as createViteServer } from "vite";
import compression from "compression";
var router = express.Router();
process.env.NODE_ENV = "production";
var root = process.cwd();
var isProduction = false;
function resolve(p) {
  return path.join(import.meta.dirname, p);
}
async function createServer() {
  let vite;
  if (!isProduction) {
    vite = await createViteServer({
      root,
      server: { middlewareMode: "ssr" }
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
        render = await vite.ssrLoadModule("src/entry.server.tsx").then((m) => m.render);
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
  const registerFastify = await Promise.resolve().then(() => __toESM(require_registerFastify()));
  const fastify = registerFastify(router);
  return fastify;
}
if (__require.main === module) {
  createServer().then((fastify) => {
    fastify.listen({ port: 3e3 }, () => console.log("listening on port 3000"));
  });
}
export {
  createServer
};
