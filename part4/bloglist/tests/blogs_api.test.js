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

after(async () => {
  await mongoose.connection.close();
});
