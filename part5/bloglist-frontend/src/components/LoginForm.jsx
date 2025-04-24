import { useState } from "react";
import loginService from "../services/login";

const LoginForm = ({ user, handleLogin, handleLogout }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      setUsername("");
      setPassword("");
      handleLogin(user);
    } catch (error) {
      console.log(error);
    }
  };

  const loginForm = () => (
    <>
      <h2>log in to application</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  );

  const loggedInUserDisplay = () => (
    <p>
      {user.name} logged in <button onClick={handleLogout}>logout</button>
    </p>
  );

  return <>{user === null ? loginForm() : loggedInUserDisplay()}</>;
};

export default LoginForm;
