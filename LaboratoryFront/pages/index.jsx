import Link from 'next/link';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import styles from '../styles/index.module.css';
import Navbar from '../components/Navbar.jsx';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMy, setIsMy] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchText, setSearchText] = useState('');
  const [profileData, setProfileData] = useState({});

  const handleCheckboxChange = (categoryId) => {
    if (selectedCategory.includes(categoryId)) {
      setSelectedCategory(
        selectedCategory.filter((category) => category !== categoryId),
      );
    } else {
      setSelectedCategory([...selectedCategory, categoryId]);
    }
  };

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('access_token='))
      ?.split('=')[1];

    if (token) {
      const decodedToken = jwtDecode(token);
      setProfileData({
        nameId: decodedToken['nameid'],
        email: decodedToken['email'],
        name: decodedToken['name'],
        givenName: decodedToken['given_name'],
      });
      setIsAuthenticated(true);
      setIsMy(decodedToken['given_name'] === 'Admin');
    } else {
      setIsAuthenticated(false);
    }

    fetch('https://localhost:7265/api/Recipe')
      .then((response) => response.json())
      .then((data) => {
        setRecipes(data);
      })
      .catch((error) => console.error('Ошибка:', error));
    fetch('https://localhost:7265/api/User')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => console.error('Ошибка:', error));
    fetch('https://localhost:7265/api/Category')
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => console.error('Ошибка:', error));
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value.toLowerCase());
  };
  const filteredRecipes = recipes.filter((recipe) => {
    const categoryMatches =
      selectedCategory.length === 0 ||
      selectedCategory.includes(recipe.categoryId);
    const searchMatches = recipe.name.toLowerCase().includes(searchText);
    const isAuthor = recipe.user_id == profileData.nameId; // Проверка, является ли пользователь автором рецепта
    const isPublic = recipe.privacy === 'public' || isMy || isAuthor;
    return categoryMatches && searchMatches && isPublic;
  });

  const calculateAverageRating = (reviews) => {
    if (!Array.isArray(reviews) || reviews.length === 0) {
      return 'Нет отзывов';
    }
    const validReviews = reviews.filter((review) => review.rating > 0);
    if (validReviews.length === 0) {
      return 'Нет отзывов';
    }
    const totalRating = validReviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );
    return (totalRating / validReviews.length).toFixed(1);
  };

  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} />
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Поиск рецептов"
          value={searchText}
          onChange={handleSearchChange}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.categorySelection}>
          <h2>Выбор категории</h2>
          <button
            className={styles.categorySelectionButton}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Категории
          </button>
          {showDropdown && (
            <div
              className={`${styles.dropdownContent} ${showDropdown ? styles.showDropdown : ''}`}
            >
              {categories.map((category) => (
                <label key={category.id} className={styles.dropdownItem}>
                  <input
                    type="checkbox"
                    className={styles.dropdownCheckbox}
                    checked={selectedCategory.includes(category.id)}
                    onChange={() => handleCheckboxChange(category.id)}
                  />
                  {category.category}
                </label>
              ))}
            </div>
          )}
        </div>
        <div className={styles.Recipes}>
          <h2>Список рецептов</h2>
          <div className={styles.listOfRecipes}>
            {filteredRecipes.map((recipe) => {
              const author =
                users.find((user) => user.id === recipe.user_id)?.name ||
                'Неизвестный';
              const categoryName =
                categories.find((category) => category.id === recipe.categoryId)
                  ?.category || 'Неизвестный';
              const averageRating = calculateAverageRating(recipe.reviews);
              return (
                <Link
                  key={recipe.id}
                  href={`/recipes/${recipe.id}`}
                  style={{ textDecoration: 'none', color: 'black' }}
                >
                  <div key={recipe.id} className={styles.recipeCard}>
                    <h3>{recipe.name}</h3>
                    <p>Категория: {categoryName}</p>
                    <p>Автор: {author}</p>
                    <p>Средняя оценка: {averageRating}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
