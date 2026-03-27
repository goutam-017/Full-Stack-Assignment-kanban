import { useState } from 'react'
import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import BoardPage from "./pages/BoardPage"
import PrivateRoute from './routes/PrivateRoute'
import { ToastContainer } from 'react-toastify'
import Navbar from './components/Navbar'
import CreateBoard from './pages/CreateBoard'
import PublicRoute from './routes/PublicRoute'

function App() {

  return (
    <>
      <ToastContainer />
      <div className="h-screen flex flex-col">
        <div className="h-[60px]">
          <Navbar />
        </div>

        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/dashboard" element={<PrivateRoute> <Dashboard /></PrivateRoute>} />
            <Route path="/create-board" element={<PrivateRoute> <CreateBoard /></PrivateRoute>} />
            <Route path="/board/:id" element={<PrivateRoute><BoardPage /></PrivateRoute>} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App
