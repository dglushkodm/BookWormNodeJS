import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, filterBooks } from '../store/booksSlice.js';
import BookList from '../components/BookList.jsx';
import Filters from '../components/Filters.jsx';
import styles from '../assets/BooksPage.module.css';

function BooksPage() {
    const dispatch = useDispatch();
    const { books, loading, error } = useSelector(state => state.books);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchBooks());
    }, [dispatch]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (filters) => {
        dispatch(filterBooks({ ...filters, search: searchTerm}));
    };

    const handleFilter = (filters) => {
        dispatch(filterBooks({ ...filters}));
    };


    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div className={styles.booksPage}>
            <h1>Каталог книг</h1>

            <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                <input
                    type="text"
                    placeholder="Поиск по названию"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button type="submit">Найти</button>
            </form>

            <div className={styles.catalogLayout}>
                <div className={styles.catalogLeft}>
                    <BookList books={books} />
                </div>
                <div className={styles.catalogRight}>
                    <Filters onFilter={handleFilter}/>
                </div>
            </div>
        </div>
    );
}

export default BooksPage;