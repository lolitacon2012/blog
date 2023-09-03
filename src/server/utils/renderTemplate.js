const { error } = require("console");
const fs = require("fs");
const path = require("path");

const NodeCache = require("node-cache");
const myCache = new NodeCache();

const template = fs.readFileSync(
  path.join(process.cwd(), "src/page_templates/index.template.html"),
  { encoding: "utf-8" }
);

const isDev = process.env.NODE_ENV === "development";

const renderTemplate = (data) => {
  const keys = Object.keys(data || {});
  let result = template;
  keys.forEach((key) => {
    const value = data[key] || "";
    result = result.replace(`{{${key}}}`, value);
  });
  return result;
};

const renderPage = (pageName) => {
  const cacheResult = myCache.get(pageName);
  if (!isDev && cacheResult) {
    return cacheResult;
  }
  let body = "";
  let style = "";
  let script = "";
  let meta = {};
  if (!fs.existsSync(`src/pages/${pageName}`)) {
    throw new error("Page does not exist.");
  }
  try {
    body = fs.readFileSync(
      path.join(process.cwd(), `src/pages/${pageName}/index.body.html`),
      { encoding: "utf-8" }
    );
  } catch (e) {}
  try {
    style = fs.readFileSync(
      path.join(process.cwd(), `src/pages/${pageName}/index.css`),
      { encoding: "utf-8" }
    );
  } catch (e) {}
  try {
    script = fs.readFileSync(
      path.join(process.cwd(), `src/pages/${pageName}/index.js`),
      { encoding: "utf-8" }
    );
  } catch (e) {}
  try {
    meta = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), `src/pages/${pageName}/meta.json`),
        { encoding: "utf-8" }
      )
    );
  } catch (e) {}
  const result = renderTemplate({ ...meta, body, style, script });
  !isDev && myCache.set(pageName, result, 999999);
  return result;
};

module.exports = {
  renderPage,
};
