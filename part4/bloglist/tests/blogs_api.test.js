const { test, beforeEach, after, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const {
  initialBlogs,
  initialUsers,
  getAllBlogs,
  nonExistentId,
  getTokenFor,
} = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
  const userPromises = initialUsers.map((user) => new User(user).save());
  await Promise.all(userPromises);
  const blogPromises = initialBlogs.map((blog) => new Blog(blog).save());
  await Promise.all(blogPromises);
});

describe("getting all blogs", () => {
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

    assert.strictEqual(response.body.length, initialBlogs.length);
  });

  test("returned blogs have id property set correctly", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(StatusCodes.OK)
      .expect("Content-Type", /application\/json/);

    assert.ok(response.body.every((blog) => blog.id !== undefined));
  });
});

describe("adding a new blog", () => {
  test("a valid blog can be added", async () => {
    const blogsBefore = await getAllBlogs();

    const newBlog = {
      title: "My cool blog",
      author: "David Simon",
      url: "https://DavidSimon.tech",
      likes: 0,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${await getTokenFor("testuser")}`)
      .expect(StatusCodes.CREATED)
      .expect("Content-Type", /application\/json/);

    const blogsAfter = await getAllBlogs();
    assert.strictEqual(blogsAfter.length, blogsBefore.length + 1);
    const blog = blogsAfter.find((b) => b.title === newBlog.title);
    assert(blog !== undefined);
  });

  test("cannot add blog without authentication", async () => {
    const blogsBefore = await getAllBlogs();

    const newBlog = {
      title: "My cool blog",
      author: "David Simon",
      url: "https://DavidSimon.tech",
      likes: 0,
    };

    await api.post("/api/blogs").send(newBlog).expect(StatusCodes.UNAUTHORIZED);

    const blogsAfter = await getAllBlogs();
    assert.strictEqual(blogsAfter.length, blogsBefore.length);
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
      .set("Authorization", `Bearer ${await getTokenFor("testuser")}`)
      .expect(StatusCodes.CREATED)
      .expect("Content-Type", /application\/json/);

    const blogsAfter = await getAllBlogs();
    const blog = blogsAfter.find((b) => b.title === newBlog.title);
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
      .set("Authorization", `Bearer ${await getTokenFor("testuser")}`)
      .expect(StatusCodes.BAD_REQUEST);
    await api
      .post("/api/blogs")
      .send(blogWithoutUrl)
      .set("Authorization", `Bearer ${await getTokenFor("testuser")}`)
      .expect(StatusCodes.BAD_REQUEST);
  });
});

describe("deleting a blog", () => {
  test("can delete a blog", async () => {
    const blogsBefore = await getAllBlogs();
    const blogsToDelete = blogsBefore[0];

    await api
      .delete(`/api/blogs/${blogsToDelete.id}`)
      .set("Authorization", `Bearer ${await getTokenFor("testuser")}`)
      .expect(StatusCodes.NO_CONTENT);

    const blogsAfter = await getAllBlogs();
    assert.strictEqual(blogsAfter.length, blogsBefore.length - 1);
    const blog = blogsAfter.find((b) => b.id === blogsToDelete.id);
    assert.strictEqual(blog, undefined);
  });

  test("cannot delete a blog without authentication", async () => {
    const blogsBefore = await getAllBlogs();
    const blogsToDelete = blogsBefore[0];

    await api
      .delete(`/api/blogs/${blogsToDelete.id}`)
      .expect(StatusCodes.UNAUTHORIZED);

    const blogsAfter = await getAllBlogs();
    assert.strictEqual(blogsAfter.length, blogsBefore.length);
  });

  test("blog cannot be deleted by another user", async () => {
    const blogsBefore = await getAllBlogs();
    const blogsToDelete = blogsBefore[0];

    await api
      .delete(`/api/blogs/${blogsToDelete.id}`)
      .set("Authorization", `Bearer ${await getTokenFor("hellas")}`)
      .expect(StatusCodes.UNAUTHORIZED);

    const blogsAfter = await getAllBlogs();
    assert.strictEqual(blogsAfter.length, blogsBefore.length);
  });

  test("deletion of invalid blog id returns 404", async () => {
    const id = nonExistentId();
    await api
      .delete(`/api/blogs/${id}`)
      .set("Authorization", `Bearer ${await getTokenFor("testuser")}`)
      .expect(StatusCodes.NOT_FOUND);
  });
});

describe("updating a blog", () => {
  test("can update a blog", async () => {
    const blogsBefore = await getAllBlogs();
    const blogToUpdate = blogsBefore[0];

    const updatedBlog = {
      ...blogToUpdate,
      title: "New title",
      author: "New author",
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .set("Authorization", `Bearer ${await getTokenFor("testuser")}`)
      .expect(StatusCodes.OK);

    const blogsAfter = await getAllBlogs();
    assert.strictEqual(blogsAfter.length, blogsBefore.length);
    const blogAfter = blogsAfter.find((b) => b.id === blogToUpdate.id);
    assert.strictEqual(blogAfter.title, "New title");
    assert.strictEqual(blogAfter.author, "New author");
  });

  test("cannot update a blog with missing title or url", async () => {
    const blogsBefore = await getAllBlogs();
    const blogToUpdate = blogsBefore[0];

    const updatedBlogWithoutTitle = {
      ...blogToUpdate,
      title: "",
    };
    const updatedBlogWithoutUrl = {
      ...blogToUpdate,
      url: "",
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogWithoutTitle)
      .set("Authorization", `Bearer ${await getTokenFor("testuser")}`)
      .expect(StatusCodes.BAD_REQUEST);
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogWithoutUrl)
      .set("Authorization", `Bearer ${await getTokenFor("testuser")}`)
      .expect(StatusCodes.BAD_REQUEST);
  });

  test("cannot update a blog by another user", async () => {
    const blogsBefore = await getAllBlogs();
    const blogToUpdate = blogsBefore[0];

    const updatedBlog = {
      ...blogToUpdate,
      title: "New title",
      author: "New author",
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .set("Authorization", `Bearer ${await getTokenFor("hellas")}`)
      .expect(StatusCodes.UNAUTHORIZED);
  });

  test("updating a non-existent blog returns 404", async () => {
    const id = nonExistentId();
    await api
      .put(`/api/blogs/${id}`)
      .set("Authorization", `Bearer ${await getTokenFor("testuser")}`)
      .expect(StatusCodes.NOT_FOUND);
  });
});

after(async () => {
  await mongoose.connection.close();
});
