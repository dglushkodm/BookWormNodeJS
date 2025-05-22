import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedBooks } from '../store/booksSlice.js';
import BookList from '../components/BookList.jsx';
import styles from '../assets/HomePage.module.css';

function HomePage() {
    const dispatch = useDispatch();
    const { featuredBooks, loading, error } = useSelector(state => state.books);

    useEffect(() => {
        dispatch(fetchFeaturedBooks());
    }, [dispatch]);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div className={styles.homePage}>
            <h1>Добро пожаловать в онлайн библиотеку</h1>
            <h2>Рекомендуемые книги</h2>
            <BookList books={featuredBooks} />
        </div>
    );
}

export default HomePage;