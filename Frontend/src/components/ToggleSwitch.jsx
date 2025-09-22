import { useEffect, useState } from "react";

export default function ToggleSwitch() {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("hh-theme");
    const initial = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setChecked(initial);
  }, []);

  useEffect(() => {
    const root = document.documentElement; // <html>
    const body = document.body;
    if (checked) {
      root.classList.add("dark");
      body.classList.add("dark");
      localStorage.setItem("hh-theme", "dark");
    } else {
      root.classList.remove("dark");
      body.classList.remove("dark");
      localStorage.setItem("hh-theme", "light");
    }
  }, [checked]);

  return (
    <div className="relative w-[100px] h-[50px] select-none">
      <input
        id="toggle"
        type="checkbox"
        checked={checked}
        onChange={() => setChecked(!checked)}
        className="peer hidden"
      />
      <label
        htmlFor="toggle"
        role="switch"
        aria-checked={checked}
        onClick={(e)=>{ e.preventDefault(); setChecked(v=>!v); }}
        className="absolute inset-0 rounded-full border-4 border-gray-800 bg-gray-800 cursor-pointer transition-colors duration-500 ease-out dark:border-gray-200 dark:bg-gray-200 flex items-center px-2 peer-checked:bg-gray-300 dark:peer-checked:bg-gray-700 peer-checked:justify-end"
        aria-label="Toggle dark mode"
      >
        <span className="block w-[25px] h-[25px] rounded-full bg-white dark:bg-gray-900 shadow transition-all duration-500 ease-out peer-checked:shadow-lg peer-checked:scale-105" />
      </label>
    </div>
  );
}
