import { useEffect, useState } from 'react';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';
import styles from '../styles/journal.module.css';
import Navbar from '../components/Navbar.jsx';

export default function JournalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('access_token='))
      ?.split('=')[1];

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
    async function fetchJournalAndRecipes() {
      //const token = document.cookie.split('; ').find(row => row.startsWith('access_token=')).split('=')[1];
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken['nameid']; // Получаем ID пользователя из токена

        try {
          // Запрос к API журнала

          const journalResponse = await fetch(
            'https://localhost:7265/api/Journal',
          );
          if (!journalResponse.ok) {
            throw new Error('Ошибка при получении данных журнала.');
          }
          const journalData = await journalResponse.json();

          // Фильтрация записей журнала по user_Id
          const userJournalEntries = journalData.filter(
            (entry) => entry.user_Id == userId,
          );

          // Получение уникальных recipe_Id из записей журнала
          const recipeIds = [
            ...new Set(userJournalEntries.map((entry) => entry.recipe_Id)),
          ];

          // Запросы к API рецептов для каждого recipe_Id
          const recipesPromises = recipeIds.map((id) =>
            fetch(`https://localhost:7265/api/Recipe/${id}`).then((response) =>
              response.json(),
            ),
          );
          const recipesData = await Promise.all(recipesPromises);

          // Установка отфильтрованных рецептов
          setRecipes(recipesData);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchJournalAndRecipes();
  }, []);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>Ошибка: {error}</p>;
  }

  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} />
      <h1>Мои сохраненные рецепты</h1>
      <div className={styles.recipesList}>
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <Link
              key={recipe.id}
              style={{ textDecoration: 'none', color: 'black' }}
              href={`/recipes/${recipe.id}`}
            >
              <div key={recipe.id} className={styles.recipeCard}>
                <h2>{recipe.name}</h2>
                <p>{recipe.description}</p>
              </div>
            </Link>
          ))
        ) : (
          <p>У вас пока нет рецептов.</p>
        )}
      </div>
    </div>
  );
}
