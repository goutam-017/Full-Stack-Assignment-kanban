import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../services/axiosInstance'

const Dashboard = () => {

  const [boards, setBoards] = useState([])

  const fetchBoards = async () => {
    try {
      const { data } = await axiosInstance.get('/api/boards/')
      setBoards(data)
    } catch (error) {
      console.error('Error fetching boards:', error)
    }
  }


  useEffect(() => {
    fetchBoards()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Boards</h1>

      <div className="grid grid-cols-3 gap-4">
        {boards.map((b) => (
          <Link key={b.id} to={`/board/${b.id}`}>
            <div className="p-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
              {b.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Dashboard