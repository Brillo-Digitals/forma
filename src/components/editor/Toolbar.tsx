"use client";

import { useBuilderStore } from "@/store/builderStore";
import { SectionType, ElementType } from "@/types";
import { Layout, Layers, MessageSquare, Tag, PanelBottom, Undo2, Redo2, Sparkles, Award, Megaphone, HelpCircle, Type, ImageIcon, MousePointerClick, SquareDashed } from "lucide-react";
import { useState } from "react";
import AIGeneratorModal from "./AIGeneratorModal";
import { useDraggable } from "@dnd-kit/core";

interface ToolbarItem {
  type: SectionType;
  icon: React.ReactNode;
  label: string;
}

const SECTION_ITEMS: ToolbarItem[] = [
  { type: "hero", icon: <Layout size={18} />, label: "Hero" },
  { type: "features", icon: <Layers size={18} />, label: "Features" },
  { type: "testimonials", icon: <MessageSquare size={18} />, label: "Testimonials" },
  { type: "pricing", icon: <Tag size={18} />, label: "Pricing" },
  { type: "logobar", icon: <Award size={18} />, label: "Logo Bar" },
  { type: "cta", icon: <Megaphone size={18} />, label: "CTA Banner" },
  { type: "faq", icon: <HelpCircle size={18} />, label: "FAQ" },
  { type: "footer", icon: <PanelBottom size={18} />, label: "Footer" },
];

const ELEMENT_ITEMS: { type: ElementType; icon: React.ReactNode; label: string }[] = [
  { type: "text", icon: <Type size={18} />, label: "Text" },
  { type: "image", icon: <ImageIcon size={18} />, label: "Image" },
  { type: "button", icon: <MousePointerClick size={18} />, label: "Button" },
  { type: "container", icon: <SquareDashed size={18} />, label: "Container" },
];

// Individual draggable toolbar button
function DraggableToolbarItem({ item, onClick }: { item: ToolbarItem; onClick: () => void }) {
  const { sections } = useBuilderStore();
  const isActive = sections.some((s) => s.type === item.type);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `toolbar-${item.type}`,
    data: { type: item.type, fromToolbar: true },
  });

  return (
    <div className="relative group">
      <button
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        onClick={onClick}
        title={`Drag or click to add ${item.label}`}
        className={`p-3 rounded transition-all duration-180 flex items-center justify-center select-none
          ${isDragging ? "opacity-40 scale-95" : ""}
          ${isActive ? "text-gold" : "text-white/50 hover:text-white hover:bg-white/5"}
        `}
        style={{ touchAction: "none" }}
      >
        {item.icon}
      </button>

      {/* Tooltip */}
      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-180 z-50 whitespace-nowrap">
        <div className="bg-charcoal text-white font-sans text-[12px] px-[10px] py-[6px] shadow-lg">
          {item.label}
        </div>
      </div>
    </div>
  );
}

export default function Toolbar() {
  const { sections, addSection, undo, redo, historyIndex, history } = useBuilderStore();
  const [showAI, setShowAI] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleAddSection = (type: SectionType) => {
    addSection(type);
  };

  const targetSectionId = useBuilderStore(s => s.selectedId || s.selectedSectionForElement);
  const addElement = useBuilderStore(s => s.addElement);

  const handleAddElement = (type: ElementType) => {
    if (targetSectionId) {
      addElement(targetSectionId, type);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full py-4 relative group/toolbar">
        <div className="flex-1 flex flex-col items-center gap-2">

          {/* AI Generator Trigger */}
          <div className="relative group mb-4">
            <button
              onClick={() => setShowAI(true)}
              className="p-3 rounded transition-all duration-180 flex items-center justify-center bg-wine/20 text-wine hover:bg-wine hover:text-white"
            >
              <Sparkles size={18} />
            </button>
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-180 z-50 whitespace-nowrap">
              <div className="bg-charcoal text-white font-sans text-[12px] px-[10px] py-[6px] shadow-lg">
                AI Generate
              </div>
            </div>
          </div>

          <div className="w-[32px] h-[1px] bg-white/10 mx-auto mb-4 shrink-0" />

          {SECTION_ITEMS.map((item) => (
            <DraggableToolbarItem
              key={item.type}
              item={item}
              onClick={() => handleAddSection(item.type)}
            />
          ))}

          {targetSectionId && (
            <>
              <div className="w-[32px] h-[1px] bg-white/10 mx-auto my-4 shrink-0" />
              {ELEMENT_ITEMS.map((item) => (
                <div key={item.type} className="relative group">
                  <button
                    onClick={() => handleAddElement(item.type)}
                    title={`Add ${item.label}`}
                    className="p-3 rounded transition-all duration-180 flex items-center justify-center select-none text-white/50 hover:text-white hover:bg-white/5"
                  >
                    {item.icon}
                  </button>
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-180 z-50 whitespace-nowrap">
                    <div className="bg-charcoal text-white font-sans text-[12px] px-[10px] py-[6px] shadow-lg">
                      Add {item.label}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="w-[32px] h-[1px] bg-white/10 mx-auto my-4 shrink-0" />

        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="relative group">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-3 rounded transition-all duration-180 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Undo2 size={18} />
            </button>
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-180 z-50 whitespace-nowrap">
              <div className="bg-charcoal text-white font-sans text-[12px] px-[10px] py-[6px] shadow-lg">
                Undo
              </div>
            </div>
          </div>

          <div className="relative group">
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-3 rounded transition-all duration-180 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Redo2 size={18} />
            </button>
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-180 z-50 whitespace-nowrap">
              <div className="bg-charcoal text-white font-sans text-[12px] px-[10px] py-[6px] shadow-lg">
                Redo
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAI && (
        <AIGeneratorModal
          onClose={() => setShowAI(false)}
          onShowToast={showToast}
        />
      )}

      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-white font-sans text-[13px] px-6 py-3 shadow-lg z-50 rounded-[2px] bg-charcoal">
          {toastMsg}
        </div>
      )}
    </>
  );
}
