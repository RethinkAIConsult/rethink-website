import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { CaseStudies } from "@/components/sections/case-studies";
import { About } from "@/components/sections/about";
import { Faq } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <Services />
      <CaseStudies />
      <About />
      <Faq />
      <Contact />
    </main>
  );
}
