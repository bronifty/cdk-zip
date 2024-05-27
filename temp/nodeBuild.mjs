import * as esbuild from "esbuild";
import { resolveApp, resolveBuild } from "./utils.mjs";

// await esbuild.build({
//   entryPoints: ["app.js", "lambda.js", "registerFastify.js"],
//   bundle: true,
//   format: "esm",
//   platform: "node",
//   target: ["node20"],
//   outdir: "dist",
//   external: ["node_modules"],
// });

/** Build the server component tree */
await esbuild.build({
  bundle: true,
  format: "esm",
  logLevel: "error",
  entryPoints: [
    resolveApp("app.js"),
    resolveApp("lambda.js"),
    resolveApp("registerFastify.js"),
  ],
  outdir: resolveBuild(),
  // avoid bundling npm packages for server-side components
  packages: "external",
});
