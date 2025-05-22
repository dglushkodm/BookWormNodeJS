import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function AdminRoute() {
    const { user, isAuthenticated } = useSelector(state => state.auth);

    return isAuthenticated && user?.role === 'admin' ? (
        <Outlet />
    ) : (
        <Navigate to="/" replace />
    );
}

export default AdminRoute;