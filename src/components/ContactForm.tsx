import React, { useState } from "react";
import { submitLead, GlobalSettings } from "../lib/firebase";
import { Mail, Phone, MapPin, Send, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "react-hot-toast";

interface ContactFormProps {
  settings: GlobalSettings;
}

export default function ContactForm({ settings }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast.error("Por favor, preencha os campos obrigatórios (Nome, E-mail e Mensagem).");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitLead(name, email, phone, company, message);
      toast.success("Orçamento solicitado com sucesso! Nossa equipe entrará em contato em breve.");
      
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Ocorreu um erro ao enviar sua solicitação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format whatsapp number visually
  const formattedPhone = settings.whatsapp.startsWith("+") 
    ? settings.whatsapp 
    : `+55 ${settings.whatsapp}`;

  return (
    <section id="contato" className="py-24 bg-slate-50 dark:bg-slate-950 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Contact Info & Copy */}
          <div className="lg:col-span-5 text-left space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 text-xs font-semibold tracking-wider uppercase">
                Vamos Conversar?
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                Solicite um Orçamento sem Compromisso
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                Pronto para transformar sua empresa? Entre em contato preenchendo o formulário ou fale conosco diretamente pelos nossos canais oficiais de atendimento.
              </p>
            </div>

            {/* Visual Icons List */}
            <div className="space-y-6">
              {/* WhatsApp */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">WhatsApp Comercial</p>
                  <a 
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-base font-semibold text-slate-800 dark:text-slate-200 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
                  >
                    {formattedPhone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 dark:bg-sky-500/5 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">E-mail Comercial</p>
                  <a 
                    href={`mailto:${settings.email}`}
                    className="text-base font-semibold text-slate-800 dark:text-slate-200 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
                  >
                    {settings.email}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Atendimento Nacional</p>
                  <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                    São Paulo, SP • Atendemos todo o Brasil
                  </p>
                </div>
              </div>
            </div>

            {/* Compliancy seal */}
            <div className="p-4.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-sky-500 shrink-0" />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Garantia de confidencialidade de dados conforme a LGPD. Suas informações de contato estão seguras conosco.
              </p>
            </div>
          </div>

          {/* Right: Interactive Form card */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-xl relative overflow-hidden"
            >
              <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-6 text-left flex items-center gap-2">
                Fale com Nossos Especialistas
                <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {/* Name */}
                <div>
                  <label htmlFor="form-name" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                    Nome Completo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="form-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: João da Silva"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 dark:focus:border-sky-500 transition-colors text-sm"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="form-email" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                    E-mail Corporativo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="form-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex: joao@empresa.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 dark:focus:border-sky-500 transition-colors text-sm"
                  />
                </div>

                {/* Row: Phone & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="form-phone" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                      Telefone / WhatsApp
                    </label>
                    <input
                      id="form-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 dark:focus:border-sky-500 transition-colors text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="form-company" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                      Nome da Empresa
                    </label>
                    <input
                      id="form-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Ex: Minha Empresa Ltda"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 dark:focus:border-sky-500 transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="form-message" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                    Quais soluções ou programas você tem interesse? <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="form-message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Nos conte brevemente sobre sua demanda, quantidade de colaboradores e data prevista para o evento."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 dark:focus:border-sky-500 transition-colors text-sm resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-sky-200 dark:shadow-none hover:scale-[1.01]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processando Solicitação...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar Solicitação de Orçamento
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
