import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Image, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    fetchBooks,
    deleteBook,
    createBook,
    updateBook
} from '../../store/booksSlice';
import { fetchAuthors } from '../../store/authorSlice';
import { fetchGenres } from '../../store/genresSlice.js';
import styles from '../../assets/AdminBooks.module.css';

export default function AdminBooks() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { books } = useSelector(state => state.books);
    const { authors } = useSelector(state => state.authors);
    const { genres } = useSelector(state => state.genres);
    const [showModal, setShowModal] = useState(false);
    const [currentBook, setCurrentBook] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        authorId: '',
        description: '',
        publicationDate: '',
        coverImage: '',
        genres: []
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(fetchBooks());
        dispatch(fetchAuthors());
        dispatch(fetchGenres());
    }, [dispatch]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Название обязательно';
        }

        if (!formData.authorId) {
            newErrors.authorId = 'Автор обязателен';
        }

        if (formData.publicationDate) {
            const date = new Date(formData.publicationDate);
            const currentYear = new Date().getFullYear();

            if (date > new Date()) {
                newErrors.publicationDate = 'Дата не может быть в будущем';
            } else if (date.getFullYear() < 1000) {
                newErrors.publicationDate = 'Некорректная дата';
            } else if (date.getFullYear() > currentYear + 5) {
                newErrors.publicationDate = 'Дата слишком далеко в будущем';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const bookData = {
                ...formData,
                genreIds: formData.genres.map(g => g.id)
            };

            if (currentBook) {
                dispatch(updateBook({ id: currentBook.id, ...bookData }));
            } else {
                dispatch(createBook(bookData));
            }
            setShowModal(false);
        }
    };

    const handleEdit = (book) => {
        setCurrentBook(book);
        setFormData({
            title: book.title,
            authorId: book.authorId,
            description: book.description,
            publicationDate: book.publicationDate,
            coverImage: book.coverImage,
            genres: book.Genres || []
        });
        setShowModal(true);
    };

    const handleGenreToggle = (genre) => {
        setFormData(prev => {
            const isSelected = prev.genres.some(g => g.id === genre.id);
            return {
                ...prev,
                genres: isSelected
                    ? prev.genres.filter(g => g.id !== genre.id)
                    : [...prev.genres, genre]
            };
        });
    };

    const handleManageChapters = (bookId) => {
        navigate(`/admin/books/${bookId}/chapters`);
    };

    return (
        <div className={styles.adminBooks}>
            <div className={styles.header}>
                <h3>Управление книгами</h3>
                <Button 
                    className={styles.addBookBtn}
                    onClick={() => {
                        setCurrentBook(null);
                        setFormData({
                            title: '',
                            authorId: '',
                            description: '',
                            publicationDate: '',
                            coverImage: '',
                            genres: []
                        });
                        setErrors({});
                        setShowModal(true);
                    }}
                >
                    Добавить книгу
                </Button>
            </div>

            <Table striped bordered hover className={styles.table}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Автор</th>
                    <th>Жанры</th>
                    <th>Дата публикации</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {books.map(book => (
                    <tr key={book.id}>
                        <td>{book.id}</td>
                        <td>{book.title}</td>
                        <td>{authors.find(a => a.id === book.authorId)?.lastName || 'Неизвестный автор'}</td>
                        <td>
                            {book.Genres?.map(genre => (
                                <Badge key={genre.id} bg="secondary" className="me-1">
                                    {genre.name}
                                </Badge>
                            ))}
                        </td>
                        <td>{book.publicationDate}</td>
                        <td className={styles.actions}>
                            <Button
                                size="sm"
                                onClick={() => handleManageChapters(book.id)}
                                className={`${styles.actionButton} ${styles.neutralButton} me-2`}
                                title="Управление главами"
                            >
                                Главы
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => handleEdit(book)}
                                className={`${styles.actionButton} ${styles.primaryButton} me-2`}
                            >
                                Редактировать
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => dispatch(deleteBook(book.id))}
                                className={`${styles.actionButton} ${styles.dangerButton}`}
                            >
                                Удалить
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{currentBook ? 'Редактировать' : 'Добавить'} книгу</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Название *</Form.Label>
                            <Form.Control
                                className={styles.input}
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                isInvalid={!!errors.title}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.title}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Автор *</Form.Label>
                            <Form.Select
                                className={styles.input}
                                value={formData.authorId}
                                onChange={(e) => setFormData({...formData, authorId: e.target.value})}
                                isInvalid={!!errors.authorId}
                            >
                                <option value="">Выберите автора</option>
                                {authors.map(author => (
                                    <option key={author.id} value={author.id}>
                                        {`${author.lastName} ${author.firstName}`}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.authorId}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Жанры</Form.Label>
                            <div className={styles.genreSelector}>
                                {genres.map(genre => (
                                    <Button
                                        key={genre.id}
                                        variant={formData.genres.some(g => g.id === genre.id)
                                            ? 'primary'
                                            : 'outline-primary'}
                                        size="sm"
                                        onClick={() => handleGenreToggle(genre)}
                                        className={`${styles.genreButton} ${
                                            formData.genres.some(g => g.id === genre.id) ? styles.selected : ''
                                        }`}
                                    >
                                        {genre.name}
                                    </Button>
                                ))}
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Описание</Form.Label>
                            <Form.Control
                                className={styles.input}
                                as="textarea"
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Дата публикации</Form.Label>
                            <Form.Control
                                className={styles.input}
                                type="date"
                                value={formData.publicationDate}
                                onChange={(e) => setFormData({...formData, publicationDate: e.target.value})}
                                isInvalid={!!errors.publicationDate}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.publicationDate}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Ссылка на обложку</Form.Label>
                            <Form.Control
                                className={styles.input}
                                type="text"
                                value={formData.coverImage}
                                onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
                                placeholder="URL или путь к изображению"
                            />
                            {formData.coverImage && (
                                <div className="mt-2">
                                    <p>Превью обложки:</p>
                                    <Image
                                        src={formData.coverImage}
                                        alt="Превью обложки"
                                        thumbnail
                                        style={{ maxHeight: '200px' }}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/200x300?text=Обложка+не+загружена';
                                        }}
                                    />
                                </div>
                            )}
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Отмена
                        </Button>
                        <Button variant="primary" type="submit">
                            Сохранить
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}