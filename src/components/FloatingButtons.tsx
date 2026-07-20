import React, { useState } from "react";
import { MessageSquare, Instagram, Phone, X, Send, Sparkles, User, HelpCircle } from "lucide-react";
import { GlobalSettings } from "../lib/firebase";
import { motion, AnimatePresence } from "motion/react";

interface FloatingButtonsProps {
  settings: GlobalSettings;
}

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

export default function FloatingButtons({ settings }: FloatingButtonsProps) {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: "Olá! Sou a Performance Assistente. Como posso ajudar a transformar sua equipe hoje?"
    }
  ]);

  const cleanWhatsappNumber = settings.whatsapp.replace(/[^0-9]/g, "");

  const handlePredefinedQuestion = (question: string, answer: string, actionType?: "whatsapp" | "instagram" | "none") => {
    // Add user question to history
    const userMsg: ChatMessage = { sender: "user", text: question };
    const botMsg: ChatMessage = { sender: "bot", text: answer };
    
    setChatHistory((prev) => [...prev, userMsg, botMsg]);

    // Handle redirection logic if applicable
    if (actionType === "whatsapp") {
      setTimeout(() => {
        window.open(`https://wa.me/${cleanWhatsappNumber}?text=Olá,%20gostaria%20de%20solicitar%20um%20orçamento%20de%20treinamento!`, "_blank");
      }, 1000);
    } else if (actionType === "instagram") {
      setTimeout(() => {
        window.open(settings.instagram, "_blank");
      }, 1000);
    }
  };

  const predefinedOptions = [
    {
      label: "💬 Chamar no WhatsApp",
      question: "Quero falar no WhatsApp agora",
      answer: "Excelente escolha! Estou te direcionando para falar diretamente com um de nossos consultores comerciais via WhatsApp. Um segundo...",
      action: "whatsapp" as const
    },
    {
      label: "📅 Dúvidas sobre SIPAT",
      question: "Como funciona a SIPAT com a Performance?",
      answer: "Nossa SIPAT é 100% customizável! Oferecemos teatros, palestras shows dinâmicas, jogos gigantes e quick massage. Cuidamos do cronograma inteiro de forma prática e em conformidade legal.",
      action: "none" as const
    },
    {
      label: "📸 Ver Fotos no Instagram",
      question: "Gostaria de ver o Instagram da empresa",
      answer: "Claro! Nosso Instagram está cheio de registros em tempo real das dinâmicas e teatros. Vou abrir uma nova aba para você ver nosso portfólio visual...",
      action: "instagram" as const
    },
    {
      label: "📍 Regiões de Atendimento",
      question: "Vocês atendem na minha região?",
      answer: "Sim! Nossa sede é em São Paulo, mas nossa equipe de palestrantes, atores e técnicos viaja e atende empresas em todo o território nacional, incluindo filiais remotas.",
      action: "none" as const
    }
  ];

  return (
    <>
      {/* Right Side: Fixed Instagram & WhatsApp buttons with waves */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3.5">
        {/* Instagram button */}
        <motion.a
          href={settings.instagram}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-13 h-13 rounded-full bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 text-white flex items-center justify-center shadow-lg cursor-pointer hover:shadow-xl relative"
          aria-label="Instagram Oficial"
        >
          <Instagram className="w-6 h-6" />
        </motion.a>

        {/* WhatsApp button */}
        <motion.a
          href={`https://wa.me/${cleanWhatsappNumber}`}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.1, rotate: -5 }}
          className="w-13 h-13 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg cursor-pointer hover:shadow-xl relative group"
          aria-label="Fale no WhatsApp"
        >
          {/* Pulsing ring wave */}
          <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping opacity-75 pointer-events-none" />
          <Phone className="w-6 h-6 fill-white text-emerald-500" />
        </motion.a>
      </div>

      {/* Left Side: AI Assistant floating button */}
      <div className="fixed bottom-6 left-6 z-40">
        <motion.button
          onClick={() => setIsAiOpen(true)}
          whileHover={{ scale: 1.05 }}
          className="bg-white dark:bg-slate-900 rounded-full p-1.5 sm:pr-5 shadow-xl flex items-center gap-3 border border-slate-200/80 dark:border-slate-800 cursor-pointer transition-all select-none text-left active:scale-95"
          aria-label="Abrir Performance Assistente"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 relative shrink-0">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150"
              alt="Performance Assistente"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
          </div>
          <div className="hidden sm:block">
            <div className="text-[10px] font-black tracking-wider text-slate-400 uppercase font-mono leading-none">Performance Assistente</div>
            <div className="text-xs font-bold text-slate-800 dark:text-white mt-1">Como posso ajudar?</div>
          </div>
        </motion.button>
      </div>

      {/* AI Chat Drawer / Dialog Modal */}
      <AnimatePresence>
        {isAiOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-start p-4 pointer-events-none">
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAiOpen(false)}
              className="absolute inset-0 bg-slate-950/20 backdrop-blur-xs pointer-events-auto cursor-pointer"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50, x: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50, x: -20 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 h-[500px] max-h-[80vh] flex flex-col justify-between overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-orange-600 to-[#FF7A00] text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-white/20 border border-white/20">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150"
                      alt="Performance Assistente"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-left">
                    <h4 className="font-brand font-bold text-sm">Performance Assistente</h4>
                    <p className="text-[10px] text-orange-100 font-mono">Suporte Virtual Inteligente</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAiOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Message list body */}
              <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950/20">
                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2 max-w-[80%] ${
                      msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {msg.sender === "user" ? (
                        <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100">
                          <img
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150"
                            alt="Performance Assistente"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                    </div>
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed text-left ${
                      msg.sender === "user"
                        ? "bg-sky-600 text-white rounded-tr-none"
                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800/80 rounded-tl-none shadow-xs"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggestions Panel footer */}
              <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider text-left pl-1">
                  Selecione uma dúvida frequente:
                </p>
                <div className="grid grid-cols-1 gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                  {predefinedOptions.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handlePredefinedQuestion(opt.question, opt.answer, opt.action)}
                      className="w-full text-left px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950 border border-slate-100 dark:border-slate-800 hover:border-sky-200 text-slate-700 dark:text-slate-300 font-medium transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span>{opt.label}</span>
                      <HelpCircle className="w-3 h-3 text-slate-300" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
