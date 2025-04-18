const config = require("./utils/config");
const express = require("express");
const mongoose = require("mongoose");
const blogRouter = require("./controllers/blog");
const { errorHandler } = require("./utils/middleware");
const app = express();

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl);

app.use(express.json());

app.use("/api/blogs", blogRouter);

app.use(errorHandler);

module.exports = app;
