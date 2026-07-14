import React from "react";
import { GraduationCap, Briefcase, Factory, HeartPulse, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

export default function WhereWeAct() {
  const sectors = [
    {
      title: "Empresas & Escritórios",
      icon: <Briefcase className="w-8 h-8 text-sky-600 dark:text-sky-400" />,
      bgImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop",
      description: "Sedes administrativas, escritórios de tecnologia e equipes em regime híbrido. Foco total em ergonomia (NR-17), quick massage, saúde mental e mindfulness corporativo.",
      color: "border-sky-500/20 hover:border-sky-500"
    },
    {
      title: "Indústrias & Logística",
      icon: <Factory className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />,
      bgImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop",
      description: "Fábricas, canteiros de obras e centros de distribuição. Abordagem lúdica de altíssimo impacto para sensibilizar operadores sobre uso de EPIs, direção defensiva e regras de segurança de ouro.",
      color: "border-emerald-500/20 hover:border-emerald-500"
    },
    {
      title: "Hospitais & Clínicas",
      icon: <HeartPulse className="w-8 h-8 text-rose-600 dark:text-rose-400" />,
      bgImage: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600&auto=format&fit=crop",
      description: "Para profissionais de saúde que cuidam da nossa vida. Programas dinâmicos focados no cansaço físico (LER/DORT), burnout, acolhimento humanizado e gincanas digitais para turnos rotativos.",
      color: "border-rose-500/20 hover:border-rose-500"
    },
    {
      title: "Escolas & Universidades",
      icon: <GraduationCap className="w-8 h-8 text-amber-600 dark:text-amber-400" />,
      bgImage: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=800&auto=format&fit=crop",
      description: "Treinamentos especiais de brigada de incêndio lúdica, primeiros socorros de forma dinâmica, teatro interativo para estudantes, além de programas de ergonomia escolar para docentes.",
      color: "border-amber-500/20 hover:border-amber-500"
    }
  ];

  return (
    <section id="onde-atuamos" className="py-24 bg-white dark:bg-slate-900 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-3"
          >
            Presença & Versatilidade
          </motion.div>
          
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Treinamentos Sob Medida para Qualquer Setor
          </h2>
          
          <p className="mt-4 text-slate-500 dark:text-slate-400 text-base sm:text-lg">
            Nossas abordagens são customizadas de acordo com o nível de instrução, 
            regime de trabalho e desafios específicos de cada área de atuação.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sectors.map((sector, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative h-96 rounded-3xl overflow-hidden group border ${sector.color} shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer`}
            >
              {/* Background image & gradient overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src={sector.bgImage}
                  alt={sector.title}
                  className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-950/70 group-hover:bg-slate-950/60 transition-colors duration-300" />
              </div>

              {/* Card Contents */}
              <div className="absolute inset-0 z-10 p-8 flex flex-col justify-between text-left">
                {/* Header with Icon and Arrow */}
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    {sector.icon}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center border border-white/20">
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Info Text */}
                <div className="space-y-3">
                  <h3 className="font-display text-2xl font-bold text-white tracking-tight">
                    {sector.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed max-w-md">
                    {sector.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
