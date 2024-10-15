import { FC } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

const ProtectedRoute: FC = () => {
    const { isAuthenticated } = useAuth()
    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
}

export default ProtectedRoute
