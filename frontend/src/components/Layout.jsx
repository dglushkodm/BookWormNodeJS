import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import styles from '../assets/Layout.module.css';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMe } from "../store/authSlice.js";

function Layout() {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(getMe());
        }
    }, [dispatch]);

    return (
        <div className={styles.layout}>
            <Header />
            <main className={styles.main}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default Layout;