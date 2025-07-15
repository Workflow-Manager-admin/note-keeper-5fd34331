import React, { useState } from "react";
import "./AuthForm.css";

/**
 * AuthForm for login/register
 * Props:
 * - onAuth: function(email, password, mode), mode: 'login' | 'register'
 * - loading: boolean
 * - error: string
 */
 // PUBLIC_INTERFACE
export default function AuthForm({ onAuth, loading, error }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const switchMode = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuth(email, password, mode);
  };

  return (
    <div className="authform">
      <div className="authform-card">
        <div className="authform-title">
          {mode === "login" ? "Sign In" : "Register"}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            className="authform-input"
            type="email"
            placeholder="Email"
            value={email}
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="authform-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={4}
          />
          <button className="authform-btn" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Sign In"
              : "Register"}
          </button>
        </form>
        <div className="authform-foot">
          <span>
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
          </span>
          <button className="authform-link" onClick={switchMode}>
            {mode === "login" ? "Register" : "Sign In"}
          </button>
        </div>
        {error && <div className="authform-error">{error}</div>}
      </div>
    </div>
  );
}
