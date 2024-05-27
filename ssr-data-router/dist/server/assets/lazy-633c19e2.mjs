import { j as jsx, a as jsxs, F as Fragment } from "../entry.server.mjs";
import { useLoaderData } from "react-router-dom";
import "react/jsx-runtime";
import "react";
import "react-dom/server";
import "react-router-dom/server.mjs";
const loader = async () => {
  await new Promise((r) => setTimeout(r, 500));
  return {
    date: (/* @__PURE__ */ new Date()).toISOString()
  };
};
function LazyPage() {
  let data = useLoaderData();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("h2", { children: "Lazy Route" }),
    /* @__PURE__ */ jsxs("p", { children: [
      "Date from loader: ",
      data.date
    ] })
  ] });
}
const element = /* @__PURE__ */ jsx(LazyPage, {});
export {
  element,
  loader
};
