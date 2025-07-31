import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerWithEmail, loginWithGoogle } from "../users/auth";
import { getAuth, validatePassword } from "firebase/auth";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await registerWithEmail(email, password);
      const user = userCredential.user;
      console.log("Registration successful:", user);
      
      await fetch("http://localhost:5001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          firstName: firstName,
          lastName: lastName
        })
      }) 

      navigate("/"); // redirect after successful registration
    } catch (error) {
      console.error("Registration failed:");
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handlePasswordValidation = () => {
    const isValid = validatePassword(password);
    if (!isValid) {
      setError("Password must contain at least 6 characters, Password must contain an upper case character, Password must contain a non-alphanumeric character");
    }
  };

  async function handleGoogleRegister() {
    setIsLoading(true);
    setError("");
    try {
      const user = await loginWithGoogle(); // same function handles Google login/register
      console.log("Google sign-in successful:", user);
      navigate("/account");
    } catch (error) {
      console.error("Google sign-in failed:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">Create Your Account</h1>
          <p className="register-subtitle">Sign up for TerpTrace</p>
        </div>

        {error && <div className="register-error">{error}</div>}

        <form className="register-form" onSubmit={handleSubmit}>
          <button
            type="button"
            className={`google-register-button ${isLoading ? "loading" : ""}`}
            onClick={handleGoogleRegister}
            disabled={isLoading}
          >
            <div className="google-icon">G</div> Sign up with Google
          </button>

          <div className="divider">
            <span>or</span>
          </div>

         <div classname = "register-input-group">
            <input
                type="text"
                className="register-input"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={isLoading}
            />
        </div>
        <div classname = "register-input-group">
            <input
                type="text"
                className="register-input"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={isLoading}
            />
        </div>
          <div className="register-input-group">
            <input
              type="email"
              className="register-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="register-input-group">
            <input
              type="password"
              className="register-input"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="register-input-group">
            <input
              type="password"
              className="register-input"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={`register-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="register-footer">
          <p className="register-footer-text">
            Already have an account?{" "}
            <a href="/login" className="register-link">
              Log in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
