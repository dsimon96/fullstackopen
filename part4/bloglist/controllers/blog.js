const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const blogRouter = require("express").Router();
const { StatusCodes } = require("http-status-codes");
const { userExtractor } = require("../utils/middleware");

blogRouter.get("/", async (_, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  return response.json(blogs);
});

blogRouter.post("/", userExtractor, async (request, response) => {
  const { title, url, author, likes } = request.body;
  const user = request.user;
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

blogRouter.delete("/:id", userExtractor, async (request, response) => {
  const user = request.user;
  const blogToDelete = await Blog.findById(request.params.id);
  if (!blogToDelete) {
    return response
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "Blog not found" });
  } else if (blogToDelete.user.toString() !== user.id.toString()) {
    return response.status(StatusCodes.UNAUTHORIZED).json({
      error: "User not authorized to delete this blog",
    });
  }

  await blogToDelete.deleteOne();
  user.blogs = user.blogs.filter(
    (blog) => blog.toString() !== blogToDelete.id.toString(),
  );
  await user.save();

  return response.status(StatusCodes.NO_CONTENT).end();
});

blogRouter.put("/:id", userExtractor, async (request, response) => {
  const user = request.user;
  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "Blog not found" });
  } else if (blog.user.toString() !== user.id.toString()) {
    return response.status(StatusCodes.UNAUTHORIZED).json({
      error: "User not authorized to update this blog",
    });
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true, runValidators: true },
  );

  return response.json(updatedBlog);
});

module.exports = blogRouter;
