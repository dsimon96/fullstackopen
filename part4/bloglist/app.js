const config = require("./utils/config");
const express = require("express");
const mongoose = require("mongoose");
const blogRouter = require("./controllers/blog");
const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const { errorHandler, tokenExtractor } = require("./utils/middleware");
const app = express();

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl);

app.use(express.json());
app.use(tokenExtractor);

app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

app.use(errorHandler);

module.exports = app;
