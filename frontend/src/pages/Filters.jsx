import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGenres, fetchAuthors } from '../store/metaSlice';
import styles from '../assets/Filters.module.css';

function Filters() {
    const dispatch = useDispatch();
    const { genres, authors } = useSelector(state => state.meta);
    const [filters, setFilters] = useState({
        genre: '',
        author: '',
        yearFrom: '',
        yearTo: '',
        rateFrom: '',
        sort: ''
    });

    useEffect(() => {
        dispatch(fetchGenres());
        dispatch(fetchAuthors());
    }, [dispatch]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const applyFilters = () => {
        dispatch(filterBooks(filters));
    };

    const resetFilters = () => {
        setFilters({
            genre: '',
            author: '',
            yearFrom: '',
            yearTo: '',
            rateFrom: '',
            sort: ''
        });
        dispatch(filterBooks({}));
    };

    return (
        <div className={styles.filtersContainer}>
            <h3>Фильтры</h3>

            <div className={styles.filterGroup}>
                <label htmlFor="genre">Жанр:</label>
                <select
                    id="genre"
                    name="genre"
                    value={filters.genre}
                    onChange={handleFilterChange}
                >
                    <option value="">Все жанры</option>
                    {genres.map(genre => (
                        <option key={genre.id} value={genre.id}>{genre.name}</option>
                    ))}
                </select>
            </div>

            <div className={styles.filterGroup}>
                <label htmlFor="author">Автор:</label>
                <select
                    id="author"
                    name="author"
                    value={filters.author}
                    onChange={handleFilterChange}
                >
                    <option value="">Все авторы</option>
                    {authors.map(author => (
                        <option key={author.id} value={author.id}>
                            {author.firstName} {author.lastName}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.filterGroup}>
                <label>Год издания:</label>
                <div className={styles.rangeInputs}>
                    <input
                        type="number"
                        placeholder="От"
                        name="yearFrom"
                        value={filters.yearFrom}
                        onChange={handleFilterChange}
                    />
                    <input
                        type="number"
                        placeholder="До"
                        name="yearTo"
                        value={filters.yearTo}
                        onChange={handleFilterChange}
                    />
                </div>
            </div>

            <div className={styles.filterGroup}>
                <label htmlFor="rateFrom">Рейтинг от:</label>
                <select
                    id="rateFrom"
                    name="rateFrom"
                    value={filters.rateFrom}
                    onChange={handleFilterChange}
                >
                    <option value="">Любой</option>
                    <option value="3">★ 3+</option>
                    <option value="4">★ 4+</option>
                </select>
            </div>

            <div className={styles.filterGroup}>
                <label htmlFor="sort">Сортировка:</label>
                <select
                    id="sort"
                    name="sort"
                    value={filters.sort}
                    onChange={handleFilterChange}
                >
                    <option value="">По умолчанию</option>
                    <option value="name_asc">По названию (А-Я)</option>
                    <option value="name_desc">По названию (Я-А)</option>
                    <option value="year_asc">По году (старые)</option>
                    <option value="year_desc">По году (новые)</option>
                    <option value="rate_asc">По рейтингу (низкий)</option>
                    <option value="rate_desc">По рейтингу (высокий)</option>
                </select>
            </div>

            <div className={styles.filterButtons}>
                <button onClick={applyFilters} className={styles.applyButton}>
                    Применить
                </button>
                <button onClick={resetFilters} className={styles.resetButton}>
                    Сбросить
                </button>
            </div>
        </div>
    );
}

export default Filters;