import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

const isLocalAdminPreviewEnabled =
	typeof window !== 'undefined' &&
	['localhost', '127.0.0.1'].includes(window.location.hostname) &&
	import.meta.env.VITE_ADMIN_PREVIEW_MODE === 'true'

export default function ProtectedAdminRoute({ children }) {
    const { isAuthenticated, user, isLoading } = useAuth()

    if (isLoading) {
        return null
    }

    if (isLocalAdminPreviewEnabled) {
        return children
    }

    if (!isAuthenticated || !user?.isAdmin) {
        return <Navigate to="/" replace />
    }

    return children
}