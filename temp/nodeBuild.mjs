import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["app.js", "lambda.js", "registerFastify.js"],
  bundle: true,
  format: "esm",
  platform: "node",
  target: ["node20"],
  outdir: "dist",
});
