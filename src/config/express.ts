import cors = require("cors");
import path = require("path");
import express = require("express");
import type { Application } from "express";
import * as bodyParser from "body-parser";
import compression = require("compression");
import rateLimit from "express-rate-limit";
import bearerToken = require("express-bearer-token");
import routes from "../api/routes/v1/index";
import * as error from "../api/utils/error";
import { config } from "./var";
import * as http from "http";
const { port } = config;

/**
 * express instance
 */
const app: Application = express();
const server = http.createServer(app);
const apiRequestLimiterAll = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 90000,
});
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(bodyParser.json({ limit: "5000mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "5000mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use(bearerToken());
app.use("/v1/", apiRequestLimiterAll);
app.use(cors(corsOptions));
app.use(compression()); // compress all responses
app.use("/v1", routes); // mount API v1 routes

app.use("/", express.static(path.join(__dirname, "../../build")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../build", "index.html"));
});

app.use(error.converter); // if error is not an instance of API error, convert it
app.use(error.notFound); // catch 404 and forward to error handler
app.use(error.handler); // error handler, send stacktrace only during development

server.listen(port);

export default app;
