"use client";

import { motion } from "framer-motion";
import { LayoutGrid, MousePointer2, Download } from "lucide-react";

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface FeaturesSectionProps {
  label?: string;
  subtitle?: string;
  title?: string;
  features?: FeatureItem[];
  bgColor?: string;
  cardBgColor?: string;
  accentColor?: string;
  headlineColor?: string;
  bodyColor?: string;
}

const defaultFeatures: FeatureItem[] = [
  {
    id: "f1",
    title: "Drag & Compose",
    description: "Rearrange sections with precision. Every movement intentional.",
    iconName: "LayoutGrid"
  },
  {
    id: "f2",
    title: "Live Editing",
    description: "Click any element to edit it. Changes reflect in real time.",
    iconName: "MousePointer2"
  },
  {
    id: "f3",
    title: "Export Ready",
    description: "Export clean HTML/CSS or React components with one click.",
    iconName: "Download"
  }
];

export default function FeaturesSection({
  label = "WHY FORMA",
  subtitle,
  title = "Design Without Compromise",
  features = defaultFeatures,
  bgColor = "#F4F7FF",
  cardBgColor = "#FFFFFF",
  accentColor = "#2563EB",
  headlineColor = "#111827",
  bodyColor = "#475569",
}: FeaturesSectionProps) {
  const sectionLabel = label || subtitle || "WHY FORMA";

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "LayoutGrid": return <LayoutGrid size={20} style={{ color: accentColor }} />;
      case "MousePointer2": return <MousePointer2 size={20} style={{ color: accentColor }} />;
      case "Download": return <Download size={20} style={{ color: accentColor }} />;
      default: return <LayoutGrid size={20} style={{ color: accentColor }} />;
    }
  };

  return (
    <section className="w-full py-[96px] px-4 flex flex-col items-center" style={{ backgroundColor: bgColor }}>
      <div className="w-full max-w-[1200px] flex flex-col items-center text-center">
        <div className="uppercase text-[11px] tracking-[0.14em] mb-6 font-sans" style={{ color: accentColor }}>
          {sectionLabel}
        </div>
        
        <h2 className="font-heading font-bold text-[48px] max-w-[560px] leading-[1.15] mb-16" style={{ color: headlineColor }}>
          {title}
        </h2>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-[32px] text-left">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="p-[24px] shadow-none rounded-none border-l-[2px]"
              style={{ backgroundColor: cardBgColor, borderLeftColor: accentColor }}
            >
              <div className="mb-4">
                {getIcon(feature.iconName)}
              </div>
              <h3 className="font-sans font-semibold text-[15px] mb-2" style={{ color: headlineColor }}>
                {feature.title}
              </h3>
              <p className="font-sans text-[14px] leading-[1.65]" style={{ color: bodyColor }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
