import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState("galaxy");
  const [fontSize, setFontSize] = useState(16);
  const [lang, setLang] = useState("en");

  return (
    <AppContext.Provider value={{
      theme, setTheme,
      fontSize, setFontSize,
      lang, setLang
    }}>
      <div style={{ fontSize: fontSize }}>
        {children}
      </div>
    </AppContext.Provider>
  );
}; 
