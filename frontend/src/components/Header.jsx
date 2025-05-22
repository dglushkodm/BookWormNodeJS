import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice.js';
import styles from '../assets/Header.module.css';
import { FaBook, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaCrown } from 'react-icons/fa';

function Header() {
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const getAvatarUrl = () => {
        if (!user?.image) {
            // Download and convert default image to blob
            return fetch('https://www.dropbox.com/scl/fi/8nsi03tet9f0j13kse4yd/defaultUser.png?rlkey=6bh6bsogmextjby72wswkszco&st=z5vx9jfa&raw=1')
                .then(response => response.blob())
                .then(blob => URL.createObjectURL(blob))
                .catch(error => {
                    console.error('Error loading default avatar:', error);
                    return null;
                });
        }
        try {
            if (Array.isArray(user.image)) {
                const blob = new Blob([new Uint8Array(user.image)], { type: 'image/jpeg' });
                return URL.createObjectURL(blob);
            }
        } catch (error) {
            console.error('Error processing avatar:', error);
        }
        return null;
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    <FaBook className={styles.logoIcon} />
                    BookWorm
                </Link>

                <nav className={styles.nav}>
                    <Link to="/books" className={styles.navLink}>
                        <FaBook className={styles.navIcon} />
                        <span>Книги</span>
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link to="/profile" className={styles.navLink}>
                                {user?.image ? (
                                    <img 
                                        src={getAvatarUrl()} 
                                        alt="Avatar" 
                                        className={styles.avatar}
                                        onError={(e) => {
                                            e.target.src = 'https://www.dropbox.com/scl/fi/8nsi03tet9f0j13kse4yd/defaultUser.png?rlkey=6bh6bsogmextjby72wswkszco&st=z5vx9jfa&raw=1';
                                        }}
                                    />
                                ) : (
                                    <FaUser className={styles.navIcon} />
                                )}
                                <span>Профиль</span>
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className={styles.navLink}>
                                    <FaCrown className={styles.navIcon} />
                                    <span>Админ</span>
                                </Link>
                            )}
                            <button onClick={handleLogout} className={styles.logoutBtn}>
                                <FaSignOutAlt className={styles.navIcon} />
                                <span>Выйти</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={styles.navLink}>
                                <FaSignInAlt className={styles.navIcon} />
                                <span>Войти</span>
                            </Link>
                            <Link to="/register" className={styles.navLink}>
                                <FaUserPlus className={styles.navIcon} />
                                <span>Регистрация</span>
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;