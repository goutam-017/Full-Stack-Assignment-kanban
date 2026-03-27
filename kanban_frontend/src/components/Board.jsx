import React, { useEffect, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import List from "./List";
import axiosInstance from "../services/axiosInstance"
import { toast } from "react-toastify";
import { connectSocket, getSocket } from "../services/socket"

const Board = ({ boardId }) => {
  const [lists, setLists] = useState([]);

  const [newList, setNewList] = useState("")



  useEffect(() => {
    console.log("Board ID:", boardId);
    if (!boardId) return
    console.log("Board ID:", boardId);

    const fetchBoard = async () => {
      try {
        const { data } = await axiosInstance.get(`api/boards/${boardId}/`);
        console.log("Fetched board:", data);
        setLists(data.lists);
      } catch (error) {
        console.error("Error fetching board:", error);
      }
    };

    fetchBoard();
  }, [boardId]);

  const createList = async (e) => {
    e.preventDefault()
    try {
      if (!newList.trim()) return;

      const newPosition = lists.length + 1;

      console.log(Number(newPosition))
      const { data } = await axiosInstance.post("api/lists/", {
        title: newList,
        board: boardId,
        position: Number(newPosition),
      });

      setNewList("")
      setLists((prev) => [...prev, data])
      toast.success("List created successfully!")

    } catch (error) {
      console.error("Error creating list:", error.response?.data);
    }
  }

  // Drag logic

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    const newLists = [...lists];

    const sourceList = newLists.find(
      (list) => list.list_id.toString() === source.droppableId
    );

    const destList = newLists.find(
      (list) => list.list_id.toString() === destination.droppableId
    );

    const [movedTask] = sourceList.tasks.splice(source.index, 1);
    destList.tasks.splice(destination.index, 0, movedTask);

    setLists(newLists);

    // ✅ Send via existing socket
    const socket = getSocket();

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "task_moved",
          board_id: movedTask.board, // optional but useful
          task_id: movedTask.id,
          source_list_id: sourceList.list_id,
          destination_list_id: destList.list_id,
          source_index: source.index,
          destination_index: destination.index,
        })
      );
    }
  };

  useEffect(() => {
    const socket = connectSocket(boardId);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "task_moved") {
        console.log("📡 Received:", data);

        setLists((prevLists) => {
          const newLists = [...prevLists];

          const sourceList = newLists.find(
            (l) => l.list_id === data.source_list_id
          );

          const destList = newLists.find(
            (l) => l.list_id === data.destination_list_id
          );

          if (!sourceList || !destList) return prevLists;

          const taskIndex = sourceList.tasks.findIndex(
            (t) => t.id === data.task_id
          );

          if (taskIndex === -1) return prevLists;

          const [task] = sourceList.tasks.splice(taskIndex, 1);
          destList.tasks.splice(data.destination_index, 0, task);

          return newLists;
        });
      }
    };

    // ✅ cleanup when component unmounts
    return () => {
      socket.close();
    };
  }, [boardId])


  return (
    <div className="p-4">
      <form onSubmit={createList} className="flex gap-2 p-4 justify-center mt-2">
        <input
          value={newList}
          onChange={(e) => setNewList(e.target.value)}
          placeholder="New List"
          className="border p-2 rounded"
          required
        />

        <button type="submit" className="bg-green-500 text-white px-3 cursor-pointer rounded">
          Add List
        </button>
      </form>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 gap-4 p-4">
          {lists.map((list, index) => (
            <List key={list.list_id} list={list} index={index} />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Board;