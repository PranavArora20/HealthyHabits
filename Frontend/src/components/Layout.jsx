import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { useEffect, useRef, useState } from "react";
import ToggleSwitch from "./ToggleSwitch";

function isAuthed() {
  return !!localStorage.getItem("accessToken");
}

const navLinkClass = ({ isActive }) =>
  `mx-1 inline-flex rounded-full px-4 py-2 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-slate-800 ${
    isActive
      ? "bg-brand-600 text-white dark:bg-brand-500 font-semibold border border-brand-700 shadow-sm"
      : "border border-transparent"
  }`;

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(isAuthed());
  const panelRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onStorage = () => setAuthed(isAuthed());
    window.addEventListener("storage", onStorage);
    const id = setInterval(onStorage, 500);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(id);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setAuthed(false);
    navigate('/login');
  };

  const closeMenu = () => setOpen(false);

  return (
    <div className="min-h-screen flex flex-col text-[16px] md:text-[17px] text-gray-900 dark:text-gray-100 bg-[linear-gradient(180deg,#eef2ff_0%,#f8fbff_40%,#ffffff_100%)] dark:bg-[linear-gradient(180deg,#0b1020_0%,#0f172a_60%,#0b1020_100%)]">
      <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur shadow-sm dark:bg-slate-900/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-5 flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
            <img src={logo} alt="HealthyHabits" className="h-8 w-8" />
            <span className="text-xl font-semibold text-brand-700 dark:text-brand-300">
              HealthyHabits
            </span>
          </Link>
          <div className="flex items-center gap-3 lg:hidden">
            <button
              className="inline-flex items-center rounded-md border px-3 py-2 text-base dark:border-slate-700 cursor-pointer"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              ☰
            </button>
          </div>
        </div>
        <div
          ref={panelRef}
          className={`lg:block ${open ? "block" : "hidden"} border-t lg:border-t-0 dark:border-slate-800 transition-all duration-300`}
        >
          <div className="max-w-7xl mx-auto px-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 py-4">
            <nav className="flex flex-wrap items-center gap-3 text-base">
              <NavLink to="/activities" end onClick={closeMenu} className={navLinkClass}>Activities</NavLink>
              <NavLink to="/nutrition" onClick={closeMenu} className={navLinkClass}>Nutrition</NavLink>
              <NavLink to="/sleep" onClick={closeMenu} className={navLinkClass}>Sleep</NavLink>
              <NavLink to="/goals" onClick={closeMenu} className={navLinkClass}>Goals</NavLink>
              <NavLink to="/habits" onClick={closeMenu} className={navLinkClass}>Habits</NavLink>
              <NavLink to="/challenges" onClick={closeMenu} className={navLinkClass}>Challenges</NavLink>
              <NavLink to="/reminders" onClick={closeMenu} className={navLinkClass}>Reminders</NavLink>
              <NavLink to="/community" onClick={closeMenu} className={navLinkClass}>Community</NavLink>
            </nav>
            <div className="flex items-center gap-5 flex-wrap">
              {!authed ? (
                <Link to="/login" onClick={closeMenu} className="inline-flex items-center rounded-md border border-brand-600/40 bg-brand-600 px-4 py-2 text-white text-base shadow-sm hover:bg-brand-700 hover:border-brand-700 cursor-pointer">Login</Link>
              ) : (
                <button onClick={handleLogout} className="inline-flex items-center rounded-md border border-gray-700/40 bg-gray-800 px-4 py-2 text-white text-base shadow-sm cursor-pointer">Logout</button>
              )}
              <ToggleSwitch />
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-5 py-8 flex-1 w-full">
        {children}
      </main>
      <footer className="border-t py-8 text-center text-sm text-gray-600 dark:border-slate-800 dark:text-gray-400">
        Built with care · Stay consistent 💪
      </footer>
    </div>
  );
}
