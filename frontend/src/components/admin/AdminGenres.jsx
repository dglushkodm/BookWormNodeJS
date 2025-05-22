import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Badge, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchGenres,
    deleteGenre,
    createGenre,
    updateGenre,
    fetchBooksByGenre
} from '../../store/genresSlice.js';
import styles from '../../assets/AdminGenres.module.css';

export default function AdminGenres() {
    const dispatch = useDispatch();
    const { genres, booksByGenre, loading, error } = useSelector(state => state.genres);
    const [showModal, setShowModal] = useState(false);
    const [showBooksModal, setShowBooksModal] = useState(false);
    const [currentGenre, setCurrentGenre] = useState(null);
    const [formData, setFormData] = useState({
        name: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(fetchGenres());
    }, [dispatch]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Название жанра обязательно';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Название должно содержать минимум 2 символа';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            if (currentGenre) {
                dispatch(updateGenre({ id: currentGenre.id, ...formData }));
            } else {
                dispatch(createGenre(formData));
            }
            setShowModal(false);
        }
    };

    const handleEdit = (genre) => {
        setCurrentGenre(genre);
        setFormData({
            name: genre.name
        });
        setErrors({});
        setShowModal(true);
    };

    const handleShowBooks = (genreId) => {
        dispatch(fetchBooksByGenre(genreId));
        setShowBooksModal(true);
    };
console.log(genres);
    return (
        <div className={styles.adminGenres}>
            <div className={styles.header}>
                <h3>Управление жанрами</h3>
                {error && <Alert variant="danger">{error}</Alert>}
                <Button
                    variant="primary"
                    onClick={() => {
                        setCurrentGenre(null);
                        setFormData({ name: '' });
                        setErrors({});
                        setShowModal(true);
                    }}
                    disabled={loading}
                >
                    {loading ? 'Загрузка...' : 'Добавить жанр'}
                </Button>
            </div>

            <Table striped bordered hover className={styles.table}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Количество книг</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {genres.map(genre => (
                    <tr key={genre.id}>
                        <td>{genre.id}</td>
                        <td>{genre.name}</td>
                        <td>
                            <Badge
                                bg="info"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleShowBooks(genre.id)}
                            >
                                {genre.booksCount ?? '...'} книг
                            </Badge>
                        </td>
                        <td className={styles.actions}>
                            <Button
                                variant="warning"
                                size="sm"
                                onClick={() => handleEdit(genre)}
                                className={`${styles.actionButton} ${styles.primaryButton} me-2`}
                                disabled={loading}
                            >
                                Редактировать
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => {
                                    if (window.confirm(`Удалить жанр "${genre.name}"?`)) {
                                        dispatch(deleteGenre(genre.id));
                                    }
                                }}
                                className={`${styles.actionButton} ${styles.dangerButton}`}
                                disabled={loading || (genre.booksCount && genre.booksCount > 0)}
                                title={genre.booksCount > 0 ? "Нельзя удалить жанр с книгами" : ""}
                            >
                                Удалить
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {/* Модальное окно для добавления/редактирования жанра */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentGenre ? 'Редактировать' : 'Добавить'} жанр</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Название жанра *</Form.Label>
                            <Form.Control
                                className={styles.input}
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                isInvalid={!!errors.name}
                                disabled={loading}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => setShowModal(false)}
                            disabled={loading}
                        >
                            Отмена
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Сохранение...' : 'Сохранить'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Модальное окно для просмотра книг жанра */}
            <Modal show={showBooksModal} onHide={() => setShowBooksModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Книги жанра</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {booksByGenre.length > 0 ? (
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Название</th>
                                <th>Автор</th>
                            </tr>
                            </thead>
                            <tbody>
                            {booksByGenre.map(book => (
                                <tr key={book.id}>
                                    <td>{book.id}</td>
                                    <td>{book.title}</td>
                                    <td>{book.Author?.firstName} {book.Author?.lastName}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>Нет книг в этом жанре</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowBooksModal(false)}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}