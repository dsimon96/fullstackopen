const { StatusCodes } = require("http-status-codes");

const errorHandler = (error, request, response, next) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(error.message);
  }

  if (error.name === "ValidationError") {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: error.message });
  }

  return next(error);
};

module.exports = { errorHandler };
