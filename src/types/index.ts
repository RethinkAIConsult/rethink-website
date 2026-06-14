import type { LucideIcon } from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  description: string;
  details: string;
  deliverables: string[];
  icon: LucideIcon;
  techBadges: string[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  subtitle: string;
  sector: string;
  metric?: { value: number; unit?: string; label: string; separator?: boolean };
  testimonial?: { quote: string; attribution: string };
  description: string;
  tags: string[];
  results: string[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ArticleSection = {
  heading: string;
  body: string[];
  bullets?: string[];
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  dek: string;
  datePublished: string;
  dateModified: string;
  readMinutes: number;
  sections: ArticleSection[];
  faqs: FaqItem[];
  related?: { label: string; href: string }[];
};

export type ContactFormData = {
  name: string;
  email: string;
  company: string;
  budget: "" | "under-5k" | "5k-15k" | "15k-50k" | "50k-plus";
  message: string;
  referral: string;
  website: string; // honeypot
};

export type ContactFormState = {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
};
