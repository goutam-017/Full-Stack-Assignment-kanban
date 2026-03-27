import React, { useContext, useState, createContext, useEffect } from 'react'
import axiosInstance from '../services/axiosInstance'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem('access') ? true : false
    )
    const [firstName, setFirstName] = useState('')
    const [userId, setUserId] = useState('')

    const getUserName = async () => {
        try {
            const { data } = await axiosInstance.get('api/auth/users/')
            setFirstName(data[0].first_name)
            setUserId(data[0].id)
        } catch (error) {
            console.error('Error fetching user name:', error)
        }
    }
    useEffect(() => {
        if (isLoggedIn) {
            getUserName()
        }
    }, [])

    const value = {
        isLoggedIn, setIsLoggedIn,
        firstName, setFirstName,
        userId, setUserId
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
export { AuthContext }