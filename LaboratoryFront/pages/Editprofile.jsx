import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { jwtDecode } from 'jwt-decode';
import styles from '../styles/Editprofile.module.css';

export default function UserProfile() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    role: '',
  });
  const [profileData, setProfileData] = useState({
    nameId: '',
    email: '',
    name: '',
    givenName: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Добавляем PUT запрос на сервер
    fetch(`https://localhost:7265/api/User/${profileData.nameId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Добавьте необходимые заголовки, например, для аутентификации
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Успех:', data);
        // Обработайте успешное обновление данных пользователя
      })
      .catch((error) => {
        console.error('Ошибка:', error);
        // Обработайте возможные ошибки запроса
      });
  };

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('access_token='))
      ?.split('=')[1];

    if (token) {
      setIsAuthenticated(true);
      const decodedToken = jwtDecode(token);
      const newProfileData = {
        nameId: decodedToken['nameid'],
        email: decodedToken['email'],
        name: decodedToken['name'],
        givenName: decodedToken['given_name'],
      };
      setProfileData(newProfileData);
      setUser({
        id: newProfileData.nameId,
        name: '',
        email: '',
        password: '',
        role: '',
      });
    } else {
      setIsAuthenticated(false);
    }
  }, []); // Empty dependency array to fetch recipes only once
  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} />
      <div className={styles.container}>
        <h1 className={styles.formTitle}>Редактирование профиля</h1>
        <form onSubmit={handleSubmit}>
          <label className={styles.formLabel}>
            Имя:
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className={styles.inputField}
            />
          </label>
          <label className={styles.formLabel}>
            Email:
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className={styles.inputField}
            />
          </label>
          <label className={styles.formLabel}>
            Пароль:
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className={styles.inputField}
            />
          </label>
          <button type="submit" className={styles.submitButton}>
            Сохранить изменения
          </button>
        </form>
      </div>
    </div>
  );
}
