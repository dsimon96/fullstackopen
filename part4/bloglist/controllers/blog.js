const Blog = require("../models/blog");
const blogRouter = require("express").Router();
const { StatusCodes } = require("http-status-codes");

blogRouter.get("/", async (_, response) => {
  const blogs = await Blog.find({});
  return response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);
  const result = await blog.save();

  return response.status(StatusCodes.CREATED).json(result);
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
