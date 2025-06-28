import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useTokenExpiryRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleTokenExpired = () => {
      localStorage.removeItem("jwtToken"); // clear token
      navigate("/login");
    };

    window.addEventListener("tokenExpired", handleTokenExpired);

    return () => {
      window.removeEventListener("tokenExpired", handleTokenExpired);
    };
  }, [navigate]);
};

export default useTokenExpiryRedirect;
