import { useEffect, useState } from "react";
import Form from "./components/form"
import { FaMoon, FaSun } from "react-icons/fa";

function App() { 
  const THEME_KEY = "task-manager-theme";

  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    // Follow system theme if no stored preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  // Update HTML class & save to localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <>
  <div className="theme-toggle" onClick={toggleTheme} style={{ cursor: "pointer", fontSize: "1.5rem", position: "absolute", top: "1rem", right: "1rem" }}>
        {theme === "dark" ? <FaSun title="Light Mode" /> : <FaMoon title="Dark Mode" />}
      </div>

    <Form />
    </>
  )
}

export default App
