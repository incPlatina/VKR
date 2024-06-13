import React, { useEffect, useState } from 'react';
import styles from '../styles/profile.module.css';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/Navbar.jsx';

type DecodedToken = {
  nameid: string;
  email: string;
  name: string;
  given_name: string;
};

const handleJournal = () => {
  window.location.href = '/journal'; // Измените URL на актуальный путь к вашей странице входа
};
const handlecreate = () => {
  window.location.href = '/create';
};
const handleAdmin = () => {
  window.location.href = '/admin';
};
const handleEdit = () => {
  window.location.href = '/Editprofile';
};

const Profile = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVip, setIsVip] = useState(false);
  const [profileData, setProfileData] = useState({
    nameId: '',
    email: '',
    name: '',
    givenName: '',
  });

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('access_token='))
      ?.split('=')[1];

    if (token) {
      const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
      const newProfileData = {
        nameId: decodedToken['nameid'],
        email: decodedToken['email'],
        name: decodedToken['name'],
        givenName: decodedToken['given_name'],
      };
      setProfileData(newProfileData);

      // Проверка должна быть здесь, после обновления состояния
      if (newProfileData.givenName === 'Admin') {
        setIsAdmin(true);
      }
      if (
        newProfileData.givenName === 'Admin' ||
        newProfileData.givenName === 'Vip'
      ) {
        setIsVip(true);
      }

      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
  }, []);

  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} />
      <div className={styles.profileContainer}>
        <div className={styles.profileInfo}>
          <h2>Карточка пользователя</h2>
          <p>Имя пользователя: {profileData.name}</p>
          <p>Email: {profileData.email}</p>
          {/* Дополнительная информация профиля */}
        </div>
        <div className={styles.journalMenu}>
          <p>
            <button onClick={handlecreate}>Создать рецепт</button>
          </p>
          <p>
            <button onClick={handleEdit}>Редактировать профиль</button>
          </p>
          {isAdmin && (
            <p>
              <button onClick={handleAdmin}>Зайти в админ панель</button>
            </p>
          )}
          <p>
            {isVip && (
              <button onClick={handleJournal}>Лабораторный журнал</button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
