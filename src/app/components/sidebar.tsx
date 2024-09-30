import React from "react";
import styles from "../styles/sidebar.module.scss";
import { IoMdMore, IoMdClose } from "react-icons/io";
import { useRouter } from "next/navigation";
import Link from "next/link";
const Sidebar: React.FC<{
  isOpen: boolean;
  toggleSidebar: () => void;
  handleLogout: () => void;
}> = ({ isOpen, toggleSidebar, handleLogout }) => {
  const router = useRouter();

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.toggleBtn} onClick={toggleSidebar}>
        {isOpen ? <IoMdClose /> : <IoMdMore />}
      </div>
      <ul className={styles.sidebarList}>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li className={styles.sidebarItem} onClick={handleLogout}>
          Logout
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
