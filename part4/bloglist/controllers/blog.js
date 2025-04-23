const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");
const blogRouter = require("express").Router();
const { StatusCodes } = require("http-status-codes");

blogRouter.get("/", async (_, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  return response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  const { title, url, author, likes } = request.body;
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

  const blog = new Blog({
    title,
    url,
    author,
    likes,
    user: user.id,
  });
  const savedNote = await blog.save();
  user.blogs = user.blogs.concat(savedNote);
  await user.save();

  return response.status(StatusCodes.CREATED).json(savedNote);
});

blogRouter.delete("/:id", async (request, response) => {
  const result = await Blog.findByIdAndDelete(request.params.id);

  if (!result) {
    return response
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "Blog not found" });
  }

  return response.status(StatusCodes.NO_CONTENT).end();
});

blogRouter.put("/:id", async (request, response) => {
  const blog = await Blog.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
  });

  if (!blog) {
    return response
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "Blog not found" });
  }

  return response.json(blog);
});

module.exports = blogRouter;
