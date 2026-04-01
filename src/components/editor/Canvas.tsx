"use client";

import { useState } from "react";
import { useBuilderStore } from "@/store/builderStore";
import SectionBlock from "./SectionBlock";
import HeroSection from "../sections/HeroSection";
import FeaturesSection from "../sections/FeaturesSection";
import TestimonialsSection from "../sections/TestimonialsSection";
import PricingSection from "../sections/PricingSection";
import FooterSection from "../sections/FooterSection";
import { Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

export default function Canvas() {
  const { sections, selectSection, reorderSections } = useBuilderStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);

      reorderSections(arrayMove(sections, oldIndex, newIndex));
    }
  };

  const renderSection = (section: any) => {
    switch (section.type) {
      case "hero":
        return <HeroSection {...section.props} />;
      case "features":
        return <FeaturesSection {...section.props} />;
      case "testimonials":
        return <TestimonialsSection {...section.props} />;
      case "pricing":
        return <PricingSection {...section.props} />;
      case "footer":
        return <FooterSection {...section.props} />;
      default:
        return <div>Unknown section format</div>;
    }
  };

  const activeSection = sections.find((s) => s.id === activeId);

  return (
    <div 
      className="w-full h-full flex flex-col overflow-y-auto"
      onClick={() => selectSection(null)}
    >
      {sections.length === 0 ? (
        <div className="flex-1 w-full flex flex-col items-center justify-center min-h-[500px]">
          <Plus size={32} className="text-wine mb-4" />
          <h2 className="font-heading italic text-[22px] text-stone mb-2">
            Your canvas is empty.
          </h2>
          <p className="font-sans text-[14px] text-stone">
            Use the toolbar to add your first section.
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext
            items={sections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {sections.map((section) => (
              <SectionBlock key={section.id} id={section.id}>
                {renderSection(section)}
              </SectionBlock>
            ))}
          </SortableContext>

          <DragOverlay>
            {activeSection ? (
              <div className="opacity-70 border-[2px] border-wine">
                 {/* Ghost element renders identical content */}
                 <SectionBlock id={activeSection.id} overlay>
                   {renderSection(activeSection)}
                 </SectionBlock>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
