const Blog = require("../models/blog");
const blogRouter = require("express").Router();

blogRouter.get("/", async (_, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouter.post("/", (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

module.exports = blogRouter;
