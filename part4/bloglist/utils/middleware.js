const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const errorHandler = (error, _, response, next) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(error.message);
  } else if (error.name === "ValidationError") {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: error.message });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "expected `username` to be unique" });
  } else if (error.name === "JsonWebTokenError") {
    return response
      .status(StatusCodes.UNAUTHORIZED)
      .send({ error: "Invalid token" });
  }

  return next(error);
};

const tokenExtractor = (request, response, next) => {
  const authHeader = request.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    request.token = authHeader.replace("Bearer ", "");
  }

  return next();
};

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(StatusCodes.UNAUTHORIZED).json({
      error: "Invalid token",
    });
  }

  const user = await User.findById(decodedToken.id);
  if (!user) {
    return response.status(StatusCodes.UNAUTHORIZED).json({
      error: "Invalid user",
    });
  }

  request.user = user;

  return next();
};

module.exports = { errorHandler, tokenExtractor, userExtractor };
