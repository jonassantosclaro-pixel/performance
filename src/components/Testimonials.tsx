import React, { useState, useEffect } from "react";
import { TESTIMONIALS } from "../data";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { listenToTestimonials } from "../lib/firebase";
import { Testimonial } from "../types";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = listenToTestimonials((updatedTestimonials) => {
      if (updatedTestimonials && updatedTestimonials.length > 0) {
        setTestimonials(updatedTestimonials);
        // Ensure currentIndex is still valid
        setCurrentIndex((prev) => (prev >= updatedTestimonials.length ? 0 : prev));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex] || TESTIMONIALS[0];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 relative z-20 overflow-hidden">
      {/* Decorative vector */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Quote Icon decorative */}
        <div className="inline-flex p-4 rounded-3xl bg-sky-500/10 text-sky-500 mb-8 animate-bounce-slow">
          <Quote className="w-8 h-8 fill-sky-500" />
        </div>

        {/* Carousel slide container */}
        <div className="relative min-h-[250px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Rating stars */}
              <div className="flex justify-center gap-1">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote Quote */}
              <p className="font-display text-xl sm:text-2xl font-medium italic text-slate-800 dark:text-slate-100 leading-relaxed max-w-2xl mx-auto">
                "{current.text}"
              </p>

              {/* Author Info */}
              <div>
                <h4 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  {current.name}
                </h4>
                <p className="text-sm font-mono text-slate-400 uppercase tracking-wider mt-1">
                  {current.role} • <span className="text-sky-500 font-semibold">{current.company}</span>
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons and indicators */}
        <div className="flex items-center justify-center gap-8 mt-12">
          {/* Prev */}
          <button
            onClick={handlePrev}
            className="p-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 rounded-full text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 hover:shadow-md transition-all cursor-pointer"
            aria-label="Previous Testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Indicators */}
          <div className="flex gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "w-8 bg-sky-500" : "bg-slate-300 dark:bg-slate-700"
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={handleNext}
            className="p-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 rounded-full text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 hover:shadow-md transition-all cursor-pointer"
            aria-label="Next Testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
