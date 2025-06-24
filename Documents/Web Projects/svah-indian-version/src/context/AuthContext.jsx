import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  const storeTokenInLocalStorage = (serverToken) => {
    localStorage.setItem("token", serverToken);
    setToken(serverToken);
    setIsLoggedIn(!!serverToken);
  };

  const LogoutUser = () => {
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("uid");
    localStorage.clear();
  };

  const storeUser = (id) => {
    localStorage.setItem("uid", id);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, LogoutUser, storeTokenInLocalStorage, storeUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
