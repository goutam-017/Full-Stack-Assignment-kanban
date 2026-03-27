import React, { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthProvider"

const Navbar = () => {
  const navigate = useNavigate()
  const { isLoggedIn, firstName } = useContext(AuthContext)



  const handleLogout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    navigate('/')
  }
  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between">

      <Link to="/dashboard" className="text-xl font-bold text-blue-600">
        KanbanBoard
      </Link>
      {
        isLoggedIn ? <><div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="text-gray-700 hover:text-blue-600 transition font-medium"
          >
            Dashboard
          </Link>

          <Link
            to="/create-board"
            className="text-gray-700 hover:text-blue-600 transition font-medium"
          >
            Create Board
          </Link>
        </div>

          <div className="flex items-center gap-4">

            <div className="w-9 h-9 bg-blue-500 text-white flex items-center justify-center rounded-full font-semibold">
              {firstName ? firstName[0].toUpperCase() : 'U'}
            </div>

            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 transition">
              Logout
            </button>
          </div></> : <div className="flex items-center gap-4">
          <button onClick={() => { navigate('/') }} className="bg-blue-500 text-white px-4 py-1.5 rounded hover:bg-blue-600 transition">
            Login
          </button>
          <button onClick={() => { navigate('/register') }} className="bg-green-500 text-white px-4 py-1.5 rounded hover:bg-green-600 transition">
            Register
          </button>
        </div>

      }

    </nav>
  )
}

export default Navbar