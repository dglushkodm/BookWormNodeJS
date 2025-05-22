import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Accordion, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchChaptersByBook,
    addChapter,
    editChapter,
    removeChapter
} from '../../store/chaptersSlice';
import { fetchBookById } from '../../store/booksSlice';
import styles from '../../assets/AdminBooks.module.css';
import { Editor } from '@tinymce/tinymce-react';

export default function AdminChapters() {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { chapters } = useSelector(state => state.chapters);
    const { currentBook } = useSelector(state => state.books);
    const [showModal, setShowModal] = useState(false);
    const [currentChapter, setCurrentChapter] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        number: 1,
        volume: 1,
        content: ''
    });

    useEffect(() => {
        dispatch(fetchBookById(bookId));
        dispatch(fetchChaptersByBook(bookId));
    }, [bookId, dispatch]);

    useEffect(() => {
        if (currentChapter) {
            setFormData({
                title: currentChapter.title,
                number: currentChapter.number,
                volume: currentChapter.volume,
                content: currentChapter.content
            });
        } else {
            setFormData({
                title: '',
                number: chapters.length > 0
                    ? Math.max(...chapters.map(c => c.number)) + 1
                    : 1,
                volume: 1,
                content: ''
            });
        }
    }, [currentChapter, chapters]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const chapterData = {
            title: formData.title,
            number: Number(formData.number),
            volume: Number(formData.volume),
            content: formData.content
        };

        try {
            if (currentChapter) {
                await dispatch(editChapter({
                    id: currentChapter.id,
                    chapterData: { ...chapterData, bookId }
                })).unwrap();
            } else {
                await dispatch(addChapter({
                    bookId,
                    chapterData
                })).unwrap();
            }

            await dispatch(fetchChaptersByBook(bookId)).unwrap();
            setShowModal(false);
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    const handleEdit = (chapter) => {
        setCurrentChapter(chapter);
        setShowModal(true);
    };

    // Сортируем главы сначала по тому, затем по номеру
    const sortedChapters = [...chapters].sort((a, b) => {
        if (a.volume !== b.volume) {
            return a.volume - b.volume;
        }
        return a.number - b.number;
    });

    return (
        <div className={styles.adminBooks}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <Link to="/admin" className="text-decoration-none">
                        ← Назад к книгам
                    </Link>
                    <h3 className="mt-2">
                        Управление главами: {currentBook?.title}
                        <Badge bg="secondary" className="ms-2">
                            {chapters.length} глав
                        </Badge>
                    </h3>
                </div>
                <Button
                    variant="primary"
                    onClick={() => {
                        setCurrentChapter(null);
                        setShowModal(true);
                    }}
                >
                    Добавить главу
                </Button>
            </div>

            <Accordion>
                {sortedChapters.map((chapter, index) => (
                    <Accordion.Item key={chapter.id} eventKey={String(index)} className={styles.chapterPanel}>
                        <Accordion.Header>
                            <div className="d-flex justify-content-between w-100 pe-3">
                                <span>
                                    <strong>Том {chapter.volume}, Глава {chapter.number}:</strong> {chapter.title}
                                    <Badge bg="light" text="dark" className="ms-2">
                                        {new Date(chapter.uploadDate).toLocaleDateString()}
                                    </Badge>
                                </span>
                                <div onClick={(e) => e.stopPropagation()}>
                                    <Button
                                        variant="outline-warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleEdit(chapter)}
                                    >
                                        Редакт.
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => {
                                            if (window.confirm('Удалить главу?')) {
                                                dispatch(removeChapter(chapter.id));
                                            }
                                        }}
                                    >
                                        Удалить
                                    </Button>
                                </div>
                            </div>
                        </Accordion.Header>
                        <Accordion.Body>
                            <div
                                className="chapter-content"
                                dangerouslySetInnerHTML={{ __html: chapter.content }}
                            />
                            <div className="text-muted mt-2">
                                Последнее обновление: {new Date(chapter.updatedAt).toLocaleString()}
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {currentChapter ? 'Редактировать' : 'Добавить'} главу
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Название главы *</Form.Label>
                            <Form.Control
                                className={styles.input}
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <div className="row">
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Том *</Form.Label>
                                <Form.Control
                                    className={styles.input}
                                    type="number"
                                    min="1"
                                    value={formData.volume}
                                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Номер главы *</Form.Label>
                                <Form.Control
                                    className={styles.input}
                                    type="number"
                                    min="1"
                                    value={formData.number}
                                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label>Содержание *</Form.Label>
                            <Editor
                                apiKey="5bo8svtg1o3zcqxiqhta81ooa3i6hiwsjopnrk722m5mg0yr" // Получите бесплатный ключ на https://www.tiny.cloud/
                                value={formData.content}
                                onEditorChange={(content) => setFormData({ ...formData, content })}
                                init={{
                                    height: 500,
                                    menubar: true,
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | ' +
                                        'bold italic forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat | help',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                }}
                            />
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