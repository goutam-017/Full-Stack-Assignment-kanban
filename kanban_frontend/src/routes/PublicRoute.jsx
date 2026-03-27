import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthProvider'

const PublicRoute = ({ children }) => {
    const { isLoggedIn } = useContext(AuthContext)
    return !isLoggedIn ? (
        children
    ) : (
        <Navigate to='/dashboard' />
    )
}

export default PublicRoute