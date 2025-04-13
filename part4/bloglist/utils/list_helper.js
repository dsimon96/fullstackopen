const dummy = () => 1;

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favoriteBlog = (blogs) =>
  blogs.reduce(
    (cur, next) => (cur === null || next.likes > cur.likes ? next : cur),
    null
  );

const groupByAndMap = (blogs, mapFunction) => {
  const grouped = Object.groupBy(blogs, (blog) => blog.author);
  return Object.fromEntries(
    Object.entries(grouped).map(([author, blogs]) => [
      author,
      mapFunction(blogs),
    ])
  );
};

const maxEntryByValue = (object) =>
  Object.entries(object).reduce(
    (cur, next) => (cur === null || next[1] > cur[1] ? next : cur),
    null
  );

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const countByAuthor = groupByAndMap(blogs, (blogs) => blogs.length);

  const [author, count] = maxEntryByValue(countByAuthor);

  return { author, blogs: count };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  const likesByAuthor = groupByAndMap(blogs, (blogs) =>
    blogs.map((blog) => blog.likes).reduce((sum, likes) => sum + likes, 0)
  );

  const [author, likes] = maxEntryByValue(likesByAuthor);

  return { author, likes };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
