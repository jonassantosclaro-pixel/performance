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
  BlogPost
} from "../lib/firebase";
import { User as FirebaseUser } from "firebase/auth";
import { 
  Lock, Eye, Mail, Phone, Instagram, LogOut, CheckCircle2, 
  Loader2, X, ShieldAlert, Sparkles, Plus, Edit2, Trash2, 
  ArrowLeft, Image as ImageIcon, Tag, User, Newspaper 
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GlobalSettings;
}

export default function AdminPanel({ isOpen, onClose, settings }: AdminPanelProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminUser, setAdminUser] = useState<FirebaseUser | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Tabs & Lists State
  const [activeTab, setActiveTab] = useState<"settings" | "blog">("settings");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [isSavingPost, setIsSavingPost] = useState(false);

  // Edit states for general settings
  const [editInstagram, setEditInstagram] = useState(settings.instagram);
  const [editWhatsapp, setEditWhatsapp] = useState(settings.whatsapp);
  const [editEmail, setEditEmail] = useState(settings.email);

  // Edit states for blog posts
  const [editPostData, setEditPostData] = useState<Omit<BlogPost, "id"> & { id?: string }>({
    title: "",
    content: "",
    summary: "",
    imageUrl: "",
    category: "SIPAT",
    author: "Equipe Performance",
    createdAt: ""
  });

  // Synchronize local edit states with database updates
  useEffect(() => {
    if (settings) {
      setEditInstagram(settings.instagram);
      setEditWhatsapp(settings.whatsapp);
      setEditEmail(settings.email);
    }
  }, [settings]);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = listenToAuthState((user) => {
      setAdminUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Listen to blog posts when authenticated
  useEffect(() => {
    if (!adminUser) return;
    const unsubscribe = listenToBlogPosts((posts) => {
      setBlogPosts(posts);
    });
    return () => unsubscribe();
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
    if (!editInstagram || !editWhatsapp || !editEmail) {
      toast.error("Todos os campos de contato são obrigatórios.");
      return;
    }

    setIsSaving(true);
    try {
      await saveGlobalSettings({
        instagram: editInstagram,
        whatsapp: editWhatsapp,
        email: editEmail
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
      toast.success("Logout realizado com sucesso.");
    } catch (error) {
      toast.error("Erro ao sair da conta.");
    }
  };

  // Blog Handlers
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

          {/* Modal box (widened to max-w-3xl for premium dashboard experience when logged in) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className={`relative w-full ${
              adminUser ? "max-w-3xl" : "max-w-lg"
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
                  <div className="px-6 border-b border-slate-100 dark:border-slate-800 flex gap-6 bg-slate-50/30 dark:bg-slate-950/10 shrink-0">
                    <button
                      type="button"
                      onClick={() => { setActiveTab("settings"); setIsEditingPost(false); }}
                      className={`py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                        activeTab === "settings"
                          ? "border-sky-600 text-sky-600 dark:text-sky-400"
                          : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      }`}
                    >
                      Configurações Gerais
                    </button>
                    <button
                      type="button"
                      onClick={() => { setActiveTab("blog"); }}
                      className={`py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
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
                    {activeTab === "settings" ? (
                      /* TAB 1: GENERAL SETTINGS */
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
                        <form onSubmit={handleSaveSettings} className="space-y-4">
                          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <Sparkles className="w-4.5 h-4.5 text-amber-500" />
                            Editar Dados Oficiais de Contato
                          </h4>

                          {/* Instagram input */}
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                              <Instagram className="w-4 h-4 text-purple-500" /> Instagram Oficial
                            </label>
                            <input
                              type="url"
                              required
                              value={editInstagram}
                              onChange={(e) => setEditInstagram(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-sm focus:outline-none focus:border-sky-500"
                            />
                          </div>

                          {/* Whatsapp input */}
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                              <Phone className="w-4 h-4 text-emerald-500" /> WhatsApp Comercial (Com DDI/DDD, apenas números)
                            </label>
                            <input
                              type="text"
                              required
                              value={editWhatsapp}
                              onChange={(e) => setEditWhatsapp(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-sm focus:outline-none focus:border-sky-500"
                            />
                          </div>

                          {/* Email input */}
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                              <Mail className="w-4 h-4 text-sky-500" /> E-mail Comercial
                            </label>
                            <input
                              type="email"
                              required
                              value={editEmail}
                              onChange={(e) => setEditEmail(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-sm focus:outline-none focus:border-sky-500"
                            />
                          </div>

                          {/* Actions bar */}
                          <div className="pt-4 flex items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 mt-6">
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
                    ) : (
                      /* TAB 2: BLOG MANAGEMENT */
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
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
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
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center mt-6">
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
