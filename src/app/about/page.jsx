"use client";

import styles from "../styles/about.module.scss";
import Link from "next/link";

const About = () => {
  return (
    <main className={styles.body}>
      <div className={styles.aboutPage}>
        <section className={styles.hero}>
          <h1>Welcome to Taskify </h1>
          <p>
            Your comprehensive solution for effective task management and
            enhanced productivity.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/">Home</Link>
            <Link href="/login">Login</Link>
          </div>
        </section>

        <section className={styles.section}>
          <h2> Why Taskify?</h2>
          <p>
            In todays dynamic environment, staying organized and on top of
            tasks is crucial. Taskify provides a robust, intuitive, and
            efficient platform to track your daily tasks, manage complex
            projects, and achieve your life goals. Leveraging modern
            technologies such as Next.js, Firebase, and React, Taskify
            guarantees exceptional performance, security, and scalability.
          </p>
        </section>

        <section className={styles.section}>
          <h2>🚀 Key Features of Taskify</h2>
          <ul>
            <li>📝 Quick and Seamless Task Creation with Smart Auto-Save</li>
            <li>
              🔄 Real-Time Sync and Instant Updates via Firebase Firestore
            </li>
            <li>
              ✏️ Edit, Update, and Manage Tasks Effortlessly with Inline Editing
            </li>
            <li>🗑️ Single or Bulk Task Deletion with Safety Confirmations</li>
            <li>
              📋 Toggle Between Grid View and List View — Your Choice, Saved!
            </li>
            <li>📦 Local Storage Support for Persistent View Preferences</li>
            <li>📱 Fully Responsive and Touch-Optimized for Mobile Devices</li>
            <li>
              🔒 Secure Authentication and Protected User Data (via Firebase
              Auth)
            </li>
            <li>⚡ Lightweight, Fast Loading, and Performance Optimized UX</li>
            <li>
              📆 Automatic Timestamping: Track Creation and Last Edited Times
            </li>
            <li>
              🎨 Instantly Switch Between 4 Beautiful Themes: Maroon, Mist,
              Forest, and Peach
            </li>
          </ul>
        </section>

        <section className={styles.blogSection}>
          <h2>📚 How to Use Taskify</h2>

          <div className={styles.blogCard}>
            <h3>1. Add Your Tasks Effortlessly</h3>
            <p>
              Simply click on the task input field and start typing. Add a title
              and detailed notes to create new tasks quickly. Save with a click
              — its that easy!
            </p>
            <button>Get Started →</button>
          </div>

          <div className={styles.blogCard}>
            <h3>2. Edit and Update On the Go</h3>
            <p>
              Tap on any task to open the editing window. Instantly modify the
              heading or details, and your changes will be saved seamlessly to
              the cloud.
            </p>
            <button>Learn More →</button>
          </div>

          <div className={styles.blogCard}>
            <h3>3. Switch Views for Better Organization</h3>
            <p>
              Toggle between Grid View and List View depending on your
              preference. Your choice is automatically saved for next time.
            </p>
            <button>Customize View →</button>
          </div>
        </section>

        <section className={styles.footer}>
          <h2>👨‍💻 About the Creator</h2>
          <p>
            <strong>Hi i am Santosh Thapa</strong>, a passionate Software
            Engineer specializing in React.js, Next.js, HTML5, SASS, and modern
            web technologies. I excel at crafting responsive and visually
            captivating web interfaces with meticulous attention to detail.
          </p>
          <p>
            Connect with me on{" "}
            <a
              href="https://www.linkedin.com/in/santosh986"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>{" "}
            |{" "}
            <a
              href="https://santosh-gamma.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Portfolio
            </a>
          </p>
        </section>
      </div>
    </main>
  );
};

export default About;
