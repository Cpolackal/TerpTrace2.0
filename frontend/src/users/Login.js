import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithEmail, loginWithGoogle } from "../users/auth";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const user = await loginWithEmail(email, password);
      console.log("Login successful:", user);
      navigate("/account");
    } catch (error) {
      console.error("Login failed:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setIsLoading(true);
    setError("");

    try {
      const user = await loginWithGoogle();
      console.log("Google login successful:", user);
      navigate("/account");
    } catch (error) {
      console.error("Google login failed:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your TerpTrace account</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <button
            type="button"
            className={`google-login-button ${isLoading ? "loading" : ""}`}
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <div className="google-icon">G</div>
            Sign in with Google
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <div className="login-input-group">
            <input
              type="email"
              className="login-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="login-input-group">
            <input
              type="password"
              className="login-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={`login-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="login-footer">
          <p className="login-footer-text">
            Don't have an account?{" "}
            <a href="/register" className="login-link">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
