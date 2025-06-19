

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TokenChecker = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000;
        const now = Date.now();
        const timeout = exp - now;

        if (timeout > 0) {
          const timer = setTimeout(() => {
            localStorage.removeItem('jwtToken');
            navigate('/');
          }, timeout);

          return () => clearTimeout(timer);
        } else {
          localStorage.removeItem('jwtToken');
          navigate('/');
        }
      } catch (error) {
        localStorage.removeItem('jwtToken');
        navigate('/');
      }
    }
  }, [navigate]);

  return null;
};

export default TokenChecker;
