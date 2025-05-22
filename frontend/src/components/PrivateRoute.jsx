import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

function PrivateRoute() {
    const { isAuthenticated, user, loading } = useSelector(state => state.auth);
    const token = localStorage.getItem('token');

    if (loading || (token && user === null)) {
        return <div style={{textAlign: 'center', marginTop: '2rem'}}>Загрузка...</div>;
    }

    if (!(isAuthenticated && user && user.id)) {
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

export default PrivateRoute;