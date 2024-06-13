import { useState } from 'react';

import styles from '../styles/Calculation.module.css';

export default function CalculationsPage() {
  // Для первого калькулятора
  const [solutions, setSolutions] = useState([{ volume: 0, concentration: 0 }]);
  const [totalVolume, setTotalVolume] = useState(0);
  const [totalConcentration, setTotalConcentration] = useState(0);
  const [proportions, setProportions] = useState('');

  // Для второго калькулятора
  const [mixtures, setMixtures] = useState([{ ratio: 1, maxVolume: Infinity }]);
  const [finalVolume, setFinalVolume] = useState(0);

  // Обработчики для первого калькулятора
  const handleSolutionChange = (index, field, value) => {
    const newSolutions = [...solutions];
    newSolutions[index][field] = Number(value);
    setSolutions(newSolutions);
  };

  const addSolution = () => {
    setSolutions([...solutions, { volume: 0, concentration: 0 }]);
  };

  const calculateTotal = () => {
    const totalVol = solutions.reduce((acc, curr) => acc + curr.volume, 0);
    const totalConc =
      solutions.reduce(
        (acc, curr) => acc + curr.volume * curr.concentration,
        0,
      ) / totalVol;
    setTotalVolume(totalVol);
    setTotalConcentration(totalConc);
  };

  // Обработчики для второго калькулятора
  const handleProportionsChange = (value) => {
    setProportions(value);
    const proportionValues = value.split(':').map(Number);

    // Создаем новый массив mixtures с обновленными значениями ratio
    const newMixtures = proportionValues.map((proportion, index) => {
      // Если элемент mixtures уже существует, обновляем его ratio
      if (index < mixtures.length) {
        return { ...mixtures[index], ratio: proportion };
      }
      // Иначе, создаем новый элемент с заданным ratio и maxVolume
      return { ratio: proportion, maxVolume: Infinity };
    });

    // Обновляем состояние mixtures новым массивом
    setMixtures(newMixtures);
  };

  const handleMixtureChange = (index, field, value) => {
    const newMixtures = [...mixtures];
    if (field === 'maxVolume') {
      newMixtures[index][field] = value === '' ? Infinity : Number(value);
    } else {
      newMixtures[index][field] = Number(value);
    }
    setMixtures(newMixtures);
  };

  // Функция для добавления нового ингредиента
  const addMixture = () => {
    setMixtures([...mixtures, { ratio: 1, maxVolume: Infinity }]);
  };

  // Функция для расчета объемов ингредиентов
  const calculateVolumes = () => {
    let sumOfRatios = mixtures.reduce((acc, mixture) => acc + mixture.ratio, 0);
    let adjustedFinalVolume = finalVolume;

    // Пересчитываем объемы, пока не найдем подходящее решение
    let isVolumeExceeded;
    do {
      isVolumeExceeded = false;
      let remainingVolume = adjustedFinalVolume;

      // Рассчитываем объем каждого ингредиента
      mixtures.forEach((mixture, index) => {
        const volume = (remainingVolume * mixture.ratio) / sumOfRatios;
        if (volume > mixture.maxVolume && mixture.maxVolume !== Infinity) {
          // Если объем превышает максимальный, пересчитываем объемы
          isVolumeExceeded = true;
          const newSinglePortionVolume = mixture.maxVolume / mixture.ratio;
          remainingVolume -= mixture.maxVolume;
          sumOfRatios -= mixture.ratio;
          mixtures.forEach((mix, idx) => {
            if (idx !== index) {
              mix.calculatedVolume = newSinglePortionVolume * mix.ratio;
            }
          });
          mixture.calculatedVolume = mixture.maxVolume;
        } else if (!isVolumeExceeded) {
          // Если объем не превышен, сохраняем рассчитанный объем
          mixture.calculatedVolume = volume;
        }
      });
    } while (isVolumeExceeded && sumOfRatios > 0);

    setMixtures([...mixtures]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.calculator}>
        <h1>Калькулятор объема и концентрации растворов</h1>
        {solutions.map((solution, index) => (
          <div key={index} className={styles.solution}>
            <label className={styles.label}>
              Объем(мл)
              <input
                className={styles.input}
                type="text"
                pattern="\d*"
                value={solution.volume}
                onChange={(e) =>
                  handleSolutionChange(index, 'volume', e.target.value)
                }
                placeholder="Объем (мл)"
              />
            </label>
            <label className={styles.label}>
              Концентрация (%)
              <input
                className={styles.input}
                type="text"
                pattern="\d*"
                value={solution.concentration}
                onChange={(e) =>
                  handleSolutionChange(index, 'concentration', e.target.value)
                }
                placeholder="Концентрация (%)"
              />
            </label>
          </div>
        ))}
        <button className={styles.button} onClick={addSolution}>
          Добавить раствор
        </button>
        <button className={styles.button} onClick={calculateTotal}>
          Рассчитать итоговый объем и концентрацию
        </button>
        <p className={styles.result}>Итоговый объем: {totalVolume} мл</p>
        <p className={styles.result}>
          Итоговая концентрация: {totalConcentration} %
        </p>
      </div>
      <div>
        <h1>Калькулятор Объемов Ингредиентов</h1>
        <div>
          <label className={styles.label}>
            Введите пропорцию из рецепта
            <input
              className={styles.input}
              type="text"
              value={proportions}
              onChange={(e) => handleProportionsChange(e.target.value)}
              placeholder="Введите пропорции"
            />
          </label>
        </div>
        <label className={styles.label}>
          Объем итогового вещества (мл)
          <input
            className={styles.input}
            type="text"
            pattern="\d*"
            value={finalVolume}
            onChange={(e) => setFinalVolume(Number(e.target.value))}
            placeholder="Итоговый объем смеси (мл)"
          />
        </label>
        {mixtures.map((mixture, index) => (
          <div key={index}>
            <label className={styles.label}>
              Пропорция вещества
              <input
                className={styles.input}
                type="text"
                pattern="\d*"
                value={mixture.ratio || ''} // Если значение null, то в инпуте будет пустая строка
                onChange={(e) =>
                  handleMixtureChange(index, 'ratio', e.target.value)
                }
                placeholder={`Пропорция ингредиента ${index + 1}`}
              />
            </label>
            <label className={styles.label}>
              Максимальный объем ингредиента
              <input
                className={styles.input}
                type="text"
                pattern="\d*"
                value={mixture.maxVolume || ''} // Если значение null, то в инпуте будет пустая строка
                onChange={(e) =>
                  handleMixtureChange(index, 'maxVolume', e.target.value)
                }
                placeholder={`Макс. объем ингредиента ${index + 1} (мл)`}
              />
            </label>
            <p>
              Рассчитанный объем: {mixture.calculatedVolume?.toFixed(2) || 0} мл
            </p>
          </div>
        ))}
        <button className={styles.button} onClick={addMixture}>
          Добавить ингредиент
        </button>
        <button className={styles.button} onClick={calculateVolumes}>
          Рассчитать объемы
        </button>
      </div>
    </div>
  );
}
