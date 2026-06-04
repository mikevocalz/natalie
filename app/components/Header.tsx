"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, ChevronRight } from "lucide-react";

const navLinks = [
  { name: "Vision", href: "#vision" },
  { name: "Thesis", href: "#thesis" },
  { name: "Research", href: "#research" },
  { name: "Personas", href: "#personas" },
  { name: "Concept", href: "#concept" },
  { name: "Trust", href: "#trust" },
  { name: "System", href: "#system" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      setIsScrolled(window.scrollY > 50);

      // Active section
      const sections = navLinks.map(link => link.href.replace("#", ""));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "backdrop-blur-xl bg-[#04060d]/90"
            : "backdrop-blur-md bg-[#04060d]/60"
        }`}
      >
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[rgba(180,200,222,0.08)]">
          <motion.div
            className="h-full bg-linear-to-r from-[#3da5ff] via-[#9ec9ef] to-[#3da5ff]"
            style={{ width: `${scrollProgress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Top border glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[rgba(61,165,255,0.3)] to-transparent" />

        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <nav className="flex h-16 sm:h-18 items-center justify-between">
            {/* Logo with glow effect */}
            <motion.a
              href="#"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex items-center gap-3"
            >
              {/* Glow behind logo */}
              <div className="absolute -inset-2 bg-[#3da5ff]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[linear-gradient(135deg,rgba(61,165,255,0.2),rgba(61,165,255,0.05))] border border-[rgba(61,165,255,0.3)]">
                <Sparkles className="w-4 h-4 text-[#3da5ff]" />
              </div>
              <span className="relative font-mono text-sm sm:text-base font-bold tracking-[0.2em] text-[#eef2f7]">
                N.A.T.A.L.I.E.
              </span>
            </motion.a>

            {/* Desktop Navigation - Pill style */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-[rgba(12,22,40,0.6)] border border-[rgba(180,200,222,0.08)] backdrop-blur-sm">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 + 0.3 }}
                    className="relative px-4 py-2 rounded-xl font-mono text-[11px] tracking-[0.14em] uppercase transition-all duration-300"
                  >
                    {/* Active indicator */}
                    {activeSection === link.href.replace("#", "") && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-[rgba(61,165,255,0.15)] rounded-xl border border-[rgba(61,165,255,0.3)]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-10 transition-colors duration-300 ${
                      activeSection === link.href.replace("#", "")
                        ? "text-[#eef2f7]"
                        : "text-[#6c7e90] hover:text-[#a2b2c2]"
                    }`}>
                      {link.name}
                    </span>
                  </motion.a>
                ))}
              </div>

              {/* CTA Button */}
              <motion.a
                href="#concept"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-4 px-5 py-2.5 rounded-xl bg-[linear-gradient(135deg,#3da5ff,#2a7fcc)] text-white font-mono text-[11px] tracking-[0.12em] uppercase font-semibold shadow-lg shadow-[rgba(61,165,255,0.3)] hover:shadow-[rgba(61,165,255,0.5)] transition-shadow duration-300"
              >
                Explore
              </motion.a>
            </div>

            {/* Mobile Menu Button - Advanced */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative p-3 rounded-xl bg-[rgba(12,22,40,0.6)] border border-[rgba(180,200,222,0.12)] text-[#a2b2c2] hover:text-[#eef2f7] hover:border-[rgba(61,165,255,0.3)] transition-all"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu - Full screen overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-[#08090f]/80 backdrop-blur-sm lg:hidden"
            />
            
            {/* Menu panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm lg:hidden bg-[linear-gradient(180deg,#0c1018,#08090f)] border-l border-[rgba(180,200,222,0.12)]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[rgba(180,200,222,0.12)]">
                <span className="font-mono text-sm font-bold tracking-[0.2em] text-[#eef2f7]">
                  Menu
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-[#a2b2c2] hover:text-[#eef2f7] hover:bg-[rgba(61,165,255,0.1)] transition-all"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Nav links */}
              <nav className="flex flex-col p-4 gap-2">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, type: "spring" }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`group flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-300 ${
                      activeSection === link.href.replace("#", "")
                        ? "bg-[rgba(61,165,255,0.15)] border border-[rgba(61,165,255,0.3)]"
                        : "bg-[rgba(12,22,40,0.4)] border border-[rgba(180,200,222,0.08)] hover:border-[rgba(61,165,255,0.2)]"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className={`font-mono text-sm tracking-[0.1em] uppercase transition-colors ${
                        activeSection === link.href.replace("#", "")
                          ? "text-[#eef2f7]"
                          : "text-[#a2b2c2] group-hover:text-[#cfe2f5]"
                      }`}>
                        {link.name}
                      </span>
                      <span className="text-[10px] text-[#6c7e90] mt-0.5">
                        Section {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-all duration-300 ${
                      activeSection === link.href.replace("#", "")
                        ? "text-[#3da5ff] translate-x-0"
                        : "text-[#6c7e90] group-hover:text-[#3da5ff] -translate-x-1 group-hover:translate-x-0"
                    }`} />
                  </motion.a>
                ))}
              </nav>

              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[rgba(180,200,222,0.12)]">
                <div className="flex items-center justify-center gap-2 text-[#6c7e90]">
                  <div className="w-2 h-2 rounded-full bg-[#5af0c0] animate-pulse" />
                  <span className="font-mono text-[10px] tracking-[0.16em] uppercase">
                    System Online
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
