"use client";

import { motion } from "framer-motion";

export interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaHref?: string;
  bgColor?: string;
}

export default function HeroSection({
  headline = "Build Pages That Convert",
  subheadline = "A refined, powerful landing page builder for serious products.",
  ctaText = "Start Building",
  ctaHref = "#",
  bgColor = "var(--color-cream)",
}: HeroSectionProps) {
  const ease = [0.22, 1, 0.36, 1];

  return (
    <section
      style={{ backgroundColor: bgColor, minHeight: "92vh" }}
      className="w-full flex flex-col items-center justify-center text-center px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0, duration: 0.5, ease }}
        className="uppercase text-[11px] tracking-[0.14em] text-stone mb-6 font-sans"
      >
        FORMA — Landing Page Builder
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease }}
        className="font-heading font-bold text-[72px] leading-[1.1] tracking-[-0.02em] text-charcoal max-w-[720px]"
      >
        {headline}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease }}
        className="font-sans text-[18px] text-stone leading-[1.7] max-w-[540px] mt-[20px]"
      >
        {subheadline}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32, duration: 0.5, ease }}
        className="mt-8 flex flex-col items-center"
      >
        <motion.a
          href={ctaHref}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className="inline-block bg-wine text-white font-sans font-medium text-[14px] py-[14px] px-[36px] rounded-[2px] transition-colors duration-200 hover:bg-wine-light shadow-none"
        >
          {ctaText}
        </motion.a>
        
        <div className="w-[48px] h-[1px] bg-divider mt-[48px]" />
      </motion.div>
    </section>
  );
}
