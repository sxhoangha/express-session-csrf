const cookieParser = require("cookie-parser");
const { doubleCsrf } = require("csrf-csrf");
const session = require("express-session");

const cookieOptions = {
  sameSite: "lax",
  path: "/",
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
};

const CSRF_TOKEN_KEY = "csrfToken";

const csrfOptions = {
  getSecret: (req) => {
    console.log("getSecret", req.sessionID);
    return req.sessionID;
  }, //use sessionID as secret to generate csrf token
  cookieName: "__Host-psifi.x-csrf-token", //could change to something else
  cookieOptions,
  size: 64,
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  getTokenFromRequest: (req) => req.cookies[CSRF_TOKEN_KEY], //invoke on POST, PUT, PATCH, DELETE requests
};

const withSession = (app) => {
  app.use(
    session({
      secret: "secret", //should come from env
      resave: false,
      saveUninitialized: true,
      cookie: cookieOptions,
    })
  );
};

const withCookieParser = (app) => {
  app.use(cookieParser());
};

const withCsrf = (app) => {
  const { generateToken, doubleCsrfProtection } = doubleCsrf(csrfOptions);
  app.use(doubleCsrfProtection);
  app.use((req, res, next) => {
    const csrfToken = generateToken(res, req);
    res.cookie(CSRF_TOKEN_KEY, csrfToken, cookieOptions);
    next();
  });
};

module.exports = {
  withSession,
  withCookieParser,
  withCsrf,
};
