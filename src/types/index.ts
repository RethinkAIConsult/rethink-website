import type { LucideIcon } from "lucide-react";

export type Service = {
  title: string;
  description: string;
  details: string;
  deliverables: string[];
  icon: LucideIcon;
  techBadges: string[];
};

export type CaseStudy = {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  results: string[];
};

export type FaqItem = {
  question: string;
  answer: string;
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
