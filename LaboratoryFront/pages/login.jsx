import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import styles from '../styles/login.module.css';

const Login = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [submitResult, setSubmitResult] = useState();
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const authModel = {
      Email: email,
      Password: password,
    };

    try {
      const response = await fetch('https://localhost:7265/Auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authModel),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Сохраняем токен в куки
      document.cookie = `access_token=${data.access_token}; path=/; max-age=3600; secure; samesite=strict`;
      //console.log(data);

      // Перенаправляем пользователя на главную страницу
      window.location.href = '/';
    } catch (error) {
      console.error('Ошибка при авторизации:', error);
      setSubmitResult('Неправильный логин или пароль');
    }
  };
  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('access_token='))
      ?.split('=')[1];

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} />
      <div className={styles.formcontainer}>
        <input
          type="email"
          placeholder="Почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input type="submit" value="Войти" onClick={handleLogin} />
        {submitResult && (
          <div className={styles.submitResult}>{submitResult}</div>
        )}
      </div>
    </div>
  );
};

export default Login;
