import { useContext } from "react";
import { AppContext } from "../store";

export default function ThemeSwitcher() {
  const { setTheme } = useContext(AppContext);

  return (
    <div>
      <button onClick={() => setTheme("galaxy")}>Galaxy 🌌</button>
      <button onClick={() => setTheme("dark")}>Dark 🌙</button>
      <button onClick={() => setTheme("light")}>Light ☀️</button>
    </div>
  );
} 
