const fs = require("fs");
const path = require("path");

const { cache: myCache } = require("./cache");

const { getPageFolderPath } = require("./mapRequestPathToFilePath");
const { generateItem } = require("./renderResourceBrowser");
const isDev = process.env.NODE_ENV === "development";
const cacheTime = isDev ? 5 : 60;

const getTemplate = () =>
  fs.readFileSync(
    path.join(process.cwd(), "src/page_templates/index.template.html"),
    { encoding: "utf-8" }
  );

const template = getTemplate();

const renderTemplate = (data) => {
  const keys = Object.keys(data || {});
  let result = isDev ? getTemplate() : template;
  keys.forEach((key) => {
    const value = data[key] || "";
    result = result.replaceAll(`{{${key}}}`, value);
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
  myCache.set(pageName, { ...meta, body, style, script }, cacheTime);
  return { ...meta, body, style, script };
};

const renderPage = (pageName) => {
  const cacheResult = myCache.get(`${pageName}-rendered`);
  if (!isDev && cacheResult) {
    return cacheResult;
  }
  const result = renderTemplate(getPageData(pageName));
  !isDev && myCache.set(`${pageName}-rendered`, result, cacheTime);
  return result;
};

const getResourcePageData = (pathUrl) => {
  try {
    let convertedPathUrl = decodeURIComponent(
      pathUrl.replace("/resources", "").replaceAll("..", "")
    );
    if (convertedPathUrl?.[convertedPathUrl?.length - 1] !== "/") {
      convertedPathUrl += "/";
    }
    const title = `资料库 - ${convertedPathUrl}`;
    const everything = fs.readdirSync(
      path.join(process.cwd(), `src/static/resources${convertedPathUrl}`),
      { withFileTypes: true, encoding: "utf-8" }
    );
    const allDirs = everything
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) =>
        generateItem(
          `/resources${convertedPathUrl}${dirent.name}`,
          dirent.name,
          true
        )
      );
    const allFiles = everything
      .filter((dirent) => dirent.isFile())
      .map((dirent) => {
        if (dirent.name?.indexOf(".url") === dirent.name?.length - 4) {
          try {
            const data = JSON.parse(
              fs.readFileSync(
                path.join(
                  process.cwd(),
                  `src/static/resources${convertedPathUrl}${dirent.name}`
                ),
                {
                  encoding: "utf-8",
                }
              )
            );
            return generateItem(
              data.url,
              dirent.name.replace(".url", ""),
              false,
              true
            );
          } catch (e) {}
        } else {
          return generateItem(
            `/resources${convertedPathUrl}${dirent.name}`,
            dirent.name,
            false
          );
        }
      });
    return {
      ...getPageData("resources"),
      title,
      body: `<h1>${title}</h1> <div class="resource-container">${allDirs.join(
        ""
      )}${allFiles.join("")}</div>`,
    };
  } catch (e) {
    console.error(e);
    return getPageData("404");
  }
};

const renderResourceBrowser = (path) => {
  const cacheResult = myCache.get(`resources-${path}-rendered`);
  if (!isDev && cacheResult) {
    return cacheResult;
  }
  const result = renderTemplate(getResourcePageData(path));
  !isDev && myCache.set(`resources-${path}-rendered`, result, cacheTime);
  return result;
};

module.exports = {
  renderPage,
  getPageData,
  renderResourceBrowser,
};
