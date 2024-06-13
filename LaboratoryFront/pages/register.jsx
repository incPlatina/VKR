import React, { useEffect, useState } from 'react';
import styles from '../styles/register.module.css';
import Navbar from '../components/Navbar.jsx';

const Register = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [submitResult, setSubmitResult] = useState();
  const [Email, em] = useState();
  const [Password, pass] = useState();
  const [Name, na] = useState();
  const [userModel, setUserModel] = useState({
    Email,
    Password,
    Name,
    Role: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserModel((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userModel.Email || !userModel.Password || !userModel.Name) {
      setSubmitResult('Пожалуйста, заполните все поля.');
      return; // Прерываем выполнение функции, если не все поля заполнены
    }

    // Проверка соответствия поля Email типу "email"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userModel.Email)) {
      setSubmitResult('Введите корректный адрес электронной почты.');
      return; // Прерываем выполнение функции, если email некорректен
    }
    try {
      const response = await fetch('https://localhost:7265/api/User', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userModel),
      });
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        // Обработка успешной регистрации
        setSubmitResult('Пользователь успешно зарегестрирован');
      } else {
        // Обработка ошибок ответа
        const result = await response.json();
        console.error('Ошибка регистрации:', result);
        setSubmitResult('Пользователь с такой почтой уже существует');
      }
    } catch (error) {
      // Обработка ошибок запроса
      console.error('Ошибка запроса:', error);
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
      <form onSubmit={handleSubmit} className={styles.formcontainer}>
        <input
          type="email"
          name="Email"
          placeholder="Почта"
          value={userModel.Email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="Password"
          placeholder="Пароль"
          value={userModel.Password}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Name"
          placeholder="Имя"
          value={userModel.Name}
          onChange={handleChange}
        />
        <input type="submit" value="Зарегистрироваться" />
        {submitResult && (
          <div className={styles.submitResult}>{submitResult}</div>
        )}
      </form>
    </div>
  );
};

export default Register;
