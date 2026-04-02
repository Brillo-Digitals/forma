"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useBuilderStore } from "@/store/builderStore";
import { Trash2, GripVertical, Copy, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SectionBlockProps {
  id: string;
  children: React.ReactNode;
  overlay?: boolean;
}

export default function SectionBlock({ id, children, overlay = false }: SectionBlockProps) {
  const {
    selectedId, sections, selectSection, deleteSection, duplicateSection, moveSection
  } = useBuilderStore();
  const [isHovered, setIsHovered] = useState(false);

  const {
    attributes, listeners, setNodeRef, setActivatorNodeRef,
    transform, transition, isDragging, over,
  } = useSortable({ id });

  const isSelected = selectedId === id;
  const section = sections.find((s) => s.id === id);
  const typeLabel = section?.type.toUpperCase() || "SECTION";
  const idx = sections.findIndex(s => s.id === id);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging && !overlay ? 0.3 : 1,
  };

  // Keyboard shortcuts when selected
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isSelected || overlay) return;
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      deleteSection(id);
      selectSection(null);
    }
    if (e.key === "ArrowUp" && e.altKey) {
      e.preventDefault();
      moveSection(id, "up");
    }
    if (e.key === "ArrowDown" && e.altKey) {
      e.preventDefault();
      moveSection(id, "down");
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "d") {
      e.preventDefault();
      duplicateSection(id);
    }
  }, [isSelected, id, overlay, deleteSection, selectSection, moveSection, duplicateSection]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Border logic
  let borderStyle = "1px solid transparent";
  if (overlay) {
    borderStyle = "none";
  } else if (isSelected) {
    borderStyle = "2px solid var(--color-wine)";
  } else if (isHovered && !isDragging) {
    borderStyle = "1px dashed var(--color-divider)";
  }

  const isDropTarget = over?.id === id && !isDragging;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative w-full cursor-auto transition-colors duration-200 ${isDropTarget ? "border-t-[3px] border-t-wine" : ""}`}
      onClick={(e) => {
        if (overlay) return;
        e.stopPropagation();
        selectSection(id);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ border: borderStyle }} className="relative pointer-events-auto h-full w-full">
        {/* Type Label */}
        <AnimatePresence>
          {isSelected && !overlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.6, 1] }}
              transition={{ duration: 0.5 }}
              className="absolute top-0 left-0 bg-wine text-white font-sans text-[11px] px-2 py-1 z-10"
              style={{ transform: "translate(-2px, -100%)" }}
            >
              {typeLabel}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drag Handle */}
        {!overlay && (
          <div
            ref={setActivatorNodeRef}
            {...listeners}
            {...attributes}
            className={`absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 p-2 
              cursor-grab active:cursor-grabbing text-stone hover:text-wine transition-opacity duration-200
              ${isHovered || isSelected ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <GripVertical size={18} />
          </div>
        )}

        {/* Hover / Selected Controls */}
        {!overlay && (
          <AnimatePresence>
            {(isHovered || isSelected) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute top-2 right-2 z-10 flex gap-1.5"
              >
                {/* Move Up */}
                <button
                  onClick={(e) => { e.stopPropagation(); moveSection(id, "up"); }}
                  disabled={idx === 0}
                  className="bg-white border border-divider p-1.5 rounded shadow-sm hover:bg-cream text-stone hover:text-charcoal transition-colors disabled:opacity-30 pointer-events-auto"
                  title="Move up (⌥↑)"
                >
                  <ChevronUp size={14} />
                </button>
                {/* Move Down */}
                <button
                  onClick={(e) => { e.stopPropagation(); moveSection(id, "down"); }}
                  disabled={idx === sections.length - 1}
                  className="bg-white border border-divider p-1.5 rounded shadow-sm hover:bg-cream text-stone hover:text-charcoal transition-colors disabled:opacity-30 pointer-events-auto"
                  title="Move down (⌥↓)"
                >
                  <ChevronDown size={14} />
                </button>
                {/* Duplicate */}
                <button
                  onClick={(e) => { e.stopPropagation(); duplicateSection(id); }}
                  className="bg-white border border-divider p-1.5 rounded shadow-sm hover:bg-cream text-stone hover:text-charcoal transition-colors pointer-events-auto"
                  title="Duplicate (⌘D)"
                >
                  <Copy size={14} />
                </button>
                {/* Delete */}
                <button
                  onClick={(e) => { e.stopPropagation(); deleteSection(id); selectSection(null); }}
                  className="bg-white border border-divider p-1.5 rounded shadow-sm hover:bg-red-50 text-stone hover:text-red-500 transition-colors pointer-events-auto"
                  title="Delete (⌫)"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        <div className={overlay ? "pointer-events-none" : ""}>
          {children}
        </div>
      </div>
    </div>
  );
}
