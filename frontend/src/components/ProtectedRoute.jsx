import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

/**
 * Wraps protected routes — redirects to /login if not authenticated.
 * Shows a spinner while the auth state is loading from localStorage.
 */
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <Spinner />;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

export default ProtectedRoute;
