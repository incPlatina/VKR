import React, { useState, useEffect } from 'react';
import styles from '../styles/admin.module.css';
import UserManager from '../components/UserManager.jsx';
import RecipeManager from '../components/RecipeManager.jsx';
import Navbar from '../components/Navbar.jsx';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedUser, setSelectedUser] = useState({
    id: '', // Убедитесь, что 'id' инициализирован как строка, если он ожидается быть строкой
    email: '',
    name: '',
    role: '',
    // ... другие поля пользователя
  });
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState({
    id: '',
    name: '',
    description: '',
    category: '',
    createdDate: '',
    user_id: '',
    ingredients: [],
  });

  // Функция для получения данных пользователя по ID
  const fetchUser = async (id) => {
    try {
      const response = await fetch(`https://localhost:7265/api/User/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://localhost:7265/api/User');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const usersData = await response.json();
      setUsers(usersData);
    } catch (error) {
      console.error('Ошибка при получении списка пользователей:', error);
    }
  };

  // Функция для создания нового пользователя
  const createUser = async (newUser) => {
    try {
      const response = await fetch('https://localhost:7265/api/User', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Обновляем список пользователей
      await fetchUsers();
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error);
    }
  };

  // Функция для обновления данных пользователя
  const updateUser = async (updatedUser) => {
    try {
      const response = await fetch(
        `https://localhost:7265/api/User/admin/${updatedUser.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUser),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Обновляем список пользователей
      await fetchUsers();
    } catch (error) {
      console.error('Ошибка при обновлении пользователя:', error);
    }
  };

  // Функция для удаления пользователя
  const deleteUser = async (id) => {
    try {
      const response = await fetch(`https://localhost:7265/api/User/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Обновляем список пользователей
      await fetchUsers();
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
    }
  };
  // Обработчики событий для формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  const handleCreateUser = () => {
    createUser(selectedUser);
  };

  const handleUpdateUser = () => {
    updateUser(selectedUser);
  };

  const handleDeleteUser = () => {
    deleteUser(selectedUser.id);
  };

  // Функции CRUD для рецептов
  const fetchRecipes = async () => {
    try {
      const response = await fetch('https://localhost:7265/api/Recipe');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const recipesData = await response.json();
      setRecipes(recipesData);
    } catch (error) {
      console.error('Ошибка при получении списка рецептов:', error);
    }
  };

  // Функция для создания нового рецепта
  const createRecipe = async (newRecipe) => {
    try {
      const response = await fetch('https://localhost:7265/api/Recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecipe),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Обновляем список рецептов
      await fetchRecipes();
    } catch (error) {
      console.error('Ошибка при создании рецепта:', error);
    }
  };

  // Функция для обновления данных рецепта
  const updateRecipe = async (id, updatedRecipe) => {
    try {
      const response = await fetch(`https://localhost:7265/api/Recipe/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRecipe),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Обновляем список рецептов
      await fetchRecipes();
    } catch (error) {
      console.error('Ошибка при обновлении рецепта:', error);
    }
  };

  // Функция для удаления рецепта
  const deleteRecipe = async (id) => {
    try {
      const response = await fetch(`https://localhost:7265/api/Recipe/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Обновляем список рецептов
      await fetchRecipes();
    } catch (error) {
      console.error('Ошибка при удалении рецепта:', error);
    }
  };

  // Обработчики событий для формы рецептов
  const handleRecipeInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedRecipe({ ...selectedRecipe, [name]: value });
  };

  const handleCreateRecipe = () => {
    createRecipe(selectedRecipe);
  };

  const handleUpdateRecipe = () => {
    updateRecipe(selectedRecipe);
  };

  const handleDeleteRecipe = () => {
    deleteRecipe(selectedRecipe.id);
  };

  // Загрузка списка пользователей при монтировании компонента
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
    <div className={styles.adminContainer}>
      <Navbar isAuthenticated={isAuthenticated} />
      {/* Форма для создания и редактирования данных пользователя */}
      <div>
        <UserManager
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          handleInputChange={handleInputChange}
          handleCreateUser={handleCreateUser}
          handleUpdateUser={handleUpdateUser}
          handleDeleteUser={handleDeleteUser}
          fetchUsers={fetchUsers}
          users={users}
        />
      </div>
    </div>
  );
};

export default AdminPage;
