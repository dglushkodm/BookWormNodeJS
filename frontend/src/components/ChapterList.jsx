import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChaptersByBook } from '../store/chaptersSlice';
import { Link, useParams } from 'react-router-dom';
import styles from '../assets/ChapterList.module.css';

function ChapterList({ bookId }) {
    const { bookId: paramBookId } = useParams();
    const dispatch = useDispatch();
    const { chapters, loading, error } = useSelector(state => state.chapters);
    const targetBookId = bookId || paramBookId;

    useEffect(() => {
        if (targetBookId) {
            dispatch(fetchChaptersByBook(targetBookId));
        }
    }, [dispatch, targetBookId]);

    if (loading) return <div>Загрузка глав...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div className={styles.chapterList}>
            <h3>Содержание</h3>
            <ul>
                {chapters.map(chapter => (
                    <li key={chapter.id} className={styles.chapterItem}>
                        <Link
                            to={`/books/${targetBookId}/chapters/${chapter.id}`}
                            className={styles.chapterLink}
                        >
                            {chapter.volume && <span>Том {chapter.volume}, </span>}
                            Глава {chapter.number}: {chapter.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ChapterList;