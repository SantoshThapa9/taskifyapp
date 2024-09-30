import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import styles from "../styles/hero.module.scss";
import { auth, db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { MdMoreHoriz } from "react-icons/md";

interface Task {
  id: string;
  detail: string;
  createdAt: string;
  userId: string;
}

const TaskItem = ({
  task,
  onDelete,
  onToggleDetails,
  onToggleOptions,
  isDetailsVisible,
  isOptionsVisible,
}: {
  task: Task;
  onDelete: () => void;
  onToggleDetails: () => void;
  onToggleOptions: () => void;
  isDetailsVisible: boolean;
  isOptionsVisible: boolean;
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

const Hero = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskDetail, setTaskDetail] = useState<string>("");
  const [taskDetailsVisible, setTaskDetailsVisible] = useState<{
    [key: string]: boolean;
  }>({});
  const [taskOptionsVisible, setTaskOptionsVisible] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        const tasksRef = collection(db, `users/${currentUser.uid}/tasks`);
        const unsubscribeTasks = onSnapshot(tasksRef, (snapshot) => {
          setTasks(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...(doc.data() as Omit<Task, "id">),
            }))
          );
        });
        return () => unsubscribeTasks();
      } else {
        setTasks([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const addTask = async () => {
    if (!taskDetail.trim()) return;
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    const newTask: Omit<Task, "id"> = {
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
    await addDoc(collection(db, `users/${userId}/tasks`), newTask);
    setTaskDetail("");
  };

  const deleteTask = async (taskId: string) => {
    await deleteDoc(doc(db, `users/${auth.currentUser?.uid}/tasks`, taskId));
  };

  const toggleTaskDetails = (taskId: string) => {
    setTaskDetailsVisible((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const toggleTaskOptions = (taskId: string) => {
    setTaskOptionsVisible((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
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
        <div className={styles.taskList}>
          <h3>Task List</h3>
          {tasks.length === 0 ? (
            <p>No tasks available</p>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={() => deleteTask(task.id)}
                onToggleDetails={() => toggleTaskDetails(task.id)}
                onToggleOptions={() => toggleTaskOptions(task.id)}
                isDetailsVisible={taskDetailsVisible[task.id] || false}
                isOptionsVisible={taskOptionsVisible[task.id] || false}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
