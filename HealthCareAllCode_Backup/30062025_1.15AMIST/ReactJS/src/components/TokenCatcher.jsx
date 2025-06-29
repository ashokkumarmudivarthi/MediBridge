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

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

const TokenCatcher = () => {
  const { search, pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("TokenCatcher running, current URL:", pathname + search);
    
    const params = new URLSearchParams(search);
    const token = params.get("token");

    if (token) {
      console.log("▶️ TokenCatcher: token found", token);
      const decoded = parseJwt(token);
      const role = decoded?.roles?.[0];

      if (role) {
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("userRole", role);
        console.log("✅ Token and role stored:", role);
      }

      // Remove token from URL after saving
      navigate(pathname, { replace: true });
    }
  }, [search, pathname, navigate]);

  return null;
};

export default TokenCatcher;
