const { test, beforeEach, after, describe } = require("node:test");
const app = require("../app");
const supertest = require("supertest");
const User = require("../models/user");
const { initialUsers, getAllUsers } = require("./test_helper");
const { StatusCodes } = require("http-status-codes");
const assert = require("node:assert");
const mongoose = require("mongoose");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  const promises = initialUsers.map((user) => new User(user).save());
  await Promise.all(promises);
});

describe("getting all users", () => {
  test("users are returned as json", async () => {
    await api
      .get("/api/users")
      .expect(StatusCodes.OK)
      .expect("Content-Type", /application\/json/);
  });

  test("correct number of users are returned", async () => {
    const response = await api
      .get("/api/users")
      .expect(StatusCodes.OK)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.length, initialUsers.length);
  });
});

describe("adding a new user", () => {
  test("a valid user can be added", async () => {
    const usersBefore = await getAllUsers();

    const newUser = {
      username: "newuser",
      name: "New User",
      password: "1234",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(StatusCodes.CREATED)
      .expect("Content-Type", /application\/json/);

    const usersAfter = await getAllUsers();
    assert.strictEqual(usersAfter.length, usersBefore.length + 1);
  });

  test("cannot add user with missing username or password", async () => {
    const usersBefore = await getAllUsers();

    const userWithoutUsername = {
      name: "New User",
      password: "1234",
    };
    const userWithoutPassword = {
      username: "newuser",
      name: "New User",
    };

    await api
      .post("/api/users")
      .send(userWithoutUsername)
      .expect(StatusCodes.BAD_REQUEST);
    await api
      .post("/api/users")
      .send(userWithoutPassword)
      .expect(StatusCodes.BAD_REQUEST);

    const usersAfter = await getAllUsers();
    assert.strictEqual(usersAfter.length, usersBefore.length);
  });

  test("cannot add user with too-short username or password", async () => {
    const usersBefore = await getAllUsers();

    const userTooShortUsername = {
      username: "a",
      name: "New User",
      password: "1234",
    };
    const userTooShortPassword = {
      username: "newuser",
      name: "New User",
      password: "12",
    };

    await api
      .post("/api/users")
      .send(userTooShortUsername)
      .expect(StatusCodes.BAD_REQUEST);
    await api
      .post("/api/users")
      .send(userTooShortPassword)
      .expect(StatusCodes.BAD_REQUEST);

    const usersAfter = await getAllUsers();
    assert.strictEqual(usersAfter.length, usersBefore.length);
  });

  test("cannot add user with duplicate username", async () => {
    const usersBefore = await getAllUsers();

    const userWithDuplicateUsername = {
      username: initialUsers[0].username,
      name: "New User",
      password: "1234",
    };

    await api
      .post("/api/users")
      .send(userWithDuplicateUsername)
      .expect(StatusCodes.BAD_REQUEST);

    const usersAfter = await getAllUsers();
    assert.strictEqual(usersAfter.length, usersBefore.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
