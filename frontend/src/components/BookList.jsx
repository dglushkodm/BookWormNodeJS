import { Link } from 'react-router-dom';
import styles from '../assets/BookList.module.css';
// import DropboxImage from './DropboxImage';

function BookList({ books }) {
    const getRatingClass = (rate) => {
        if (!rate) return styles.ratingLow;
        if (rate < 2) return styles.ratingLow;
        if (rate < 3.6) return styles.ratingMedium;
        return styles.ratingHigh;
    };

    return (
        <div className={styles.bookList}>
            {books.length > 0 ? (
                books.map(book => (
                    <div key={book.id} className={styles.bookCard}>
                        <Link to={`/books/${book.id}`} className={styles.bookLink}>
                            <img
                                src={book.coverImage}
                                alt={book.title}
                                className={styles.bookImage}
                                onError={(e) => {
                                    e.target.src = '/images/book-default.jpg';
                                }}
                            />
                            <span className={`${styles.bookRating} ${getRatingClass(book.rate)}`}>
                                ★ {book.rate ? Number(book.rate).toFixed(1) : '0.0'}
                            </span>
                            <div className={styles.bookInfo}>
                                <h3 className={styles.bookTitle}>{book.title}</h3>
                                <p className={styles.bookAuthor}>{book.Author?.firstName +  ' ' + book.Author?.lastName || 'Неизвестный автор'}</p>
                                <div className={styles.bookMeta}>
                                    <span>{book.publicationDate ? new Date(book.publicationDate).getFullYear() : ''}</span>
                                </div>
                                <div className={styles.bookExtra}>
                                    {book.description && (
                                        <div className={styles.bookDescription}>
                                            {book.description.split(/[.!?]/)[0] + '.'}
                                        </div>
                                    )}
                                    {typeof book.chaptersCount !== 'undefined' && (
                                        <div className={styles.bookChapters}>
                                            Глав: {book.chaptersCount}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </div>
                ))
            ) : (
                <div className={styles.noBooks}>Книги не найдены</div>
            )}
        </div>
    );
}

export default BookList;