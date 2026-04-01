"use client";

import { useBuilderStore } from "@/store/builderStore";
import { SectionType } from "@/types";
import { Layout, Layers, MessageSquare, Tag, PanelBottom, Undo2, Redo2 } from "lucide-react";

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
  { type: "footer", icon: <PanelBottom size={18} />, label: "Footer" },
];

export default function Toolbar() {
  const { sections, addSection, undo, redo, historyIndex, history } = useBuilderStore();

  const handleAddSection = (type: SectionType) => {
    addSection(type);
  };

  return (
    <div className="flex flex-col h-full py-4 relative group/toolbar">
      <div className="flex-1 flex flex-col items-center gap-2">
        {SECTION_ITEMS.map((item) => {
          const isActive = sections.some((s) => s.type === item.type);
          return (
            <div key={item.type} className="relative group">
              <button
                onClick={() => handleAddSection(item.type)}
                className={`p-3 rounded transition-all duration-180 flex items-center justify-center 
                  ${isActive ? "text-gold" : "text-white/50 hover:text-white hover:bg-white/5"}
                `}
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
        })}
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
  );
}
