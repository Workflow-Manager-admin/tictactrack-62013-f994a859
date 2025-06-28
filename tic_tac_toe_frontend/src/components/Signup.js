import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";

// PUBLIC_INTERFACE
const Signup = () => {
  const { signup } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setErr("");
    try {
      await signup(username, password);
      navigate("/");
    } catch (err) {
      setErr("Signup failed.");
    }
  };

  return (
    <div className="center-box auth-box">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input required autoFocus type="text" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input required type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-large" type="submit">Register</button>
      </form>
      {err && <div className="error">{err}</div>}
      <p>Have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Signup;
