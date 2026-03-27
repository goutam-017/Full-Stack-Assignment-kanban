import React, { useContext, useEffect, useRef, useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import axiosInstance from "../services/axiosInstance"
import { AuthContext } from "../context/AuthProvider"
import { toast } from "react-toastify";

const List = ({ list, index }) => {
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [hide, setHide] = useState(true)
  const { userId } = useContext(AuthContext)

  const [tasks, setTasks] = useState(list.tasks || []);


  const createTask = async (e) => {
    e.preventDefault()
    const position =
      list.tasks && list.tasks.length > 0
        ? Number(list.tasks[list.tasks.length - 1].position || 0) + 1
        : 1;

    const postData = {
      title,
      description: desc,
      due_date: dueDate,
      position,
      list: list.id || list.list_id,
      assigned_to: userId,
    };

    try {
      const { data } = await axiosInstance.post("api/tasks/", postData)
      setTasks((prev) => [...prev, data]);

      setTitle("");
      setDesc("");
      setDueDate("");
      setHide(true);
      toast.success("Task created successfully!");

    } catch (error) {
      console.error("Error creating task:", error.response?.data || error.message);
    }
  }

  const handleUpdateTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  useEffect(() => {
    setTasks(list.tasks || []);
  }, [list.tasks]);

  const formRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setHide(true);
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setHide(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);


  return (
    <div ref={formRef} className="bg-gray-100 rounded-xl p-4 w-full shadow-sm">

      <h2 className="font-semibold text-gray-800 mb-3 text-lg">
        {list.title}
      </h2>

      <Droppable droppableId={String(list.list_id || list.id)}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 min-h-[50px] p-1 rounded-md transition 
              ${snapshot.isDraggingOver ? "bg-blue-100" : "bg-transparent"}`}
          >
            {tasks.map((task, i) => (
              <TaskCard
                key={task.id ? `task-${task.id}` : `task-${list.list_id}-${i}`}
                task={task}
                index={i}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="mt-2">
        {
          !hide &&
          <form onSubmit={createTask} className="space-y-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="border p-2 w-full rounded"
              required
            />

            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Description"
              className="border p-2 w-full rounded"
              required
            />

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border p-2 w-full rounded"
              required
            />
            <button type="submit" className="mt-3 w-full text-sm text-gray-600 hover:text-black hover:bg-gray-200 rounded-lg py-2 transition">
              + Add Task
            </button>
          </form>

        }

        {
          hide && <button onClick={() => setHide(false)} className="mt-3 w-full text-sm text-gray-600 hover:text-black hover:bg-gray-200 rounded-lg py-2 transition">
            + Add Task
          </button>
        }
      </div>
    </div>
  );
};

export default List;