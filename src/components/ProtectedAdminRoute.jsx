import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

export default function ProtectedAdminRoute({ children }) {
    const { isAuthenticated, user, isLoading } = useAuth()

    if (isLoading) {
        return null
    }

    if (!isAuthenticated || !user?.isAdmin) {
        return <Navigate to="/" replace />
    }

    return children
}