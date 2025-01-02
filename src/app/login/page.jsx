"use client";
import { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import styles from "../styles/login.module.scss";
import { PiEyeLight } from "react-icons/pi";
import { PiEyeSlashBold } from "react-icons/pi";
const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [flip, setFlip] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleToggle = () => {
    setFlip(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setFlip(false);
    }, 300);
  };

  const handleEmailAuth = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push("/");
    } catch (error) {
      console.log("Error code:", error.code);
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${styles.loginPage} ${
        isLogin ? styles.login : styles.signup
      }`}
    >
      <div className={`${styles.container} ${flip ? styles.flip : ""}`}>
        <h1>{isLogin ? "Login" : "Sign Up"}</h1>
        <h3>{isLogin ? "Welcome back!" : "Create Your Account"}</h3>
        <form onSubmit={handleEmailAuth}>
          <input
            placeholder="Email..."
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className={styles.passwordContainer}>
            <input
              placeholder={isLogin ? "Password..." : "Set Password..."}
              type={showPassword ? "text" : "password"} // Toggle password visibility
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.eyeButton}
            >
              {showPassword ? <PiEyeLight /> : <PiEyeSlashBold />}{" "}
            </button>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className={styles.errorMessage}>{error}</p>
        <p className={styles.toggleText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={handleToggle} className={styles.toggleButton}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
