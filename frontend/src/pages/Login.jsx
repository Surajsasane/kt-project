import React, { useState } from "react";
import axios from "axios";
import API_URL from "../config/api";

export default function Login({ onLogin }) {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!loginId || !password) {
      alert("Enter credentials");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        login_id: loginId,
        password: password,
      });

      if (res.data.success) {
        onLogin();
      }
    } catch (err) {
      alert("Invalid Login");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Employee Knowledge System</h2>

        <input
          type="text"
          placeholder="Login ID"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}