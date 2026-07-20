import React, { useState, useEffect } from "react";
import { Star, ShieldCheck, ThumbsUp, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { REVIEWS_DATA as DEFAULT_REVIEWS } from "../data";
import { listenToReviews } from "../lib/firebase";
import { Review } from "../types";

export default function Gallery() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const unsubscribe = listenToReviews((updatedReviews) => {
      if (updatedReviews && updatedReviews.length > 0) {
        setReviews(updatedReviews);
      } else {
        // Fallback to defaults typecasted properly
        const formattedDefaults = DEFAULT_REVIEWS.map(r => ({
          ...r,
          id: String(r.id)
        })) as any;
        setReviews(formattedDefaults);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <section id="galeria" className="py-24 bg-slate-50 dark:bg-slate-950 relative z-20 overflow-hidden">
      {/* Decorative backdrop gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-sky-200/10 dark:bg-sky-950/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-100/10 dark:bg-emerald-950/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-wider uppercase mb-4"
          >
            Selo de Qualidade Comprovada
          </motion.div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Reconhecimento Oficial & Avaliações
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
            Mais do que treinamentos, entregamos resultados extraordinários chancelados pelas maiores corporações do Brasil com avaliações máximas.
          </p>
        </div>

        {/* Certificate Board & Reviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Google Official Certificate Seal Badge Card */}
          <motion.div 
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4 flex flex-col justify-between p-8 sm:p-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden"
          >
            {/* Top gold certificate ribbon effect */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600" />
            
            {/* Google official styled header */}
            <div className="space-y-6 text-center lg:text-left">
              {/* Google colorful G logo representation */}
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <svg className="w-10 h-10 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <div className="text-left">
                  <h4 className="font-display font-extrabold text-slate-900 dark:text-white text-lg tracking-tight leading-none">Google</h4>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">Avaliações de Clientes</p>
                </div>
              </div>

              {/* Big 4.9 numeric presentation */}
              <div className="pt-4 flex flex-col items-center lg:items-start">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-7xl font-black text-slate-900 dark:text-white font-display tracking-tight">4.9</span>
                  <span className="text-2xl font-bold text-slate-400">/ 5</span>
                </div>
                
                {/* 5 stars (with 4.9 visual block) */}
                <div className="flex gap-1.5 mt-3">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-[#FAB005] text-[#FAB005]" />
                  ))}
                  {/* Partial 5th star rendering inside modern container */}
                  <div className="relative inline-block w-6 h-6">
                    <Star className="absolute top-0 left-0 w-6 h-6 text-slate-200 dark:text-slate-700 fill-slate-200 dark:fill-slate-700" />
                    <div className="absolute top-0 left-0 w-[90%] h-6 overflow-hidden">
                      <Star className="w-6 h-6 fill-[#FAB005] text-[#FAB005]" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                  Excelente • Oficial Google Partner
                </div>
              </div>
            </div>

            {/* Bottom Certification Badge Info */}
            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 text-center lg:text-left space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Selo oficial auditado pelo Google Reviews baseado no feedback real de gestores de RH, diretores e técnicos de segurança de todo o país.
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  320+ Avaliações Ativas
                </span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Active Google Reviews Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {reviews.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl transition-all flex flex-col justify-between text-left relative group cursor-default"
              >
                {/* Micro Google logo top right */}
                <div className="absolute top-6 right-6 opacity-40 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>

                <div className="space-y-4">
                  {/* Rating stars & verified label */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex gap-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#FAB005] text-[#FAB005]" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                      Verificado
                    </span>
                  </div>

                  {/* Review Text content */}
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    "{review.text}"
                  </p>
                </div>

                {/* Author Info line */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  {/* Initials Avatar */}
                  <div className={`w-10 h-10 rounded-full ${review.avatarBg} text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm shrink-0`}>
                    {review.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1">
                      {review.name}
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
                    </h5>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mt-0.5">
                      {review.role} • <span className="text-sky-600 font-semibold">{review.company}</span>
                    </p>
                    <p className="text-[9px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      {review.date}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
