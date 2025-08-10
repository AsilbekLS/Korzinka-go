import React, { createContext, useContext, useState } from "react";

const UIContext = createContext();

export const useUI = () => useContext(UIContext);

export const UIProvider = ({ children }) => {
  const [openNavbarSearch, setOpenNavbarSearch] = useState(false);

  return (
    <UIContext.Provider value={{ openNavbarSearch, setOpenNavbarSearch }}>
      {children}
    </UIContext.Provider>
  );
};
