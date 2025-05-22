import { Link } from 'react-router-dom';
import styles from '../assets/NotFoundPage.module.css';

function NotFoundPage() {
    return (
        <div className={styles.notFoundPage}>
            <h1>404 - Страница не найдена</h1>
            <p>Извините, запрашиваемая страница не существует.</p>
            <Link to="/" className={styles.homeLink}>
                Вернуться на главную
            </Link>
        </div>
    );
}

export default NotFoundPage;