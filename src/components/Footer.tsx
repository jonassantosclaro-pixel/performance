import React from "react";
import { Lock, Instagram, Phone, Mail, Sparkles } from "lucide-react";
import { GlobalSettings } from "../lib/firebase";

interface FooterProps {
  onAdminClick: () => void;
  settings: GlobalSettings;
}

export default function Footer({ onAdminClick, settings }: FooterProps) {
  const handleScrollTo = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      const offset = 80;
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

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white border-t border-slate-800 pt-16 pb-12 relative z-20 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* Column 1: Brand Info */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-3 select-none">
            {/* Symbol */}
            <div className="w-10 h-10 shrink-0">
              <svg 
                viewBox="0 0 200 200" 
                className="w-full h-full"
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

                {/* Main "P" body Ribbon (white for dark footer) */}
                <path
                  d="M 98,165 L 98,95 C 98,72 115,52 138,52 C 162,52 175,70 175,95 C 175,120 158,138 135,138 L 114,138"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Text details */}
            <div className="flex flex-col text-left">
              <span className="font-brand italic font-extrabold text-lg tracking-wider text-white -mb-0.5 leading-none" style={{ transform: "skewX(-10deg)" }}>
                PERFORMANCE
              </span>
              <span className="text-[8px] font-brand font-bold uppercase tracking-[0.22em] text-[#FF7A00] leading-none mt-0.5">
                Eventos Corporativos
              </span>
            </div>
          </div>
          
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            Especialistas em SIPAT, teatro corporativo, palestras show, saúde mental no trabalho, ergonomia e programas de prevenção de acidentes inovadores em todo o Brasil.
          </p>

          {/* Social Icons inside Footer */}
          <div className="flex gap-3 pt-2">
            <a 
              href={settings.instagram} 
              target="_blank" 
              rel="noreferrer" 
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-sky-500 hover:scale-105 text-slate-300 hover:text-white transition-all cursor-pointer"
              aria-label="Instagram da Performance"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`} 
              target="_blank" 
              rel="noreferrer" 
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:scale-105 text-slate-300 hover:text-white transition-all cursor-pointer"
              aria-label="WhatsApp Comercial"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
            Acesso Rápido
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <button 
                onClick={() => handleScrollTo("#inicio")} 
                className="text-slate-400 hover:text-sky-400 transition-colors cursor-pointer text-left"
              >
                Início
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleScrollTo("#onde-atuamos")} 
                className="text-slate-400 hover:text-sky-400 transition-colors cursor-pointer text-left"
              >
                Onde Atuamos
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleScrollTo("#solucoes")} 
                className="text-slate-400 hover:text-sky-400 transition-colors cursor-pointer text-left"
              >
                Nossas Soluções
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleScrollTo("#programas")} 
                className="text-slate-400 hover:text-sky-400 transition-colors cursor-pointer text-left"
              >
                Nossos Programas
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact details */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
            Contato Comercial
          </h4>
          <ul className="space-y-3.5 text-sm text-slate-400">
            <li className="flex items-start gap-2.5">
              <Mail className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                {settings.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`} className="hover:text-white transition-colors">
                {settings.whatsapp.startsWith("+") ? settings.whatsapp : `+55 ${settings.whatsapp}`}
              </a>
            </li>
            <li className="text-xs text-slate-500 pt-2 leading-relaxed">
              Atendimento presencial e remoto corporativo em todo o território nacional.
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright & Admin Trigger */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
        <p className="text-xs text-slate-500">
          © {currentYear} PERFORMANCE Treinamentos Corporativos & Bem-Estar S/S. Todos os direitos reservados.
        </p>
        
        {/* Discrete Admin login link */}
        <button
          onClick={onAdminClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-500 hover:text-sky-400 hover:bg-slate-800/30 transition-all text-xs font-semibold tracking-wide cursor-pointer select-none"
        >
          <Lock className="w-3.5 h-3.5" />
          Administração
        </button>
      </div>
    </footer>
  );
}
