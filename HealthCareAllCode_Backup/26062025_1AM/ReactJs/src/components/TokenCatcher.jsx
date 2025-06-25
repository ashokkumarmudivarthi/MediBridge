/*// src/components/TokenCatcher.jsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TokenCatcher = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      console.log("🎯 OAuth2 token found in URL:", token);
      localStorage.setItem("jwtToken", token);
      navigate("/dashboard"); // clean URL
    }
  }, [location, navigate]);

  return null;
};

export default TokenCatcher;
*/

// src/components/TokenCatcher.jsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const TokenCatcher = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      console.log("🎯 OAuth2 token found in URL:", token);
      localStorage.setItem("jwtToken", token);

      // Decode role and store for debugging if needed
      const decoded = parseJwt(token);
      const role = decoded?.roles?.[0] || null;
      console.log("🎭 Role extracted from token:", role);
      
      localStorage.setItem("userRole", role);
window.location.href = "/dashboard"; // Force full page reload to reset router
      navigate("/dashboard"); // remove token from URL
    }
  }, [location, navigate]);

  return null;
};

export default TokenCatcher;
