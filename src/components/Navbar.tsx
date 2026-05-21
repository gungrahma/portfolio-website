import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.hash]);

  const navLinks = [
    { name: "About", path: "/#about" },
    { name: "Projects", path: "/projects" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full h-[var(--nav-height,80px)] bg-transparent backdrop-blur-md z-[1000] flex items-center border-b border-[var(--border-color)] transition-colors duration-300">
      <div className="container mx-auto px-6 h-full flex justify-between items-center max-w-[1000px]">
        {/* Logo */}
        <div className="flex items-center gap-4 z-[1001]">
          <Link to="/" className="w-8 h-8 bg-[var(--text-color)] flex items-center justify-center rounded-sm hover:-translate-y-0.5 transition-transform">
            <span className="text-[var(--bg-color)] font-black text-xs italic">AR</span>
          </Link>
          <span className="text-[11px] uppercase tracking-[0.3em] font-medium opacity-60 hidden sm:block">Agung Rahma</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 lg:gap-10 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-[11px] uppercase tracking-widest cursor-pointer hover:opacity-50 transition-opacity"
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={toggleTheme}
            className="p-2 hover:rotate-[30deg] transition-transform duration-300"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <a
            href="/#contact"
            className="px-4 py-2 border border-[var(--border-color)] rounded-full text-[10px] uppercase tracking-widest hover:bg-[var(--text-color)] hover:text-[var(--bg-color)] transition-all cursor-pointer"
          >
            Let's Talk
          </a>
        </nav>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-4 z-[1001]">
          <button
            onClick={toggleTheme}
            className="p-2 hover:rotate-[30deg] transition-transform duration-300"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-4/5 h-screen bg-[var(--bg-color)] shadow-[-5px_0_15px_rgba(0,0,0,0.1)] flex flex-col justify-center items-center gap-8 z-[1000]"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-2xl font-medium hover:opacity-60 transition-opacity"
                >
                  {link.name}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
