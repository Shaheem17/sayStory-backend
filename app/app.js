const app = require("./server");
const helmet = require("helmet");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mime = require("mime-types");
const config = require("config");
const serverConfig = config.get("server");

//Add app features
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public", { setHeaders: setCustomXssControl }));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"), {
    setHeaders: setCustomXssControl,
  })
);
app.use(
  "/importationLogs",
  express.static(path.join(__dirname, "../importationLogs"), {
    setHeaders: setCustomXssControl,
  })
);

/*
 * Initialize Application routes
 */
app.all("/*", (req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    serverConfig.env !== "development" ? "SAMEORIGIN" : "*"
  );
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "content-type, Authorization");
  next();
});

if (serverConfig.env !== "development") {
  //helmet
  app.use(helmet());
  app.use(helmet.noCache());
  app.disable("x-powered-by");
  app.all("/*", function (req, res, next) {
    setAPIHeaderAccessControl(res);
    next();
  });
}

function setCustomXssControl(res, path) {
  if (serverConfig.env === "development") {
    return;
  }
  if (path && mime.lookup(path) === "text/html") {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("XPragma", "no-cache");
    res.setHeader("Expires", "0");
  } else {
    // Set cache of 30 days in assets
    res.setHeader("Cache-Control", `public, max-age=${86400000 * 30}`);
  }
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-Content-Type-Options", "nosniff");
}

function setAPIHeaderAccessControl(res) {
  if (serverConfig.env === "development") {
    return;
  }
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("XPragma", "no-cache");
  res.setHeader("Expires", "0");
}

/* router initialization */
const router = require("../routes/router");
app.use("/", router);

//unhandled rejection
process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled", reason, p); // log all your errors, 'unsuppressing' them.
});

// catch 404 and forward to error handler
app.use((req, res) => {
  return res.sendStatus(404);
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = config.session.secure ? err : {};

  // render the error page
  res.status(err.status || 500);
});

//exports app
// app.use(cors());
module.exports = app;
