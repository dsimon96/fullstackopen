const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const helper = require("./test_helper");

test("dummy returns one", () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  test("of empty list is zero", () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test("when list has only one blog equals the likes of that", () => {
    const result = listHelper.totalLikes(helper.listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("of a bigger list is calculated right", () => {
    const result = listHelper.totalLikes(helper.initialBlogs);
    assert.strictEqual(result, 36);
  });
});

describe("favorite blog", () => {
  test("of empty list is null", () => {
    const result = listHelper.favoriteBlog([]);
    assert.strictEqual(result, null);
  });

  test("when list has only one blog, returns that blog", () => {
    const result = listHelper.favoriteBlog(helper.listWithOneBlog);
    assert.deepStrictEqual(result, helper.listWithOneBlog[0]);
  });

  test("when list has multiple blogs, return one that has the most likes", () => {
    const result = listHelper.favoriteBlog(helper.initialBlogs);
    const blogWithMostLikes = helper.initialBlogs[2];

    assert.deepStrictEqual(result, blogWithMostLikes);
  });
});

describe("most blogs", () => {
  test("of empty list is null", () => {
    const result = listHelper.mostBlogs([]);
    assert.strictEqual(result, null);
  });

  test("when list has only one blog, returns the author of that blog", () => {
    const result = listHelper.mostBlogs(helper.listWithOneBlog);
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", blogs: 1 });
  });

  test("when list has multiple blogs, returns the author with the most blogs", () => {
    const result = listHelper.mostBlogs(helper.initialBlogs);
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 3,
    });
  });
});

describe("most likes", () => {
  test("of empty list is null", () => {
    const result = listHelper.mostLikes([]);
    assert.strictEqual(result, null);
  });

  test("when list has only one blog, returns the author of that blog", () => {
    const result = listHelper.mostLikes(helper.listWithOneBlog);
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", likes: 5 });
  });

  test("when list has multiple blogs, returns the author with the most likes", () => {
    const result = listHelper.mostLikes(helper.initialBlogs);
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
