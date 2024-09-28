import React from "react";
import { MdOutlineMenu } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import styles from "./sidebar.module.scss";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar,
  onLogout,
}) => {
  return (
    <div>
      <button onClick={toggleSidebar} className={styles.toggleButton}>
        {isOpen ? <RxCross2 /> : <MdOutlineMenu />}
      </button>
      {isOpen && (
        <div className={styles.sidebar}>
          <ul>
            <li>
              <a href="#">About</a>
            </li>
            <li className={styles.logoutItem}>
              {" "}
              {/* Add custom class here */}
              <a href="#" onClick={onLogout}>
                Logout
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
