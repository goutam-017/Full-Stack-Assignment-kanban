import React from 'react'
import { useParams } from "react-router-dom";
import Board from "../components/Board";

const BoardPage = () => {
  const { id } = useParams();
  return <Board boardId={id} />
}

export default BoardPage
