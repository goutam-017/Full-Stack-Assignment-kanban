import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"

const Register = () => {

    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullname, setFullname] = useState('')
    const [loading, setLoading] = useState(false)

    const handleRegistration = async (e) => {
        e.preventDefault()
        setLoading(true)

        const parts = fullname.trim().split(" ")
        const Fname = parts[0] || ""
        const Lname = parts.slice(1).join(" ") || ""

        const userData = {
            first_name: Fname,
            last_name: Lname,
            username,
            email,
            password
        }

        try {
            const resData = await axios.post('http://127.0.0.1:8000/api/auth/register/', userData)

            if (resData.data) {
                toast.success(resData.data.msg)
                navigate('/')
            }

        } catch (error) {

            if (!error.response) {
                toast.error("Network Error. Please try again later.")
            } else {
                const data = error.response.data

                if (data.username) {
                    toast.error(data.username[0])
                }

                if (data.email) {
                    toast.error(data.email[0])
                }

                if (data.password) {
                    toast.error(
                        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
                    )
                }
            }

        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[91.4vh] flex items-center justify-center bg-gray-200">

            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

                <h2 className="text-3xl font-bold text-center text-green-800 mb-6">
                    Create Account
                </h2>

                <form onSubmit={handleRegistration}>
                    <div className="mb-4">
                        <label className="block text-gray-600 mb-1">Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your Full Name"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-green-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-green-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 mb-1">Username</label>
                        <input
                            type="text"
                            placeholder="Enter a Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-green-500"
                        />
                    </div>


                    <div className="mb-6">
                        <label className="block text-gray-600 mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="Set a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-green-500"
                        />
                    </div>

                    <p className="text-sm text-center text-gray-600 mb-4">
                        Already have an account?{" "}
                        <span
                            onClick={() => navigate('/login')}
                            className="text-blue-500 cursor-pointer hover:underline"
                        >
                            Login
                        </span>
                    </p>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-lg text-white font-semibold transition ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                            }`}
                    >
                        {loading ? "Please wait..." : "Sign up"}
                    </button>

                </form>
            </div>
        </div>
    )
}

export default Register