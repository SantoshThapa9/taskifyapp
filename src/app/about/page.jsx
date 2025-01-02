"use client";
import React from "react";
import styles from "../styles/about.module.scss";

const About = () => {
  return (
    <div className={styles.aboutContainer}>
      <h1 className={styles.title}>Welcome to Taskify</h1>
      <p className={styles.tagline}>
        A simple task manager to help you stay organized and productive.
      </p>

      <section className={styles.section}>
        <h2 className={styles.heading}>Why I Created Taskify</h2>
        <p className={styles.paragraph}>
          I wanted to build a task manager that is clean, simple, and easy to
          use. Taskify is all about helping you focus on your tasks without any
          distractions.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>How Taskify Works</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span className={styles.listItemNumber}>1</span>
            <span className={styles.dialog}>
              Sign in to start managing your tasks.
            </span>
          </li>
          <li className={styles.listItem}>
            <span className={styles.listItemNumber}>2</span>
            <span className={styles.dialog}>Add tasks quickly and easily.</span>
          </li>
          <li className={styles.listItem}>
            <span className={styles.listItemNumber}>3</span>
            <span className={styles.dialog}>
              Swipe through your tasks and manage them effortlessly.
            </span>
          </li>
          <li className={styles.listItem}>
            <span className={styles.listItemNumber}>4</span>
            <span className={styles.dialog}>
              Sync your tasks across all your devices instantly.
            </span>
          </li>
          <li className={styles.listItem}>
            <span className={styles.listItemNumber}>5</span>
            <span className={styles.dialog}>
              You can also view the creation date and time of each task
            </span>
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Get Started Today!</h2>
        <p className={styles.paragraph}>
          Taskify is free to use. Start managing your tasks today! If you have
          any feedback, feel free to contact me at {""}
          <a
            target="_blank"
            href="https://santosh-gamma.vercel.app/"
            className={styles.link}
          >
            Personal Portfolio
          </a>
          .
        </p>
      </section>
    </div>
  );
};

export default About;
