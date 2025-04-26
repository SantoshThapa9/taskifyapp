"use client";

import { useState, useEffect, useRef } from "react";
import { auth, db } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import styles from "./styles/taskify.module.scss";
import NavBar from "./components/NavBar";
import clsx from "clsx";
import { MdDataSaverOn } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/navigation";

const Taskify = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskDetail, setTaskDetail] = useState("");
  const [taskHeading, setTaskHeading] = useState("");
  const [isTakingInput, SetIsTakingInput] = useState(false);
  const [taskWindowOn, setTaskWindowOn] = useState(null);
  const unsubscribeRef = useRef(null);
  const [editedHeading, setEditedHeading] = useState("");
  const [editedDetail, setEditedDetail] = useState("");
  const [isListView, setIsListView] = useState(() => {
    const savedView = localStorage.getItem("isListView");
    return savedView ? JSON.parse(savedView) : false;
  });

  const taskWindowRef = useRef(null);

  const router = useRouter();

  const addTask = async () => {
    const heading = textareaRef.current?.value.trim() || "";
    const detail = textareaRef2.current?.value.trim() || "";

    if (!heading && !detail) return;
    const userId = auth.currentUser?.uid;
    if (!userId) {
      if (window.confirm("Please Sign-in to Add Tasks")) router.push("/login");
      return;
    }
    setTaskDetail("");
    setTaskHeading("");
    SetIsTakingInput(false);

    const newTask = {
      heading,
      detail,
      createdAt: new Date(),
      updatedAt: null,
      userId,
    };
    await addDoc(collection(db, `users/${userId}/tasks`), newTask);
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
    if (userId && taskWindowOn?.id) {
      setTaskWindowOn(null);
      const taskRef = doc(db, `users/${userId}/tasks`, taskWindowOn.id);
      if (
        editedHeading !== taskWindowOn.heading ||
        editedDetail !== taskWindowOn.detail
      ) {
        await updateDoc(taskRef, {
          heading: editedHeading,
          detail: editedDetail,
          updatedAt: new Date(),
          createdAt: null,
        });
      }
    }
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

  const getData = () => {
    setLoading(true);
    setTimeout(() => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }

      onAuthStateChanged(auth, (user) => {
        if (!user) {
          setTasks([]);
          setLoading(false);
          return;
        }

        const tasksRef = collection(db, `users/${user.uid}/tasks`);
        const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
          setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
          setLoading(false);
        });

        unsubscribeRef.current = unsubscribe;
      });
    }, 600);
  };

  useEffect(() => {
    getData();
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const deleteTask = async (taskId) => {
    closeTaskWindow();
    const userId = auth.currentUser?.uid;
    if (userId) await deleteDoc(doc(db, `users/${userId}/tasks`, taskId));
  };

  const deleteAllTasks = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete all tasks?"
    );
    if (!confirmDelete) return;

    const tasksRef = collection(db, `users/${userId}/tasks`);
    const snapshot = await getDocs(tasksRef);

    const deletePromises = snapshot.docs.map((docItem) =>
      deleteDoc(doc(db, `users/${userId}/tasks`, docItem.id))
    );

    await Promise.all(deletePromises);
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 480;

  const headingLimit = isMobile ? 50 : 100;
  const detailLimit = isMobile ? 150 : 500;

  const formatDate = (date) => {
    const formattedDate = date instanceof Date ? date : new Date(date);

    if (isNaN(formattedDate.getTime())) {
      // Check if it's a valid date
      return "Invalid Date";
    }

    return formattedDate.toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

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
          <div className={styles.box2} onClick={addTask}>
            <MdDataSaverOn />
          </div>
        </div>
      </div>
      {loading ? (
        <span className={styles.loader} />
      ) : tasks.length !== 0 ? (
        <div
          className={clsx(
            styles.taskParentCtn,
            isListView ? styles.listView : styles.gridView
          )}
        >
          {tasks
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

                  {taskWindowOn?.id === task.id && (
                    <div
                      ref={taskWindowRef}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className={styles.taskWindow}
                    >
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
                          onClick={() => deleteTask(task.id)}
                        >
                          <MdDelete />
                        </div>
                        <span>
                          {task.updatedAt
                            ? `Edited: ${formatDate(task.updatedAt.toDate())}`
                            : `Created: ${formatDate(task.createdAt.toDate())}`}
                        </span>

                        <div
                          className={styles.CtnChild}
                          onClick={() => closeTaskWindow()}
                        >
                          <MdDataSaverOn />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <span style={{ marginTop: "10dvh" }}>No tasks available</span>
      )}
    </main>
  );
};

export default Taskify;
