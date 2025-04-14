const Blog = require("../models/blog");
const blogRouter = require("express").Router();
const { StatusCodes } = require("http-status-codes");

blogRouter.get("/", async (_, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);
  const result = await blog.save();

  response.status(StatusCodes.CREATED).json(result);
});

module.exports = blogRouter;
