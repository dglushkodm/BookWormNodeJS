import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchBookById, rateBook } from '../store/booksSlice.js';
import { toggleFavorite, fetchFavorites } from '../store/userSlice.js';
import ChapterList from '../components/ChapterList.jsx';
import Rating from '../components/Rating.jsx';
import Comments from '../components/Comments.jsx';
import styles from '../assets/BookPage.module.css';

function BookPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { book, loading, error } = useSelector(state => state.books);
    const { favorites } = useSelector(state => state.user);
    const { user } = useSelector(state => state.auth);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        dispatch(fetchBookById(id))
        dispatch(fetchFavorites());
    }, [dispatch, id]);

    const handleRate = async (selectedRating) => {
        if (!user) {
            toast.warning('Для оценки книги необходимо войти в систему', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        if (selectedRating > 0 && selectedRating <= 5) {
            try {
                await dispatch(rateBook({ bookId: id, rating: selectedRating })).unwrap();
                dispatch(fetchBookById(id));
                toast.success('Спасибо за вашу оценку!', {
                    position: "bottom-right",
                    autoClose: 2000,
                });
            } catch (error) {
                console.error('Ошибка при оценке книги:', error);
                toast.error('Произошла ошибка при оценке книги', {
                    position: "bottom-right",
                    autoClose: 3000,
                });
            }
        }
    };

    const handleToggleFavorite = () => {
        if (!user) {
            toast.warning('Для добавления в избранное необходимо войти в систему', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        const isCurrentlyFavorite = favorites.some(fav => fav.id === book.id);

        dispatch(toggleFavorite(book.id))
            .unwrap()
            .then(() => {
                toast.success(
                    isCurrentlyFavorite
                        ? 'Книга удалена из избранного'
                        : 'Книга добавлена в избранное',
                    {
                        position: "bottom-right",
                        autoClose: 2000,
                    }
                );
            })
            .catch(error => {
                console.error('Ошибка при изменении избранного:', error);
                toast.error('Произошла ошибка при изменении избранного', {
                    position: "bottom-right",
                    autoClose: 3000,
                });
            });
    };

    const handleAddComment = async (content) => {
        try {
            // Убедимся, что id это число
            const bookId = parseInt(id);
            if (isNaN(bookId)) {
                throw new Error('Invalid book ID');
            }

            const response = await fetch(`http://localhost:3000/api/comments/book/${bookId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ content })
            });

            if (!response.ok) {
                throw new Error('Failed to add comment');
            }

            dispatch(fetchBookById(id));
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    };

    const handleUpdateComment = async (commentId, content) => {
        try {
            const response = await fetch(`http://localhost:3000/api/comments/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ content })
            });

            if (!response.ok) {
                throw new Error('Failed to update comment');
            }

            dispatch(fetchBookById(id));
        } catch (error) {
            console.error('Error updating comment:', error);
            throw error;
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete comment');
            }

            dispatch(fetchBookById(id));
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    };

    if (error) return <div>Ошибка: {error}</div>;
    if (!book) return <div>Книга не найдена</div>;

    console.log('User data:', user); // Добавьте перед return
    console.log('Book data:', book); // Добавьте перед return
    console.log('Favorites:', favorites); // Добавьте перед return
    return (
        <div className={styles.bookPage}>
            <div className={styles.bookHeader}>
                <img src={`${book.coverImage}`} alt={book.title} className={styles.bookImage} />

                <div className={styles.bookInfo}>
                    <h1>{book.title}</h1>
                    <p>Автор: {book.Author?.firstName} {book.Author?.lastName}</p>
                    <p>Год публикации: {book.publicationDate ? new Date(book.publicationDate).getFullYear() : ''}</p>

                    <div className={styles.ratingContainer}>
                        <div className={styles.averageRating}>
                            <span className={styles.ratingValue}>
                                {book.rate ? Number(book.rate).toFixed(1) : 'Нет оценок'}
                            </span>
                            <span className={styles.ratingMax}>/5</span>
                        </div>

                        <Rating
                            onChange={handleRate}
                        />
                    </div>
                    <div>
                        {user && (
                            <button
                                onClick={handleToggleFavorite}
                                className={`${styles.favoriteButton} ${
                                    favorites.some(fav => fav.id === book.id) ? styles.favorited : ''
                                }`}
                            >
                                {favorites.some(fav => fav.id === book.id) ? 'В избранном' : 'В избранное'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.tabs}>
                <button
                    className={activeTab === 'description' ? styles.active : ''}
                    onClick={() => setActiveTab('description')}
                >
                    Описание
                </button>
                <button
                    className={activeTab === 'chapters' ? styles.active : ''}
                    onClick={() => setActiveTab('chapters')}
                >
                    Главы
                </button>
                <button
                    className={activeTab === 'comments' ? styles.active : ''}
                    onClick={() => setActiveTab('comments')}
                >
                    Комментарии
                </button>
            </div>

            <div className={styles.tabContent}>
                {activeTab === 'description' ? (
                    <>
                        <h3>Полное описание</h3>
                        <p>{book.description}</p>
                    </>
                ) : activeTab === 'chapters' ? (
                    <ChapterList bookId={id} />
                ) : (
                    <Comments
                        bookId={id}
                        comments={book.Comments}
                        onAddComment={handleAddComment}
                        onUpdateComment={handleUpdateComment}
                        onDeleteComment={handleDeleteComment}
                    />
                )}
            </div>
        </div>
    );
}

export default BookPage;