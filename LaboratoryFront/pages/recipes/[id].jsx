// pages/recipes/[id].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import styles from '../../styles/Recipe.module.css';
import Navbar from '../../components/Navbar.jsx';

import CalculationsPage from '../../components/Calculayion.jsx';

export default function RecipePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVip, setIsVip] = useState(false);
  const [isMy, setIsMy] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState(null);
  const [categories, setCategories] = useState([]);
  const [submitSave, setSaveResult] = useState();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reviewUsers, setReviewUsers] = useState({}); // Добавлено состояние для хранения данных пользователей отзывов
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [profileData, setProfileData] = useState({});

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
    } else {
      setIsAuthenticated(false);
    }
    async function fetchRecipeAndUser() {
      if (id) {
        setLoading(true);
        try {
          // Запрос к API рецепта
          fetch('https://localhost:7265/api/Category')
            .then((response) => response.json())
            .then((data) => {
              setCategories(data);
            })
            .catch((error) => console.error('Ошибка:', error));
          const recipeResponse = await fetch(
            `https://localhost:7265/api/Recipe/${id}`,
          );
          if (!recipeResponse.ok) {
            throw new Error('Ошибка при запросе рецепта.');
          }
          const recipeData = await recipeResponse.json();
          setRecipe(recipeData);

          // Запрос к API пользователя
          const userResponse = await fetch(
            `https://localhost:7265/api/User/${recipeData.user_id}`,
          );
          if (!userResponse.ok) {
            throw new Error('Ошибка при запросе пользователя.');
          }
          const userData = await userResponse.json();
          setUser(userData);

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
            setProfileData(newProfileData);
            if (
              newProfileData.givenName === 'Admin' ||
              (newProfileData.givenName === 'Vip' &&
                recipeData.user_id == newProfileData.nameId)
            ) {
              setIsVip(true);
            }
            if (
              newProfileData.givenName === 'Admin' ||
              recipeData.user_id == newProfileData.nameId
            ) {
              setIsMy(true);
            }
          }
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchRecipeAndUser();
  }, [id]);

  // Функция для загрузки данных пользователя по ID
  async function fetchUser(userId) {
    if (!reviewUsers[userId]) {
      // Проверяем, есть ли уже данные пользователя
      try {
        const response = await fetch(
          `https://localhost:7265/api/User/${userId}`,
        );
        if (!response.ok) {
          throw new Error('Ошибка при запросе данных пользователя.');
        }
        const userData = await response.json();
        setReviewUsers((prevUsers) => ({
          ...prevUsers,
          [userId]: userData.name,
        })); // Обновляем состояние
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
      }
    }
  }

  useEffect(() => {
    // Вызываем функцию для каждого ID пользователя в отзывах
    recipe?.reviews.forEach((review) => {
      if (review.user_Id) {
        fetchUser(review.user_Id);
      }
    });
  }, [recipe]);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>Ошибка: {error}</p>;
  }

  if (!recipe) {
    return <p>Рецепт не найден.</p>;
  }

  // Функция для отправки отзыва
  async function submitReview() {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('access_token='))
      .split('=')[1];
    if (token) {
      const decodedToken = jwtDecode(token);
      const user_Id = decodedToken['nameid']; // Получаем user_Id из токена

      const reviewData = {
        recipeId: id, // id рецепта из параметров маршрута
        text: reviewText,
        rating: reviewRating,
        user_Id: user_Id,
      };

      try {
        const response = await fetch('https://localhost:7265/api/Review', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reviewData),
        });

        if (!response.ok) {
          throw new Error('Ошибка при отправке отзыва.');
        }

        // Обработка успешной отправки отзыва
        console.log('Отзыв успешно отправлен');
        window.location.reload();
      } catch (error) {
        console.error('Ошибка при отправке отзыва:', error);
      }
    }
  }
  async function deleteRecipe() {
    try {
      const response = await fetch(`https://localhost:7265/api/Recipe/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        // You can add any additional data or parameters here if needed
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении рецепта.');
      }

      // Обработка успешного удаления рецепта
      console.log('Рецепт успешно удален');
      window.location.href = `/`;
      // You can perform any other actions after successful deletion
    } catch (error) {
      console.error('Ошибка при удалении рецепта:', error);
    }
  }
  async function saveRecipe() {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('access_token='))
      .split('=')[1];
    if (token) {
      const decodedToken = jwtDecode(token);
      const user_Id = decodedToken['nameid']; // Получаем user_Id из токена

      const data = {
        user_Id: user_Id,
        recipe_Id: id, // id текущего рецепта из параметров маршрута
      };

      try {
        const response = await fetch('https://localhost:7265/api/Journal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Ошибка при сохранении рецепта.');
        }

        // Обработка успешной отправки данных о создании рецепта
        setSaveResult('Рецепт успешно сохранен');
      } catch (error) {
        setSaveResult('Рецепт уже сохранен');
      }
    }
  }
  const categoryName =
    categories.find((category) => category.id === recipe.categoryId)
      ?.category || 'Неизвестный';
  const handleEdit = () => {
    window.location.href = `/recipes/EditRecipe/${id}`;
  };
  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} />
      <div className={styles.contentContainer}>
        <div className={styles.recipeForm}>
          <h2>{recipe.name}</h2>
          <p>{recipe.description}</p>
          <p>Категория: {categoryName}</p>
          <p>Пропорция смешивания: {recipe.proportion}</p>
          <p>
            Дата создания: {new Date(recipe.createdDate).toLocaleDateString()}
          </p>
          {user && (
            <div className="user-info">
              <h3>Автор рецепта: {user.name}</h3>
            </div>
          )}
          <h2>Ингредиенты</h2>
          {recipe.ingredients.map((ingredient) => (
            <div key={ingredient.id} className={styles.ingredient}>
              <p>Название:{ingredient.name}</p>
              <p>Описание:{ingredient.description}</p>
              <p>Химическая формула:{ingredient.formula}</p>
              <p>Мера измерения:{ingredient.unitOfMeasurement}</p>
            </div>
          ))}
          {isVip && <button onClick={saveRecipe}>Сохранить рецепт</button>}
          {isMy && <button onClick={handleEdit}>Изменить рецепт</button>}
          {isMy && <button onClick={deleteRecipe}>Удалить рецепт</button>}
          {submitSave && (
            <div className={styles.submitResult}>{submitSave}</div>
          )}
        </div>
        <div className={styles.calculationsContainer}>
          {/* Здесь будет отображаться компонент с калькуляторами */}
          <CalculationsPage />
        </div>
      </div>
      <div className={styles.reviewsSection}>
        {isAuthenticated && (
          <div className={styles.reviewForm}>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Ваш отзыв"
            />
            <select
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
            >
              <option value={0}>Выберите рейтинг</option>
              <option value={1}>1 звезда</option>
              <option value={2}>2 звезды</option>
              <option value={3}>3 звезды</option>
              <option value={4}>4 звезды</option>
              <option value={5}>5 звезд</option>
            </select>
            <button onClick={submitReview}>Оставить отзыв</button>
          </div>
        )}
        <h2>Отзывы</h2>
        {recipe.reviews.map((review) => (
          <div key={review.id} className={styles.review}>
            <p>
              {reviewUsers[review.user_Id] || 'Загрузка имени пользователя...'}
            </p>
            <p>Комментарий: {review.text}</p>
            <p>Рейтинг: {review.rating}</p>
          </div>
        ))}
      </div>
    </>
  );
}
