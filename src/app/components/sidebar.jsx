"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/sidebar.module.scss";
import { IoMdMore, IoMdClose } from "react-icons/io";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { auth } from "../firebaseConfig";
import { useTheme } from "../hook/ThemeContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const sidebarRef = useRef(null);
  const { theme, setTheme } = useTheme(null);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

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
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.email) {
        setUserEmail(user.email);
        setIsUserLoggedIn(true);
      } else {
        setUserEmail("");
        setIsUserLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setIsUserLoggedIn(false);
  };

  return (
    <div
      ref={sidebarRef}
      className={`${styles.sidebar} ${isOpen ? styles.open : ""} ${
        theme === "dark" ? styles.dark : styles.light
      }`}
    >
      <div className={styles.toggleBtn} onClick={toggleSidebar}>
        {isOpen ? <IoMdClose /> : <IoMdMore />}
      </div>

      <span className={styles.userEmail}>
        {isUserLoggedIn ? `Hi, ${userEmail}` : "Hi, Guest"}
      </span>

      <ul className={styles.sidebarList}>
        <li className={styles.sidebarItem}>
          <a href="/taskify">Home</a>
        </li>
        <li className={styles.sidebarItem} onClick={() => setIsOpen(false)}>
          <a href="/about">About</a>
        </li>
        <a
          href="/login"
          className={styles.sidebarItem}
          onClick={() => {
            handleLogout();
            setIsOpen(false);
          }}
        >
          {isUserLoggedIn ? "Logout" : "Sign In"}
        </a>
        <li className={styles.sidebarItem} onClick={toggleTheme}>
          {theme === "light" ? <MdDarkMode /> : <MdLightMode />} Theme
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
