import React, { useState } from "react";
import { SOLUTIONS } from "../data";
import { Solution } from "../types";
import ServiceIcon from "./ServiceIcon";
import { ArrowRight, Check, X, ShieldCheck, Sparkle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Services() {
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);

  return (
    <section id="solucoes" className="py-24 bg-slate-50 dark:bg-slate-950 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 text-xs font-semibold tracking-wider uppercase mb-3"
          >
            Nossas Metodologias
          </motion.div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Soluções Inovadoras para sua Empresa
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400 text-base sm:text-lg">
            Abordagens dinâmicas que unem informação técnica e entretenimento para fixar hábitos saudáveis e de segurança de forma permanente.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SOLUTIONS.map((solution, index) => (
            <motion.div
              key={solution.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer text-left"
              onClick={() => setSelectedSolution(solution)}
            >
              <div>
                {/* Icon wrapper */}
                <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ServiceIcon name={solution.icon} className="w-7 h-7" />
                </div>
                
                {/* Title */}
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                  {solution.title}
                </h3>
                
                {/* Short description */}
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  {solution.shortDesc}
                </p>
              </div>

              {/* Read more footer link */}
              <div className="flex items-center gap-1 text-sky-600 dark:text-sky-400 text-sm font-semibold mt-auto group-hover:gap-2 transition-all">
                Ver detalhes
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Expanding Detail Modal / Lightbox */}
      <AnimatePresence>
        {selectedSolution && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSolution(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedSolution(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:scale-105 transition-all z-10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content Header */}
              <div className="p-6 sm:p-8 pb-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-3xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <ServiceIcon name={selectedSolution.icon} className="w-8 h-8" />
                </div>
                <div className="flex flex-col items-center sm:items-start">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                    {selectedSolution.category}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {selectedSolution.title}
                  </h3>
                </div>
              </div>

              {/* Content Description */}
              <div className="p-8 text-left space-y-6">
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Sobre a Solução
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                    {selectedSolution.longDesc}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Principais Benefícios
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedSolution.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <div className="p-1 rounded bg-emerald-500/10 text-emerald-500 shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-950/20">
                <button
                  onClick={() => setSelectedSolution(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Fechar
                </button>
                <a
                  href="#contato"
                  onClick={() => {
                    setSelectedSolution(null);
                    const element = document.querySelector("#contato");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="px-6 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-semibold shadow-md shadow-sky-200/50 dark:shadow-none hover:bg-sky-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  Solicitar Orçamento
                  <Sparkle className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
