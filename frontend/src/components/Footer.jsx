import styles from '../assets/Footer.module.css';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.footerContent}>
                    <div className={styles.footerSection}>
                        <h3>BookWorm</h3>
                        <p>Ваш надежный источник знаний и вдохновения</p>
                    </div>

                    <div className={styles.footerSection}>
                        <h4>Навигация</h4>
                        <ul className={styles.footerLinks}>
                            <li><a href="/">Главная</a></li>
                            <li><a href="/books">Книги</a></li>
                            <li><a href="/about">О нас</a></li>
                            <li><a href="/contact">Контакты</a></li>
                        </ul>
                    </div>

                    <div className={styles.footerSection}>
                        <h4>Контакты</h4>
                        <p>Email: info@onlinelibrary.com</p>
                        <p>Телефон: +375 (29) 123-45-67</p>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p>&copy; {currentYear} BookWorm. Все права защищены.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;