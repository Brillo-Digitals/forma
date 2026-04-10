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

const SUGGESTED_PROMPTS = [
  "A landing page for a travel startup offering weekend getaways from Lagos.",
  "A modern SaaS page for a team productivity app with clear pricing.",
  "A conversion-focused page for a fitness coaching brand targeting beginners.",
  "A premium landing page for a real estate company selling waterfront homes.",
];

const ALLOWED_TYPES = new Set(["hero", "features", "testimonials", "pricing", "footer"]);

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
      label: has("saas") ? "PRODUCT CAPABILITIES" : has("agency") ? "DELIVERY PROCESS" : "WHY CHOOSE US",
      title: has("saas") ? "Everything you need" : has("agency") ? "How we deliver" : "Why teams choose us",
      features: [
        {
          iconName: "LayoutGrid",
          title: has("saas") ? "Lightning Fast" : has("agency") ? "Strategy First" : "Purpose-Built",
          description: "Designed from the ground up for performance and clarity at every stage."
        },
        {
          iconName: "MousePointer2",
          title: has("saas") ? "Precision Targeting" : has("agency") ? "Creative Excellence" : "Results Driven",
          description: "Every decision backed by data and tailored to your specific goals."
        },
        {
          iconName: "Download",
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
        label: "LOVED BY CUSTOMERS",
        testimonials: [
          { quote: "This transformed how our team operates. We shipped our MVP in 2 weeks.", authorName: "Amara B.", authorRole: "Founder" },
          { quote: "The attention to detail is unlike anything else I've used.", authorName: "Chris M.", authorRole: "Product Lead" }
        ]
      }
    });
  }

  // Pricing — only for saas/tool
  if (has("saas") || has("tool") || has("software") || has("app") || has("platform")) {
    sections.push({
      id: generateId(), type: "pricing", order: sections.length,
      props: {
        title: "Simple, transparent pricing",
        tiers: [
          { id: generateId(), name: "Starter", price: "$0/mo", features: ["Up to 3 projects", "Basic analytics", "Email support"], ctaText: "Get Started" },
          { id: generateId(), name: "Pro", price: "$49/mo", features: ["Unlimited projects", "Advanced analytics", "Priority support", "Team collaboration"], ctaText: "Start Trial", isPopular: true },
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

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function toString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function normalizeGeneratedSections(input: unknown): SectionProps[] {
  if (!Array.isArray(input)) return [];

  const normalized = input
    .map((section, index): SectionProps | null => {
      const rawSection = toRecord(section);
      const rawType = toString(rawSection.type).toLowerCase();
      if (!ALLOWED_TYPES.has(rawType)) return null;

      const rawProps = toRecord(rawSection.props);
      let normalizedProps: Record<string, unknown> = { ...rawProps };

      if (rawType === "features") {
        const rawFeatures = Array.isArray(rawProps.features) ? rawProps.features : [];
        normalizedProps = {
          label: toString(rawProps.label, "WHY FORMA"),
          title: toString(rawProps.title || rawProps.headline, "Design Without Compromise"),
          features: rawFeatures.map((item, featureIndex) => {
            const f = toRecord(item);
            const iconName = ["LayoutGrid", "MousePointer2", "Download"][featureIndex % 3];
            return {
              id: toString(f.id, generateId()),
              title: toString(f.title, `Feature ${featureIndex + 1}`),
              description: toString(f.description, "Feature description"),
              iconName: toString(f.iconName || f.icon, iconName),
            };
          }),
        };
      }

      if (rawType === "testimonials") {
        const rawTestimonials = Array.isArray(rawProps.testimonials) ? rawProps.testimonials : [];
        normalizedProps = {
          label: toString(rawProps.label || rawProps.title || rawProps.headline, "WHAT THEY SAY"),
          testimonials: rawTestimonials.map((item, testimonialIndex) => {
            const t = toRecord(item);
            return {
              id: toString(t.id, generateId()),
              quote: toString(t.quote, `Customer quote ${testimonialIndex + 1}`),
              authorName: toString(t.authorName || t.author, "Customer"),
              authorRole: toString(t.authorRole || t.role, ""),
            };
          }),
        };
      }

      if (rawType === "pricing") {
        const rawTiers = Array.isArray(rawProps.tiers)
          ? rawProps.tiers
          : Array.isArray(rawProps.plans)
            ? rawProps.plans
            : [];
        normalizedProps = {
          title: toString(rawProps.title || rawProps.headline, "Simple, Transparent Pricing"),
          tiers: rawTiers.map((item, tierIndex) => {
            const t = toRecord(item);
            return {
              id: toString(t.id, generateId()),
              name: toString(t.name, `Plan ${tierIndex + 1}`),
              price: toString(t.price, "$0/mo"),
              features: Array.isArray(t.features) ? t.features : [],
              ctaText: toString(t.ctaText || t.cta || t.buttonText, "Get Started"),
              ctaHref: toString(t.ctaHref || t.href, "#"),
              isPopular: Boolean(t.isPopular || t.featured),
            };
          }),
        };
      }

      if (rawType === "hero") {
        normalizedProps = {
          headline: toString(rawProps.headline, "Built for What Comes Next"),
          subheadline: toString(rawProps.subheadline, "Launch quickly with polished sections and clear messaging."),
          ctaText: toString(rawProps.ctaText, "Get Started"),
          ctaHref: toString(rawProps.ctaHref, "#"),
        };
      }

      if (rawType === "footer") {
        normalizedProps = {
          brandName: toString(rawProps.brandName, "FORMA"),
          tagline: toString(rawProps.tagline, "Built with care."),
        };
      }

      return {
        id: toString(rawSection.id, generateId()),
        type: rawType as SectionProps["type"],
        order: index,
        props: normalizedProps,
        elements: [],
      };
    })
    .filter((section): section is SectionProps => Boolean(section));

  return normalized.length > 0 ? normalized : [];
}

export default function AIGeneratorModal({ onClose, onShowToast }: Props) {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setGenerating, loadTemplate } = useBuilderStore();

  const handleGenerate = async () => {
    if (!prompt.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setGenerating(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const message = data?.error || "Generation request failed";
        throw new Error(message);
      }

      const normalizedSections = normalizeGeneratedSections(data?.sections);
      if (normalizedSections.length === 0) {
        throw new Error("Invalid output layout");
      }

      loadTemplate(normalizedSections);
      onShowToast("Page generated with AI.");
      onClose();
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Generation request failed";
      const quotaExceeded = /quota|429|rate limit/i.test(msg);
      try {
        const mockSections = normalizeGeneratedSections(buildMockSections(prompt));
        if (mockSections.length === 0) {
          throw new Error("Mock generation failed");
        }
        loadTemplate(mockSections);
        onShowToast(
          quotaExceeded
            ? "Gemini quota exceeded. Loaded a local mock layout instead."
            : "AI request failed. Generated a local mock layout instead."
        );
        onClose();
      } catch {
        onShowToast("Generation failed. Try again.", true);
      }
    } finally {
      setGenerating(false);
      setIsSubmitting(false);
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

          <div className="w-full mb-4">
            <p className="text-[11px] uppercase tracking-[0.08em] text-stone mb-2">Suggested prompts</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPrompt(item)}
                  className="text-left text-[11px] leading-[1.4] bg-white border border-divider px-3 py-2 text-charcoal hover:border-wine/50 hover:bg-wine/5 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. A landing page for a luxury skincare brand in Lagos."
            rows={4}
            autoFocus
            className="w-full border border-divider focus:border-wine outline-none bg-white font-sans text-[14px] text-charcoal p-4 mb-2 resize-none transition-colors"
          />
          <p className="text-[11px] text-stone/60 self-start mb-6">Ctrl/Cmd + Enter to generate</p>

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isSubmitting}
            className="bg-wine text-white font-sans text-[13px] px-8 py-3 rounded-none hover:bg-wine-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full flex items-center justify-center gap-2"
          >
            <Sparkles size={16} /> {isSubmitting ? "Generating with AI..." : "Generate with AI"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
