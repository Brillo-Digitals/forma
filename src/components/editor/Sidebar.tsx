"use client";

import { useBuilderStore } from "@/store/builderStore";
import { X } from "lucide-react";

export default function Sidebar() {
  const { sections, selectedId, selectSection, updateSectionProp, deleteSection } = useBuilderStore();

  const selectedSection = sections.find((s) => s.id === selectedId);

  if (!selectedSection) {
    return (
      <div className="p-6 text-stone font-sans text-[13px]">
        Select a section to edit its properties.
      </div>
    );
  }

  const { id, type, props } = selectedSection;

  return (
    <div className="flex flex-col h-full relative font-sans">
      {/* Header */}
      <div className="h-[52px] border-b border-divider flex items-center justify-between px-6 shrink-0 bg-white">
        <div className="font-semibold text-[13px] uppercase tracking-[0.08em] text-charcoal">
          {type}
        </div>
        <button onClick={() => selectSection(null)} className="text-stone hover:text-charcoal transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Controls */}
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-[24px]">
        {Object.entries(props).map(([key, value]) => {
           // We infer type: boolean = toggle, color strings (startsWith('#')) = color picker, text = textarea.
           const isColor = typeof value === 'string' && value.startsWith('#');
           const isBoolean = typeof value === 'boolean';
           const isText = typeof value === 'string' && !isColor;
           
           return (
             <div key={key} className="flex flex-col gap-2">
               <label className="text-[11px] uppercase tracking-[0.1em] text-stone">
                 {key.replace(/([A-Z])/g, ' $1').trim()}
               </label>
               {isText && (
                 <textarea
                   value={value}
                   onChange={(e) => updateSectionProp(id, key, e.target.value)}
                   className="w-full font-sans text-[14px] text-charcoal border border-divider focus:border-wine focus:outline-none p-[10px] resize-none"
                   rows={3}
                 />
               )}
               {isColor && (
                 <div className="flex items-center gap-3">
                   <div className="relative w-6 h-6 border border-divider cursor-pointer">
                     <div className="w-full h-full" style={{ backgroundColor: value }} />
                     <input
                       type="color"
                       value={value}
                       onChange={(e) => updateSectionProp(id, key, e.target.value)}
                       className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                     />
                   </div>
                   <input
                     type="text"
                     value={value}
                     onChange={(e) => updateSectionProp(id, key, e.target.value)}
                     className="font-mono text-[12px] text-charcoal bg-transparent border-none outline-none w-20"
                   />
                 </div>
               )}
               {isBoolean && (
                 <button
                   onClick={() => updateSectionProp(id, key, !value)}
                   className={`relative inline-flex h-[20px] w-[36px] items-center rounded-full transition-colors duration-200 ${value ? 'bg-wine' : 'bg-divider'}`}
                 >
                   <span
                     className={`inline-block h-[16px] w-[16px] rounded-full bg-white transition-transform duration-200 shadow-sm ${value ? 'translate-x-[18px]' : 'translate-x-[2px]'}`}
                   />
                 </button>
               )}
             </div>
           );
        })}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-divider shrink-0">
        <button
          onClick={() => {
            deleteSection(id);
            selectSection(null);
          }}
          className="text-[13px] text-wine hover:underline transition-all"
        >
          Delete Section
        </button>
      </div>
    </div>
  );
}
