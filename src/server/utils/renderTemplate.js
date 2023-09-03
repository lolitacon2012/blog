const fs = require("fs");
const path = require("path");

const NodeCache = require("node-cache");
const myCache = new NodeCache();

const { getPageFolderPath } = require("./mapRequestPathToFilePath");

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

const getPageData = (pageNameInput) => {
  let pageName = pageNameInput;
  const cacheResult = myCache.get(pageName);
  if (!isDev && cacheResult) {
    return cacheResult;
  }
  let body = "";
  let style = "";
  let script = "";
  let meta = {};
  if (!fs.existsSync(getPageFolderPath(pageName)) || !pageName) {
    pageName = "404";
  }
  try {
    body = fs.readFileSync(
      path.join(
        process.cwd(),
        `${getPageFolderPath(pageName)}/index.body.html`
      ),
      { encoding: "utf-8" }
    );
  } catch (e) {}
  try {
    style = fs.readFileSync(
      path.join(process.cwd(), `${getPageFolderPath(pageName)}/index.css`),
      { encoding: "utf-8" }
    );
  } catch (e) {}
  try {
    script = fs.readFileSync(
      path.join(process.cwd(), `${getPageFolderPath(pageName)}/index.js`),
      { encoding: "utf-8" }
    );
  } catch (e) {}
  try {
    meta = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), `${getPageFolderPath(pageName)}/meta.json`),
        { encoding: "utf-8" }
      )
    );
  } catch (e) {}
  !isDev && myCache.set(pageName, { ...meta, body, style, script }, 999999);
  return { ...meta, body, style, script };
};

const renderPage = (pageName) => {
  const cacheResult = myCache.get(`${pageName}-rendered`);
  if (!isDev && cacheResult) {
    return cacheResult;
  }
  const result = renderTemplate(getPageData(pageName));
  !isDev && myCache.set(`${pageName}-rendered`, result, 999999);
  return result;
};

module.exports = {
  renderPage,
  getPageData,
};
