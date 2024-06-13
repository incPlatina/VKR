// UserManager.jsx
import React from 'react';
import styles from '../styles/UserManager.module.css';

const UserManager = ({
  selectedUser,
  setSelectedUser,
  handleInputChange,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
  fetchUsers,
  users,
}) => {
  return (
    <div className={styles.userManagerContainer}>
      <input
        name="id"
        type="text"
        placeholder="ID"
        value={selectedUser.id}
        onChange={handleInputChange}
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={selectedUser.email}
        onChange={handleInputChange}
      />
      <input
        name="name"
        type="text"
        placeholder="Имя"
        value={selectedUser.name}
        onChange={handleInputChange}
      />
      <input
        name="role"
        type="text"
        placeholder="Роль"
        value={selectedUser.role}
        onChange={handleInputChange}
      />
      {/* Добавьте другие поля для редактирования */}
      <button onClick={handleUpdateUser}>Обновить пользователя</button>
      <button onClick={handleDeleteUser}>Удалить пользователя</button>
      <button onClick={fetchUsers}>Показать всех пользователей</button>

      {/* Таблица для отображения списка пользователей */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Имя</th>
            <th>Роль</th>
            {/* Добавьте другие заголовки столбцов */}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td>{user.role}</td>
              {/* Добавьте другие ячейки данных */}
              <td>
                <button onClick={() => setSelectedUser(user)}>Выбрать</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManager;
