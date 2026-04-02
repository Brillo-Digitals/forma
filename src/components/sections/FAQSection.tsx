"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSectionProps {
  headline?: string;
  faqs?: FAQItem[];
  bgColor?: string;
  bgImage?: string;
}

function FAQItem({ item, index }: { item: FAQItem; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-divider last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className="font-heading font-bold text-[20px] text-charcoal group-hover:text-wine transition-colors pr-8">
          {item.question}
        </span>
        <span className="shrink-0 text-wine">
          {open ? <Minus size={20} /> : <Plus size={20} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="font-sans text-[15px] text-stone pb-6 leading-relaxed max-w-[600px]">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection({
  headline = "Frequently asked questions",
  faqs = [
    { question: "How do I get started?", answer: "Sign up and create your first project in under 2 minutes. No credit card required." },
    { question: "Is there a free plan?", answer: "Yes — our Starter plan is free forever with up to 3 projects and basic features." },
    { question: "Can I export my pages?", answer: "Absolutely. Export clean, production-ready HTML/CSS with one click at any time." },
    { question: "Do you offer team plans?", answer: "Yes. Our Pro plan supports unlimited team members with role-based permissions." },
  ],
  bgColor = "var(--color-cream)",
  bgImage,
}: FAQSectionProps) {
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
      <div className="max-w-[720px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading font-bold text-[40px] text-charcoal mb-12"
        >
          {headline}
        </motion.h2>

        <div>
          {faqs.map((item, i) => (
            <FAQItem key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
