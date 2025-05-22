import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthors } from '../store/authorSlice';
import { fetchGenres } from '../store/genresSlice';
import styles from '../assets/Filters.module.css';

function Filters({ searchTerm, onFilter }) {
    const dispatch = useDispatch();
    const { authors, loading: authorsLoading } = useSelector(state => state.authors);
    const { genres, loading: genresLoading } = useSelector(state => state.genres);

    const [filters, setFilters] = useState({
        genre: '',
        author: '',
        yearFrom: '',
        yearTo: '',
        rateFrom: '',
        sort: ''
    });

    const [genreSearch, setGenreSearch] = useState('');
    const [authorSearch, setAuthorSearch] = useState('');

    useEffect(() => {
        dispatch(fetchAuthors());
        dispatch(fetchGenres());

        const savedFilters = localStorage.getItem('bookFilters');
        if (savedFilters) {
            setFilters(JSON.parse(savedFilters));
        }
    }, [dispatch]);

    useEffect(() => {
        if (Object.values(filters).some(val => val !== '')) {
            localStorage.setItem('bookFilters', JSON.stringify(filters));
        }
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const applyFilters = () => {
        const activeFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== '')
        );
        onFilter(activeFilters);
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
        setGenreSearch('');
        setAuthorSearch('');
        localStorage.removeItem('bookFilters');
        onFilter({});
    };

    const filteredGenres = useMemo(() =>
            genres.filter(genre =>
                genre.name.toLowerCase().includes(genreSearch.toLowerCase())
            ),
        [genres, genreSearch]
    );

    const filteredAuthors = useMemo(() =>
            authors.filter(author =>
                `${author.firstName} ${author.lastName}`
                    .toLowerCase()
                    .includes(authorSearch.toLowerCase())
            ),
        [authors, authorSearch]
    );

    if (authorsLoading || genresLoading) {
        return (
            <div className={styles.filtersContainer}>
                <h3>Фильтры</h3>
                <div className={styles.loading}>Загрузка данных...</div>
            </div>
        );
    }

    return (
        <div className={styles.filtersContainer}>
            <h3>Фильтры</h3>

            <div className={styles.filterGroup}>
                <label htmlFor="genre">Жанр:</label>
                <div className={styles.searchableSelect}>
                    <input
                        type="text"
                        placeholder="Поиск жанра..."
                        value={genreSearch}
                        onChange={(e) => setGenreSearch(e.target.value)}
                        className={styles.searchInput}
                    />
                    <select
                        id="genre"
                        name="genre"
                        value={filters.genre}
                        onChange={handleFilterChange}
                    >
                        <option value="">Все жанры</option>
                        {filteredGenres.map(genre => (
                            <option key={genre.id} value={genre.id}>
                                {genre.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={styles.filterGroup}>
                <label htmlFor="author">Автор:</label>
                <div className={styles.searchableSelect}>
                    <input
                        type="text"
                        placeholder="Поиск автора..."
                        value={authorSearch}
                        onChange={(e) => setAuthorSearch(e.target.value)}
                        className={styles.searchInput}
                    />
                    <select
                        id="author"
                        name="author"
                        value={filters.author}
                        onChange={handleFilterChange}
                    >
                        <option value="">Все авторы</option>
                        {filteredAuthors.map(author => (
                            <option key={author.id} value={author.id}>
                                {author.firstName} {author.lastName}
                            </option>
                        ))}
                    </select>
                </div>
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
                        min="1900"
                        max={new Date().getFullYear()}
                    />
                    <input
                        type="number"
                        placeholder="До"
                        name="yearTo"
                        value={filters.yearTo}
                        onChange={handleFilterChange}
                        min="1900"
                        max={new Date().getFullYear()}
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
                    <option value="4.5">★ 4.5+</option>
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
                <button
                    type="button"
                    onClick={applyFilters}
                    className={styles.applyButton}
                >
                    Применить
                </button>
                <button
                    type="button"
                    onClick={resetFilters}
                    className={styles.resetButton}
                >
                    Сбросить
                </button>
            </div>
        </div>
    );
}

export default Filters;