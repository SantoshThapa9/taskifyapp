"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/sidebar.module.scss";
import { IoMdMore, IoMdClose } from "react-icons/io";
import { auth } from "../firebaseConfig";
import { useTheme } from "../hook/ThemeContext";
import Link from "next/link";
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const sidebarRef = useRef(null);
  const { theme, toggleTheme } = useTheme();

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };
  const closeSidebar = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", closeSidebar);
    return () => {
      document.removeEventListener("mousedown", closeSidebar);
    };
  }, []);

  useEffect(() => {
    const getData = auth.onAuthStateChanged((user) => {
      if (user?.email) {
        setUserEmail(user.email);
        setIsUserLoggedIn(true);
      } else {
        setUserEmail("Guest");
        setIsUserLoggedIn(false);
      }
    });
    return () => getData();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setIsUserLoggedIn(false);
  };

  return (
    <aside
      ref={sidebarRef}
      className={`${styles.sidebar} ${isOpen ? styles.open : ""} `}
    >
      <div className={styles.box1}>
        <div className={styles.toggleBtn} onClick={toggleSidebar}>
          {isOpen ? <IoMdClose /> : <IoMdMore />}
        </div>

        <span className={styles.userEmail}>{userEmail}</span>
      </div>

      <div className={styles.box2}>
        <Link onClick={() => setIsOpen(false)} href="/">
          Home
        </Link>

        <Link href="/about" onClick={() => setIsOpen(false)}>
          About
        </Link>

        <Link
          href="/login"
          onClick={() => {
            handleLogout();
            setIsOpen(false);
          }}
        >
          {isUserLoggedIn ? "Logout" : "Sign In"}
        </Link>

        <button onClick={toggleTheme}>Theme: {theme}</button>
      </div>
    </aside>
  );
};

export default Sidebar;
