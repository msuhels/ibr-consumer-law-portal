import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const userToken = Cookies.get("user_token");

  useEffect(() => {
    if (!userToken) {
      navigate("/signin");
    }
    setIsLoading(false);
  }, [userToken, navigate]);

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }
  return <>{children}</>;
};

export default AuthWrapper;
