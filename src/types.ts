export interface Solution {
  id: string;
  title: string;
  icon: string;
  shortDesc: string;
  longDesc: string;
  category: "seguranca" | "saude" | "bem-estar" | "interativo";
  benefits: string[];
}

export interface Program {
  id: string;
  title: string;
  description: string;
  target: string;
  period: string;
  color: string;
  tagline: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  category: string;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  text: string;
  date: string;
  avatarBg: string;
}
