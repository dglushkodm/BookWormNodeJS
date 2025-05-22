import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchAuthors,
    deleteAuthor,
    createAuthor,
    updateAuthor
} from '../../store/authorSlice';
import styles from '../../assets/AdminBooks.module.css';

export default function AdminAuthors() {
    const dispatch = useDispatch();
    const { authors } = useSelector(state => state.authors);
    const [showModal, setShowModal] = useState(false);
    const [currentAuthor, setCurrentAuthor] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        biography: '',
        birthDate: '',
        photo: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(fetchAuthors());
    }, [dispatch]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Имя обязательно';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Фамилия обязательна';
        }

        if (formData.birthDate) {
            const birthDate = new Date(formData.birthDate);
            if (birthDate > new Date()) {
                newErrors.birthDate = 'Дата рождения не может быть в будущем';
            }
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            if (currentAuthor) {
                dispatch(updateAuthor({ id: currentAuthor.id, ...formData }));
            } else {
                dispatch(createAuthor(formData));
            }
            setShowModal(false);
        }
    };

    const handleEdit = (author) => {
        setCurrentAuthor(author);
        setFormData({
            firstName: author.firstName,
            lastName: author.lastName,
            biography: author.biography,
            birthDate: author.birthDate,
            photo: author.photo
        });
        setShowModal(true);
    };

    return (
        <div className={styles.adminBooks}>
            <div className={styles.header}>
                <h3>Управление авторами</h3>
                <Button variant="primary" onClick={() => {
                    setCurrentAuthor(null);
                    setFormData({
                        firstName: '',
                        lastName: '',
                        biography: '',
                        birthDate: '',
                        photo: ''
                    });
                    setErrors({});
                    setShowModal(true);
                }}>
                    Добавить автора
                </Button>
            </div>

            <Table striped bordered hover className={styles.table}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Фамилия</th>
                    <th>Имя</th>
                    <th>Дата рождения</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {authors.map(author => (
                    <tr key={author.id}>
                        <td>{author.id}</td>
                        <td>{author.lastName}</td>
                        <td>{author.firstName}</td>
                        <td>{author.birthDate}</td>
                        <td className={styles.actions}>
                            <Button
                                onClick={() => handleEdit(author)}
                                className={`${styles.actionButton} ${styles.primaryButton} me-2`}
                            >
                                Редактировать
                            </Button>
                            <Button
                                onClick={() => dispatch(deleteAuthor(author.id))}
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
                    <Modal.Title>{currentAuthor ? 'Редактировать' : 'Добавить'} автора</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Имя *</Form.Label>
                            <Form.Control
                                className={styles.input}
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                isInvalid={!!errors.firstName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.firstName}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Фамилия *</Form.Label>
                            <Form.Control
                                className={styles.input}
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                isInvalid={!!errors.lastName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.lastName}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Биография</Form.Label>
                            <Form.Control
                                className={styles.input}
                                as="textarea"
                                rows={3}
                                value={formData.biography}
                                onChange={(e) => setFormData({...formData, biography: e.target.value})}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Дата рождения</Form.Label>
                            <Form.Control
                                className={styles.input}
                                type="date"
                                value={formData.birthDate}
                                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                                isInvalid={!!errors.birthDate}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.birthDate}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Фото автора (URL)</Form.Label>
                            <Form.Control
                                className={styles.input}
                                type="text"
                                value={formData.photo}
                                onChange={(e) => setFormData({...formData, photo: e.target.value})}
                                placeholder="URL или путь к фотографии автора"
                            />
                            {formData.photo && (
                                <div className="mt-2">
                                    <p>Превью фото:</p>
                                    <Image
                                        src={formData.photo}
                                        alt="Превью фото автора"
                                        thumbnail
                                        style={{ maxHeight: '200px' }}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/200x300?text=Фото+не+загружено';
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