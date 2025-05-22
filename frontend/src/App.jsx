import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import BooksPage from './pages/BooksPage.jsx';
import BookPage from './pages/BookPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import PublicRoute from './components/PublicRoute.jsx';
import AdminChapters from "./components/admin/AdminChapters.jsx";
import ChapterViewer from "./pages/ChapterViewer.jsx";

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
                <Routes>
                    <Route path="/" element={<Layout />}>
                        {/* Публичные маршруты */}
                        <Route index element={<HomePage />} />
                        <Route path="books" element={<BooksPage />} />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage />} />

                        {/* Приватные маршруты */}
                        <Route element={<PrivateRoute />}>
                            <Route path="profile" element={<ProfilePage />} />
                            <Route path="books/:id" element={<BookPage />} />
                            <Route path="books/:bookId/chapters/:chapterId" element={<ChapterViewer />} />
                        </Route>
                        <Route element={<AdminRoute />}>
                            <Route path="admin" element={<AdminPage />} />
                            <Route path="admin/books/:bookId/chapters" element={<AdminChapters />} />
                        </Route>

                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}

export default App;