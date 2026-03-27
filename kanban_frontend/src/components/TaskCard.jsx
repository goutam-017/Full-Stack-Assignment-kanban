import React, { useEffect, useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import axiosInstance from "../services/axiosInstance"
import { toast } from "react-toastify"
import { FaTrash } from "react-icons/fa"

const TaskCard = ({ task, index, onUpdate, onDelete }) => {
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [desc, setDesc] = useState(task.description);

  const updateTask = async () => {

    try {
      const { data } = await axiosInstance.patch(`/api/tasks/${task.id}/`, {
        title,
        description: desc,
      });
      onUpdate(data)
      console.log("Task updated:", data);
      toast.success("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
    }
    setEdit(false);
  };

  const deleteTask = async () => {
    if (!window.confirm("Are you sure?")) return
    
    try {
      await axiosInstance.delete(`/api/tasks/delete/${task.id}/`);

      onDelete(task.id); // 🔥 remove from UI

      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  useEffect(() => {
    setTitle(task.title);
    setDesc(task.description);
  }, [task]);


  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white p-3 rounded-lg shadow-sm border transition cursor-pointer
            ${snapshot.isDragging ? "bg-blue-50 shadow-md" : "hover:bg-gray-50"}
          `}
        >
          {edit ? (
            <>
              <input
                className="border p-1 rounded w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="border p-1 rounded w-full mt-2"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />

              <button
                onClick={updateTask}
                className="mt-2 px-2 py-1 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </>
          ) : (
            <><button
              onClick={deleteTask}
              className="text-red-500 hover:text-red-700 mt-2 cursor-pointer float-right"
            >
              <FaTrash />
            </button>
              <h3
                className="font-semibold text-gray-800"
                onDoubleClick={() => setEdit(true)}
              >
                {title}
              </h3>

              {desc && (
                <p className="text-sm text-gray-600 mt-1">
                  {desc}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;