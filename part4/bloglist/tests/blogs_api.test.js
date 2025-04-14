const { test, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const { StatusCodes } = require("http-status-codes");
const { blogs } = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  const promises = blogs.map((blog) => new Blog(blog).save());
  await Promise.all(promises);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(StatusCodes.OK)
    .expect("Content-Type", /application\/json/);
});

test("correct number of blogs are returned", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(StatusCodes.OK)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.length, blogs.length);
});

test("returned blogs have id property set correctly", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(StatusCodes.OK)
    .expect("Content-Type", /application\/json/);

  assert.ok(response.body.every((blog) => blog.id !== undefined));
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "My cool blog",
    author: "David Simon",
    url: "https://DavidSimon.tech",
    likes: 0,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(StatusCodes.CREATED)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  const blog = response.body.find((b) => b.title === newBlog.title);
  assert(blog !== undefined);

  assert.strictEqual(response.body.length, blogs.length + 1);
});

test("a blog without likes defaults to 0", async () => {
  const newBlog = {
    title: "My cool blog",
    author: "David Simon",
    url: "https://DavidSimon.tech",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(StatusCodes.CREATED)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  const blog = response.body.find((b) => b.title === newBlog.title);
  assert.strictEqual(blog.likes, 0);
});

test("cannot add blog with missing title or url", async () => {
  const blogWithoutTitle = {
    author: "David Simon",
    url: "https://DavidSimon.tech",
    likes: 0,
  };
  const blogWithoutUrl = {
    title: "My cool blog",
    author: "David Simon",
    likes: 0,
  };

  await api
    .post("/api/blogs")
    .send(blogWithoutTitle)
    .expect(StatusCodes.BAD_REQUEST);
  await api
    .post("/api/blogs")
    .send(blogWithoutUrl)
    .expect(StatusCodes.BAD_REQUEST);
});

after(async () => {
  await mongoose.connection.close();
});
