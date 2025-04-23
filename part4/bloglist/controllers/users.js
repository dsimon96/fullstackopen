const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");

const usersRouter = require("express").Router();

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  return response.json(users);
});

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (password === undefined || password.length < 3) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "password must be at least 3 characters long" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  return response.status(StatusCodes.CREATED).json(savedUser);
});

module.exports = usersRouter;
