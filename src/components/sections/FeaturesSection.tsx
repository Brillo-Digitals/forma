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
  title?: string;
  features?: FeatureItem[];
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
  title = "Design Without Compromise",
  features = defaultFeatures,
}: FeaturesSectionProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "LayoutGrid": return <LayoutGrid size={20} className="text-wine" />;
      case "MousePointer2": return <MousePointer2 size={20} className="text-wine" />;
      case "Download": return <Download size={20} className="text-wine" />;
      default: return <LayoutGrid size={20} className="text-wine" />;
    }
  };

  return (
    <section className="w-full py-[96px] bg-wine-muted px-4 flex flex-col items-center">
      <div className="w-full max-w-[1200px] flex flex-col items-center text-center">
        <div className="uppercase text-[11px] tracking-[0.14em] text-wine mb-6 font-sans">
          {label}
        </div>
        
        <h2 className="font-heading font-bold text-[48px] text-charcoal max-w-[560px] leading-[1.15] mb-16">
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
              className="bg-cream p-[24px] border-l-[2px] border-gold shadow-none rounded-none"
            >
              <div className="mb-4">
                {getIcon(feature.iconName)}
              </div>
              <h3 className="font-sans font-semibold text-[15px] text-charcoal mb-2">
                {feature.title}
              </h3>
              <p className="font-sans text-[14px] text-stone leading-[1.65]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
