import React from 'react';

const RecipeManager = ({
  selected,
  setSelected,
  handleInputChange,
  handleCreate,
  handleUpdate,
  handleDelete,
  fetch,
  recipes,
}) => {
  return (
    <div>
      <input
        name="id"
        type="text"
        placeholder="ID"
        value={selected.id}
        onChange={handleInputChange}
      />
      <input
        name="description"
        type="text"
        placeholder="Описание"
        value={selected.description}
        onChange={handleInputChange}
      />
      <input
        name="name"
        type="text"
        placeholder="Название рецепта"
        value={selected.name}
        onChange={handleInputChange}
      />
      <input
        name="category"
        type="text"
        placeholder="Категория"
        value={selected.category}
        onChange={handleInputChange}
      />
      {/* Добавьте другие поля для редактирования */}
      <button onClick={handleCreate}>Создать пользователя</button>
      <button onClick={handleUpdate}>Обновить пользователя</button>
      <button onClick={handleDelete}>Удалить пользователя</button>
      <button onClick={fetch}>Показать всех пользователей</button>

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
          {recipes.map((recipe) => (
            <tr key={recipe.id}>
              <td>{recipe.id}</td>
              <td>{recipe.email}</td>
              <td>{recipe.name}</td>
              <td>{recipe.role}</td>
              {/* Добавьте другие ячейки данных */}
              <td>
                <button onClick={() => setSelected(recipe)}>Выбрать</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecipeManager;
