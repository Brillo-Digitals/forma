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
import { SectionType } from "@/types";
import { useState } from "react";
import { Layout, Layers, MessageSquare, Tag, PanelBottom } from "lucide-react";
import SectionBlock from "./SectionBlock";
import HeroSection from "../sections/HeroSection";
import FeaturesSection from "../sections/FeaturesSection";
import TestimonialsSection from "../sections/TestimonialsSection";
import PricingSection from "../sections/PricingSection";
import FooterSection from "../sections/FooterSection";

const SECTION_ICONS: Record<SectionType, React.ReactNode> = {
  hero: <Layout size={20} />,
  features: <Layers size={20} />,
  testimonials: <MessageSquare size={20} />,
  pricing: <Tag size={20} />,
  footer: <PanelBottom size={20} />,
};

export function renderSection(section: any) {
  switch (section.type) {
    case "hero":         return <HeroSection {...section.props} />;
    case "features":     return <FeaturesSection {...section.props} />;
    case "testimonials": return <TestimonialsSection {...section.props} />;
    case "pricing":      return <PricingSection {...section.props} />;
    case "footer":       return <FooterSection {...section.props} />;
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
