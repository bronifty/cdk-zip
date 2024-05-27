import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["app.js"],
  bundle: true,
  platform: "node",
  target: ["node20"],
  outfile: "out.js",
});
