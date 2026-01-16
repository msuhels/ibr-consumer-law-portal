import React from 'react';
import { useThemeProvider } from '../utils/ThemeContext';
import moonIcon from "../images/dashboard_img/moon-outline.png";

export default function ThemeToggle() {
  const { currentTheme, changeCurrentTheme } = useThemeProvider();
  return (
    <div className="relative inline-flex items-center">
      <input
        type="checkbox"
        name="light-switch"
        id="light-switch"
        className="light-switch sr-only"
        checked={currentTheme === 'light'}
        // onChange={() => changeCurrentTheme(currentTheme === 'light' ? 'dark' : 'light')}
      />
      <label
        className="flex items-center justify-center cursor-pointer w-8 h-8  bg-white hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600/80 border rounded-xl"
        htmlFor="light-switch"
      >
         <img src={moonIcon}/>
        <span className="sr-only">Switch to light / dark version</span>
      </label>
    </div>
  );
}
