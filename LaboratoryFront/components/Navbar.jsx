// components/Navbar.js
import styles from '../styles/Navbar.module.css';

const Navbar = ({ isAuthenticated }) => {
  const handleLogout = () => {
    // Удаляем куки access_token
    document.cookie =
      'access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
    // Перенаправляем пользователя на страницу входа или главную страницу
    window.location.href = '/login'; // Измените URL на актуальный путь к вашей странице входа
  };
  return (
    <div>
      <h1 className={styles.title}>Химическая лаборатория</h1>
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <a href="/">Главная</a>
          <a href="/demonstration">Демонстрация реакций</a>
          <a href="/calculation">Калькулятор</a>
        </div>
        <div className={styles.navRight}>
          {!isAuthenticated && <a href="/login">Авторизация</a>}
          {!isAuthenticated && <a href="/register">Регистрация</a>}
          {isAuthenticated && <a href="/profile">Профиль</a>}
          {isAuthenticated && (
            <a href="/" onClick={handleLogout}>
              Выйти из аккаунта
            </a>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
