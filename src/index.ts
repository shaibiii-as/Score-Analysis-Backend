import { connect } from "./config/mongoose";
import app from "./config/express";

app.set("view engine", "ejs");
connect();

export default app;
