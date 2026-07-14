import React, { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Navbar({ darkMode, setDarkMode }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Monitor scroll state to change navbar look
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Início", href: "#inicio" },
    { label: "Quem Somos", href: "#quem-somos" },
    { label: "Onde Atuamos", href: "#onde-atuamos" },
    { label: "Soluções", href: "#solucoes" },
    { label: "Programas", href: "#programas" },
    { label: "Avaliações", href: "#galeria" },
    { label: "Blog", href: "#blog" },
    { label: "Contato", href: "#contato" },
  ];

  const handleScrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(id);
    if (element) {
      const offset = 80; // height of fixed header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 dark:border-slate-800/50 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3 select-none group"
          >
            {/* Symbol */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0">
              <svg 
                viewBox="0 0 200 200" 
                className="w-full h-full drop-shadow-[0_2px_8px_rgba(255,122,0,0.15)] dark:drop-shadow-none"
                style={{ transform: "skewX(-10deg)" }}
              >
                {/* Orange Head Circle */}
                <circle cx="82" cy="45" r="14" fill="#FF7A00" />

                {/* Left Orange Swoosh Ribbon */}
                <path
                  d="M 45,135 C 35,110 50,82 80,82"
                  fill="none"
                  stroke="#FF7A00"
                  strokeWidth="15"
                  strokeLinecap="round"
                />

                {/* Main "P" body Ribbon */}
                <path
                  d="M 98,165 L 98,95 C 98,72 115,52 138,52 C 162,52 175,70 175,95 C 175,120 158,138 135,138 L 114,138"
                  fill="none"
                  className="stroke-slate-900 dark:stroke-white transition-colors duration-300"
                  strokeWidth="18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Text details */}
            <div className="flex flex-col text-left">
              <span className="font-brand italic font-extrabold text-lg sm:text-xl tracking-wider text-slate-900 dark:text-white -mb-0.5 leading-none" style={{ transform: "skewX(-10deg)" }}>
                PERFORMANCE
              </span>
              <span className="text-[8px] sm:text-[9px] font-brand font-bold uppercase tracking-[0.22em] text-[#FF7A00] leading-none mt-0.5">
                Eventos Corporativos
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollTo(link.href);
                }}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right actions (Dark Mode, CTA, Mobile menu button) */}
          <div className="flex items-center space-x-3">
            {/* Dark Mode Switcher */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 hover:scale-105 transition-all duration-200"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Desktop CTA */}
            <button
              onClick={() => handleScrollTo("#contato")}
              className="hidden lg:flex items-center px-5 py-2 rounded-full text-sm font-bold bg-sky-600 hover:bg-sky-700 text-white transition-all duration-200 shadow-lg shadow-sky-200/50 dark:shadow-none hover:scale-105 cursor-pointer"
            >
              Solicitar Orçamento
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg md:hidden text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleScrollTo(link.href);
                  }}
                  className="block px-4 py-2.5 rounded-xl text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 px-4">
                <button
                  onClick={() => handleScrollTo("#contato")}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-base font-semibold bg-sky-600 text-white shadow-md shadow-sky-200/50 dark:shadow-none"
                >
                  Solicitar Orçamento
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
