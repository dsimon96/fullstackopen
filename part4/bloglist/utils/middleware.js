const { StatusCodes } = require("http-status-codes");

const errorHandler = (error, request, response, next) => {
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

  next();
};

module.exports = { errorHandler, tokenExtractor };
