"use client";
import React, { useState, useEffect } from "react";
import styles from "../styles/sidebar.module.scss";
import { IoMdMore, IoMdClose } from "react-icons/io";
import Link from "next/link";
import { auth } from "../firebaseConfig";
import { useRouter } from "next/navigation";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    await auth.signOut();
    setIsUserLoggedIn(false);
    router.push("/login");
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.email) {
        setUserEmail(user.email);
        setIsUserLoggedIn(true);
      } else {
        setUserEmail("");
        setIsUserLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div
      onClick={toggleSidebar}
      className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}
    >
      <div className={styles.toggleBtn}>
        {isOpen ? <IoMdClose /> : <IoMdMore />}
      </div>
      {isUserLoggedIn && <span className={styles.userEmail}> {userEmail}</span>}
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
      </ul>
    </div>
  );
};

export default Sidebar;
