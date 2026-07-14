import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, VolumeX, FastForward, Sparkles, ShieldCheck } from "lucide-react";

interface SplashIntroProps {
  onComplete: () => void;
}

// Background particle item structure
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function SplashIntro({ onComplete }: SplashIntroProps) {
  const [timeLeft, setTimeLeft] = useState(7); // 7 seconds countdown
  const [isMuted, setIsMuted] = useState(true);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate slow drifting cinematic particles
  useEffect(() => {
    const generated: Particle[] = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: Math.random() * 100, // percentage
      size: Math.random() * 3 + 1, // 1px to 4px
      duration: Math.random() * 15 + 10, // 10s to 25s
      delay: Math.random() * -20, // negative delay so they are already spread out
      opacity: Math.random() * 0.4 + 0.1
    }));
    setParticles(generated);
  }, []);

  // Handle countdown of 7 seconds
  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, onComplete]);

  // Track mouse movement to create 3D parallax reaction effect on the logo
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

  // Synthesize premium cinematic corporate chime using Web Audio API
  const playCinematicChime = (forcePlay = false) => {
    if (isMuted && !forcePlay) return;

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Resume context if suspended (browser security)
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // --- FX 1: Deep Warm Corporate Base Pad ---
      const padOsc1 = ctx.createOscillator();
      const padOsc2 = ctx.createOscillator();
      const padGain = ctx.createGain();
      const padFilter = ctx.createBiquadFilter();

      padOsc1.type = "sawtooth";
      padOsc2.type = "triangle";

      // Root C2 (65.4Hz) and Fifth G2 (98.0Hz) for instant epic harmony
      padOsc1.frequency.setValueAtTime(65.41, ctx.currentTime);
      padOsc2.frequency.setValueAtTime(98.00, ctx.currentTime);

      padFilter.type = "lowpass";
      padFilter.frequency.setValueAtTime(120, ctx.currentTime);
      padFilter.frequency.exponentialRampToValueAtTime(380, ctx.currentTime + 3.5);

      padGain.gain.setValueAtTime(0, ctx.currentTime);
      padGain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 1.2);
      padGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 6.5);

      padOsc1.connect(padFilter);
      padOsc2.connect(padFilter);
      padFilter.connect(padGain);
      padGain.connect(ctx.destination);

      padOsc1.start();
      padOsc2.start();
      padOsc1.stop(ctx.currentTime + 7);
      padOsc2.stop(ctx.currentTime + 7);

      // --- FX 2: Sparkling High Chime Bell (Triggered slightly after, around 1.5s) ---
      const chimeOsc1 = ctx.createOscillator();
      const chimeOsc2 = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      const chimeFilter = ctx.createBiquadFilter();

      chimeOsc1.type = "sine";
      chimeOsc2.type = "triangle";

      // Perfect pure bell tones at C5 (523.25Hz) and E5 (659.25Hz)
      chimeOsc1.frequency.setValueAtTime(523.25, ctx.currentTime + 1.6);
      chimeOsc2.frequency.setValueAtTime(659.25, ctx.currentTime + 1.6);

      chimeFilter.type = "highpass";
      chimeFilter.frequency.setValueAtTime(600, ctx.currentTime + 1.6);

      chimeGain.gain.setValueAtTime(0, ctx.currentTime);
      chimeGain.gain.setValueAtTime(0, ctx.currentTime + 1.5);
      chimeGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 1.8);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 6);

      chimeOsc1.connect(chimeFilter);
      chimeOsc2.connect(chimeFilter);
      chimeFilter.connect(chimeGain);
      chimeGain.connect(ctx.destination);

      chimeOsc1.start();
      chimeOsc2.start();
      chimeOsc1.stop(ctx.currentTime + 7);
      chimeOsc2.stop(ctx.currentTime + 7);

      setAudioPlayed(true);
    } catch (e) {
      console.warn("Synthesizer context blocked by browser policies:", e);
    }
  };

  // Toggle sound option
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't trigger logo clicks
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (!newMuted && !audioPlayed) {
      playCinematicChime(true);
    }
  };

  // Trigger sound when clicking anywhere on the screen
  const handleScreenClick = () => {
    if (isMuted) {
      setIsMuted(false);
      playCinematicChime(true);
    } else if (!audioPlayed) {
      playCinematicChime();
    }
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleScreenClick}
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        y: "-100%",
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
      }}
      className="fixed inset-0 z-[9999] bg-[#0D1B2A] flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none"
    >
      {/* Background radial highlight glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,122,0,0.12)_0%,transparent_60%)] pointer-events-none" />
      
      {/* Floating particles background layer */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
            }}
            animate={{
              y: ["0px", "-120px", "0px"],
              x: ["0px", "40px", "0px"],
              opacity: [p.opacity, p.opacity * 2, p.opacity],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Cinematic Glowing Orb following mouse position slightly */}
      <motion.div 
        className="absolute w-[400px] h-[400px] rounded-full bg-sky-500/5 dark:bg-sky-500/5 filter blur-[80px] pointer-events-none"
        animate={{
          x: mousePos.x * 120,
          y: mousePos.y * 120,
        }}
        transition={{ type: "spring", stiffness: 40, damping: 25 }}
      />

      {/* Top Controls Bar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-50">
        {/* Quality indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono uppercase tracking-widest text-slate-400">
          <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
          <span>Experiência Premium</span>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={toggleMute}
          className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 text-xs font-semibold cursor-pointer"
          title={isMuted ? "Ativar som de cinema" : "Desativar som"}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-rose-400 animate-pulse" />
              <span className="hidden sm:inline">Com Som</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span className="hidden sm:inline">Mutar</span>
            </>
          )}
        </button>
      </div>

      {/* LOGO BOX - KEN BURNS DYNAMIC SCALE EFFECT & 3D MOUSE PARALLAX TILT */}
      <motion.div
        className="relative flex flex-col items-center justify-center text-center max-w-[95vw] md:max-w-5xl px-4 select-none"
        animate={{
          scale: [1, 1.05],
          rotateX: mousePos.y * -8, // tilt backward/forward
          rotateY: mousePos.x * 8,  // tilt side-to-side
        }}
        transition={{
          scale: { duration: 7, ease: "linear" },
          rotateX: { type: "spring", stiffness: 100, damping: 20 },
          rotateY: { type: "spring", stiffness: 100, damping: 20 }
        }}
        style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      >
        {/* Outer radial pulse ring */}
        <div className="absolute -inset-10 bg-radial from-orange-500/10 to-transparent rounded-full filter blur-xl animate-pulse-slow pointer-events-none" />

        {/* 1. Vector Logo Symbol with Draw-in Stroke & Glow Effects */}
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 mb-8" style={{ transform: "translateZ(50px)" }}>
          {/* Expanding Pulsing Waves */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.6, 1.5], opacity: [0, 0.4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
              className="absolute w-4/5 h-4/5 rounded-full border-2 border-orange-500/40"
            />
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.6, 1.8], opacity: [0, 0.2, 0] }}
              transition={{ duration: 3.5, delay: 1.2, repeat: Infinity, ease: "easeOut" }}
              className="absolute w-4/5 h-4/5 rounded-full border border-sky-400/20"
            />
          </div>

          {/* High-Fidelity brand symbol as highly responsive, styled vector */}
          <svg 
            viewBox="0 0 200 200" 
            className="w-full h-full filter drop-shadow-[0_0_25px_rgba(255,122,0,0.5)] transition-all duration-300"
            style={{ transform: "skewX(-10deg)" }} // Apply the official brand slant skew!
          >
            {/* Orange Head Circle with zoom entrance */}
            <motion.circle
              cx="82"
              cy="45"
              r="13"
              fill="#FF7A00"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6, type: "spring", stiffness: 120 }}
            />

            {/* Left Orange Swoosh Ribbon - draws in */}
            <motion.path
              d="M 45,135 C 35,110 50,82 80,82"
              fill="none"
              stroke="#FF7A00"
              strokeWidth="14"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.8, ease: "easeInOut", delay: 0.2 }}
            />

            {/* White "P" body Ribbon - draws in */}
            <motion.path
              d="M 98,165 L 98,95 C 98,72 115,52 138,52 C 162,52 175,70 175,95 C 175,120 158,138 135,138 L 114,138"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="17"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2.2, ease: "easeInOut", delay: 0.4 }}
            />
          </svg>
        </div>

        {/* 2. Main Title: PERFORMANCE - with Cinematic Light Sweep Flare */}
        <div className="relative overflow-hidden mb-3" style={{ transform: "translateZ(30px)" }}>
          <motion.h1
            initial={{ opacity: 0, y: 30, letterSpacing: "0.05em" }}
            animate={{ opacity: 1, y: 0, letterSpacing: "0.15em" }}
            transition={{ duration: 1.4, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-brand italic font-[800] text-white text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-widest relative z-10 select-none uppercase"
            style={{ transform: "skewX(-10deg)" }} // Slanted styling
          >
            PERFORMANCE
          </motion.h1>

          {/* Shimmer Light Sweep Effect Layer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ delay: 2.5, duration: 2.2, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] pointer-events-none z-20"
          />
        </div>

        {/* 3. Subtitle: EVENTOS CORPORATIVOS - with surrounding line flares */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 2.2 }}
          className="flex items-center gap-4 w-full max-w-[280px] sm:max-w-md justify-center mb-8"
          style={{ transform: "translateZ(20px)" }}
        >
          {/* Left line gradient decoration */}
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-orange-500/60" />

          <span className="text-[#FF7A00] font-brand font-bold tracking-[0.35em] uppercase text-[10px] sm:text-xs md:text-sm whitespace-nowrap">
            Eventos Corporativos
          </span>

          {/* Right line gradient decoration */}
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-orange-500/60" />
        </motion.div>

        {/* 4. Slogan: Connect, Develop, Transform - dynamic character fade */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 3.0 }}
          className="text-slate-400 font-sans font-medium text-[9px] sm:text-[11px] md:text-xs tracking-[0.15em] sm:tracking-[0.25em] uppercase leading-relaxed max-w-lg sm:max-w-2xl px-2"
          style={{ transform: "translateZ(10px)" }}
        >
          Conectamos Pessoas <span className="text-orange-500/75 px-1">•</span> Desenvolvemos Talentos <span className="text-orange-500/75 px-1">•</span> Transformamos Resultados
        </motion.p>
      </motion.div>

      {/* Bottom Progress and Skip Button Wrapper */}
      <div className="absolute bottom-10 left-6 right-6 flex flex-col sm:flex-row items-center justify-between gap-4 z-50">
        
        {/* Informational tip */}
        <div className="text-[10px] font-medium text-slate-500 flex items-center gap-1.5 order-2 sm:order-1 bg-white/2 px-3 py-1.5 rounded-full border border-white/5">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
          <span>Aguarde ou clique para carregar o site</span>
        </div>

        {/* Skip Button with radial countdown progress ring */}
        <div className="order-1 sm:order-2 flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Avoid duplicate trigger
              onComplete();
            }}
            className="group px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-orange-500/40 transition-all duration-300 flex items-center gap-2 text-xs font-semibold hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Pular Intro</span>
            <FastForward className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Countdown radial ring */}
          <div className="relative w-9 h-9 flex items-center justify-center">
            {/* Background ring */}
            <svg className="w-full h-full rotate-[-90deg]">
              <circle
                cx="18"
                cy="18"
                r="15"
                className="stroke-slate-700"
                strokeWidth="2.5"
                fill="transparent"
              />
              {/* Dynamic countdown path */}
              <motion.circle
                cx="18"
                cy="18"
                r="15"
                className="stroke-orange-500"
                strokeWidth="2.5"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 15}
                animate={{
                  strokeDashoffset: (2 * Math.PI * 15) * (1 - timeLeft / 7)
                }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </svg>
            <span className="absolute text-[10px] font-mono font-bold text-white">
              {timeLeft}
            </span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
