import React, { useState, useRef } from "react";
import { ArrowDown, Play, Sparkles, MessageSquareCode } from "lucide-react";
import { motion } from "motion/react";

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Normalize coordinates from -1 to 1
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

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

  return (
    <section
      id="inicio"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-slate-50 dark:bg-slate-950"
    >
      {/* Decorative Moving Background Orbs & Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-sky-200/40 dark:bg-sky-900/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/10 w-[500px] h-[500px] bg-emerald-100/50 dark:bg-emerald-900/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50/20 dark:bg-slate-900/20 rounded-full blur-2xl" />
        
        {/* Abstract grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 dark:opacity-10" />

        {/* GIANT BACKDROP LOGO WITH AMBIENT EFFECTS */}
        <motion.div
          className="absolute right-[-15%] md:right-[-5%] top-[10%] w-[500px] h-[500px] sm:w-[650px] sm:h-[650px] lg:w-[850px] lg:h-[850px] opacity-[0.12] dark:opacity-[0.09] select-none pointer-events-none"
          style={{
            transformStyle: "preserve-3d",
            perspective: 1000,
          }}
          animate={{
            x: mousePos.x * -45,
            y: mousePos.y * -45,
            rotateX: mousePos.y * -8,
            rotateY: mousePos.x * 8,
          }}
          transition={{ type: "spring", stiffness: 45, damping: 25 }}
        >
          {/* Pulsing ambient glow centered behind the giant background logo */}
          <div className="absolute inset-0 bg-radial from-[#FF7A00]/20 dark:from-[#FF7A00]/30 to-transparent rounded-full filter blur-3xl scale-90" />

          {/* Glowing vectors */}
          <motion.svg
            viewBox="0 0 200 200"
            className="w-full h-full filter drop-shadow-[0_0_40px_rgba(255,122,0,0.25)]"
            style={{ transform: "skewX(-10deg)" }}
            animate={{
              rotate: [0, 1, -1, 0],
              y: [0, 12, -12, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
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
          </motion.svg>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left text column */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6 text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-wider uppercase shadow-xs border border-emerald-200/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
            <span>Líder em Treinamentos Corporativos & SIPAT</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight"
          >
            Experiências que{" "}
            <span className="text-sky-600">Transformam</span>{" "}
            Equipes e Empresas.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-300 font-normal max-w-xl leading-relaxed"
          >
            Palestras shows, teatro corporativo, ginástica laboral, ergonomia e
            atividades interativas. Soluções inovadoras para promover a segurança do trabalho,
            saúde física e bem-estar mental de seus colaboradores.
          </motion.p>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <button
              onClick={() => handleScrollTo("#programas")}
              className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-base shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              Ver Programas
            </button>
            <button
              onClick={() => handleScrollTo("#contato")}
              className="px-8 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-white font-bold text-base border-2 border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              Saiba Mais
            </button>
          </motion.div>

          {/* Brand trust / highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="pt-6 grid grid-cols-3 gap-6 border-t border-slate-200/80 dark:border-slate-800/80 w-full"
          >
            <div>
              <p className="text-2xl font-bold text-sky-600 dark:text-sky-400 font-display">100%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Interativo & Lúdico</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-display">+10 Anos</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">De Experiência</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-500 font-display">NR-17</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Conformidade Legal</p>
            </div>
          </motion.div>
        </div>

        {/* Right graphical/image column */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 1 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-900 group"
          >
            {/* Overlay Grid lines */}
            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/10 transition-colors duration-500 z-10" />
            
            {/* Visual Main Image */}
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop"
              alt="Teatro e palestras corporativas"
              className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </div>

      {/* Down arrow indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 dark:text-slate-500">Scroll</span>
        <button
          onClick={() => handleScrollTo("#onde-atuamos")}
          className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-slate-500 hover:text-sky-500 dark:hover:text-sky-400 hover:shadow-md transition-all cursor-pointer"
        >
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
