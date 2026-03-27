import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { AuthContext } from "../context/AuthProvider"

const Login = () => {

  const { setIsLoggedIn } = useContext(AuthContext)
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    const userData = { username, password }

    try {
      const resData = await axios.post('http://127.0.0.1:8000/api/auth/login/', userData)

      localStorage.setItem('access', resData.data.access_token)
      localStorage.setItem('refresh', resData.data.refresh_token)

      setIsLoggedIn(true)
      setUsername('')
      setPassword('')
      navigate('/dashboard')

      toast.success(resData.data.msg)

    } catch (error) {
      console.log(error.response)
      if (!error.response) {
        toast.error("Network Error. Please try again later.")
      } else {
        toast.error(error.response.data.msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[91.4vh] flex items-center justify-center bg-gray-200">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">
          Login
        </h2>

        <form onSubmit={handleLogin}>

          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Username</label>
            <input
              type="text"
              placeholder="Enter your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <p className="text-sm text-center text-gray-600 mb-4">
            Don't have an account?{" "}
            <span
              onClick={() => navigate('/register')}
              className="text-green-600 cursor-pointer hover:underline"
            >
              Signup
            </span>
          </p>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold transition ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
              }`}
          >
            {loading ? "Please wait..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  )
}

export default Login