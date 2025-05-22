import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites, updateProfile } from '../store/userSlice.js';
import { toast } from 'react-toastify';
import styles from '../assets/ProfilePage.module.css';

function ProfilePage() {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { favorites } = useSelector(state => state.user);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        image: null
    });

    useEffect(() => {
        dispatch(fetchFavorites());
    }, [dispatch]);

    useEffect(() => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            image: null
        });
    }, [user]);

    const getAvatarUrl = () => {
        try {
            if (user?.image && Array.isArray(user.image) && user.image.length > 0) {
                const blob = new Blob([new Uint8Array(user.image)], { type: 'image/jpeg' });
                return URL.createObjectURL(blob);
            }
        } catch (error) {
            console.error('Error processing avatar:', error);
        }
        return 'http://localhost:3000/images/defaultUser.jpg';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const arrayBuffer = reader.result;
                const byteArray = Array.from(new Uint8Array(arrayBuffer));
                setFormData(prev => ({
                    ...prev,
                    image: byteArray
                }));
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updateProfile(formData)).unwrap();
            const updatedUser = await dispatch(getMe()).unwrap();
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setIsEditing(false);
            toast.success('Профиль успешно обновлен');
        } catch (error) {
            toast.error(error.message || 'Ошибка при обновлении профиля');
        }
    };

    return (
        <div className={styles.profilePage}>
            <h1>Мой профиль</h1>

            <div className={styles.profileInfo}>
                <div className={styles.avatarSection}>
                    <img
                        src={isEditing && formData.image ? URL.createObjectURL(new Blob([formData.image])) : getAvatarUrl()}
                        alt="Аватар"
                        className={styles.avatar}
                        onError={(e) => {
                            e.target.src = 'E:/NodeJSCurs3/BookWorm2/backend/materials/images/defaultUser.jpg';
                        }}
                    />
                    {isEditing ? (
                        <form onSubmit={handleSubmit} className={styles.editForm}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">Имя:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="image">Аватар:</label>
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <div className={styles.buttonGroup}>
                                <button type="submit" className={styles.saveButton}>Сохранить</button>
                                <button type="button" onClick={() => setIsEditing(false)} className={styles.cancelButton}>
                                    Отмена
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <h2>{user?.name || 'Пользователь'}</h2>
                            <p>{user?.email || ''}</p>
                            <button onClick={() => setIsEditing(true)} className={styles.editButton}>
                                Редактировать профиль
                            </button>
                        </>
                    )}
                </div>

                <div>
                    <h3>Избранные книги</h3>
                    {favorites?.length > 0 ? (
                        <div className={styles.favoritesList}>
                            {favorites.map(book => (
                                <a key={book.id} href={`/books/${book.id}`} className={styles.favoriteBookCard} style={{ textDecoration: 'none' }}>
                                    <img
                                        src={book.coverImage ? book.coverImage : 'http://localhost:3000/images/defaultBook.jpg'}
                                        alt={book.title}
                                        className={styles.bookCover}
                                        onError={e => { e.target.src = 'http://localhost:3000/images/defaultBook.jpg'; }}
                                    />
                                    <div className={styles.bookInfo}>
                                        <div className={styles.bookTitle}>{book.title}</div>
                                        <div className={styles.bookAuthor}>{book.Author ? `${book.Author.firstName} ${book.Author.lastName}` : ''}</div>
                                        <div className={styles.bookMeta}>
                                            {book.publicationDate && <span>Год: {new Date(book.publicationDate).getFullYear()}</span>}
                                            {book.UserFav?.addedAt && <span>Добавлено: {new Date(book.UserFav.addedAt).toLocaleDateString()}</span>}
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p>У вас пока нет избранных книг</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;