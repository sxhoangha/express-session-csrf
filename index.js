const express = require("express");
const {
  withSession,
  withCookieParser,
  withCsrf,
} = require("./middlewareConfig");

const app = express();

//configure middleware
withSession(app);
withCookieParser(app);
withCsrf(app);

app.post("*", (req, res) => {
  res.send("POST request received");
});

app.all("*", (req, res) => {
  res.send("GET request received");
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
