import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageSpinner } from '../components/ui/Spinner';

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
export default function ProtectedRoute({ children }) {
    const { isAuthed, loading } = useAuth();

    if (loading) {
        return <PageSpinner message="Verifying session..." />;
    }

    if (!isAuthed) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
