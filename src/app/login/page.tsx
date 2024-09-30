"use client";
import { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import styles from "../styles/login.module.scss";
import { FirebaseError } from "firebase/app";
const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  type Task = {
    id: string;
    title: string;
  };

  const handleEmailAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await setDoc(doc(db, "users", user.uid), { email });
      }
      router.push("/");
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(getErrorMessage(error.code));
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorCode: string): string => {
    const errorMessages: { [key: string]: string } = {
      "auth/user-not-found": "User not found. Please sign up.",
      "auth/email-already-in-use":
        "Email already in use. Please login instead.",
      "auth/wrong-password": "Incorrect password. Please try again.",
      "auth/invalid-email":
        "The email address is not valid. Please check your email.",
      "auth/operation-not-allowed":
        "Email/password accounts are not enabled. Please contact support.",
      "auth/weak-password":
        "The password is too weak. Please choose a stronger password.",
    };
    return (
      errorMessages[errorCode] || "Authentication failed. Please try again."
    );
  };

  const fetchUserTasks = async (userId: string) => {
    try {
      const tasksRef = collection(db, "users", userId, "tasks");
      const taskSnapshot = await getDocs(tasksRef);
      setTasks(
        taskSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Task))
      );
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await fetchUserTasks(user.uid);
        router.push("/");
      } else {
        console.log("User not authenticated.");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const [flip, setFlip] = useState(false);

  const handleToggle = () => {
    setFlip(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setFlip(false);
    }, 300);
  };

  return (
    <div
      className={`${styles.loginPage} ${
        isLogin ? styles.login : styles.signup
      }`}
    >
      <div className={`${styles.container} ${flip ? styles.flip : ""}`}>
        <h1>{isLogin ? "Login" : "Sign Up"}</h1>
        <form onSubmit={handleEmailAuth}>
          <input
            placeholder="Email..."
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            placeholder={isLogin ? "Password..." : "Set Password..."}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <p className={styles.toggleText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={handleToggle} className={styles.toggleButton}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
        {tasks.length > 0 && (
          <div className={styles.tasksContainer}>
            <h2>Your Tasks</h2>
            <ul>
              {tasks.map((task) => (
                <li key={task.id}>{task.title}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
