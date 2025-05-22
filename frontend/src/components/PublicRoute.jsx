import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

function PublicRoute() {
    const { isAuthenticated } = useSelector(state => state.auth);

    if (!isAuthenticated) {
        toast.error('Для доступа к этой странице необходимо авторизоваться', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default PublicRoute; 