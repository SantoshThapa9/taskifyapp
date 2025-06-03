"use client";
import { useRef, useState, useEffect } from "react";
import styles from "../styles/taskify.module.scss";
import clsx from "clsx";
import { TbGridDots } from "react-icons/tb";
import { MdTableRows } from "react-icons/md";
import { IoMdRefresh, IoMdMore, IoMdClose } from "react-icons/io";
import Image from "next/image";
import { MdOutlineDeleteSweep } from "react-icons/md";
import { auth } from "../firebaseConfig";
import { useTheme } from "../hook/ThemeContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NavBar = ({ isListView, setIsListView, getData, deleteAllTasks }) => {
  const refreshRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const menuRef = useRef(null);
  const { theme, toggleTheme } = useTheme();

  const refreshClick = () => {
    const icon = refreshRef.current;

    if (icon) {
      icon.classList.add(styles.refreshIcon);
      const refreshAnimation = () => {
        icon.classList.remove(styles.refreshIcon);
        icon.removeEventListener("animationend", refreshAnimation);
      };
      icon.addEventListener("animationend", refreshAnimation);
    }
  };

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeMenu);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
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

  const unsubscribeRef = useRef(null);
  const router = useRouter();

  const handleLogout = async () => {
    // Unsubscribe from Firestore listeners first
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    // Then sign out
    await auth.signOut();
    setIsUserLoggedIn(false);
    router.push("/login");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navDiv}>
        <div className={clsx(styles.navItem)}>
          <Image
            src="/taskify.png"
            alt="Profile Picture"
            width={50}
            height={50}
            priority
            className={styles.img}
          />
          <strong>Taskify</strong>
        </div>
      </div>

      <div className={clsx(styles.navDiv, styles.navDiv2)}>
        <div
          className={clsx(styles.navItem)}
          onClick={() => {
            refreshClick();
            getData();
          }}
        >
          <IoMdRefresh ref={refreshRef} />
        </div>
        <div
          className={clsx(styles.navItem)}
          onClick={() => {
            setIsListView((prev) => !prev);
          }}
        >
          {isListView ? <MdTableRows /> : <TbGridDots />}
        </div>
        <div onClick={deleteAllTasks} className={clsx(styles.navItem)}>
          <MdOutlineDeleteSweep />
        </div>
        <div ref={menuRef} className={styles.menuContainer}>
          <div className={styles.menuToggle} onClick={toggleMenu}>
            {isOpen ? <IoMdClose /> : <IoMdMore />}
          </div>
          {isOpen && (
            <div className={styles.menuDropdown}>
              <span className={styles.userEmail}>{userEmail}</span>
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
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
