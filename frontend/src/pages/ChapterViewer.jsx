import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchChapterById } from '../store/chaptersSlice';
import styles from '../assets/ChapterViewer.module.css';

function ChapterViewer() {
    const { bookId, chapterId } = useParams();
    const dispatch = useDispatch();
    const { currentChapter, loading, error } = useSelector(state => state.chapters);

    useEffect(() => {
        dispatch(fetchChapterById({ bookId, chapterId }));
    }, [dispatch, bookId, chapterId]);

    if (loading) return <div>Загрузка главы...</div>;
    if (error) return <div>Ошибка: {error}</div>;
    if (!currentChapter) return <div>Глава не найдена</div>;

    return (
        <div className={styles.chapterViewer}>
            <div className={styles.header}>
                <Link to={`/books/${bookId}`} className={styles.backLink}>
                    ← Назад к книге
                </Link>
                <h2>
                    {currentChapter.volume && `Том ${currentChapter.volume}, `}
                    Глава {currentChapter.number}: {currentChapter.title}
                </h2>
            </div>
            <div 
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: currentChapter.content }}
            />
        </div>
    );
}

export default ChapterViewer;