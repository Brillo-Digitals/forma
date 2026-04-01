"use client";

import React, { useState } from "react";
import { useBuilderStore } from "@/store/builderStore";
import { Trash2, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SectionBlockProps {
  id: string;
  children: React.ReactNode;
  overlay?: boolean;
}

export default function SectionBlock({ id, children, overlay = false }: SectionBlockProps) {
  const { selectedId, selectSection, deleteSection, sections } = useBuilderStore();
  const [isHovered, setIsHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
    over,
  } = useSortable({ id });

  const isSelected = selectedId === id;
  const section = sections.find((s) => s.id === id);
  const typeLabel = section?.type.toUpperCase() || "SECTION";

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging && !overlay ? 0.3 : 1, // original element opacity
  };

  // Border logic
  let borderStyle = "1px solid transparent";
  if (overlay) {
    borderStyle = "none"; // Handled by Canvas overlay wrapper
  } else if (isSelected) {
    borderStyle = "2px solid var(--color-wine)";
  } else if (isHovered && !isDragging) {
    borderStyle = "1px dashed var(--color-divider)";
  }

  // Drop line indicator
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

        {/* Controls */}
        {!overlay && (
          <div className={`transition-opacity duration-200 absolute top-2 right-2 z-10 flex gap-2 ${!isSelected && isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteSection(id);
              }}
              className="bg-white border border-divider p-2 rounded shadow-sm hover:bg-red-50 text-stone hover:text-red-500 transition-colors pointer-events-auto"
              title="Delete Section"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}

        <div className={overlay ? "pointer-events-none" : ""}>
          {children}
        </div>
      </div>
    </div>
  );
}
