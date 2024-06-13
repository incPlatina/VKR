import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Select from 'react-select';
import styles from '../styles/create.module.css';
import { jwtDecode } from 'jwt-decode';

export default function CreateRecipePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVip, setIsVip] = useState(false);
  const [name, setName] = useState();
  const [privacy, setPrivacy] = useState({
    value: 'public',
    label: 'Публичный',
  });
  const [formula, setFormula] = useState();
  const [unitOfMeasurement, setunitOfMeasurement] = useState();
  const [submitResult, setSubmitResult] = useState();
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState();
  const [proportion, setProportion] = useState();
  const [categoryId, setCategory] = useState();
  const [profileData, setProfileData] = useState({});
  const [ingredients, setIngredients] = useState([
    { name, description, formula, unitOfMeasurement },
  ]);
  const privacyOptions = [
    { value: 'public', label: 'Публичный' },
    { value: 'private', label: 'Приватный' },
  ];

  // Функция для добавления нового ингредиента
  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { name, description, formula, unitOfMeasurement },
    ]);
  };
  const getOptionsFromCategories = (categories) => {
    return categories.map((category) => ({
      value: category.id,
      label: category.category,
    }));
  };
  // Функция для обновления данных ингредиента
  const updateIngredient = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  // Функция для отправки данных рецепта на сервер
  const submitRecipe = async () => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('access_token='))
      .split('=')[1];
    if (token) {
      const user_id = profileData.nameId;

      const recipeData = {
        name,
        description,
        categoryId,
        createdDate: new Date().toISOString(),
        user_id, // ID пользователя из токена
        ingredients,
        proportion,
        privacy: privacy.value,
      };

      try {
        const response = await fetch('https://localhost:7265/api/Recipe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(recipeData),
        });

        if (!response.ok) {
          throw new Error('Ошибка при отправке рецепта.');
        }

        // Обработка успешной отправки рецепта
        setSubmitResult('Рецепт успешно создан');
      } catch (error) {
        console.log(error);
        setSubmitResult(`Заполните все поля`);
      }
    } else {
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await fetch('https://localhost:7265/api/Category');
      if (!response.ok) {
        throw new Error('Ошибка при загрузке категорий.');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Ошибка при загрузке категорий:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
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
      if (newProfileData.givenName == 'Vip') {
        setIsVip(true);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []); // Empty dependency array to fetch recipes only once

  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} />
      <div className={styles.container}>
        <h1>Создание Рецепта</h1>
        <div className={styles.formrecipe}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Название"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание"
          />
          <Select
            options={getOptionsFromCategories(categories)}
            onChange={(selectedOption) => setCategory(selectedOption.value)}
            placeholder="Выберите категорию"
          />
          <input
            type="text"
            value={proportion}
            onChange={(e) => setProportion(e.target.value)}
            placeholder="Пропорция"
          />
          {isVip && (
            <div>
              <label>Приватность рецепта:</label>
              <Select
                options={privacyOptions}
                value={privacy}
                onChange={setPrivacy}
                placeholder="Выберите приватность"
              />
            </div>
          )}
          <h2>Ингредиенты</h2>
          <div className={styles.ingredientlist}>
            {ingredients.map((ingredient, index) => (
              <div key={index} className={styles.ingredientitem}>
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) =>
                    updateIngredient(index, 'name', e.target.value)
                  }
                  placeholder="Название ингредиента"
                />
                <input
                  type="text"
                  value={ingredient.description}
                  onChange={(e) =>
                    updateIngredient(index, 'description', e.target.value)
                  }
                  placeholder="Описание ингредиента"
                />
                <input
                  type="text"
                  value={ingredient.formula}
                  onChange={(e) =>
                    updateIngredient(index, 'formula', e.target.value)
                  }
                  placeholder="Формула ингредиента"
                />
                <input
                  type="text"
                  value={ingredient.unitOfMeasurement}
                  onChange={(e) =>
                    updateIngredient(index, 'unitOfMeasurement', e.target.value)
                  }
                  placeholder="Единица измерения"
                />
              </div>
            ))}
          </div>
          <button onClick={addIngredient}>Добавить ингредиент</button>
          <button onClick={submitRecipe}>Создать рецепт</button>
          {submitResult && (
            <div className={styles.submitResult}>{submitResult}</div>
          )}
        </div>
      </div>
    </div>
  );
}
