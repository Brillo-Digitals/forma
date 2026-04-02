"use client";

import { motion } from "framer-motion";

export interface CTABannerProps {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaHref?: string;
  bgColor?: string;
  bgImage?: string;
}

export default function CTABanner({
  headline = "Start building today.",
  subheadline = "Join thousands of teams already shipping better landing pages.",
  ctaText = "Get Started Free",
  ctaHref = "#",
  bgColor = "#2A2A2A",
  bgImage,
}: CTABannerProps) {
  return (
    <section
      className="w-full py-[96px] px-4"
      style={{
        backgroundColor: bgColor,
        backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-[720px] mx-auto flex flex-col items-center text-center gap-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading font-bold text-[48px] md:text-[56px] text-white leading-[1.1]"
        >
          {headline}
        </motion.h2>

        {subheadline && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans text-[16px] text-white/60 max-w-[480px]"
          >
            {subheadline}
          </motion.p>
        )}

        <motion.a
          href={ctaHref}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.22, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          whileTap={{ scale: 0.97 }}
          className="inline-block bg-white text-charcoal font-sans font-medium text-[14px] py-[14px] px-[36px] rounded-[2px] hover:bg-cream transition-colors duration-200"
        >
          {ctaText}
        </motion.a>

        <p className="font-sans text-[12px] text-white/30">
          No credit card required · Cancel anytime
        </p>
      </div>
    </section>
  );
}
