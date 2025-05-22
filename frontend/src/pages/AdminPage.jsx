import { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import AdminBooks from '../components/admin/AdminBooks';
import AdminUsers from '../components/admin/AdminUsers';
import AdminAuthors from '../components/admin/AdminAuthors.jsx';
import styles from '../assets/AdminPage.module.css';
import AdminGenres from "../components/admin/AdminGenres.jsx";
import AdminChapters from "../components/admin/AdminChapters.jsx";

function AdminPage() {
    const [key, setKey] = useState('books');

    return (
        <div className={styles.adminPage}>
            <h1>Административная панель</h1>

            <Tabs
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3 nav-tabs"
            >
                <Tab eventKey="books" title="Управление книгами">
                    <AdminBooks />
                </Tab>
                <Tab eventKey="users" title="Управление пользователями">
                    <AdminUsers />
                </Tab>
                <Tab eventKey="authors" title="Управление авторами">
                    <AdminAuthors />
                </Tab>
                <Tab eventKey="genres" title="Управление жанрами">
                    <AdminGenres />
                </Tab>
            </Tabs>
        </div>
    );
}

export default AdminPage;