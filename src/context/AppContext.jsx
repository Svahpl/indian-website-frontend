import { useContext, createContext, Children, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const setCartCounter = (count) => {
    setCartCount(count);
  };

  return (
    <AppContext.Provider value={{ cartCount, setCartCounter }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
