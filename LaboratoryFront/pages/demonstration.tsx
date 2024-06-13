import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import Navbar from '../components/Navbar.jsx';
import styles from '../styles/demonstration.module.css';

// Определите типы для элементов и формул
type Element = {
  id: number;
  symbol: string;
  name: string;
};

type OptionType = {
  label: string;
  value: string;
};

type Formule = {
  id: number;
  name: string;
  formuleText: string;
  element1: string;
  element2: string;
  description: string;
};

type ReactionViewModel = {
  result: boolean;
  formule: Formule;
};

const IndexPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement1, setSelectedElement1] = useState<OptionType | null>(
    null,
  );
  const [selectedElement2, setSelectedElement2] = useState<OptionType | null>(
    null,
  );
  const [reactionResult, setReactionResult] =
    useState<ReactionViewModel | null>(null);

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
    fetch('https://localhost:7265/Demonstration')
      .then((response) => response.json())
      .then((data) => setElements(data))
      .catch((error) => console.error('Ошибка при получении данных:', error));
  }, []);

  const handleReaction = () => {
    if (selectedElement1 && selectedElement2) {
      const requestBody = {
        Symbol1: selectedElement1.label.split(' - ')[0],
        Symbol2: selectedElement2.label.split(' - ')[0],
      };

      fetch('https://localhost:7265/Demonstration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
        .then((response) => response.json())
        .then((data) => setReactionResult(data))
        .catch((error) => console.error('Ошибка при отправке данных:', error));
    }
  };

  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} />
      <div className={styles.container}>
        <h1 className={styles.title}>
          Выберите два элемента и нажмите "Реагировать":
        </h1>
        <Select
          className={styles.reactionresult}
          options={elements.map((element) => ({
            label: `${element.symbol} - ${element.name}`,
            value: element.id.toString(),
          }))}
          onChange={(selectedOption: SingleValue<OptionType>) =>
            setSelectedElement1(selectedOption)
          }
          placeholder="Выберите первый элемент"
        />
        <Select
          className={styles.reactionresult}
          options={elements.map((element) => ({
            label: `${element.symbol} - ${element.name}`,
            value: element.id.toString(),
          }))}
          onChange={(selectedOption: SingleValue<OptionType>) =>
            setSelectedElement2(selectedOption)
          }
          placeholder="Выберите второй элемент"
        />
        <button className={styles.button} onClick={handleReaction}>
          Реагировать
        </button>

        {reactionResult?.result && (
          <div className={styles.reactionResult}>
            <h2>Результат реакции:</h2>
            <p>Название: {reactionResult.formule.name}</p>
            <p>Формула: {reactionResult.formule.formuleText}</p>
            <p>Описание: {reactionResult.formule.description}</p>
          </div>
        )}
        {reactionResult?.result == false && (
          <div className={styles.reactionResult}>
            <h2>Результат реакции:</h2>
            <p>Нет такой реакции</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndexPage;
