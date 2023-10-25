"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const server = require("react-dom/server");
const server_mjs = require("react-router-dom/server.mjs");
const reactRouterDom = require("react-router-dom");
const Page$2 = ({ data }) => {
  return /* @__PURE__ */ jsxRuntime.jsxs("main", { children: [
    /* @__PURE__ */ jsxRuntime.jsx("h1", { children: "Index" }),
    /* @__PURE__ */ jsxRuntime.jsx("pre", { children: JSON.stringify(data, null, 2) })
  ] });
};
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Page$2
}, Symbol.toStringTag, { value: "Module" }));
const Page$1 = ({ data }) => {
  return /* @__PURE__ */ jsxRuntime.jsxs("main", { children: [
    /* @__PURE__ */ jsxRuntime.jsx("h1", { children: "Page 2" }),
    /* @__PURE__ */ jsxRuntime.jsx("pre", { children: JSON.stringify(data, null, 2) })
  ] });
};
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Page$1
}, Symbol.toStringTag, { value: "Module" }));
const Page = () => {
  return /* @__PURE__ */ jsxRuntime.jsxs("main", { children: [
    /* @__PURE__ */ jsxRuntime.jsx("h1", { children: "Page 3" }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { children: "This page has no function" })
  ] });
};
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Page
}, Symbol.toStringTag, { value: "Module" }));
const pages = /* @__PURE__ */ Object.assign({ "./pages/index/page.jsx": __vite_glob_0_0, "./pages/page-2/page.jsx": __vite_glob_0_1, "./pages/page-3/page.jsx": __vite_glob_0_2 });
const routes = Object.keys(pages).map((path) => {
  const dir = path.split("/")[2];
  return {
    path: dir === "index" ? "/" : dir,
    element: pages[path].default
  };
});
const Router = ({ data }) => {
  if (typeof window !== "undefined") {
    data = window.__data__;
  }
  return /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Routes, { children: routes.map((route, index) => {
    const { path, element: Component } = route;
    return /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { path, element: /* @__PURE__ */ jsxRuntime.jsx(Component, { data: { data } }) }, index);
  }) });
};
const render = (url, data) => {
  return server.renderToString(
    /* @__PURE__ */ jsxRuntime.jsx(server_mjs.StaticRouter, { location: url, children: /* @__PURE__ */ jsxRuntime.jsx(Router, { data }) })
  );
};
exports.render = render;
