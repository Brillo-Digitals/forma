"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { useBuilderStore } from "@/store/builderStore";
import { SectionProps } from "@/types";
import { motion } from "framer-motion";
import { generateId } from "@/utils/generateId";

interface Props {
  onClose: () => void;
  onShowToast: (msg: string, isError?: boolean) => void;
}

// --- Mock generation: keyword-aware layout builder ---
function buildMockSections(prompt: string): SectionProps[] {
  const p = prompt.toLowerCase();
  const has = (k: string) => p.includes(k);

  const sections: SectionProps[] = [];

  // Always add a hero
  const headline = has("saas") ? "The Smarter Way to Work"
    : has("skincare") || has("beauty") ? "Luxury Meets Science"
    : has("agency") ? "We Build Brands That Matter"
    : has("food") || has("restaurant") ? "Taste the Difference"
    : has("fitness") || has("gym") ? "Train Harder. Live Better."
    : has("finance") || has("fintech") ? "Your Money, Working Harder"
    : "Built for What Comes Next";

  const subheadline = has("saas") ? "Automate your workflow and ship 3× faster."
    : has("skincare") || has("beauty") ? "Dermatologist-tested. Naturally elegant."
    : has("agency") ? "From strategy to execution, we own results."
    : has("food") || has("restaurant") ? "Farm-fresh ingredients, expertly crafted."
    : has("fitness") || has("gym") ? "Join 10,000+ members transforming their lives."
    : has("finance") || has("fintech") ? "Smart tools for smarter financial decisions."
    : "The platform built for ambitious teams ready to scale.";

  sections.push({
    id: generateId(), type: "hero", order: 0,
    props: {
      headline,
      subheadline,
      ctaText: has("saas") ? "Start Free Trial" : has("agency") ? "See Our Work" : "Get Started",
      ctaHref: "#",
    }
  });

  // Features
  sections.push({
    id: generateId(), type: "features", order: 1,
    props: {
      headline: has("saas") ? "Everything you need" : has("agency") ? "How we deliver" : "Why teams choose us",
      features: [
        {
          icon: "⚡",
          title: has("saas") ? "Lightning Fast" : has("agency") ? "Strategy First" : "Purpose-Built",
          description: "Designed from the ground up for performance and clarity at every stage."
        },
        {
          icon: "🎯",
          title: has("saas") ? "Precision Targeting" : has("agency") ? "Creative Excellence" : "Results Driven",
          description: "Every decision backed by data and tailored to your specific goals."
        },
        {
          icon: "🔒",
          title: has("saas") ? "Enterprise-Grade Security" : has("agency") ? "Reliable Delivery" : "Trusted by Many",
          description: "Built with the highest standards so you can focus on growing."
        }
      ]
    }
  });

  // Testimonials
  if (!has("minimal") && !has("simple")) {
    sections.push({
      id: generateId(), type: "testimonials", order: 2,
      props: {
        headline: "Loved by customers",
        testimonials: [
          { quote: "This transformed how our team operates. We shipped our MVP in 2 weeks.", author: "Amara B.", role: "Founder" },
          { quote: "The attention to detail is unlike anything else I've used.", author: "Chris M.", role: "Product Lead" }
        ]
      }
    });
  }

  // Pricing — only for saas/tool
  if (has("saas") || has("tool") || has("software") || has("app") || has("platform")) {
    sections.push({
      id: generateId(), type: "pricing", order: sections.length,
      props: {
        headline: "Simple, transparent pricing",
        plans: [
          { name: "Starter", price: "$0", period: "/ month", features: ["Up to 3 projects", "Basic analytics", "Email support"], cta: "Get Started" },
          { name: "Pro", price: "$49", period: "/ month", features: ["Unlimited projects", "Advanced analytics", "Priority support", "Team collaboration"], cta: "Start Trial", featured: true },
        ]
      }
    });
  }

  // Footer always
  sections.push({
    id: generateId(), type: "footer", order: sections.length,
    props: {
      brandName: prompt.split(" ").slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      tagline: "Built with care. Designed to last."
    }
  });

  return sections;
}

export default function AIGeneratorModal({ onClose, onShowToast }: Props) {
  const [prompt, setPrompt] = useState("");
  const { setGenerating, loadTemplate } = useBuilderStore();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setGenerating(true);
    onClose();

    const isDummy = !process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY ||
      process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY === "dummy";

    if (isDummy) {
      // Build a real mock layout from the prompt keywords
      setTimeout(() => {
        const mockSections = buildMockSections(prompt);
        loadTemplate(mockSections);
        setGenerating(false);
        onShowToast("Page generated. Review and refine.");
      }, 2800);
      return;
    }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("Generation request failed");

      const data = await res.json();
      if (data.sections && Array.isArray(data.sections)) {
        loadTemplate(data.sections);
        onShowToast("Page generated. Review and refine.");
      } else {
        throw new Error("Invalid output layout");
      }
    } catch (err) {
      console.error(err);
      onShowToast("Generation failed. Try again.", true);
    } finally {
      setGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleGenerate();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="bg-cream w-full max-w-[540px] relative shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-stone hover:text-charcoal transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-10 flex flex-col items-center">
          <div className="text-wine mb-4 flex items-center justify-center bg-wine/10 w-12 h-12 rounded-full">
            <Sparkles size={24} />
          </div>
          <h2 className="font-heading font-bold text-[28px] text-charcoal mb-2">
            Describe your page
          </h2>
          <p className="text-[13px] text-stone mb-6 text-center">
            Describe your product or brand and we'll build the layout for you.
          </p>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. A landing page for a luxury skincare brand in Lagos."
            rows={4}
            autoFocus
            className="w-full border border-divider focus:border-wine outline-none bg-white font-sans text-[14px] text-charcoal p-4 mb-2 resize-none transition-colors"
          />
          <p className="text-[11px] text-stone/60 self-start mb-6">⌘ + Enter to generate</p>

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim()}
            className="bg-wine text-white font-sans text-[13px] px-8 py-3 rounded-none hover:bg-wine-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full flex items-center justify-center gap-2"
          >
            <Sparkles size={16} /> Generate Layout
          </button>
        </div>
      </motion.div>
    </div>
  );
}
