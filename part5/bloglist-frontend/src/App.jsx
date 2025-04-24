import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import LoginForm from "./components/LoginForm";
import CreateBlogForm from "./components/CreateBlogForm";
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem("loggedInUser");
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = (user) => {
    setUser(user);
    window.localStorage.setItem("loggedInUser", JSON.stringify(user));
    blogService.setToken(user.token);
  };

  const handleFailedLogin = () => {
    setNotification({
      type: "error",
      message: "wrong username or password",
    });

    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem("loggedInUser");
    blogService.setToken(null);
  };

  const handleCreate = (blog) => {
    setBlogs(blogs.concat(blog));
    setNotification({
      type: "success",
      message: `a new blog ${blog.title} by ${blog.author} added`,
    });

    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  return (
    <>
      <h2>{user === null ? "log in to application" : "blogs"}</h2>
      <Notification notification={notification} />
      <LoginForm
        user={user}
        handleLogin={handleLogin}
        handleFailedLogin={handleFailedLogin}
        handleLogout={handleLogout}
      />
      {user && <CreateBlogForm handleCreate={handleCreate} />}
      {user && (
        <>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </>
      )}
    </>
  );
};

export default App;
