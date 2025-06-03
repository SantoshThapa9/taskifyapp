"use client";

import { useState, useEffect, useRef } from "react";
import { auth, db } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  setDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import styles from "./styles/taskify.module.scss";
import NavBar from "./components/NavBar";
import clsx from "clsx";
import { MdDataSaverOn } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

const Taskify = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskDetail, setTaskDetail] = useState("");
  const [taskHeading, setTaskHeading] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTakingInput, SetIsTakingInput] = useState(false);
  const [taskWindowOn, setTaskWindowOn] = useState(null);
  const unsubscribeRef = useRef(null);
  const [editedHeading, setEditedHeading] = useState("");
  const [editedDetail, setEditedDetail] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [isListView, setIsListView] = useState(() => {
    const savedView = localStorage.getItem("isListView");
    return savedView ? JSON.parse(savedView) : false;
  });

  const taskWindowRef = useRef(null);

  // Add online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Sync local tasks with Firebase when coming back online
  useEffect(() => {
    const syncTasksWithFirebase = async () => {
      const userId = auth.currentUser?.uid;
      if (isOnline && userId) {
        const localTasks = JSON.parse(
          localStorage.getItem("guestTasks") || "[]"
        );
        for (const task of localTasks) {
          const taskRef = doc(db, `users/${userId}/tasks`, task.id);
          const existing = await getDoc(taskRef);

          if (!existing.exists()) {
            await setDoc(taskRef, task);
          }
        }
      }
    };

    syncTasksWithFirebase();
  }, [isOnline]);

  const addTask = async () => {
    const heading = textareaRef.current?.value.trim() || "";
    const detail = textareaRef2.current?.value.trim() || "";

    if (!heading && !detail) return;

    const userId = auth.currentUser?.uid;

    setTaskDetail("");
    setTaskHeading("");
    SetIsTakingInput(false);

    const newTask = {
      id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      heading,
      detail,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      userId,
    };

    // Always save to local storage
    const localTasks = JSON.parse(localStorage.getItem("guestTasks") || "[]");
    localStorage.setItem(
      "guestTasks",
      JSON.stringify([newTask, ...localTasks])
    );
    setTasks([newTask, ...tasks]);

    // If online and logged in, save to Firebase
    if (isOnline && userId) {
      try {
        // await addDoc(collection(db, `users/${userId}/tasks`), newTask);
        const taskRef = doc(db, `users/${userId}/tasks`, newTask.id);
        await setDoc(taskRef, newTask); // You need to import `setDoc` from Firestore

        const updatedLocalTasks = localTasks.filter((t) => t.id !== newTask.id);
        localStorage.setItem("guestTasks", JSON.stringify(updatedLocalTasks));
      } catch (error) {
        console.error("Error saving to Firebase:", error);
      }
    }
  };

  const openTaskWindow = (taskId) => {
    const selectedTask = tasks.find((t) => t.id === taskId);
    if (selectedTask) {
      setTaskWindowOn(selectedTask);
      setEditedHeading(selectedTask.heading ?? "");
      setEditedDetail(selectedTask.detail ?? "");
    }
  };

  const closeTaskWindow = async () => {
    const userId = auth.currentUser?.uid;
    if (!taskWindowOn) return;

    const hasChanges =
      editedHeading !== taskWindowOn.heading ||
      editedDetail !== taskWindowOn.detail;

    if (hasChanges) {
      const updatedTask = {
        ...taskWindowOn,
        heading: editedHeading,
        detail: editedDetail,
        updatedAt: new Date().toISOString(),
        createdAt: null,
      };

      setTasks(tasks.map((t) => (t.id === taskWindowOn.id ? updatedTask : t)));

      const localTasks = JSON.parse(localStorage.getItem("guestTasks") || "[]");
      const updatedLocalTasks = localTasks.map((t) =>
        t.id === taskWindowOn.id ? updatedTask : t
      );
      localStorage.setItem("guestTasks", JSON.stringify(updatedLocalTasks));

      if (isOnline && userId) {
        try {
          const taskRef = doc(db, `users/${userId}/tasks`, taskWindowOn.id);
          const snapshot = await getDoc(taskRef);

          if (snapshot.exists()) {
            await updateDoc(taskRef, {
              heading: editedHeading,
              detail: editedDetail,
              updatedAt: new Date(),
              createdAt: null,
            });
          } else {
            // Document doesn't exist, so we create it instead
            await setDoc(taskRef, updatedTask);
          }
        } catch (error) {
          console.error("Error updating or setting in Firebase:", error);
        }
      }
    }

    setTaskWindowOn(null);
  };

  useEffect(() => {
    if (!taskWindowOn) return;

    const handleClickOutside = (event) => {
      if (
        taskWindowRef.current &&
        !taskWindowRef.current.contains(event.target)
      ) {
        closeTaskWindow();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [taskWindowOn, editedDetail, editedHeading, closeTaskWindow]);

  const inputCtnRef = useRef(null);

  useEffect(() => {
    if (!isTakingInput) return;
    const closeInputCtn = (event) => {
      if (inputCtnRef.current && !inputCtnRef.current.contains(event.target)) {
        SetIsTakingInput(false);
        setTaskDetail("");
        setTaskHeading("");
        addTask();
      }
    };
    document.addEventListener("mousedown", closeInputCtn);
    return () => {
      document.removeEventListener("mousedown", closeInputCtn);
    };
  }, [isTakingInput, addTask]);

  const textareaRef = useRef(null);
  const textareaRef2 = useRef(null);
  const textareaRef3 = useRef(null);
  const textareaRef4 = useRef(null);

  useEffect(() => {
    const textareas = [
      textareaRef.current,
      textareaRef2.current,
      textareaRef3.current,
      textareaRef4.current,
    ];

    const maxHeight = window.innerHeight * 0.3;

    textareas.forEach((textarea) => {
      if (textarea) {
        textarea.style.height = "auto";
        const newHeight = Math.max(textarea.scrollHeight, 32);
        textarea.style.height = `${Math.min(newHeight, maxHeight)}px`;
      }
    });
  }, [taskDetail, taskHeading, editedDetail, editedHeading, taskWindowOn]);

  useEffect(() => {
    localStorage.setItem("isListView", JSON.stringify(isListView));
  }, [isListView]);

  const getData = async () => {
    setLoading(true);

    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    const localTasks = JSON.parse(localStorage.getItem("guestTasks") || "[]");
    setTasks(localTasks);

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user || !isOnline) {
        setLoading(false);
        setTasks(localTasks);
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }
        return;
      }
      try {
        for (const task of localTasks) {
          const taskRef = doc(db, `users/${user.uid}/tasks`, task.id);
          const existing = getDoc(taskRef);
          // if (!existing.exists()) {
          //   setDoc(taskRef, task);
          // }
        }
        localStorage.setItem("guestTasks", "[]"); // Clear synced guest tasks
      } catch (error) {
        console.error("Error syncing guest tasks to Firebase:", error);
      }

      try {
        const tasksRef = collection(db, `users/${user.uid}/tasks`);
        const unsubscribe = onSnapshot(
          tasksRef,
          (snapshot) => {
            const firebaseTasks = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setTasks(firebaseTasks);
            setLoading(false);
          },
          (error) => {
            // Handle any errors from the snapshot listener
            console.log("Firestore snapshot error:", error);
            setTasks(localTasks);
            setLoading(false);
          }
        );

        unsubscribeRef.current = unsubscribe;
      } catch (err) {
        console.error("Unexpected error in Firestore onSnapshot:", err);
        setTasks(localTasks);
        setLoading(false);
      }
    });

    // Return a cleanup function that unsubscribes from both listeners
    return () => {
      unsubscribeAuth();
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  };

  useEffect(() => {
    getData();
    // return () => {
    //   if (unsubscribe) {
    //     unsubscribe();
    //   }
    // };
  }, []);

  const deleteTask = async (taskId) => {
    closeTaskWindow();
    const userId = auth.currentUser?.uid;

    // Remove from local state
    setTasks(tasks.filter((t) => t.id !== taskId));

    // Remove from localStorage
    const localTasks = JSON.parse(localStorage.getItem("guestTasks") || "[]");
    const updatedLocalTasks = localTasks.filter((t) => t.id !== taskId);
    localStorage.setItem("guestTasks", JSON.stringify(updatedLocalTasks));

    // If online and logged in, delete from Firebase
    if (isOnline && userId) {
      try {
        await deleteDoc(doc(db, `users/${userId}/tasks`, taskId));
      } catch (error) {
        console.error("Error deleting from Firebase:", error);
      }
    }
  };

  const deleteAllTasks = async () => {
    const userId = auth.currentUser?.uid;
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all tasks?"
    );
    if (!confirmDelete) return;

    // Clear local state
    setTasks([]);

    // Clear localStorage
    localStorage.setItem("guestTasks", "[]");

    // If online and logged in, clear Firebase
    if (isOnline && userId) {
      try {
        const tasksRef = collection(db, `users/${userId}/tasks`);
        const snapshot = await getDocs(tasksRef);
        const deletePromises = snapshot.docs.map((docItem) =>
          deleteDoc(doc(db, `users/${userId}/tasks`, docItem.id))
        );
        await Promise.all(deletePromises);
      } catch (error) {
        console.error("Error deleting all tasks from Firebase:", error);
      }
    }
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 480;

  const headingLimit = isMobile ? 50 : 100;
  const detailLimit = isMobile ? 150 : 500;

  const formatDate = (date) => {
    try {
      if (date?.toDate) {
        date = date.toDate(); // Firebase Timestamp
      } else if (typeof date === "string") {
        date = new Date(date); // ISO String
      }

      if (!(date instanceof Date) || isNaN(date.getTime())) {
        return "Invalid Date";
      }

      return date.toLocaleString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "Invalid Date";
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const searchLower = searchQuery.toLowerCase();
    const headingMatch = task.heading?.toLowerCase().includes(searchLower);
    const detailMatch = task.detail?.toLowerCase().includes(searchLower);
    return searchLower === "" || headingMatch || detailMatch;
  });

  return (
    <main className={styles.body}>
      <header className={styles.seoHeading}>
        <h1>Taskify - Task Management App</h1>
        <h2>Boost Your Productivity with Smart Task Management</h2>
        <h3>
          Taskify is a powerful task management app to boost productivity, track
          tasks, and plan effortlessly. Developed by Santosh Thapa.
        </h3>
      </header>
      <NavBar
        isListView={isListView}
        setIsListView={setIsListView}
        getData={getData}
        deleteAllTasks={deleteAllTasks}
      />
      <div className={styles.inputParentCtn}>
        <div className={styles.inputCtn} ref={inputCtnRef}>
          <div className={styles.box1}>
            {isTakingInput && (
              <textarea
                rows={1}
                ref={textareaRef}
                placeholder="Title"
                value={taskHeading}
                className={clsx(styles.heading)}
                onChange={(e) => {
                  setTaskHeading(e.target.value);
                }}
              />
            )}
            <textarea
              rows={1}
              ref={textareaRef2}
              onClick={() => SetIsTakingInput(true)}
              placeholder="Enter task details"
              value={taskDetail}
              className={styles.detail}
              onChange={(e) => {
                setTaskDetail(e.target.value);
              }}
            />
          </div>
          <MdDataSaverOn onClick={addTask} className={styles.addBtn} />
        </div>
        <div className={clsx(styles.searchCtn, isTakingInput && styles.hidden)}>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FiSearch className={styles.searchIcon} />
        </div>
      </div>
      {loading ? (
        <span className={styles.loader} />
      ) : filteredTasks.length > 0 ? (
        <div
          className={clsx(
            styles.taskParentCtn,
            isListView ? styles.listView : styles.gridView
          )}
        >
          {filteredTasks
            .sort((a, b) => {
              const dateA = a.createdAt?.toDate
                ? a.createdAt.toDate()
                : new Date(a.createdAt);
              const dateB = b.createdAt?.toDate
                ? b.createdAt.toDate()
                : new Date(b.createdAt);

              return dateB - dateA;
            })
            .map((task) => (
              <div
                key={task.id}
                onClick={() => openTaskWindow(task.id)}
                className={styles.taskCtn}
              >
                <div className={styles.task}>
                  <h3>
                    {task.heading
                      ? task.heading.length > headingLimit
                        ? task.heading.slice(0, headingLimit) + "..."
                        : task.heading
                      : ""}
                  </h3>
                  <p>
                    {task.detail
                      ? task.detail.length > detailLimit
                        ? task.detail.slice(0, detailLimit) + "..."
                        : task.detail
                      : ""}
                  </p>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div style={{ marginTop: "240px" }}>
          {searchQuery ? "No matching tasks found" : "No tasks available"}
        </div>
      )}
      {taskWindowOn && (
        <div
          ref={taskWindowRef}
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={styles.taskWindow}
        >
          <div className={styles.taskWindowHeader}>
            <h4>Taskify</h4>
            <div className={styles.closeBtn} onClick={() => closeTaskWindow()}>
              <IoClose />
            </div>
          </div>
          <div className={styles.textareaCtn}>
            <textarea
              rows={1}
              ref={textareaRef3}
              type="text"
              value={editedHeading}
              onChange={(e) => setEditedHeading(e.target.value)}
              className={styles.heading}
              placeholder="Title"
            />
            <textarea
              rows={1}
              ref={textareaRef4}
              value={editedDetail}
              onChange={(e) => setEditedDetail(e.target.value)}
              className={styles.detail}
              placeholder="Enter task details"
            />
          </div>
          <div className={styles.windowCtn2}>
            <div
              className={styles.CtnChild}
              onClick={() => deleteTask(taskWindowOn.id)}
            >
              <MdDelete />
            </div>
            <span>
              {taskWindowOn.updatedAt
                ? `Edited: ${formatDate(taskWindowOn.updatedAt)}`
                : `Created: ${formatDate(taskWindowOn.createdAt)}`}
            </span>
            <div className={styles.CtnChild} onClick={() => closeTaskWindow()}>
              <MdDataSaverOn />
            </div>
          </div>
        </div>
      )}
      <footer className={styles.appFooter}>
        <p>
          © 2024 Taskify - Created by{" "}
          <a
            href="https://santosh-gamma.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.portfolioLink}
          >
            Santosh Thapa
          </a>
        </p>
      </footer>
    </main>
  );
};

export default Taskify;
