const getPageFolderPath = (pageName) => {
  if (pageName === "/") {
    return "src/pages/homepage";
  } else if (pageName?.[0] === "/") {
    return `src/pages${pageName || ""}`;
  } else {
    return `src/pages/${pageName || ""}`;
  }
};

module.exports = {
    getPageFolderPath,
};
