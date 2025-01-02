"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/sidebar.module.scss";
import { IoMdMore, IoMdClose } from "react-icons/io";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import Link from "next/link";
import { auth } from "../firebaseConfig";
import { useRouter } from "next/navigation";
import "../global.scss";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [theme, setTheme] = useState("light");
  const router = useRouter();
  const sidebarRef = useRef(null);
  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };
  const closeSidebar = (event) => {
    // Check if the click was outside the sidebar
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", closeSidebar); // Listen for mouse click on document
    return () => {
      document.removeEventListener("mousedown", closeSidebar); // Cleanup on unmount
    };
  }, []);
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };
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
    router.push("/login");
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
        {" "}
        {isUserLoggedIn ? `Hi, ${userEmail}` : "Hi, Guest"}{" "}
      </span>

      <ul className={styles.sidebarList}>
        <li className={styles.sidebarItem}>
          <Link href="/taskify">Home</Link>
        </li>
        <li className={styles.sidebarItem}>
          <Link href="/about">About</Link>
        </li>
        <li
          className={styles.sidebarItem}
          onClick={isUserLoggedIn ? handleLogout : () => router.push("/login")}
        >
          {isUserLoggedIn ? "Logout" : "Sign In"}
        </li>
        <li className={styles.sidebarItem} onClick={toggleTheme}>
          {theme === "light" ? <MdDarkMode /> : <MdLightMode />} Theme
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
