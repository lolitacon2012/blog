const fetchAvailable = !!fetch;
const loadClientPage = async (href, isPopState) => {
  let json = {};
  const cache = sessionStorage?.getItem(`client-page-data-${href}`);

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
      sessionStorage.setItem(`client-page-data-${href}`, JSON.stringify(json));
    }
  }
  if (json.data && !json.error) {
    document.title = json.data.title;
    document.getElementById("page-style").innerHTML = json.data.style;
    document.getElementById("page-stage").innerHTML = json.data.body;
    document.getElementById("page-script").remove();
    const newScript = document.createElement("script");
    newScript.setAttribute("id", "page-script");
    newScript.innerHTML = json.data.script;
    document.body.appendChild(newScript);
    !isPopState && history.pushState({}, "", href);
  } else {
    window.location.href = href;
  }
};

if (fetchAvailable) {
  document.body.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      e.preventDefault();
      const href = e.target.getAttribute("href");
      loadClientPage(href);
    }
  });
  addEventListener("popstate", function (e) {
    e.preventDefault();
    loadClientPage(location.pathname, true);
  });
  addEventListener("pushstate", function (e) {
    e.preventDefault();
    loadClientPage(location.pathname);
  });
}
