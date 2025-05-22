import { useEffect, useState } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, updateUserRole, deleteUser } from '../../store/userSlice.js';
import styles from '../../assets/AdminUsers.module.css';

export default function AdminUsers() {
    const dispatch = useDispatch();
    const { users } = useSelector(state => state.user);
    const { user: currentUser } = useSelector(state => state.auth);
    const [loading, setLoading] = useState({});

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    const handleRoleChange = async (userId, newRole) => {
        setLoading(prev => ({ ...prev, [userId]: true }));
        await dispatch(updateUserRole({ userId, role: newRole }));
        setLoading(prev => ({ ...prev, [userId]: false }));
    };

    const handleDelete = (userId) => {
        dispatch(deleteUser(userId));
    };

    return (
        <div className={styles.adminUsers}>
            <h3>Управление пользователями</h3>

            <Table className={styles.table} striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Имя</th>
                    <th>Email</th>
                    <th>Роль</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {users
                    .slice()
                    .sort((a, b) => (a.id === currentUser.id ? -1 : b.id === currentUser.id ? 1 : 0))
                    .map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <Badge 
                                    className={user.role === 'admin' ? styles.adminBadge : styles.readerBadge}
                                >
                                    {user.role}
                                </Badge>
                            </td>
                            <td className={styles.actions}>
                                {user.id !== currentUser.id ? (
                                    <>
                                        <Button
                                            variant={user.role === 'admin' ? 'primary' : 'success'}
                                            size="sm"
                                            onClick={() => handleRoleChange(
                                                user.id,
                                                user.role === 'admin' ? 'reader' : 'admin'
                                            )}
                                            disabled={loading[user.id]}
                                            className={`${styles.actionButton} ${styles.primaryButton} me-2`}
                                        >
                                            {loading[user.id] ? '...' :
                                                user.role === 'admin' ? 'Сделать читателем' : 'Сделать админом'}
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(user.id)}
                                            className={`${styles.actionButton} ${styles.dangerButton}`}
                                        >
                                            Удалить
                                        </Button>
                                    </>
                                ) : (
                                    <span style={{color: '#7e8594', fontWeight: 500}}>Вы</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}