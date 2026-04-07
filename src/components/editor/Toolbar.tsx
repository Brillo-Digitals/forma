"use client";

import { useBuilderStore } from "@/store/builderStore";
import { SectionType, ElementType } from "@/types";
import { Layout, Layers, MessageSquare, Tag, PanelBottom, Undo2, Redo2, Sparkles, Award, Megaphone, HelpCircle, Type, ImageIcon, MousePointerClick, SquareDashed, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useState } from "react";
import AIGeneratorModal from "./AIGeneratorModal";
import { useDraggable } from "@dnd-kit/core";

interface ToolbarItem {
  type: SectionType;
  icon: React.ReactNode;
  label: string;
}

interface ToolbarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
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
function DraggableToolbarItem({ item, onClick, collapsed }: { item: ToolbarItem; onClick: () => void; collapsed: boolean }) {
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
        className={`${collapsed ? "h-10 w-10" : "h-10 w-full px-3"} rounded-[10px] border transition-all duration-200 flex items-center ${collapsed ? "justify-center" : "justify-start gap-2"} select-none
          ${isDragging ? "opacity-45 scale-95" : ""}
          ${isActive
            ? "text-cyan-200 border-cyan-300/40 bg-cyan-400/10 shadow-[0_0_0_1px_rgba(34,211,238,0.15)]"
            : "text-slate-300 border-transparent hover:text-white hover:border-white/15 hover:bg-white/8"}
        `}
        style={{ touchAction: "none" }}
      >
        {item.icon}
        {!collapsed && <span className="text-[12px] font-medium">{item.label}</span>}
      </button>

      {/* Tooltip */}
      {collapsed && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-180 z-50 whitespace-nowrap">
          <div className="bg-slate-900 text-slate-100 font-sans text-[12px] px-[10px] py-[6px] shadow-lg rounded-[6px] border border-slate-700/70">
            {item.label}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Toolbar({ collapsed, onToggleCollapse }: ToolbarProps) {
  const { addSection, undo, redo, historyIndex, history } = useBuilderStore();
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
      <div className="flex flex-col h-full p-2 relative">
        <div className="h-full rounded-[14px] border border-white/10 bg-[linear-gradient(180deg,#1f2430_0%,#161b25_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] flex flex-col py-3 px-2">
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} mb-2`}>
          {!collapsed && <span className="text-[10px] uppercase tracking-[0.12em] text-slate-400 font-semibold">Builder Tools</span>}
          <button
            onClick={onToggleCollapse}
            className="h-8 w-8 rounded-[8px] border border-white/10 text-slate-300 hover:text-white hover:bg-white/8 transition-colors flex items-center justify-center"
            title={collapsed ? "Expand toolbar" : "Collapse toolbar"}
          >
            {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          </button>
        </div>

        <div className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1 flex flex-col ${collapsed ? "items-center" : "items-stretch"} gap-2`}>

          {/* AI Generator Trigger */}
          <div className="relative group mb-2">
            <button
              onClick={() => setShowAI(true)}
              className={`${collapsed ? "h-10 w-10" : "h-10 w-full px-3"} rounded-[10px] transition-all duration-200 flex items-center ${collapsed ? "justify-center" : "justify-start gap-2"} bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950 hover:brightness-110 shadow-[0_6px_14px_rgba(14,165,233,0.35)]`}
            >
              <Sparkles size={18} />
              {!collapsed && <span className="text-[12px] font-semibold">AI Generate</span>}
            </button>
            {collapsed && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-180 z-50 whitespace-nowrap">
                <div className="bg-slate-900 text-slate-100 font-sans text-[12px] px-[10px] py-[6px] shadow-lg rounded-[6px] border border-slate-700/70">
                  AI Generate
                </div>
              </div>
            )}
          </div>

          <span className={`text-[9px] uppercase tracking-[0.14em] text-slate-400 font-semibold mb-1 ${collapsed ? "text-center" : "px-1"}`}>Sections</span>

          <div className={`${collapsed ? "w-[36px]" : "w-full"} h-[1px] bg-white/12 mx-auto mb-3 shrink-0`} />

          {SECTION_ITEMS.map((item) => (
            <DraggableToolbarItem
              key={item.type}
              item={item}
              onClick={() => handleAddSection(item.type)}
              collapsed={collapsed}
            />
          ))}

          {targetSectionId && (
            <>
              <div className={`${collapsed ? "w-[36px]" : "w-full"} h-[1px] bg-white/12 mx-auto my-3 shrink-0`} />
              <span className={`text-[9px] uppercase tracking-[0.14em] text-slate-400 font-semibold mb-1 ${collapsed ? "text-center" : "px-1"}`}>Elements</span>
              {ELEMENT_ITEMS.map((item) => (
                <div key={item.type} className="relative group">
                  <button
                    onClick={() => handleAddElement(item.type)}
                    title={`Add ${item.label}`}
                    className={`${collapsed ? "h-10 w-10" : "h-10 w-full px-3"} rounded-[10px] border border-transparent transition-all duration-200 flex items-center ${collapsed ? "justify-center" : "justify-start gap-2"} select-none text-slate-300 hover:text-white hover:border-white/15 hover:bg-white/8`}
                  >
                    {item.icon}
                    {!collapsed && <span className="text-[12px] font-medium">{item.label}</span>}
                  </button>
                  {collapsed && (
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-180 z-50 whitespace-nowrap">
                      <div className="bg-slate-900 text-slate-100 font-sans text-[12px] px-[10px] py-[6px] shadow-lg rounded-[6px] border border-slate-700/70">
                        Add {item.label}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        <div className={`${collapsed ? "w-[36px]" : "w-full"} h-[1px] bg-white/12 mx-auto my-3 shrink-0`} />
        <span className={`text-[9px] uppercase tracking-[0.14em] text-slate-400 font-semibold mb-2 ${collapsed ? "text-center" : "px-1"}`}>History</span>

        <div className={`flex flex-col ${collapsed ? "items-center" : "items-stretch"} gap-2 shrink-0`}>
          <div className="relative group">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className={`${collapsed ? "h-10 w-10" : "h-10 w-full px-3"} rounded-[10px] border border-transparent transition-all duration-200 flex items-center ${collapsed ? "justify-center" : "justify-start gap-2"} text-slate-300 hover:text-white hover:border-white/15 hover:bg-white/8 disabled:opacity-30 disabled:hover:bg-transparent`}
            >
              <Undo2 size={18} />
              {!collapsed && <span className="text-[12px] font-medium">Undo</span>}
            </button>
            {collapsed && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-180 z-50 whitespace-nowrap">
                <div className="bg-slate-900 text-slate-100 font-sans text-[12px] px-[10px] py-[6px] shadow-lg rounded-[6px] border border-slate-700/70">
                  Undo
                </div>
              </div>
            )}
          </div>

          <div className="relative group">
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className={`${collapsed ? "h-10 w-10" : "h-10 w-full px-3"} rounded-[10px] border border-transparent transition-all duration-200 flex items-center ${collapsed ? "justify-center" : "justify-start gap-2"} text-slate-300 hover:text-white hover:border-white/15 hover:bg-white/8 disabled:opacity-30 disabled:hover:bg-transparent`}
            >
              <Redo2 size={18} />
              {!collapsed && <span className="text-[12px] font-medium">Redo</span>}
            </button>
            {collapsed && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-180 z-50 whitespace-nowrap">
                <div className="bg-slate-900 text-slate-100 font-sans text-[12px] px-[10px] py-[6px] shadow-lg rounded-[6px] border border-slate-700/70">
                  Redo
                </div>
              </div>
            )}
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
