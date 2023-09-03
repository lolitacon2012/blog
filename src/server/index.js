const Koa = require("koa");
const Router = require("@koa/router");
const fs = require("fs");
const path = require("path");
const koaSend = require("koa-send");

const oneDayMs = 1000 * 60 * 60 * 24;
const oneYearMs = oneDayMs * 365;

const { renderPage } = require("./utils/renderTemplate");

const app = new Koa();
const router = new Router();

router.get("/", (ctx) => {
  ctx.body = renderPage("homepage");
});

router.get(["/assets/(.*)", "/favicon.ico"], async (ctx, next) => {
  let url = ctx.req.url;
  if (url === "/favicon.ico") {
    url = "/assets/favicon.ico"
  }
  const filePath = url.replace("/assets/", "/src/static/");
  if (fs.existsSync(path.join(process.cwd(), filePath))) {
    return koaSend(ctx, filePath, {
      root: "",
      immutable: true,
      maxAge: oneYearMs,
    });
  } else {
    // 404
    next();
  }
});

router.get("(.*)", (ctx, next) => {
  ctx.body = renderPage("404");
  next();
});

// response
app.use(router.routes()).use(router.allowedMethods());

app.listen(3001);
