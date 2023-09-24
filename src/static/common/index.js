const openDirectly = (href) => {
  if (
    href[0] !== "/" ||
    href.indexOf("/resources") === 0 ||
    href.indexOf("/assets") === 0
  ) {
    return true;
  } else {
    return false;
  }
};
const fetchAvailable = !!fetch;
const loadClientPage = async (href, isPopState) => {
  let json = {};
  // Disabled for now
  // const cache = sessionStorage?.getItem(`client-p-data-${href}`);
  const cache = undefined;
  if (sessionStorage && cache) {
    json = JSON.parse(cache);
  } else {
    const response = await fetch(
      `/api/fullPageData?path=${encodeURIComponent(href)}`,
      {
        method: "GET",
      }
    );
    json = await response.json();
    if (sessionStorage) {
      sessionStorage.setItem(`client-p-data-${href}`, JSON.stringify(json));
    }
  }
  if (json.data && !json.error) {
    document.title = json.data.title;
    document.getElementById("p-style").innerHTML = json.data.style;
    document.getElementById("p-stage").innerHTML = json.data.body;
    document.getElementById("p-script").remove();
    const newScript = document.createElement("script");
    newScript.setAttribute("id", "p-script");
    newScript.innerHTML = json.data.script;
    document.body.appendChild(newScript);
    !isPopState && history.pushState({}, "", href);
    // window.scrollTo({ top: 0 });
  } else {
    window.location.href = href;
  }
};

if (fetchAvailable) {
  document.body.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      const href = e.target.getAttribute("href");
      if (!openDirectly(href)) {
        e.preventDefault();
        loadClientPage(href);
      }
    } else {
      let parent = e.target.parentNode;
      while (parent?.tagName) {
        if (parent.tagName === "A") {
          const href = parent.getAttribute("href");
          if (!openDirectly(href)) {
            e.preventDefault();
            loadClientPage(href);
          }
          return;
        } else {
          parent = parent?.parentNode;
        }
      }
    }
  });
  addEventListener("popstate", function (e) {
    if (!openDirectly(location.pathname)) {
      e.preventDefault();
      loadClientPage(location.pathname, true);
    }
  });
  addEventListener("pushstate", function (e) {
    if (!openDirectly(location.pathname)) {
      e.preventDefault();
      loadClientPage(location.pathname);
    }
  });
}
