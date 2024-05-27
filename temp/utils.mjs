import { fileURLToPath } from "node:url";
/** UTILS */

const appDir = new URL(".", import.meta.url);
const buildDir = new URL("./dist/", import.meta.url);

export function resolveApp(path = "") {
  return fileURLToPath(new URL(path, appDir));
}

export function resolveBuild(path = "") {
  return fileURLToPath(new URL(path, buildDir));
}

const reactComponentRegex = /\.jsx$/;
