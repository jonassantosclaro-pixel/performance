import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import WhereWeAct from "./components/WhereWeAct";
import Services from "./components/Services";
import Programs from "./components/Programs";
import Testimonials from "./components/Testimonials";
import Gallery from "./components/Gallery";
import Blog from "./components/Blog";
import ContactForm from "./components/ContactForm";
import FloatingButtons from "./components/FloatingButtons";
import AdminPanel from "./components/AdminPanel";
import Footer from "./components/Footer";
import SplashIntro from "./components/SplashIntro";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "motion/react";
import { bootstrapAndTrackViews, GlobalSettings } from "./lib/firebase";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [settings, setSettings] = useState<GlobalSettings>({
    instagram: "https://instagram.com/performance.treinamentos",
    whatsapp: "+5511999999999",
    email: "contato@performance.com",
    views: 0
  });

  // Track page views and load real-time configuration from Firestore
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    const initTracking = async () => {
      try {
        unsubscribe = await bootstrapAndTrackViews((latestSettings) => {
          if (latestSettings) {
            setSettings(latestSettings);
          }
        });
      } catch (err) {
        console.error("Firebase tracking bootstrap failed:", err);
      }
    };

    initTracking();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Sync dark mode class with state
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Handle body scroll lock while splash screen is active
  useEffect(() => {
    if (showSplash) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showSplash]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 relative select-text antialiased">
      {/* 7-Second Splash Intro */}
      <AnimatePresence>
        {showSplash && (
          <SplashIntro onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {/* Dynamic Background Noise Accent */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.06),transparent_100%)] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.04),transparent_100%)]" />

      {/* Toast Notifications */}
      <Toaster 
        position="top-center" 
        toastOptions={{
          className: "font-sans text-sm font-medium rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white shadow-lg",
          duration: 4000
        }}
      />

      {/* Navigation */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Page Content */}
      <main className="relative z-10">
        <Hero />
        <Stats />
        <WhereWeAct />
        <Services />
        <Programs />
        <Testimonials />
        <Gallery />
        <Blog />
        <ContactForm settings={settings} />
      </main>

      {/* Footer & Admin Modal Launcher */}
      <Footer onAdminClick={() => setIsAdminOpen(true)} settings={settings} />

      {/* Admin Panel Drawer Modal */}
      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        settings={settings} 
      />

      {/* Left/Right Floating Social & AI Assistant Buttons */}
      <FloatingButtons settings={settings} />
    </div>
  );
}
