const Blog = require("../models/blog");
const User = require("../models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const listWithOneBlog = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 5,
    __v: 0,
    user: "68096237517d4781a83f0999",
  },
];

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
    user: "68096237517d4781a83f0999",
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
    user: "68096237517d4781a83f0999",
  },
  {
    _id: "5a422b341b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
    user: "68096237517d4781a83f0999",
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
    user: "68096237517d4781a83f0999",
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
    user: "68096237517d4781a83f0999",
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
    user: "68096237517d4781a83f0999",
  },
];

const getAllBlogs = async () => {
  const allBlogs = await Blog.find({});
  return allBlogs.map((blog) => blog.toJSON());
};

const nonExistentId = () => {
  return new mongoose.Types.ObjectId();
};

const initialUsers = [
  {
    _id: "68096237517d4781a83f0999",
    username: "testuser",
    name: "Test User",
    password: "abc123",
  },
  {
    _id: "68096237517d4781a83f099a",
    username: "hellas",
    name: "Hellas",
    password: "1234",
  },
  {
    _id: "68096237517d4781a83f099b",
    username: "mluukkai",
    name: "Matti Luukkai",
    password: "5678",
  },
];

const getAllUsers = async () => {
  const allUsers = await User.find({});
  return allUsers.map((user) => user.toJSON());
};

const getTokenFor = async (username) => {
  const testUser = await User.findOne({ username });
  return jwt.sign(
    { username: testUser.username, id: testUser._id },
    process.env.SECRET,
  );
};

module.exports = {
  initialBlogs,
  listWithOneBlog,
  getAllBlogs,
  nonExistentId,
  initialUsers,
  getAllUsers,
  getTokenFor,
};
