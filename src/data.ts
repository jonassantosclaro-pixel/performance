import { Solution, Program, Testimonial, GalleryItem, Review } from "./types";

export const SOLUTIONS: Solution[] = [
  {
    id: "teatro-corporativo",
    title: "Teatro Corporativo",
    icon: "Drama",
    shortDesc: "Espetáculos teatrais personalizados que abordam segurança, saúde e comportamento com muito humor e impacto.",
    longDesc: "Nossos espetáculos unem arte e conteúdo técnico para sensibilizar os colaboradores de forma leve e inesquecível. Criamos peças sob medida sobre prevenção de acidentes, uso de EPIs, assédio no trabalho e relações interpessoais.",
    category: "interativo",
    benefits: [
      "Alta taxa de retenção de conteúdo",
      "Comunicação direta, descontraída e lúdica",
      "Roteiros personalizados de acordo com a realidade da sua empresa",
      "Quebra de barreiras e engajamento genuíno"
    ]
  },
  {
    id: "palestras-show",
    title: "Palestras Show",
    icon: "Sparkles",
    shortDesc: "Apresentações dinâmicas com mágicas, humoristas e músicos focados em SIPAT e prevenção.",
    longDesc: "Palestras interativas que combinam conhecimentos técnicos com recursos de entretenimento (ilusionismo, música e comédia stand-up). Focadas em temas como Direção Defensiva, Alcoolismo e Drogas, Ergonomia e Motivação.",
    category: "seguranca",
    benefits: [
      "Engajamento máximo do início ao fim",
      "Recursos audiovisuais e interativos de ponta",
      "Palestrantes especialistas e performáticos",
      "Mensagens marcantes que mudam comportamentos"
    ]
  },
  {
    id: "dinamicas-interativas",
    title: "Dinâmicas Interativas",
    icon: "Users",
    shortDesc: "Atividades práticas em grupo para fortalecer o trabalho em equipe, a comunicação e o clima organizacional.",
    longDesc: "Exercícios vivenciais que estimulam a cooperação, a resolução conjunta de problemas e a empatia. Ideal para integrar equipes, alinhar objetivos corporativos e exercitar a liderança de forma prática.",
    category: "bem-estar",
    benefits: [
      "Aumento imediato do espírito de equipe",
      "Identificação de perfis de liderança",
      "Facilitação por psicólogos corporativos",
      "Ambiente de aprendizado descontraído e seguro"
    ]
  },
  {
    id: "quick-massage",
    title: "Quick Massage",
    icon: "Activity",
    shortDesc: "Sessões rápidas de massagem laboral para redução do estresse físico e alívio de tensões imediatas.",
    longDesc: "Sessões de 10 a 15 minutos realizadas em cadeiras ergonômicas especiais no próprio ambiente corporativo. Focada no relaxamento da região cervical, ombros, costas e braços, diminuindo a ansiedade e dores crônicas.",
    category: "bem-estar",
    benefits: [
      "Redução instantânea do nível de cortisol (estresse)",
      "Alívio rápido de dores musculares",
      "Melhora na disposição e foco para o trabalho",
      "Sentimento de valorização por parte do colaborador"
    ]
  },
  {
    id: "ergonomia-laboral",
    title: "Ergonomia & Ginástica Laboral",
    icon: "Heart",
    shortDesc: "Análises ergonômicas completas e sessões de alongamento guiadas para saúde física no trabalho.",
    longDesc: "Desenvolvemos programas completos de Ginástica Laboral (preparatória, compensatória e de relaxamento) além de vistorias técnicas (AET) para prevenção de LER/DORT, garantindo a conformidade com as normas vigentes (NR-17).",
    category: "saude",
    benefits: [
      "Prevenção eficaz de lesões ocupacionais (LER/DORT)",
      "Melhoria postural coletiva dos colaboradores",
      "Redução do índice de absenteísmo por causas ortopédicas",
      "Adequação plena à legislação brasileira (NR-17)"
    ]
  },
  {
    id: "jogos-interativos",
    title: "Jogos e Gamificação",
    icon: "Gamepad2",
    shortDesc: "Jogos de tabuleiro gigantes, quizzes virtuais e gincanas digitais para fixar regras de segurança.",
    longDesc: "Transformamos treinamentos de segurança do trabalho e conformidade (compliance) em uma competição saudável e empolgante. Desenvolvemos tabuleiros gigantes, roletas de prêmios, escape rooms e quizzes virtuais acessados via celular.",
    category: "interativo",
    benefits: [
      "Aprendizado imersivo e competitivo",
      "Estatísticas em tempo real do nível de conhecimento",
      "Apropriado para todas as idades e níveis de instrução",
      "Premiações integradas para motivar a pontuação"
    ]
  },
  {
    id: "tunel-do-conhecimento",
    title: "Túnel do Conhecimento",
    icon: "Columns",
    shortDesc: "Uma experiência imersiva e sensorial que simula riscos reais e a importância do autocuidado.",
    longDesc: "Uma estrutura cenográfica inflável ou modular montada dentro da empresa. Os colaboradores passam por estações com estímulos visuais, auditivos e táteis que exemplificam a vida antes e após acidentes de trabalho, focando no fator humano.",
    category: "seguranca",
    benefits: [
      "Experiência com altíssimo impacto emocional",
      "Uso de óculos de realidade virtual e simulação sonora",
      "Assinatura de compromisso com a vida ao final do circuito",
      "Atração de grande destaque para a sua SIPAT"
    ]
  },
  {
    id: "saude-mental",
    title: "Saúde Mental & Mindfulness",
    icon: "BrainCircuit",
    shortDesc: "Palestras, rodas de conversa e práticas meditativas focadas no combate à Síndrome de Burnout.",
    longDesc: "Intervenções delicadas e profissionais sobre estresse crônico, equilíbrio entre vida pessoal/profissional, inteligência emocional e mindfulness corporativo. Conduzidas por psicólogos e especialistas certificados.",
    category: "saude",
    benefits: [
      "Prevenção e detecção precoce do Burnout",
      "Melhoria na resiliência e foco das lideranças",
      "Estímulo à empatia e comunicação não-violenta",
      "Criação de um ambiente psicologicamente seguro"
    ]
  }
];

export const PROGRAMS: Program[] = [
  {
    id: "sipat",
    title: "SIPAT Premium",
    description: "Semana Interna de Prevenção de Acidentes de Trabalho inovadora, dinâmica e 100% personalizada para sua empresa. Unimos teatro, palestras, gincanas digitais e quick massage em um cronograma impecável.",
    target: "Indústrias, Empresas, Comércio, Hospitais e Construtoras.",
    period: "Anual (Obrigatória pela NR-5)",
    color: "from-sky-500 to-indigo-500",
    tagline: "Engajamento real na semana mais importante do ano."
  },
  {
    id: "sipatma",
    title: "SIPATMA",
    description: "Integração total entre Saúde, Segurança do Trabalho e Meio Ambiente. Abordagem de sustentabilidade, descarte correto de resíduos, economia de água e energia, além de direção defensiva e proteção à vida.",
    target: "Empresas com foco em metas ESG e indústrias certificadas ISO 14001.",
    period: "Anual",
    color: "from-emerald-500 to-teal-600",
    tagline: "Segurança para a sua equipe, respeito pelo planeta."
  },
  {
    id: "campanhas-prevencao",
    title: "Campanhas de Prevenção Anuais",
    description: "Ações contínuas baseadas no calendário oficial da saúde: Janeiro Branco (Saúde Mental), Março Lilás/Azul, Abril Verde (Segurança), Setembro Amarelo (Prevenção do Suicídio), Outubro Rosa e Novembro Azul.",
    target: "Todas as empresas comprometidas com a qualidade de vida ao longo de todo o ano.",
    period: "Mensal / Calendário de Saúde",
    color: "from-amber-500 to-orange-600",
    tagline: "Cuidado e conscientização de janeiro a dezembro."
  },
  {
    id: "feira-saude",
    title: "Feira de Saúde e Bem-Estar",
    description: "Um dia inteiro dedicado à qualidade de vida: bioimpedância, orientação nutricional individual, avaliação postural, quick massage coletiva, teste de glicemia, aferição de pressão e palestras flash de nutrição.",
    target: "Sedes administrativas e escritórios de alta performance.",
    period: "Semestral ou Integração de Benefícios",
    color: "from-rose-500 to-red-600",
    tagline: "Saúde medida na prática com acolhimento profissional."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Márcia Antunes",
    role: "Diretora de RH",
    company: "Metais do Brasil S/A",
    text: "O Teatro Corporativo da PERFORMANCE foi o maior sucesso da nossa SIPAT. Os funcionários riram e se emocionaram, e os desvios de segurança caíram drasticamente nos meses seguintes. Excelente investimento!",
    rating: 5
  },
  {
    id: "2",
    name: "Carlos Eduardo Mendes",
    role: "Gerente de EHS",
    company: "LogiTech Logistics",
    text: "Contratamos as Palestras Show e o circuito do Túnel do Conhecimento. Nunca vi nossa equipe operacional tão concentrada e participativa. Conseguimos zerar os acidentes por distração. Parabéns à equipe PERFORMANCE!",
    rating: 5
  },
  {
    id: "3",
    name: "Fernanda G. Ramos",
    role: "Coordenadora de Qualidade de Vida",
    company: "Inovação Digital Tech",
    text: "A Quick Massage e as práticas de Saúde Mental trouxeram um clima maravilhoso de acolhimento em meio às entregas do trimestre. Os colaboradores se sentiram extremamente respeitados e ouvidos.",
    rating: 5
  },
  {
    id: "4",
    name: "Roberto Silveira",
    role: "Presidente da CIPA",
    company: "Hospital das Nações",
    text: "A gamificação e o quiz digital permitiram atingir 100% dos plantonistas de enfermagem, que historicamente não conseguiam participar das ações presenciais. Foi genial, prático e inovador.",
    rating: 5
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal1",
    url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
    caption: "Apresentação de Palestra Show interativa com mágicas na CIPA",
    category: "Palestra"
  },
  {
    id: "gal2",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    caption: "Dinâmica de quebra-gelo e integração de equipes operacionais",
    category: "Dinâmicas"
  },
  {
    id: "gal3",
    url: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=800&auto=format&fit=crop",
    caption: "Serviço de Quick Massage aliviando dores posturais",
    category: "Bem-estar"
  },
  {
    id: "gal4",
    url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop",
    caption: "Teatro interativo de SIPAT sobre o uso correto de EPIs",
    category: "Teatro"
  },
  {
    id: "gal5",
    url: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?q=80&w=800&auto=format&fit=crop",
    caption: "Treinamento prático de ergonomia postural no escritório",
    category: "Ergonomia"
  },
  {
    id: "gal6",
    url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop",
    caption: "Gincana e gamificação virtual com roleta de perguntas e respostas",
    category: "Gamificação"
  }
];

export const REVIEWS_DATA: Review[] = [
  {
    id: "1",
    name: "Mariana Menezes",
    role: "Coordenadora de EHS (Segurança do Trabalho)",
    company: "Nestlé Brasil",
    rating: 5,
    text: "O teatro corporativo de SIPAT da Performance foi o melhor que já contratamos! Leve, engraçado e com uma mensagem de prevenção de acidentes impecável. Nossos colaboradores amaram e engajaram 100%.",
    date: "Há 1 semana",
    avatarBg: "bg-sky-600"
  },
  {
    id: "2",
    name: "Rodrigo Silva",
    role: "Gerente de Recursos Humanos",
    company: "Ambev",
    rating: 5,
    text: "Contratamos o programa integrado de Quick Massage e Ergonomia para o escritório central. A equipe da Performance é super profissional, pontual e as sessões trouxeram um alívio de estresse visível para a equipe.",
    date: "Há 2 semanas",
    avatarBg: "bg-emerald-600"
  },
  {
    id: "3",
    name: "Ana Paula Costa",
    role: "Diretora de QVT (Qualidade de Vida)",
    company: "Itaú Unibanco",
    rating: 5,
    text: "As palestras show focadas em Saúde Mental e Equilíbrio Emocional foram um divisor de águas na nossa semana da saúde. Abordagem com empatia, leveza e embasamento científico fantástico.",
    date: "Há 1 mês",
    avatarBg: "bg-purple-600"
  },
  {
    id: "4",
    name: "Juliana Vasconcelos",
    role: "Gestora de DHO",
    company: "Johnson & Johnson",
    rating: 5,
    text: "Excelente atendimento comercial e execução técnica espetacular. Adaptaram as dinâmicas teatrais para a realidade do nosso chão de fábrica de forma genial. Superou nossas expectativas!",
    date: "Há 1 mês",
    avatarBg: "bg-amber-600"
  }
];

