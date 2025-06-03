"use client";

import styles from "../styles/about.module.scss";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";

const About = () => {
  return (
    <main className={styles.body}>
      <div className={styles.aboutPage}>
        <section className={styles.hero}>
          <h1>Welcome to Taskify</h1>
          <p>
            Elevate your productivity with our intelligent task management
            platform. Seamlessly organize, track, and accomplish your goals with
            style.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/">Explore Taskify</Link>
            <Link href="/login">Get Started</Link>
          </div>
        </section>

        <section className={styles.section}>
          <h2>🎯 Our Mission</h2>
          <p>
            At Taskify, we believe in transforming the way people manage their
            tasks and achieve their goals. Our platform combines cutting-edge
            technology with intuitive design to create an experience that not
            only helps you stay organized but also motivates you to accomplish
            more.
          </p>
        </section>

        <section className={styles.section}>
          <h2>✨ Why Choose Taskify?</h2>
          <p>
            In todays fast-paced world, staying organized isnt just a
            luxury—it s a necessity. Taskify leverages modern technologies like
            Next.js, Firebase, and React to deliver a powerful, secure, and
            scalable platform that adapts to your needs.
          </p>
        </section>

        <section className={styles.section}>
          <h2>🚀 Powerful Features</h2>
          <ul>
            <li>
              <strong>Smart Task Management</strong>
              <p>
                Create, organize, and track tasks with intelligent auto-save
              </p>
            </li>
            <li>
              <strong>Real-Time Sync</strong>
              <p>Stay updated across all devices with instant Firebase sync</p>
            </li>
            <li>
              <strong>Intuitive Interface</strong>
              <p>Effortlessly manage tasks with our user-friendly design</p>
            </li>
            <li>
              <strong>Customizable Views</strong>
              <p>Switch between Grid and List views to suit your style</p>
            </li>
            <li>
              <strong>Secure Platform</strong>
              <p>Enterprise-grade security with Firebase Authentication</p>
            </li>
            <li>
              <strong>Theme Options</strong>
              <p>Choose from 5 beautiful themes to match your preference</p>
            </li>
          </ul>
        </section>

        <section className={styles.blogSection}>
          <h2>📚 Getting Started with Taskify</h2>
          <div className={styles.blogGrid}>
            <div className={styles.blogCard}>
              <h3>Quick Setup</h3>
              <p>
                Create your account in seconds and start organizing your tasks
                immediately. Our intuitive onboarding process ensures you re up
                and running in no time.
              </p>

              <Link href="/login">Create Account →</Link>
            </div>

            <div className={styles.blogCard}>
              <h3>Task Management</h3>
              <p>
                Learn how to create, organize, and track your tasks effectively.
                Discover features like bulk actions, smart sorting, and
                real-time updates.
              </p>
              <a href="https://santosh-gamma.vercel.app/">View Tutorial →</a>
            </div>

            <div className={styles.blogCard}>
              <h3>Customization</h3>
              <p>
                Personalize your Taskify experience with themes, view
                preferences, and organization methods that work best for you.
              </p>
              <Link href="/">Explore Settings →</Link>
            </div>
          </div>
        </section>

        <section className={styles.footer}>
          <h2>Meet the Creator</h2>
          <p>
            Hi, I m <strong>Santosh Thapa</strong> — a passionate Software
            Engineer dedicated to creating intuitive and powerful web
            applications. With expertise in React.js, Next.js, and modern web
            technologies, I strive to build solutions that make a difference in
            people s daily lives.
          </p>
          <div className={styles.socialLinks}>
            <a
              href="https://www.linkedin.com/in/santosh986"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin /> LinkedIn
            </a>
            <a
              href="https://santosh-gamma.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGlobe /> Portfolio
            </a>
            <a
              href="https://github.com/SantoshThapa9"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub /> GitHub
            </a>
          </div>
        </section>
      </div>
    </main>
  );
};

export default About;
