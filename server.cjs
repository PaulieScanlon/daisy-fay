"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
const fs = require("fs");
const express = require("express");
const path = require("path");
const url = require("url");
var _documentCurrentScript = typeof document !== "undefined" ? document.currentScript : null;
const exists = (file) => {
  return fs.existsSync(file);
};
const resolve = (file, url$1) => {
  return path.resolve(path.dirname(url.fileURLToPath(url$1)), file);
};
const app = express();
const createServer = async () => {
  let template, render, serverFile, serverFunction, serverData;
  app.use((await import("compression")).default());
  app.use(
    (await import("serve-static")).default(resolve("dist/client", typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.src || new URL("server.cjs", document.baseURI).href), {
      index: false
    })
  );
  app.use("*", async (req, res) => {
    const url2 = req.originalUrl;
    const safeUrl = url2 === "/" ? "/index" : req.originalUrl;
    try {
      template = fs.readFileSync(resolve("./dist/client/index.html", typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.src || new URL("server.cjs", document.baseURI).href), "utf-8");
      render = (await Promise.resolve().then(() => require("./assets/entry-server-5790ed5d.cjs"))).render;
      serverFile = `./dist/functions${safeUrl}/function.js`;
      if (exists(serverFile)) {
        serverFunction = (await import(serverFile)).GET;
        serverData = await serverFunction();
      }
      const dom = render(url2, serverData);
      const script = `<script>window.__data__=${JSON.stringify(serverData)}<\/script>`;
      const html = template.replace(`<!--ssr-outlet-->`, `${dom} ${script}`);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (event) {
      console.log(event.stack);
      res.status(500).end(event.stack);
    }
  });
};
createServer();
if (process.env.NODE_ENV === "preview") {
  app.listen(5173, () => {
    console.log("http://localhost:5173");
  });
}
module.exports = app;
