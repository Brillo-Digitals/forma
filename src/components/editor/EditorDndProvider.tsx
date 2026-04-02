"use client";

import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove } from "@dnd-kit/sortable";
import { useBuilderStore } from "@/store/builderStore";
import { SectionType, SectionProps } from "@/types";
import { useState } from "react";
import { Layout, Layers, MessageSquare, Tag, PanelBottom, Megaphone, HelpCircle, Award } from "lucide-react";
import SectionBlock from "./SectionBlock";
import HeroSection from "../sections/HeroSection";
import FeaturesSection from "../sections/FeaturesSection";
import TestimonialsSection from "../sections/TestimonialsSection";
import PricingSection from "../sections/PricingSection";
import FooterSection from "../sections/FooterSection";
import LogoBar from "../sections/LogoBar";
import CTABanner from "../sections/CTABanner";
import FAQSection from "../sections/FAQSection";

const SECTION_ICONS: Record<SectionType, React.ReactNode> = {
  hero: <Layout size={20} />,
  features: <Layers size={20} />,
  testimonials: <MessageSquare size={20} />,
  pricing: <Tag size={20} />,
  footer: <PanelBottom size={20} />,
  logobar: <Award size={20} />,
  cta: <Megaphone size={20} />,
  faq: <HelpCircle size={20} />,
};

export function renderSection(section: SectionProps) {
  const sectionStyle = section.style?.desktop || {};
  
  // Merge with any props-based background
  const combinedStyle = {
    backgroundColor: sectionStyle.backgroundColor || (section.props?.bgColor as string) || undefined,
    backgroundImage: sectionStyle.backgroundImage || (section.props?.bgImage as string) || undefined,
    backgroundSize: sectionStyle.backgroundSize || 'cover',
    backgroundPosition: sectionStyle.backgroundPosition || 'center',
    minHeight: sectionStyle.minHeight || 600,
    padding: sectionStyle.padding || `${sectionStyle.paddingTop || 0}px ${sectionStyle.paddingRight || 0}px ${sectionStyle.paddingBottom || 0}px ${sectionStyle.paddingLeft || 0}px`,
    margin: sectionStyle.margin,
    opacity: sectionStyle.opacity,
    borderRadius: sectionStyle.borderRadius ? `${sectionStyle.borderRadius}px` : undefined,
    border: sectionStyle.border,
    boxShadow: sectionStyle.boxShadow,
  };

  const SectionWrapper = ({ children }: { children: React.ReactNode }) => (
    <div style={combinedStyle}>
      {children}
    </div>
  );

  switch (section.type) {
    case "hero":         return <SectionWrapper><HeroSection {...section.props} /></SectionWrapper>;
    case "features":     return <SectionWrapper><FeaturesSection {...section.props} /></SectionWrapper>;
    case "testimonials": return <SectionWrapper><TestimonialsSection {...section.props} /></SectionWrapper>;
    case "pricing":      return <SectionWrapper><PricingSection {...section.props} /></SectionWrapper>;
    case "footer":       return <SectionWrapper><FooterSection {...section.props} /></SectionWrapper>;
    case "logobar":      return <SectionWrapper><LogoBar {...section.props} /></SectionWrapper>;
    case "cta":          return <SectionWrapper><CTABanner {...section.props} /></SectionWrapper>;
    case "faq":          return <SectionWrapper><FAQSection {...section.props} /></SectionWrapper>;
    default:             return <div>Unknown section</div>;
  }
}

/**
 * Provides a shared DndContext for both Toolbar (drag source) and Canvas (drop target).
 * Must wrap the entire editor body.
 */
export default function EditorDndProvider({ children }: { children: React.ReactNode }) {
  const { sections, reorderSections, addSection } = useBuilderStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragFromToolbar, setDragFromToolbar] = useState<SectionType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.fromToolbar) {
      setDragFromToolbar(e.active.data.current.type as SectionType);
      setActiveId(null);
    } else {
      setActiveId(e.active.id as string);
      setDragFromToolbar(null);
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (active.data.current?.fromToolbar) {
      if (over) addSection(active.data.current.type as SectionType);
      setDragFromToolbar(null);
      return;
    }

    setActiveId(null);
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      reorderSections(arrayMove(sections, oldIndex, newIndex));
    }
  };

  const activeSection = sections.find((s) => s.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={dragFromToolbar ? [] : [restrictToVerticalAxis]}
    >
      {children}

      <DragOverlay>
        {activeSection && (
          <div className="opacity-70 border-[2px] border-wine pointer-events-none">
            <SectionBlock id={activeSection.id} overlay>
              {renderSection(activeSection)}
            </SectionBlock>
          </div>
        )}
        {dragFromToolbar && (
          <div className="bg-white border-2 border-dashed border-wine px-10 py-5 text-wine font-heading text-[16px] font-bold shadow-2xl text-center flex items-center gap-3 min-w-[240px]">
            {SECTION_ICONS[dragFromToolbar]}
            {dragFromToolbar.charAt(0).toUpperCase() + dragFromToolbar.slice(1)} Section
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
