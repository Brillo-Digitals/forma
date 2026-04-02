"use client";

import { motion } from "framer-motion";

export interface LogoBarProps {
  label?: string;
  logos?: string[];
  bgColor?: string;
  bgImage?: string;
}

export default function LogoBar({
  label = "TRUSTED BY TEAMS AT",
  logos = ["Acme Corp", "Initech", "Hooli", "Pied Piper", "Globex", "Umbrella"],
  bgColor = "#FFFFFF",
  bgImage,
}: LogoBarProps) {
  return (
    <section
      className="w-full py-[48px] px-4 border-y border-divider/30"
      style={{
        backgroundColor: bgColor,
        backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-[960px] mx-auto flex flex-col items-center gap-8">
        {label && (
          <p className="font-sans text-[11px] tracking-[0.18em] text-stone uppercase">
            {label}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {logos.map((logo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="font-heading font-bold text-[18px] text-charcoal/30 hover:text-charcoal/60 transition-colors cursor-default select-none"
            >
              {logo}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
