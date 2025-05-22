import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaUser } from 'react-icons/fa';
import styles from '../assets/Comments.module.css';

function Comments({ bookId, comments, onAddComment, onUpdateComment, onDeleteComment }) {
    const { user } = useSelector(state => state.auth);
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const [editContent, setEditContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) {
            toast.warning('Комментарий не может быть пустым');
            return;
        }
        try {
            await onAddComment(newComment);
            setNewComment('');
            toast.success('Комментарий добавлен');
        } catch (error) {
            toast.error('Ошибка при добавлении комментария');
        }
    };

    const handleEdit = (comment) => {
        setEditingComment(comment.id);
        setEditContent(comment.content);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editContent.trim()) {
            toast.warning('Комментарий не может быть пустым');
            return;
        }
        try {
            await onUpdateComment(editingComment, editContent);
            setEditingComment(null);
            setEditContent('');
            toast.success('Комментарий обновлен');
        } catch (error) {
            toast.error('Ошибка при обновлении комментария');
        }
    };

    const handleDelete = async (commentId) => {
        if (window.confirm('Вы уверены, что хотите удалить этот комментарий?')) {
            try {
                await onDeleteComment(commentId);
                toast.success('Комментарий удален');
            } catch (error) {
                toast.error('Ошибка при удалении комментария');
            }
        }
    };

    const getAvatarUrl = (user) => {
        if (!user?.image) return null;
        try {
            // Если image — это объект с type: 'Buffer' и data: [...]
            if (user.image.data && Array.isArray(user.image.data)) {
                const blob = new Blob([new Uint8Array(user.image.data)], { type: 'image/jpeg' });
                return URL.createObjectURL(blob);
            }
            // Если image — это просто массив (на всякий случай)
            if (Array.isArray(user.image)) {
                const blob = new Blob([new Uint8Array(user.image)], { type: 'image/jpeg' });
                return URL.createObjectURL(blob);
            }
            // Если image — это строка (URL)
            if (typeof user.image === 'string') return user.image;
        } catch (error) {
            console.error('Error processing avatar:', error);
        }
        return null;
    };

    return (
        <div className={styles.commentsSection}>
            <h3>Комментарии</h3>

            {user && (
                <form onSubmit={handleSubmit} className={styles.commentForm}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Напишите комментарий..."
                        required
                    />
                    <button type="submit">Отправить</button>
                </form>
            )}

            <div className={styles.commentsList}>
                {comments && comments.length > 0 ? (
                    comments.map(comment => {
                        console.log('comment.User:', comment.User);
                        console.log('comment.User.image:', comment.User?.image);
                        return (
                        <div key={comment.id} className={styles.comment}>
                            <div className={styles.commentHeader}>
                                <div className={styles.userInfo}>
                                    {comment.User?.image ? (
                                        <img
                                            src={getAvatarUrl(comment.User)}
                                            alt={comment.User.name}
                                            className={styles.userAvatar}
                                            onError={e => { e.target.style.display = 'none'; }}
                                        />
                                    ) : (
                                        <FaUser className={styles.userAvatar} />
                                    )}
                                    <span className={styles.userName}>{comment.User.name}</span>
                                </div>
                                <span className={styles.commentDate}>
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            {editingComment === comment.id ? (
                                <form onSubmit={handleUpdate} className={styles.editForm}>
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        required
                                    />
                                    <div className={styles.editButtons}>
                                        <button type="submit">Сохранить</button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingComment(null);
                                                setEditContent('');
                                            }}
                                        >
                                            Отмена
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <p className={styles.commentContent}>{comment.content}</p>
                                    {user && (user.id === comment.User.id || user.role === 'admin') && (
                                        <div className={styles.commentActions}>
                                            <button
                                                onClick={() => handleEdit(comment)}
                                                className={styles.editButton}
                                            >
                                                Редактировать
                                            </button>
                                            <button
                                                onClick={() => handleDelete(comment.id)}
                                                className={styles.deleteButton}
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )})
                ) : (
                    <p className={styles.noComments}>Пока нет комментариев</p>
                )}
            </div>
        </div>
    );
}

export default Comments; 