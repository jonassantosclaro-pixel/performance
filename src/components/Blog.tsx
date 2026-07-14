import React, { useState, useEffect } from "react";
import { listenToBlogPosts, BlogPost } from "../lib/firebase";
import { Calendar, User, Tag, ArrowRight, X, Clock, Newspaper, Sparkles, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const FALLBACK_POSTS: BlogPost[] = [
  {
    id: "fallback_1",
    title: "Como Engajar sua Equipe na SIPAT: Estratégias Inovadoras",
    summary: "Descubra como transformar a Semana Interna de Prevenção de Acidentes de Trabalho em um evento memorável, dinâmico e focado em engajamento real.",
    content: "A Semana Interna de Prevenção de Acidentes de Trabalho (SIPAT) é uma das datas mais importantes no calendário corporativo. No entanto, muitas empresas enfrentam o desafio de engajar os colaboradores em palestras longas e teóricas.\n\nPara transformar essa realidade, a Performance Treinamentos traz abordagens inovadoras baseadas em metodologias ativas e teatro corporativo. Aqui estão as principais dicas para tornar sua SIPAT inesquecível:\n\n1. Teatro Corporativo e Palestras Shows\nAo invés de slides cansativos, use o humor e a dramatização para tratar de temas sérios como ergonomia, direção defensiva e uso de EPIs. O teatro conecta-se diretamente com as emoções, facilitando a retenção da mensagem.\n\n2. Atividades Práticas e Interativas\nInsira sessões de ginástica laboral interativa, desafios e dinâmicas em grupo. A participação ativa fixa o aprendizado muito melhor do que a escuta passiva.\n\n3. Gamificação\nCrie quiz, competições saudáveis entre setores com pequenos prêmios. A busca pela pontuação estimula a participação voluntária e alegre de todos.\n\nImplementando essas práticas, sua empresa não apenas cumpre a legislação, mas constrói uma verdadeira cultura preventiva, onde a segurança se torna um valor compartilhado por cada colaborador.",
    category: "SIPAT",
    author: "Equipe Performance",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    createdAt: "2026-07-10T14:30:00.000Z"
  },
  {
    id: "fallback_2",
    title: "Benefícios da Ginástica Laboral na Prevenção de LER/DORT",
    summary: "Entenda como pequenas pausas ativas durante a jornada de trabalho podem reduzir dores musculares, estresse e prevenir afastamentos.",
    content: "Dores nas costas, tensão nos ombros e cansaço visual são sintomas comuns em ambientes corporativos de alta produtividade. A Ginástica Laboral surge como uma solução de baixo custo e altíssimo impacto para melhorar a qualidade de vida corporativa.\n\nEssas pausas estruturadas, que duram de 10 a 15 minutos, consistem em alongamentos, exercícios de mobilidade e dinâmicas respiratórias que trazem benefícios imediatos:\n\n- Redução da Fadiga Muscular: Alivia a sobrecarga de posturas estáticas prolongadas.\n- Prevenção de LER e DORT: Exercícios focados em punhos, ombros e coluna reduzem microlesões repetitivas.\n- Alívio de Estresse: A pausa mental ajuda a arejar as ideias e reduzir o esgotamento diário.\n- Integração da Equipe: Realizar as sessões juntos cria um clima de descontração e sorrisos.\n\nInvestir na saúde física dos colaboradores é um pilar de segurança humana e produtiva. Solicite um diagnóstico de ergonomia para sua empresa hoje mesmo.",
    category: "Saúde & Bem-Estar",
    author: "Dr. Ricardo Ramos (Ergonomista)",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
    createdAt: "2026-07-08T10:15:00.000Z"
  },
  {
    id: "fallback_3",
    title: "Cultura de Segurança: O papel da Liderança Ativa",
    summary: "A segurança do trabalho começa de cima para baixo. Saiba como gestores e diretores podem liderar pelo exemplo prático.",
    content: "Muitas empresas possuem regras excelentes de segurança do trabalho escritas em manuais, mas sofrem com falhas operacionais no dia a dia. A diferença entre uma regra escrita e a prática diária está na Cultura de Segurança.\n\nA liderança tem o papel mais crítico na formação dessa cultura. Quando supervisores e diretores utilizam os EPIs corretamente, participam ativamente das inspeções e ouvem de forma aberta as preocupações da equipe, a mensagem de cuidado se torna autêntica.\n\nComo liderar com foco em prevenção:\n- Pratique o Diálogo Diário de Segurança (DDS): Dedique 5 minutos antes da jornada para alinhar riscos.\n- Reconheça Comportamentos Seguros: Valorize quem segue as normas, não apenas cobre os erros.\n- Estimule a Reportação de Quase-Acidentes: O melhor acidente é aquele que foi evitado graças a um reporte precoce.\n\nPromover treinamentos comportamentais específicos para líderes ajuda a alinhar o discurso e a prática, gerando ambientes mais produtivos e de risco zero.",
    category: "Segurança",
    author: "Eng. Fernando Dias",
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800",
    createdAt: "2026-07-05T09:00:00.000Z"
  }
];

const CATEGORIES = ["Todos", "SIPAT", "Saúde & Bem-Estar", "Segurança", "Treinamentos", "Inovação"];

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [activeReadPost, setActiveReadPost] = useState<BlogPost | null>(null);

  // Subscribe to real-time posts from Firestore
  useEffect(() => {
    const unsubscribe = listenToBlogPosts((firebasePosts) => {
      if (firebasePosts && firebasePosts.length > 0) {
        setPosts(firebasePosts);
      } else {
        setPosts(FALLBACK_POSTS);
      }
    });

    return () => unsubscribe();
  }, []);

  const filteredPosts = selectedCategory === "Todos"
    ? posts
    : posts.filter(post => post.category.toLowerCase() === selectedCategory.toLowerCase());

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
    } catch {
      return isoString;
    }
  };

  return (
    <section id="blog" className="py-24 bg-white dark:bg-slate-900 relative z-20">
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-xs font-bold tracking-wider uppercase mb-4"
          >
            <Newspaper className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
            <span>Blog & Notícias</span>
          </motion.div>
          
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Conteúdo Inteligente para sua Empresa
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
            Fique por dentro das melhores práticas de segurança do trabalho, ergonomia, SIPAT inovadora e saúde corporativa.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-sky-600 text-white shadow-md scale-105"
                  : "bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, idx) => (
              <motion.article
                key={post.id || idx}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
              >
                {/* Visual Image */}
                <div className="h-52 w-full relative overflow-hidden bg-slate-200 dark:bg-slate-800">
                  <img
                    src={post.imageUrl || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-sky-600 text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>{post.category}</span>
                  </div>
                </div>

                {/* Article Info */}
                <div className="p-6 flex-1 flex flex-col justify-between text-left">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-sky-500" />
                        {formatDate(post.createdAt)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-sky-500" />
                        {post.author}
                      </span>
                    </div>

                    <h3 className="font-display font-extrabold text-slate-900 dark:text-white text-lg tracking-tight hover:text-sky-600 dark:hover:text-sky-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed line-clamp-3">
                      {post.summary}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-200/50 dark:border-slate-800/50">
                    <button
                      onClick={() => setActiveReadPost(post)}
                      className="w-full py-3 px-4 rounded-xl bg-white dark:bg-slate-900 hover:bg-sky-50 dark:hover:bg-slate-800 text-sky-600 dark:text-sky-400 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      Ler Artigo Completo
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>

          {filteredPosts.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-400">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold">Nenhuma notícia encontrada para esta categoria.</p>
            </div>
          )}
        </div>

      </div>

      {/* FULL ARTICLE READ MODAL */}
      <AnimatePresence>
        {activeReadPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveReadPost(null)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl overflow-y-auto border border-slate-100 dark:border-slate-800 shadow-2xl z-10"
            >
              {/* Cover Image Banner */}
              <div className="h-64 sm:h-80 w-full relative bg-slate-100 dark:bg-slate-800">
                <img
                  src={activeReadPost.imageUrl || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"}
                  alt={activeReadPost.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                
                {/* Category tag */}
                <div className="absolute bottom-6 left-6 bg-sky-600 text-white text-xs font-black tracking-wider uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{activeReadPost.category}</span>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setActiveReadPost(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white border border-white/20 hover:scale-105 transition-all cursor-pointer"
                  aria-label="Fechar artigo"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Text Area */}
              <div className="p-6 sm:p-10 text-left space-y-6">
                <div className="space-y-4">
                  {/* Date & Author */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-sky-500" />
                      {formatDate(activeReadPost.createdAt)}
                    </span>
                    <span className="hidden sm:inline text-slate-600 dark:text-slate-700">|</span>
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-sky-500" />
                      {activeReadPost.author}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white leading-[1.2] tracking-tight">
                    {activeReadPost.title}
                  </h3>
                </div>

                {/* Summary Box */}
                <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-100/50 dark:border-sky-900/30 text-sky-800 dark:text-sky-300 text-xs sm:text-sm italic leading-relaxed">
                  "{activeReadPost.summary}"
                </div>

                {/* Long Article Content Body (with paragraph formatting) */}
                <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                  {activeReadPost.content.split("\n").map((para, i) => {
                    const trimmed = para.trim();
                    if (!trimmed) return null;
                    return (
                      <p key={i} className="whitespace-pre-line">
                        {trimmed}
                      </p>
                    );
                  })}
                </div>

                {/* Action footer inside Modal */}
                <div className="pt-8 border-t border-slate-100 dark:border-slate-800/80 flex justify-end">
                  <button
                    onClick={() => setActiveReadPost(null)}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
                  >
                    Concluir Leitura
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
