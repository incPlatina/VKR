import { useEffect, useState } from 'react';

import Navbar from '../components/Navbar.jsx';
import Calculations from '../components/Calculayion.jsx';

export default function CalculationsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    <div>
      <Navbar isAuthenticated={isAuthenticated} />
      <Calculations />
    </div>
  );
}
