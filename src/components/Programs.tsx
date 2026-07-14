import React, { useState } from "react";
import { PROGRAMS } from "../data";
import { Calendar, Target, CheckCircle2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Programs() {
  const [activeTab, setActiveTab] = useState(PROGRAMS[0].id);
  const activeProgram = PROGRAMS.find((p) => p.id === activeTab) || PROGRAMS[0];

  return (
    <section id="programas" className="py-24 bg-white dark:bg-slate-900 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-3"
          >
            Nossos Cronogramas
          </motion.div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Programas e Campanhas Corporativas
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400 text-base sm:text-lg">
            Oferecemos projetos completos prontos para execução, alinhados com os calendários mundiais da saúde e exigências do Ministério do Trabalho.
          </p>
        </div>

        {/* Tab System Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Tab selection list */}
          <div className="lg:col-span-4 flex flex-col space-y-3">
            {PROGRAMS.map((program) => {
              const isActive = program.id === activeTab;
              return (
                <button
                  key={program.id}
                  onClick={() => setActiveTab(program.id)}
                  className={`w-full p-5 rounded-2xl text-left border transition-all duration-300 cursor-pointer flex items-center justify-between group ${
                    isActive
                      ? "bg-slate-50 dark:bg-slate-800 border-sky-500/50 dark:border-sky-500 shadow-md scale-[1.02]"
                      : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div>
                    <h3 className={`font-display text-lg font-bold tracking-tight ${
                      isActive ? "text-sky-600 dark:text-sky-400" : "text-slate-900 dark:text-white"
                    }`}>
                      {program.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 truncate max-w-[250px]">
                      {program.tagline}
                    </p>
                  </div>
                  <ChevronRightIcon className={`w-5 h-5 transition-transform duration-300 ${
                    isActive ? "text-sky-500 translate-x-1" : "text-slate-300 group-hover:translate-x-1"
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Right: Selected program description card */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProgram.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-left relative overflow-hidden min-h-[400px] flex flex-col justify-between"
              >
                {/* Glowing colored top bar */}
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${activeProgram.color}`} />
                
                <div className="space-y-6">
                  {/* Tagline */}
                  <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest block">
                    {activeProgram.tagline}
                  </span>

                  {/* Title */}
                  <h3 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {activeProgram.title}
                  </h3>

                  {/* Main description */}
                  <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                    {activeProgram.description}
                  </p>

                  {/* Metadata Indicators */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                      <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-500 shrink-0">
                        <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">Público-Alvo</p>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{activeProgram.target}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">Período de Execução</p>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{activeProgram.period}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom call to action */}
                <div className="pt-8 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Conformidade total com as normas regulamentadoras</span>
                  </div>
                  
                  <a
                    href="#contato"
                    className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold flex items-center gap-2 shadow-md shadow-sky-200/50 dark:shadow-none hover:scale-105 transition-all w-full sm:w-auto justify-center cursor-pointer"
                  >
                    Customizar Agenda
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
