"use client";

import { useBuilderStore } from "@/store/builderStore";
import SectionBlock from "./SectionBlock";
import FreeformLayer from "./FreeformLayer";
import { renderSection } from "./EditorDndProvider";
import { Plus } from "lucide-react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

function EmptyDropZone() {
  const { isOver, setNodeRef } = useDroppable({ id: "canvas-empty" });
  return (
    <div
      ref={setNodeRef}
      className={`flex-1 w-full flex flex-col items-center justify-center min-h-[500px] transition-all duration-200 ${isOver ? "bg-wine/5 border-2 border-dashed border-wine/40" : ""}`}
    >
      <Plus size={32} className="mb-4 text-wine" />
      <h2 className="font-heading italic text-[22px] text-stone mb-2">
        {isOver ? "Drop to add section" : "Your canvas is empty."}
      </h2>
      <p className="font-sans text-[14px] text-stone">
        {isOver ? "" : "Drag a section from the toolbar, or click to add."}
      </p>
    </div>
  );
}

// Viewport dimensions
const VIEWPORT_WIDTHS = {
  desktop: 1200,
  tablet: 768,
  mobile: 375,
};

export default function Canvas() {
  const { sections, selectSection, isGenerating, currentViewport } = useBuilderStore();
  const viewportWidth = VIEWPORT_WIDTHS[currentViewport];
  const scale = currentViewport === "desktop" ? 1 : currentViewport === "tablet" ? 0.8 : 0.6;

  if (isGenerating) {
    return (
      <div className="flex flex-col gap-0 w-full min-h-screen">
        {[420, 200, 320, 160].map((h, i) => (
          <div key={i} className="w-full bg-white relative overflow-hidden border-b border-divider/30"
            style={{ height: `${h}px`, opacity: 1 - i * 0.1 }}>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-wine/5 to-transparent animate-[shimmer_1.8s_infinite]"
              style={{ animationDelay: `${i * 0.25}s` }} />
            <div className="p-12 h-full flex flex-col justify-center items-center gap-5 opacity-20">
              {i === 0 && <div className="w-1/4 h-8 bg-charcoal/20 rounded-full" />}
              <div className={`h-4 bg-charcoal/15 rounded-full ${i === 0 ? "w-2/5" : "w-3/5"}`} />
              <div className="w-1/3 h-4 bg-charcoal/10 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col overflow-y-auto overflow-x-auto items-center px-8 py-6 bg-stone/5"
      onClick={() => selectSection(null)}
    >
      {sections.length === 0 ? (
        <EmptyDropZone />
      ) : (
        <div 
          className="w-full flex flex-col"
          style={{
            minWidth: currentViewport === "desktop" ? "100%" : `${viewportWidth}px`,
            transform: currentViewport === "desktop" ? "none" : `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            {sections.map((section) => (
              <div key={section.id} className="relative w-full" style={{
                backgroundColor: currentViewport !== "desktop" ? "white" : "transparent",
                boxShadow: currentViewport !== "desktop" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}>
                <SectionBlock id={section.id}>
                  {renderSection(section)}
                </SectionBlock>
                {/* Freeform element overlay — sits on top of section template */}
                <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
                  <div className="relative w-full h-full">
                    <FreeformLayer
                      sectionId={section.id}
                      elements={section.elements || []}
                    />
                  </div>
                </div>
              </div>
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  );
}
