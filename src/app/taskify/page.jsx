"use client";

import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { auth, db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { MdMoreHoriz } from "react-icons/md";
import styles from "../styles/taskify.module.scss";

const TaskItem = ({
  task,
  onDelete,
  onToggleDetails,
  onToggleOptions,
  isDetailsVisible,
  isOptionsVisible,
}) => {
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const swipeHandlers = useSwipeable({
    onSwiping: ({ deltaX, deltaY }) => {
      const isVerticalSwipe = Math.abs(deltaY) > Math.abs(deltaX);
      setTranslateX(isVerticalSwipe ? 0 : deltaX);

      if (!isVerticalSwipe && Math.abs(deltaX) > 100) {
        setIsSwiping(true);
      } else {
        setTranslateX(0);
      }
    },
    onSwiped: ({ dir }) => {
      setIsSwiping(false);

      if (translateX < -100 && dir === "Left") {
        onDelete();
      }
      setTranslateX(0);
    },
    preventScrollOnSwipe: false,
    trackMouse: true,
  });

  return (
    <div
      {...swipeHandlers}
      className={styles.taskItem}
      style={{
        transform: `translateX(${translateX}px)`,
        transition: isSwiping ? "none" : "transform 0.3s ease-out",
      }}
    >
      <span>{task.detail}</span>
      <MdMoreHoriz className={styles.optionsIcon} onClick={onToggleOptions} />
      {isOptionsVisible && (
        <div className={styles.taskOptions}>
          <button onClick={onToggleDetails} className={styles.detailsToggle}>
            {isDetailsVisible ? "Hide Details" : "View Details"}
          </button>
          <button onClick={onDelete} className={styles.deleteButton}>
            Delete
          </button>
        </div>
      )}
      {isDetailsVisible && (
        <div className={styles.taskDetails}>
          <p>Created at: {task.createdAt}</p>
        </div>
      )}
    </div>
  );
};

const Taskify = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskDetail, setTaskDetail] = useState("");
  const [taskDetailsVisible, setTaskDetailsVisible] = useState({});
  const [taskOptionsVisible, setTaskOptionsVisible] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        const tasksRef = collection(db, `users/${currentUser.uid}/tasks`);
        const unsubscribeTasks = onSnapshot(tasksRef, (snapshot) => {
          setTasks(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
          setLoading(false);
        });
        return () => unsubscribeTasks();
      } else {
        setTasks([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const addTask = async () => {
    if (!taskDetail.trim()) {
      setError("Please Enter Task Details!");
      return;
    }
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setError("Please Sign-in to Add Tasks");
      return;
    }

    const newTask = {
      detail: taskDetail,
      createdAt: new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      userId,
    };
    setError(" ");
    await addDoc(collection(db, `users/${userId}/tasks`), newTask);
    setTaskDetail("");
  };

  const deleteTask = async (taskId) => {
    await deleteDoc(doc(db, `users/${auth.currentUser?.uid}/tasks`, taskId));
  };

  const toggleTaskOptions = (taskId) => {
    setTaskOptionsVisible((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const toggleTaskDetails = (taskId) => {
    setTaskDetailsVisible((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  return (
    <div className={styles.container}>
      <h1>Taskify</h1>
      <div className={styles.addTask}>
        <input
          type="text"
          value={taskDetail}
          onChange={(e) => setTaskDetail(e.target.value)}
          placeholder="Enter task details"
          className={styles.input}
        />
        <button onClick={addTask} className={styles.addButton}>
          Add Task
        </button>
      </div>
      <div className={styles.taskifycontainer}>
        {loading ? (
          <span className={styles.loader}></span>
        ) : (
          <div className={styles.taskList}>
            <p className={styles.errorMessage}>{error}</p>
            <h3>Task List</h3>
            {tasks.length === 0 ? (
              <p>No tasks available</p>
            ) : (
              tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onDelete={() => deleteTask(task.id)}
                  onToggleOptions={() => toggleTaskOptions(task.id)}
                  onToggleDetails={() => {
                    toggleTaskDetails(task.id);
                    toggleTaskOptions(task.id);
                  }}
                  isOptionsVisible={taskOptionsVisible[task.id] || false}
                  isDetailsVisible={taskDetailsVisible[task.id] || false}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Taskify;
