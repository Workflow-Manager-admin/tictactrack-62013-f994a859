import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";

// PUBLIC_INTERFACE
const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setErr("");
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setErr("Invalid credentials.");
    }
  };

  return (
    <div className="center-box auth-box">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input required autoFocus type="text" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input required type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-large" type="submit">Sign In</button>
      </form>
      {err && <div className="error">{err}</div>}
      <p>No account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
};

export default Login;
