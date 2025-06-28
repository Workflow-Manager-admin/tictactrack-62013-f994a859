import React, { createContext, useState, useEffect, useContext } from "react";

// Define context
const AuthContext = createContext();

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Try to load user from local storage/session on mount
  useEffect(() => {
    const stored = localStorage.getItem("tic_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  // PUBLIC_INTERFACE
  const login = async (username, password) => {
    // Call backend
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();
    setUser(data.user);
    localStorage.setItem("tic_user", JSON.stringify(data.user));
    localStorage.setItem("tic_token", data.access_token);
    return data.user;
  };

  // PUBLIC_INTERFACE
  const signup = async (username, password) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error("Signup failed");
    const data = await res.json();
    setUser(data.user);
    localStorage.setItem("tic_user", JSON.stringify(data.user));
    localStorage.setItem("tic_token", data.access_token);
    return data.user;
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    setUser(null);
    localStorage.removeItem("tic_user");
    localStorage.removeItem("tic_token");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
