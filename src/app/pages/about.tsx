import React from "react";
import styles from "../styles/about.module.scss";

const About: React.FC = () => {
  return (
    <div className={styles.aboutContainer}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Welcome to Taskify</h1>
        <p className={styles.tagline}>
          Your personal task manager to stay organized and productive.
        </p>
      </div>

      <section className={styles.section}>
        <h2 className={styles.heading}>Why Taskify?</h2>
        <p className={styles.paragraph}>
          At Taskify, we believe that productivity should be simple and
          streamlined. Our app provides a clean and minimalistic interface for
          managing your tasks, allowing you to focus on what really matters
          without distractions.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>How It Works</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span className={styles.listItemNumber}>1</span> Sign in securely
            with Firebase.
          </li>
          <li className={styles.listItem}>
            <span className={styles.listItemNumber}>2</span> Add your tasks
            effortlessly.
          </li>
          <li className={styles.listItem}>
            <span className={styles.listItemNumber}>3</span> Manage and swipe
            through tasks quickly.
          </li>
          <li className={styles.listItem}>
            <span className={styles.listItemNumber}>4</span> Stay organized with
            real-time syncing across devices.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Our Mission</h2>
        <p className={styles.paragraph}>
          At Taskify, we’re committed to enhancing your productivity by
          providing a lightweight and easy-to-use task management solution. Our
          goal is to give you the tools to stay organized so you can focus on
          what matters most.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Start Using Taskify Today!</h2>
        <p className={styles.paragraph}>
          Taskify is free to use. Dive in and experience stress-free task
          management! If you have any feedback or suggestions, contact us at
          <a href="mailto:support@taskify.com" className={styles.link}>
            {" "}
            support@taskify.com
          </a>
          .
        </p>
      </section>
    </div>
  );
};

export default About;
