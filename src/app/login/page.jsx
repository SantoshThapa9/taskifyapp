"use client";
import { useState } from "react";
import { auth } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import styles from "../styles/login.module.scss";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [flip, setFlip] = useState(false);

  const handleToggle = () => {
    setFlip((prev) => !prev);
    setTimeout(() => {
      setIsLogin((prev) => !prev);
    }, 200);
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
      if (error.code === "auth/email-already-in-use") {
        setError("Email already in use. You can login.");
      } else {
        setError("Invalid email or password.");
      }
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div
        className={`${styles.container} ${flip ? styles.login : styles.signup}`}
      >
        <h1>{isLogin ? "Login" : "Sign Up"}</h1>
        <h2 className={styles.seoHeading}>
          Taskify - Smart task management app to boost productivity. Track &
          plan effortlessly. Created by Santosh Thapa.
        </h2>
        <h3>{isLogin ? "Welcome back!" : "Create Your Account"}</h3>
        <form onSubmit={handleEmailAuth}>
          <input
            placeholder="Email..."
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <div className={styles.passwordContainer}>
            <input
              placeholder={isLogin ? "Password..." : "Set Password..."}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className={`${styles.passInputCtn} ${styles.input}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className={styles.eyeButton}
            >
              {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
            </button>
          </div>
          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className={styles.errorMessage}>{error}</p>
        <p className={styles.toggleText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={handleToggle} className={styles.linkBtn}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
