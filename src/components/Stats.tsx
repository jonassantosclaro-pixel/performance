import React, { useState, useEffect } from "react";
import { Users, Award, Landmark, Smile } from "lucide-react";
import { motion } from "motion/react";

interface StatItemProps {
  key?: React.Key;
  end: number;
  suffix: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
}

function StatCounter({ end, suffix, label, description, icon, colorClass }: StatItemProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500; // ms
    const increment = end / (duration / 16); // 60 FPS
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group overflow-hidden text-center"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 rounded-bl-full group-hover:scale-125 transition-transform duration-500" />
      
      <div className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${colorClass} bg-opacity-10 shadow-inner`}>
        {icon}
      </div>

      <div className="font-display text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
        {count.toLocaleString("pt-BR")}
        {suffix}
      </div>

      <p className="text-base font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
        {label}
      </p>
      
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        {description}
      </p>
    </motion.div>
  );
}

export default function Stats() {
  const statsList = [
    {
      end: 450000,
      suffix: "+",
      label: "Colaboradores",
      description: "Treinados e motivados no país",
      icon: <Users className="w-7 h-7 text-sky-600 dark:text-sky-400" />,
      colorClass: "bg-sky-500 text-sky-600"
    },
    {
      end: 2500,
      suffix: "+",
      label: "Eventos Realizados",
      description: "SIPATs, palestras e dinâmicas",
      icon: <Award className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />,
      colorClass: "bg-emerald-500 text-emerald-600"
    },
    {
      end: 850,
      suffix: "+",
      label: "Empresas Atendidas",
      description: "Multinacionais, hospitais e indústrias",
      icon: <Landmark className="w-7 h-7 text-amber-500" />,
      colorClass: "bg-amber-500 text-amber-500"
    },
    {
      end: 98,
      suffix: "%",
      label: "Aprovação",
      description: "Pesquisa de satisfação pós-evento",
      icon: <Smile className="w-7 h-7 text-rose-500" />,
      colorClass: "bg-rose-500 text-rose-500"
    }
  ];

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-950 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsList.map((stat, idx) => (
            <StatCounter
              key={idx}
              end={stat.end}
              suffix={stat.suffix}
              label={stat.label}
              description={stat.description}
              icon={stat.icon}
              colorClass={stat.colorClass}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
