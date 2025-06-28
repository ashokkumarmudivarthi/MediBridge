// src/components/TokenExpiryWatcher.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"

const TokenExpiryWatcher = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const expiry = decoded.exp * 1000;
        const now = Date.now();
        const timeLeft = expiry - now;

        if (timeLeft <= 0) {
          localStorage.removeItem("jwtToken");
          localStorage.removeItem("userRole");
          alert("⚠️ Session expired. Please log in again.");
          navigate("/login");
        } else {
          // Set a timeout to auto-logout when time ends
          const timer = setTimeout(() => {
            localStorage.removeItem("jwtToken");
            localStorage.removeItem("userRole");
            alert("⚠️ Session expired. Please log in again.");
            navigate("/login");
          }, timeLeft);
          return () => clearTimeout(timer);
        }
      } catch (e) {
        console.error("Token decode error", e);
        localStorage.removeItem("jwtToken");
        navigate("/login");
      }
    };

    checkToken();
  }, [navigate]);

  return null;
};

export default TokenExpiryWatcher;
