import { useRef } from "react";
import styles from "../styles/taskify.module.scss";
import clsx from "clsx";
import { TbGridDots } from "react-icons/tb";
import { MdTableRows } from "react-icons/md";
import { IoMdRefresh } from "react-icons/io";
import Image from "next/image";
import { MdOutlineDeleteSweep } from "react-icons/md";

const NavBar = ({ isListView, setIsListView, getData, deleteAllTasks }) => {
  const refreshRef = useRef(null);

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

  return (
    <nav>
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
          ref={refreshRef}
          onClick={() => {
            refreshClick();
            getData();
          }}
          className={clsx(styles.navItem)}
        >
          <IoMdRefresh />
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
      </div>
    </nav>
  );
};

export default NavBar;
