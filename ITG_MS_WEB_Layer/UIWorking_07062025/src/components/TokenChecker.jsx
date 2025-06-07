// working functional expiration check for token in localStorage
/*import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TokenChecker = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    //const token = localStorage.getItem('jwtToken');
    console.log("Fetched token from localStorage:", token);

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000;
        const now = Date.now();
        const timeout = exp - now;

        console.log("Token expiry:", new Date(exp));
        console.log("Current time:", new Date(now));
        console.log("Time remaining (ms):", timeout);

        if (timeout > 0) {
          const timer = setTimeout(() => {
            console.log("Token expired. Logging out...");
            localStorage.removeItem('authToken');
            navigate('/');
          }, timeout);

          return () => {
            console.log("Cleaning up token timer.");
            clearTimeout(timer);
          };
        } else {
          console.log("Token already expired.");
          localStorage.removeItem('authToken');
          navigate('/');
        }
      } catch (error) {
        console.log("Invalid token format:", error);
        localStorage.removeItem('authToken');
        navigate('/');
      }
    } else {
      console.log("No token found in localStorage.");
    }
  }, [navigate]);

  return null;
};

export default TokenChecker;
*/


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
