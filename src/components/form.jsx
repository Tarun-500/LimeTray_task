import React, { useEffect, useState, useMemo } from "react";
import { FaTrash } from "react-icons/fa";

const TASKS_KEY = "task-manager-tasks";

const Form = () => {
    const [tasks, setTasks] = useState(() => {
        try {
          const local = localStorage.getItem(TASKS_KEY);
          return local ? JSON.parse(local) : [];
        } catch (err) {
          console.error("Error reading localStorage:", err);
          return [];
        }
      });
      
  const [taskInput, setTaskInput] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(TASKS_KEY);
      if (storedTasks) {
        const parsed = JSON.parse(storedTasks);
        if (Array.isArray(parsed)) setTasks(parsed);
      }
    } catch (err) {
      console.error("Failed to load tasks from localStorage:", err);
    }
  }, []);

 

  useEffect(() => {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error("Error saving to localStorage:", err);
    }
  }, [tasks]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = taskInput.trim();

    if (!trimmed) {
      alert("Task cannot be empty!");
      return;
    }

    if (tasks.some((task) => task.text.toLowerCase() === trimmed.toLowerCase())) {
      alert("Task already exists!");
      return;
    }

    const newTask = {
      id: Date.now(),
      text: trimmed,
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setTaskInput("");
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const filteredTasks = useMemo(() => {
    if (filter === "completed") return tasks.filter((t) => t.completed);
    if (filter === "pending") return tasks.filter((t) => !t.completed);
    return tasks;
  }, [tasks, filter]);

  return (
    <div className="task-manager">
      <h2>Task Manager</h2>

      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          placeholder="Add a new task"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">Add</button>
      </form>

      <div className="filters">
        <button
          className={`btn ${filter === "all" ? "btn-dark" : "btn-primary"}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`btn ${filter === "completed" ? "btn-dark" : "btn-success"}`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
        <button
          className={`btn ${filter === "pending" ? "btn-dark" : "btn-warning"}`}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
      </div>

      <ul className="task-list">
        {filteredTasks.length === 0 ? (
          <li>No tasks to show</li>
        ) : (
          filteredTasks.map((task) => (
            <li key={task.id} className={`task ${task.completed ? "done" : ""}`}>
              <input
                type="checkbox"
                className="checkbox"
                id={`task-${task.id}`}
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              <label htmlFor={`task-${task.id}`}>{task.text}</label>
              <button className="btn-delete" onClick={() => deleteTask(task.id)}>
                <FaTrash />
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Form;
