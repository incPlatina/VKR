import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Navbar.jsx';
import Select from 'react-select';
import styles from '../../../styles/create.module.css';
import { jwtDecode } from 'jwt-decode';

export default function EditRecipePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVip, setIsVip] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [privacy, setPrivacy] = useState(
    recipe ? recipe.privacy : { value: 'public', label: 'Публичный' },
  );
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [submitResult, setSubmitResult] = useState();
  const privacyOptions = [
    { value: 'public', label: 'Публичный' },
    { value: 'private', label: 'Приватный' },
  ];

  const [ingredients, setIngredients] = useState([]);

  // Функция для обновления ингредиентов
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  // Функция для добавления нового ингредиента
  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      {
        id: null,
        name: '',
        description: '',
        formula: '',
        unitOfMeasurement: '',
      },
    ]);
  };

  // Функция для удаления ингредиента
  const removeIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };
  const getOptionsFromCategories = (categories) => {
    return categories.map((category) => ({
      value: category.id,
      label: category.category,
    }));
  };
  // Функция для получения данных рецепта
  const fetchRecipe = async (id) => {
    try {
      const response = await fetch(`https://localhost:7265/api/Recipe/${id}`);
      if (!response.ok) {
        throw new Error('Ошибка при загрузке рецепта.');
      }
      const data = await response.json();
      setRecipe(data);
    } catch (error) {
      console.error('Ошибка при загрузке рецепта:', error);
    }
  };

  const updateRecipe = async () => {
    const { id } = router.query;
    if (!id) return;

    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('access_token='))
      .split('=')[1];
    if (token) {
      setIsAuthenticated(true);
      const user_id = profileData.nameId;

      const updatedRecipeData = {
        ...recipe,
        user_id,
        ingredients,
      };

      try {
        console.log(updatedRecipeData);
        const response = await fetch(
          `https://localhost:7265/api/Recipe/${id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedRecipeData),
          },
        );

        if (!response.ok) {
          throw new Error('Ошибка при обновлении рецепта.');
        }
        setSubmitResult('Рецепт успешно обновлен');
      } catch (error) {
        console.error('Ошибка при обновлении рецепта:', error);
        setSubmitResult('Ошибка при обновлении рецепта');
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
    if (router.isReady) {
      const { id } = router.query;
      fetchRecipe(id);
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
    }
  }, [router.isReady]);
  useEffect(() => {
    if (recipe) {
      // Установка начальных значений ингредиентов из рецепта
      setIngredients(recipe.ingredients || []);
    }
  }, [recipe]);

  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} />
      <div className={styles.container}>
        <h1>Редактирование Рецепта</h1>
        {recipe && (
          <div className={styles.formrecipe}>
            <input
              type="text"
              value={recipe.name}
              onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
              placeholder="Название"
            />
            <input
              type="text"
              value={recipe.description}
              onChange={(e) =>
                setRecipe({ ...recipe, description: e.target.value })
              }
              placeholder="Описание"
            />
            <Select
              options={getOptionsFromCategories(categories)}
              value={categories.find((c) => c.value === recipe.categoryId)}
              onChange={(selectedOption) =>
                setRecipe({ ...recipe, categoryId: selectedOption.value })
              }
              placeholder="Выберите категорию"
            />
            <input
              type="text"
              value={recipe.proportion}
              onChange={(e) =>
                setRecipe({ ...recipe, proportion: e.target.value })
              }
              placeholder="Пропорция"
            />
            {isVip && (
              <div>
                <label>Приватность рецепта:</label>
                <Select
                  options={privacyOptions}
                  value={privacyOptions.find(
                    (option) => option.value === privacy.value,
                  )}
                  onChange={(selectedOption) => {
                    setPrivacy(selectedOption);
                    setRecipe({ ...recipe, privacy: selectedOption.value });
                  }}
                  placeholder="Выберите приватность"
                />
              </div>
            )}
            <h2>Ингредиенты</h2>
            {ingredients.map((ingredient, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) =>
                    handleIngredientChange(index, 'name', e.target.value)
                  }
                  placeholder="Название ингредиента"
                />
                <input
                  type="text"
                  value={ingredient.description}
                  onChange={(e) =>
                    handleIngredientChange(index, 'description', e.target.value)
                  }
                  placeholder="Описание ингредиента"
                />
                <input
                  type="text"
                  value={ingredient.formula}
                  onChange={(e) =>
                    handleIngredientChange(index, 'formula', e.target.value)
                  }
                  placeholder="Формула"
                />
                <input
                  type="text"
                  value={ingredient.unitOfMeasurement}
                  onChange={(e) =>
                    handleIngredientChange(
                      index,
                      'unitOfMeasurement',
                      e.target.value,
                    )
                  }
                  placeholder="Единица измерения"
                />
                <button onClick={() => removeIngredient(index)}>
                  Удалить ингредиент
                </button>
              </div>
            ))}
            <button onClick={addIngredient}>Добавить ингредиент</button>
            <button onClick={updateRecipe}>Обновить рецепт</button>
            {submitResult && (
              <div className={styles.submitResult}>{submitResult}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
