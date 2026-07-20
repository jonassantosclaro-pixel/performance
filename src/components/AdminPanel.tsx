import React, { useState, useEffect } from "react";
import { 
  authenticateAdmin, 
  signAdminOut, 
  listenToAuthState, 
  saveGlobalSettings, 
  listenToBlogPosts,
  saveBlogPost,
  deleteBlogPost,
  GlobalSettings,
  BlogPost,
  listenToSolutions,
  saveSolution,
  deleteSolution,
  listenToPrograms,
  saveProgram,
  deleteProgram,
  listenToTestimonials,
  saveTestimonial,
  deleteTestimonial,
  listenToReviews,
  saveReview,
  deleteReview
} from "../lib/firebase";
import { User as FirebaseUser } from "firebase/auth";
import { 
  Lock, Eye, Mail, Phone, Instagram, LogOut, CheckCircle2, 
  Loader2, X, ShieldAlert, Sparkles, Plus, Edit2, Trash2, 
  ArrowLeft, Image as ImageIcon, Tag, User, Newspaper,
  Briefcase, Calendar, Star, Smile, ChevronRight, Layers, HelpCircle, ThumbsUp
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";
import { Solution, Program, Testimonial, Review } from "../types";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GlobalSettings;
}

type TabType = "settings" | "solutions" | "programs" | "testimonials" | "reviews" | "blog";

export default function AdminPanel({ isOpen, onClose, settings }: AdminPanelProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminUser, setAdminUser] = useState<FirebaseUser | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<TabType>("settings");

  // --- Real-time Collections Data ---
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // --- General Settings Edit states ---
  const [editInstagram, setEditInstagram] = useState(settings.instagram);
  const [editWhatsapp, setEditWhatsapp] = useState(settings.whatsapp);
  const [editEmail, setEditEmail] = useState(settings.email);
  const [editHeroTitle, setEditHeroTitle] = useState(settings.heroTitle || "");
  const [editHeroSubtitle, setEditHeroSubtitle] = useState(settings.heroSubtitle || "");
  const [editHeroCta, setEditHeroCta] = useState(settings.heroCta || "");
  const [editStatsColaboradores, setEditStatsColaboradores] = useState(settings.statsColaboradores || 450000);
  const [editStatsEventos, setEditStatsEventos] = useState(settings.statsEventos || 2500);
  const [editStatsEmpresas, setEditStatsEmpresas] = useState(settings.statsEmpresas || 850);
  const [editStatsAprovacao, setEditStatsAprovacao] = useState(settings.statsAprovacao || 98);

  // --- CRUD Active Forms / Editing states ---
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [isSavingPost, setIsSavingPost] = useState(false);
  const [editPostData, setEditPostData] = useState<Omit<BlogPost, "id"> & { id?: string }>({
    title: "",
    content: "",
    summary: "",
    imageUrl: "",
    category: "SIPAT",
    author: "Equipe Performance",
    createdAt: ""
  });

  const [isEditingSol, setIsEditingSol] = useState(false);
  const [isSavingSol, setIsSavingSol] = useState(false);
  const [editSolData, setEditSolData] = useState<Omit<Solution, "id"> & { id?: string, benefitsString?: string }>({
    title: "",
    icon: "Shield",
    shortDesc: "",
    longDesc: "",
    category: "seguranca",
    benefits: [],
    benefitsString: ""
  });

  const [isEditingProg, setIsEditingProg] = useState(false);
  const [isSavingProg, setIsSavingProg] = useState(false);
  const [editProgData, setEditProgData] = useState<Omit<Program, "id"> & { id?: string }>({
    title: "",
    description: "",
    target: "",
    period: "",
    color: "from-sky-500 to-indigo-600",
    tagline: ""
  });

  const [isEditingTest, setIsEditingTest] = useState(false);
  const [isSavingTest, setIsSavingTest] = useState(false);
  const [editTestData, setEditTestData] = useState<Omit<Testimonial, "id"> & { id?: string }>({
    name: "",
    role: "",
    company: "",
    text: "",
    rating: 5
  });

  const [isEditingRev, setIsEditingRev] = useState(false);
  const [isSavingRev, setIsSavingRev] = useState(false);
  const [editRevData, setEditRevData] = useState<Omit<Review, "id"> & { id?: string }>({
    name: "",
    role: "",
    company: "",
    rating: 5,
    text: "",
    date: "Há 1 semana",
    avatarBg: "bg-sky-600"
  });

  // Synchronize local edit states with database updates
  useEffect(() => {
    if (settings) {
      setEditInstagram(settings.instagram);
      setEditWhatsapp(settings.whatsapp);
      setEditEmail(settings.email);
      setEditHeroTitle(settings.heroTitle || "");
      setEditHeroSubtitle(settings.heroSubtitle || "");
      setEditHeroCta(settings.heroCta || "");
      setEditStatsColaboradores(settings.statsColaboradores || 450000);
      setEditStatsEventos(settings.statsEventos || 2500);
      setEditStatsEmpresas(settings.statsEmpresas || 850);
      setEditStatsAprovacao(settings.statsAprovacao || 98);
    }
  }, [settings]);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = listenToAuthState((user) => {
      setAdminUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Listen to all dynamic collections when authenticated
  useEffect(() => {
    if (!adminUser) return;

    const unsubBlog = listenToBlogPosts(setBlogPosts);
    const unsubSol = listenToSolutions(setSolutions);
    const unsubProg = listenToPrograms(setPrograms);
    const unsubTest = listenToTestimonials(setTestimonials);
    const unsubRev = listenToReviews(setReviews);

    return () => {
      unsubBlog();
      unsubSol();
      unsubProg();
      unsubTest();
      unsubRev();
    };
  }, [adminUser]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoggingIn(true);
    try {
      await authenticateAdmin(email, password);
      toast.success("Login administrativo realizado com sucesso!");
    } catch (error: any) {
      console.error("Admin Auth Error:", error);
      toast.error("Credenciais inválidas. Verifique os dados e tente novamente.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editInstagram || !editWhatsapp || !editEmail || !editHeroTitle || !editHeroSubtitle || !editHeroCta) {
      toast.error("Todos os campos obrigatórios (*) devem ser preenchidos.");
      return;
    }

    setIsSaving(true);
    try {
      await saveGlobalSettings({
        instagram: editInstagram,
        whatsapp: editWhatsapp,
        email: editEmail,
        heroTitle: editHeroTitle,
        heroSubtitle: editHeroSubtitle,
        heroCta: editHeroCta,
        statsColaboradores: Number(editStatsColaboradores),
        statsEventos: Number(editStatsEventos),
        statsEmpresas: Number(editStatsEmpresas),
        statsAprovacao: Number(editStatsAprovacao)
      });
      toast.success("Configurações atualizadas com sucesso!");
    } catch (error) {
      console.error("Error saving global settings:", error);
      toast.error("Erro ao salvar dados. Verifique suas permissões.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signAdminOut();
      setActiveTab("settings");
      setIsEditingPost(false);
      setIsEditingSol(false);
      setIsEditingProg(false);
      setIsEditingTest(false);
      setIsEditingRev(false);
      toast.success("Logout realizado com sucesso.");
    } catch (error) {
      toast.error("Erro ao sair da conta.");
    }
  };

  // --- SOLUTIONS CRUD HANDLERS ---
  const handleCreateSolClick = () => {
    setEditSolData({
      title: "",
      icon: "Shield",
      shortDesc: "",
      longDesc: "",
      category: "seguranca",
      benefits: [],
      benefitsString: ""
    });
    setIsEditingSol(true);
  };

  const handleEditSolClick = (sol: Solution) => {
    setEditSolData({
      id: sol.id,
      title: sol.title,
      icon: sol.icon,
      shortDesc: sol.shortDesc,
      longDesc: sol.longDesc,
      category: sol.category,
      benefits: sol.benefits || [],
      benefitsString: (sol.benefits || []).join(", ")
    });
    setIsEditingSol(true);
  };

  const handleDeleteSol = async (id: string) => {
    if (!window.confirm("Deseja excluir permanentemente esta solução?")) return;
    try {
      await deleteSolution(id);
      toast.success("Solução excluída!");
    } catch (err) {
      toast.error("Erro ao excluir solução.");
    }
  };

  const handleSaveSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSolData.title || !editSolData.shortDesc || !editSolData.longDesc) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    setIsSavingSol(true);
    try {
      const parsedBenefits = editSolData.benefitsString
        ? editSolData.benefitsString.split(",").map(b => b.trim()).filter(Boolean)
        : [];

      await saveSolution({
        title: editSolData.title,
        icon: editSolData.icon || "Shield",
        shortDesc: editSolData.shortDesc,
        longDesc: editSolData.longDesc,
        category: editSolData.category || "seguranca",
        benefits: parsedBenefits,
        id: editSolData.id
      });
      toast.success(editSolData.id ? "Solução atualizada!" : "Nova solução criada!");
      setIsEditingSol(false);
    } catch (err) {
      toast.error("Erro ao salvar solução.");
    } finally {
      setIsSavingSol(false);
    }
  };

  // --- PROGRAMS CRUD HANDLERS ---
  const handleCreateProgClick = () => {
    setEditProgData({
      title: "",
      description: "",
      target: "Colaboradores em geral, gestores e técnicos de segurança",
      period: "1 dia (SIPAT) ou contínuo",
      color: "from-sky-500 to-indigo-600",
      tagline: ""
    });
    setIsEditingProg(true);
  };

  const handleEditProgClick = (prog: Program) => {
    setEditProgData({
      id: prog.id,
      title: prog.title,
      description: prog.description,
      target: prog.target,
      period: prog.period,
      color: prog.color,
      tagline: prog.tagline
    });
    setIsEditingProg(true);
  };

  const handleDeleteProg = async (id: string) => {
    if (!window.confirm("Deseja excluir permanentemente este programa?")) return;
    try {
      await deleteProgram(id);
      toast.success("Programa excluído!");
    } catch (err) {
      toast.error("Erro ao excluir programa.");
    }
  };

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProgData.title || !editProgData.description || !editProgData.tagline) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    setIsSavingProg(true);
    try {
      await saveProgram({
        title: editProgData.title,
        description: editProgData.description,
        target: editProgData.target,
        period: editProgData.period,
        color: editProgData.color || "from-sky-500 to-indigo-600",
        tagline: editProgData.tagline,
        id: editProgData.id
      });
      toast.success(editProgData.id ? "Programa atualizado!" : "Novo programa criado!");
      setIsEditingProg(false);
    } catch (err) {
      toast.error("Erro ao salvar programa.");
    } finally {
      setIsSavingProg(false);
    }
  };

  // --- TESTIMONIALS CRUD HANDLERS ---
  const handleCreateTestClick = () => {
    setEditTestData({
      name: "",
      role: "",
      company: "",
      text: "",
      rating: 5
    });
    setIsEditingTest(true);
  };

  const handleEditTestClick = (test: Testimonial) => {
    setEditTestData({
      id: test.id,
      name: test.name,
      role: test.role,
      company: test.company,
      text: test.text,
      rating: test.rating
    });
    setIsEditingTest(true);
  };

  const handleDeleteTest = async (id: string) => {
    if (!window.confirm("Deseja excluir permanentemente este depoimento?")) return;
    try {
      await deleteTestimonial(id);
      toast.success("Depoimento excluído!");
    } catch (err) {
      toast.error("Erro ao excluir depoimento.");
    }
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTestData.name || !editTestData.text || !editTestData.role || !editTestData.company) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    setIsSavingTest(true);
    try {
      await saveTestimonial({
        name: editTestData.name,
        role: editTestData.role,
        company: editTestData.company,
        text: editTestData.text,
        rating: Number(editTestData.rating),
        id: editTestData.id
      });
      toast.success(editTestData.id ? "Depoimento atualizado!" : "Novo depoimento publicado!");
      setIsEditingTest(false);
    } catch (err) {
      toast.error("Erro ao salvar depoimento.");
    } finally {
      setIsSavingTest(false);
    }
  };

  // --- REVIEWS CRUD HANDLERS ---
  const handleCreateRevClick = () => {
    setEditRevData({
      name: "",
      role: "Gestor(a)",
      company: "",
      rating: 5,
      text: "",
      date: "Há 1 semana",
      avatarBg: "bg-sky-600"
    });
    setIsEditingRev(true);
  };

  const handleEditRevClick = (rev: Review) => {
    setEditRevData({
      id: rev.id,
      name: rev.name,
      role: rev.role,
      company: rev.company,
      rating: rev.rating,
      text: rev.text,
      date: rev.date,
      avatarBg: rev.avatarBg
    });
    setIsEditingRev(true);
  };

  const handleDeleteRev = async (id: string) => {
    if (!window.confirm("Deseja excluir esta avaliação?")) return;
    try {
      await deleteReview(id);
      toast.success("Avaliação excluída!");
    } catch (err) {
      toast.error("Erro ao excluir avaliação.");
    }
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRevData.name || !editRevData.text || !editRevData.company) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    setIsSavingRev(true);
    try {
      await saveReview({
        name: editRevData.name,
        role: editRevData.role,
        company: editRevData.company,
        rating: Number(editRevData.rating),
        text: editRevData.text,
        date: editRevData.date || "Há 1 semana",
        avatarBg: editRevData.avatarBg || "bg-sky-600",
        id: editRevData.id
      });
      toast.success(editRevData.id ? "Avaliação atualizada!" : "Nova avaliação criada!");
      setIsEditingRev(false);
    } catch (err) {
      toast.error("Erro ao salvar avaliação.");
    } finally {
      setIsSavingRev(false);
    }
  };

  // --- BLOG CRUD HANDLERS ---
  const handleCreatePostClick = () => {
    setEditPostData({
      title: "",
      content: "",
      summary: "",
      imageUrl: "",
      category: "SIPAT",
      author: "Equipe Performance",
      createdAt: new Date().toISOString()
    });
    setIsEditingPost(true);
  };

  const handleEditPostClick = (post: BlogPost) => {
    setEditPostData({
      id: post.id,
      title: post.title,
      content: post.content,
      summary: post.summary,
      imageUrl: post.imageUrl,
      category: post.category,
      author: post.author,
      createdAt: post.createdAt
    });
    setIsEditingPost(true);
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Tem certeza de que deseja excluir permanentemente este artigo do blog?")) {
      return;
    }
    try {
      await deleteBlogPost(postId);
      toast.success("Artigo excluído do blog!");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Erro ao excluir artigo.");
    }
  };

  const handleSaveBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPostData.title || !editPostData.content || !editPostData.summary || !editPostData.imageUrl) {
      toast.error("Todos os campos obrigatórios (*) devem ser preenchidos.");
      return;
    }

    setIsSavingPost(true);
    try {
      await saveBlogPost(editPostData);
      toast.success(editPostData.id ? "Artigo atualizado!" : "Novo artigo publicado!");
      setIsEditingPost(false);
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Erro ao publicar artigo. Verifique as restrições.");
    } finally {
      setIsSavingPost(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal box (widened to max-w-4xl for dynamic multisection dashboard) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className={`relative w-full ${
              adminUser ? "max-w-4xl" : "max-w-lg"
            } bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-10 transition-all duration-300 max-h-[90vh] flex flex-col`}
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20 shrink-0">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  Painel de Administração
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                aria-label="Fechar Painel Admin"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content area */}
            <div className="overflow-y-auto flex-1">
              {!adminUser ? (
                /* LOGIN FORM STATE */
                <div className="p-6">
                  <form onSubmit={handleLogin} className="space-y-4 text-left">
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/50 rounded-2xl flex items-start gap-3">
                      <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                          Acesso Restrito
                        </p>
                        <p className="text-[11px] text-amber-600/90 dark:text-amber-400/90 mt-0.5 leading-relaxed">
                          Faça login com as credenciais oficiais da PERFORMANCE para atualizar os dados do site ou criar novas notícias no blog.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                        E-mail Administrativo
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="performance@x.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                        Senha de Acesso
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoggingIn}
                      className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      {isLoggingIn ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Autenticando...
                        </>
                      ) : (
                        "Entrar no Painel"
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                /* ADMIN LOGGED-IN STATE */
                <div className="flex flex-col h-full">
                  
                  {/* TAB SWITCHER BAR */}
                  <div className="px-6 border-b border-slate-100 dark:border-slate-800 flex gap-4 overflow-x-auto bg-slate-50/30 dark:bg-slate-950/10 shrink-0 scrollbar-none">
                    <button
                      type="button"
                      onClick={() => { setActiveTab("settings"); setIsEditingPost(false); }}
                      className={`py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                        activeTab === "settings"
                          ? "border-sky-600 text-sky-600 dark:text-sky-400"
                          : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      }`}
                    >
                      Home/Gerais
                    </button>
                    <button
                      type="button"
                      onClick={() => { setActiveTab("solutions"); setIsEditingSol(false); }}
                      className={`py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                        activeTab === "solutions"
                          ? "border-sky-600 text-sky-600 dark:text-sky-400"
                          : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      }`}
                    >
                      Soluções/Serviços
                    </button>
                    <button
                      type="button"
                      onClick={() => { setActiveTab("programs"); setIsEditingProg(false); }}
                      className={`py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                        activeTab === "programs"
                          ? "border-sky-600 text-sky-600 dark:text-sky-400"
                          : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      }`}
                    >
                      Programas
                    </button>
                    <button
                      type="button"
                      onClick={() => { setActiveTab("testimonials"); setIsEditingTest(false); }}
                      className={`py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                        activeTab === "testimonials"
                          ? "border-sky-600 text-sky-600 dark:text-sky-400"
                          : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      }`}
                    >
                      Depoimentos (Slider)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setActiveTab("reviews"); setIsEditingRev(false); }}
                      className={`py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                        activeTab === "reviews"
                          ? "border-sky-600 text-sky-600 dark:text-sky-400"
                          : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      }`}
                    >
                      Avaliações Google
                    </button>
                    <button
                      type="button"
                      onClick={() => { setActiveTab("blog"); setIsEditingPost(false); }}
                      className={`py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                        activeTab === "blog"
                          ? "border-sky-600 text-sky-600 dark:text-sky-400"
                          : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      }`}
                    >
                      Gerenciar Blog
                    </button>
                  </div>

                  {/* TAB CONTENTS */}
                  <div className="p-6">
                    {activeTab === "settings" && (
                      /* TAB 1: GENERAL SETTINGS & HERO & STATS */
                      <div className="space-y-6 text-left">
                        {/* Visitor analytics badge block */}
                        <div className="p-6 bg-gradient-to-br from-sky-500/10 to-emerald-500/10 dark:from-sky-950/20 dark:to-emerald-950/20 rounded-3xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Métrica de Acessos</p>
                            <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-display flex items-center gap-2">
                              {settings.views.toLocaleString("pt-BR")}
                              <span className="text-[10px] font-semibold py-0.5 px-2 bg-emerald-500/10 text-emerald-600 rounded-full">Visualizações</span>
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-1">Incrementado automaticamente em tempo real</p>
                          </div>
                          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                            <Eye className="w-6 h-6" />
                          </div>
                        </div>

                        {/* Settings modification form */}
                        <form onSubmit={handleSaveSettings} className="space-y-6">
                          
                          {/* Hero Landing Copy Customization */}
                          <div className="space-y-4">
                            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                              <Sparkles className="w-4 h-4 text-amber-500" />
                              Personalizar Banner Principal (Hero)
                            </h4>
                            
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                                Título Principal (Heading Hero) *
                              </label>
                              <input
                                type="text"
                                required
                                value={editHeroTitle}
                                onChange={(e) => setEditHeroTitle(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-sm focus:outline-none focus:border-sky-500 font-medium"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                                Subtítulo de Apoio *
                              </label>
                              <textarea
                                required
                                rows={3}
                                value={editHeroSubtitle}
                                onChange={(e) => setEditHeroSubtitle(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-sm focus:outline-none focus:border-sky-500 leading-relaxed"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                                Texto do Botão CTA principal *
                              </label>
                              <input
                                type="text"
                                required
                                value={editHeroCta}
                                onChange={(e) => setEditHeroCta(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-sm focus:outline-none focus:border-sky-500"
                              />
                            </div>
                          </div>

                          {/* Stats Counters */}
                          <div className="space-y-4">
                            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                              <Smile className="w-4 h-4 text-emerald-500" />
                              Painel de Métricas e Contadores
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                              <div>
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Colaboradores</label>
                                <input
                                  type="number"
                                  required
                                  value={editStatsColaboradores}
                                  onChange={(e) => setEditStatsColaboradores(Number(e.target.value))}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none focus:border-sky-500"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Eventos</label>
                                <input
                                  type="number"
                                  required
                                  value={editStatsEventos}
                                  onChange={(e) => setEditStatsEventos(Number(e.target.value))}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none focus:border-sky-500"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Empresas</label>
                                <input
                                  type="number"
                                  required
                                  value={editStatsEmpresas}
                                  onChange={(e) => setEditStatsEmpresas(Number(e.target.value))}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none focus:border-sky-500"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Aprovação %</label>
                                <input
                                  type="number"
                                  required
                                  value={editStatsAprovacao}
                                  onChange={(e) => setEditStatsAprovacao(Number(e.target.value))}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none focus:border-sky-500"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Contact Channels */}
                          <div className="space-y-4">
                            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                              <Mail className="w-4 h-4 text-sky-500" />
                              Canais Gerais de Contato e Redes
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* Instagram input */}
                              <div>
                                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                                  Instagram URL *
                                </label>
                                <input
                                  type="url"
                                  required
                                  value={editInstagram}
                                  onChange={(e) => setEditInstagram(e.target.value)}
                                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none focus:border-sky-500"
                                />
                              </div>

                              {/* Whatsapp input */}
                              <div>
                                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                                  WhatsApp (com DDD) *
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={editWhatsapp}
                                  onChange={(e) => setEditWhatsapp(e.target.value)}
                                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none focus:border-sky-500"
                                />
                              </div>

                              {/* Email input */}
                              <div>
                                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                                  E-mail Comercial *
                                </label>
                                <input
                                  type="email"
                                  required
                                  value={editEmail}
                                  onChange={(e) => setEditEmail(e.target.value)}
                                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none focus:border-sky-500"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Actions bar */}
                          <div className="pt-4 flex items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 mt-6 shrink-0">
                            <button
                              type="button"
                              onClick={handleLogout}
                              className="px-4 py-2.5 text-xs font-semibold text-rose-500 hover:text-rose-600 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100/50 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <LogOut className="w-4 h-4" />
                              Sair da Conta
                            </button>

                            <button
                              type="submit"
                              disabled={isSaving}
                              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              {isSaving ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Salvando...
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-4 h-4" />
                                  Salvar Alterações
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {activeTab === "solutions" && (
                      /* TAB 2: SOLUTIONS/SERVICES CRUD */
                      <div className="text-left space-y-4">
                        {isEditingSol ? (
                          <form onSubmit={handleSaveSolution} className="space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                              <button
                                type="button"
                                onClick={() => setIsEditingSol(false)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                              >
                                <ArrowLeft className="w-4 h-4" />
                                Voltar para Lista
                              </button>
                              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-100/40 dark:bg-sky-950/60 px-2.5 py-1 rounded-md">
                                {editSolData.id ? "Editando Solução" : "Nova Solução"}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Título da Solução *</label>
                                <input
                                  type="text"
                                  required
                                  value={editSolData.title}
                                  onChange={(e) => setEditSolData({ ...editSolData, title: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Categoria *</label>
                                <select
                                  value={editSolData.category}
                                  onChange={(e) => setEditSolData({ ...editSolData, category: e.target.value as any })}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs"
                                >
                                  <option value="seguranca">Segurança</option>
                                  <option value="saude">Saúde</option>
                                  <option value="bem-estar">Bem-Estar</option>
                                  <option value="interativo">Interativo</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Ícone (Nome do Ícone Lucide) *</label>
                                <input
                                  type="text"
                                  required
                                  value={editSolData.icon}
                                  onChange={(e) => setEditSolData({ ...editSolData, icon: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none"
                                  placeholder="Shield, Heart, Smile, Sparkles, Brain, Dumbbell"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Descrição Curta *</label>
                                <input
                                  type="text"
                                  required
                                  value={editSolData.shortDesc}
                                  onChange={(e) => setEditSolData({ ...editSolData, shortDesc: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none"
                                />
                              </div>

                              <div className="md:col-span-2">
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Descrição Longa *</label>
                                <textarea
                                  required
                                  rows={4}
                                  value={editSolData.longDesc}
                                  onChange={(e) => setEditSolData({ ...editSolData, longDesc: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none"
                                />
                              </div>

                              <div className="md:col-span-2">
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                                  <Layers className="w-3.5 h-3.5 text-sky-500" />
                                  Benefícios (Separados por vírgulas)
                                </label>
                                <input
                                  type="text"
                                  value={editSolData.benefitsString}
                                  onChange={(e) => setEditSolData({ ...editSolData, benefitsString: e.target.value })}
                                  placeholder="Mensagem clara, Alta interatividade, Fixação de hábitos, Engajamento total"
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 shrink-0">
                              <button
                                type="button"
                                onClick={() => setIsEditingSol(false)}
                                className="px-4 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-white transition-colors cursor-pointer"
                              >
                                Cancelar
                              </button>
                              <button
                                type="submit"
                                disabled={isSavingSol}
                                className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                              >
                                {isSavingSol ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                Salvar Solução
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Briefcase className="w-4 h-4 text-sky-500" />
                                Soluções e Atividades Cadastradas ({solutions.length})
                              </h4>
                              <button
                                type="button"
                                onClick={handleCreateSolClick}
                                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
                              >
                                <Plus className="w-4 h-4" />
                                Nova Solução
                              </button>
                            </div>

                            <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/20 max-h-[45vh] overflow-y-auto">
                              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {solutions.map((sol) => (
                                  <div key={sol.id} className="p-4 flex items-center justify-between hover:bg-slate-100/40 dark:hover:bg-slate-900/40 transition-colors gap-4">
                                    <div className="text-left">
                                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">{sol.title}</h5>
                                      <span className="text-[9px] font-bold text-sky-500 uppercase tracking-widest">{sol.category}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => handleEditSolClick(sol)}
                                        className="p-1.5 rounded-lg text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/40 cursor-pointer"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteSol(sol.id)}
                                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "programs" && (
                      /* TAB 3: PROGRAMS CRUD */
                      <div className="text-left space-y-4">
                        {isEditingProg ? (
                          <form onSubmit={handleSaveProgram} className="space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                              <button
                                type="button"
                                onClick={() => setIsEditingProg(false)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                              >
                                <ArrowLeft className="w-4 h-4" />
                                Voltar para Lista
                              </button>
                              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-100/40 dark:bg-sky-950/60 px-2.5 py-1 rounded-md">
                                {editProgData.id ? "Editando Programa" : "Novo Programa"}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Título do Programa *</label>
                                <input
                                  type="text"
                                  required
                                  value={editProgData.title}
                                  onChange={(e) => setEditProgData({ ...editProgData, title: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Tagline Curta / Slogan *</label>
                                <input
                                  type="text"
                                  required
                                  value={editProgData.tagline}
                                  onChange={(e) => setEditProgData({ ...editProgData, tagline: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none"
                                  placeholder="Ex: Janeiro Branco, SIPAT Integrada"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Público-Alvo</label>
                                <input
                                  type="text"
                                  required
                                  value={editProgData.target}
                                  onChange={(e) => setEditProgData({ ...editProgData, target: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Período de Execução</label>
                                <input
                                  type="text"
                                  required
                                  value={editProgData.period}
                                  onChange={(e) => setEditProgData({ ...editProgData, period: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none"
                                />
                              </div>

                              <div className="md:col-span-2">
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Descrição Detalhada *</label>
                                <textarea
                                  required
                                  rows={4}
                                  value={editProgData.description}
                                  onChange={(e) => setEditProgData({ ...editProgData, description: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Classe de Cores do Gradiente (Classes Tailwind CSS)</label>
                                <input
                                  type="text"
                                  required
                                  value={editProgData.color}
                                  onChange={(e) => setEditProgData({ ...editProgData, color: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none"
                                  placeholder="from-sky-500 to-indigo-600"
                                />
                              </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 shrink-0">
                              <button
                                type="button"
                                onClick={() => setIsEditingProg(false)}
                                className="px-4 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-white transition-colors cursor-pointer"
                              >
                                Cancelar
                              </button>
                              <button
                                type="submit"
                                disabled={isSavingProg}
                                className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                              >
                                {isSavingProg ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                Salvar Programa
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-sky-500" />
                                Programas e Calendários de SIPAT ({programs.length})
                              </h4>
                              <button
                                type="button"
                                onClick={handleCreateProgClick}
                                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
                              >
                                <Plus className="w-4 h-4" />
                                Novo Programa
                              </button>
                            </div>

                            <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/20 max-h-[45vh] overflow-y-auto">
                              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {programs.map((prog) => (
                                  <div key={prog.id} className="p-4 flex items-center justify-between hover:bg-slate-100/40 dark:hover:bg-slate-900/40 transition-colors gap-4">
                                    <div className="text-left">
                                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">{prog.title}</h5>
                                      <span className="text-[9px] font-mono font-semibold text-slate-400">{prog.tagline}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => handleEditProgClick(prog)}
                                        className="p-1.5 rounded-lg text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/40 cursor-pointer"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteProg(prog.id)}
                                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "testimonials" && (
                      /* TAB 4: TESTIMONIALS CRUD */
                      <div className="text-left space-y-4">
                        {isEditingTest ? (
                          <form onSubmit={handleSaveTestimonial} className="space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                              <button
                                type="button"
                                onClick={() => setIsEditingTest(false)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                              >
                                <ArrowLeft className="w-4 h-4" />
                                Voltar para Lista
                              </button>
                              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-100/40 dark:bg-sky-950/60 px-2.5 py-1 rounded-md">
                                {editTestData.id ? "Editando Depoimento" : "Novo Depoimento"}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Nome do Gestor/Colaborador *</label>
                                <input
                                  type="text"
                                  required
                                  value={editTestData.name}
                                  onChange={(e) => setEditTestData({ ...editTestData, name: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Cargo *</label>
                                <input
                                  type="text"
                                  required
                                  value={editTestData.role}
                                  onChange={(e) => setEditTestData({ ...editTestData, role: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none"
                                  placeholder="Coordenadora de EHS, Gerente de RH"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Empresa Contratante *</label>
                                <input
                                  type="text"
                                  required
                                  value={editTestData.company}
                                  onChange={(e) => setEditTestData({ ...editTestData, company: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Nota (Estrelas 1-5)</label>
                                <select
                                  value={editTestData.rating}
                                  onChange={(e) => setEditTestData({ ...editTestData, rating: Number(e.target.value) })}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs"
                                >
                                  <option value={5}>5 Estrelas (Recomendado)</option>
                                  <option value={4}>4 Estrelas</option>
                                  <option value={3}>3 Estrelas</option>
                                </select>
                              </div>

                              <div className="md:col-span-2">
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Texto do Depoimento *</label>
                                <textarea
                                  required
                                  rows={4}
                                  value={editTestData.text}
                                  onChange={(e) => setEditTestData({ ...editTestData, text: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 shrink-0">
                              <button
                                type="button"
                                onClick={() => setIsEditingTest(false)}
                                className="px-4 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-white transition-colors cursor-pointer"
                              >
                                Cancelar
                              </button>
                              <button
                                type="submit"
                                disabled={isSavingTest}
                                className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                              >
                                {isSavingTest ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                Salvar Depoimento
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Star className="w-4 h-4 text-sky-500" />
                                Depoimentos Cadastrados para o Slider ({testimonials.length})
                              </h4>
                              <button
                                type="button"
                                onClick={handleCreateTestClick}
                                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
                              >
                                <Plus className="w-4 h-4" />
                                Novo Depoimento
                              </button>
                            </div>

                            <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/20 max-h-[45vh] overflow-y-auto">
                              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {testimonials.map((test) => (
                                  <div key={test.id} className="p-4 flex items-center justify-between hover:bg-slate-100/40 dark:hover:bg-slate-900/40 transition-colors gap-4">
                                    <div className="text-left">
                                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">{test.name}</h5>
                                      <span className="text-[9px] font-mono font-semibold text-slate-400">{test.role} • <span className="text-sky-500">{test.company}</span></span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => handleEditTestClick(test)}
                                        className="p-1.5 rounded-lg text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/40 cursor-pointer"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteTest(test.id)}
                                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "reviews" && (
                      /* TAB 5: REVIEWS CRUD */
                      <div className="text-left space-y-4">
                        {isEditingRev ? (
                          <form onSubmit={handleSaveReview} className="space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                              <button
                                type="button"
                                onClick={() => setIsEditingRev(false)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                              >
                                <ArrowLeft className="w-4 h-4" />
                                Voltar para Lista
                              </button>
                              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-100/40 dark:bg-sky-950/60 px-2.5 py-1 rounded-md">
                                {editRevData.id ? "Editando Avaliação" : "Nova Avaliação"}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Nome do Cliente Google *</label>
                                <input
                                  type="text"
                                  required
                                  value={editRevData.name}
                                  onChange={(e) => setEditRevData({ ...editRevData, name: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Cargo *</label>
                                <input
                                  type="text"
                                  required
                                  value={editRevData.role}
                                  onChange={(e) => setEditRevData({ ...editRevData, role: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Empresa *</label>
                                <input
                                  type="text"
                                  required
                                  value={editRevData.company}
                                  onChange={(e) => setEditRevData({ ...editRevData, company: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Data Relativa</label>
                                <input
                                  type="text"
                                  required
                                  value={editRevData.date}
                                  onChange={(e) => setEditRevData({ ...editRevData, date: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none"
                                  placeholder="Há 1 semana, Há 1 mês"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Fundo do Avatar (Classe CSS)</label>
                                <input
                                  type="text"
                                  required
                                  value={editRevData.avatarBg}
                                  onChange={(e) => setEditRevData({ ...editRevData, avatarBg: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none"
                                  placeholder="bg-sky-600, bg-emerald-600, bg-purple-600"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Nota (Google Stars 1-5)</label>
                                <select
                                  value={editRevData.rating}
                                  onChange={(e) => setEditRevData({ ...editRevData, rating: Number(e.target.value) })}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs"
                                >
                                  <option value={5}>5 Estrelas</option>
                                  <option value={4}>4 Estrelas</option>
                                </select>
                              </div>

                              <div className="md:col-span-2">
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Texto da Avaliação *</label>
                                <textarea
                                  required
                                  rows={4}
                                  value={editRevData.text}
                                  onChange={(e) => setEditRevData({ ...editRevData, text: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 shrink-0">
                              <button
                                type="button"
                                onClick={() => setIsEditingRev(false)}
                                className="px-4 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-white transition-colors cursor-pointer"
                              >
                                Cancelar
                              </button>
                              <button
                                type="submit"
                                disabled={isSavingRev}
                                className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                              >
                                {isSavingRev ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                Salvar Avaliação
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <ThumbsUp className="w-4 h-4 text-sky-500" />
                                Avaliações Google Auditadas ({reviews.length})
                              </h4>
                              <button
                                type="button"
                                onClick={handleCreateRevClick}
                                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
                              >
                                <Plus className="w-4 h-4" />
                                Nova Avaliação
                              </button>
                            </div>

                            <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/20 max-h-[45vh] overflow-y-auto">
                              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {reviews.map((rev) => (
                                  <div key={rev.id} className="p-4 flex items-center justify-between hover:bg-slate-100/40 dark:hover:bg-slate-900/40 transition-colors gap-4">
                                    <div className="text-left">
                                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">{rev.name}</h5>
                                      <span className="text-[9px] font-mono font-semibold text-slate-400">{rev.company} • <span className="text-sky-500">{rev.date}</span></span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => handleEditRevClick(rev)}
                                        className="p-1.5 rounded-lg text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/40 cursor-pointer"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteRev(rev.id)}
                                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "blog" && (
                      /* TAB 6: BLOG MANAGEMENT */
                      <div className="text-left space-y-4">
                        {isEditingPost ? (
                          /* BLOG SUB-VIEW: CREATING/EDITING FORM */
                          <form onSubmit={handleSaveBlogPost} className="space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                              <button
                                type="button"
                                onClick={() => setIsEditingPost(false)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                              >
                                <ArrowLeft className="w-4 h-4" />
                                Voltar para Lista
                              </button>
                              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-100/40 dark:bg-sky-950/60 px-2.5 py-1 rounded-md">
                                {editPostData.id ? "Editando Artigo" : "Novo Artigo"}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Post Title */}
                              <div className="md:col-span-2">
                                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                                  Título do Artigo *
                                </label>
                                <input
                                  type="text"
                                  required
                                  placeholder="Ex: Como melhorar a postura no home office"
                                  value={editPostData.title}
                                  onChange={(e) => setEditPostData({ ...editPostData, title: e.target.value })}
                                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none focus:border-sky-500"
                                />
                              </div>

                              {/* Category selection */}
                              <div>
                                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                                  Categoria *
                                </label>
                                <select
                                  value={editPostData.category}
                                  onChange={(e) => setEditPostData({ ...editPostData, category: e.target.value })}
                                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs focus:outline-none focus:border-sky-500"
                                >
                                  <option value="SIPAT">SIPAT</option>
                                  <option value="Saúde & Bem-Estar">Saúde & Bem-Estar</option>
                                  <option value="Segurança">Segurança</option>
                                  <option value="Treinamentos">Treinamentos</option>
                                  <option value="Inovação">Inovação</option>
                                </select>
                              </div>

                              {/* Author */}
                              <div>
                                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                                  Autor *
                                </label>
                                <input
                                  type="text"
                                  required
                                  placeholder="Ex: Dr. Marcelo (Fisioterapeuta)"
                                  value={editPostData.author}
                                  onChange={(e) => setEditPostData({ ...editPostData, author: e.target.value })}
                                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none focus:border-sky-500"
                                />
                              </div>

                              {/* Image Link (External Link) */}
                              <div className="md:col-span-2">
                                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                                  <ImageIcon className="w-3.5 h-3.5 text-sky-500" />
                                  Link Externo da Imagem *
                                </label>
                                <input
                                  type="url"
                                  required
                                  placeholder="https://images.unsplash.com/photo-..."
                                  value={editPostData.imageUrl}
                                  onChange={(e) => setEditPostData({ ...editPostData, imageUrl: e.target.value })}
                                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none focus:border-sky-500"
                                />
                                {editPostData.imageUrl && (
                                  <div className="mt-2 relative h-28 rounded-lg overflow-hidden border border-slate-200/60 dark:border-slate-800 max-w-xs bg-slate-100">
                                    <img
                                      src={editPostData.imageUrl}
                                      alt="Preview"
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLElement).style.display = "none";
                                      }}
                                    />
                                    <span className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Preview da Imagem</span>
                                  </div>
                                )}
                              </div>

                              {/* Summary / Snippet */}
                              <div className="md:col-span-2">
                                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                                  Resumo Rápido (Snippet de chamada) *
                                </label>
                                <input
                                  type="text"
                                  required
                                  maxLength={300}
                                  placeholder="Breve sumário de até 300 caracteres que aparecerá na listagem inicial..."
                                  value={editPostData.summary}
                                  onChange={(e) => setEditPostData({ ...editPostData, summary: e.target.value })}
                                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none focus:border-sky-500"
                                />
                              </div>

                              {/* Content text */}
                              <div className="md:col-span-2">
                                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                                  Conteúdo Completo do Artigo * (Suporta múltiplos parágrafos usando pulos de linha)
                                </label>
                                <textarea
                                  required
                                  rows={8}
                                  placeholder="Escreva aqui o artigo completo. Você pode dar pulos de linha para separar os parágrafos."
                                  value={editPostData.content}
                                  onChange={(e) => setEditPostData({ ...editPostData, content: e.target.value })}
                                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none focus:border-sky-500 font-sans leading-relaxed"
                                />
                              </div>
                            </div>

                            {/* Form submit footer */}
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 shrink-0">
                              <button
                                type="button"
                                onClick={() => setIsEditingPost(false)}
                                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-white transition-colors cursor-pointer"
                              >
                                Cancelar
                              </button>
                              <button
                                type="submit"
                                disabled={isSavingPost}
                                className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                              >
                                {isSavingPost ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Publicando...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Publicar Notícia
                                  </>
                                )}
                              </button>
                            </div>
                          </form>
                        ) : (
                          /* BLOG SUB-VIEW: LIST OF POSTS */
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Newspaper className="w-4 h-4 text-sky-500" />
                                Listagem de Notícias Cadastradas ({blogPosts.length})
                              </h4>
                              <button
                                type="button"
                                onClick={handleCreatePostClick}
                                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
                              >
                                <Plus className="w-4 h-4" />
                                Nova Notícia
                              </button>
                            </div>

                            {/* Table List of posts */}
                            <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/20 max-h-[45vh] overflow-y-auto">
                              {blogPosts.length === 0 ? (
                                <div className="p-12 text-center text-slate-400">
                                  <Newspaper className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                  <p className="text-xs font-semibold">Nenhum artigo personalizado criado no banco de dados.</p>
                                  <p className="text-[10px] text-slate-400 mt-1">O site exibirá os artigos de demonstração até que você publique a primeira notícia.</p>
                                </div>
                              ) : (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                  {blogPosts.map((post) => (
                                    <div key={post.id} className="p-4 flex items-center justify-between hover:bg-slate-100/40 dark:hover:bg-slate-900/40 transition-colors gap-4">
                                      <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-200/60 dark:border-slate-800 bg-slate-200">
                                          <img
                                            src={post.imageUrl}
                                            alt={post.title}
                                            referrerPolicy="no-referrer"
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                        <div className="text-left min-w-0">
                                          <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-sm sm:max-w-md">
                                            {post.title}
                                          </h5>
                                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold mt-1">
                                            <span className="text-sky-600 dark:text-sky-400 flex items-center gap-0.5"><Tag className="w-2.5 h-2.5" />{post.category}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-0.5"><User className="w-2.5 h-2.5" />{post.author}</span>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                          type="button"
                                          onClick={() => handleEditPostClick(post)}
                                          className="p-1.5 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-950/40 text-sky-600 hover:text-sky-700 transition-colors cursor-pointer"
                                          title="Editar"
                                        >
                                          <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeletePost(post.id!)}
                                          className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                                          title="Deletar"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Bottom Close/Logout bar */}
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center mt-6 shrink-0">
                              <button
                                type="button"
                                onClick={handleLogout}
                                className="px-4 py-2.5 text-xs font-semibold text-rose-500 hover:text-rose-600 bg-rose-50 dark:bg-rose-950/20 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <LogOut className="w-4 h-4" />
                                Sair da Conta
                              </button>
                              <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-white transition-colors cursor-pointer"
                              >
                                Fechar Painel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
