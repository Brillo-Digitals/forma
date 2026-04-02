"use client";

import { X } from "lucide-react";
import { TEMPLATES } from "@/templates";
import { useBuilderStore } from "@/store/builderStore";
import { SectionProps } from "@/types";

interface TemplateGalleryProps {
  onClose: () => void;
}

export default function TemplateGallery({ onClose }: TemplateGalleryProps) {
  const { loadTemplate } = useBuilderStore();

  const TEMPLATE_THEME: Record<string, { preview: string; chip: string; button: string }> = {
    blank: {
      preview: "bg-gradient-to-br from-slate-100 via-white to-zinc-100",
      chip: "bg-slate-900/80 text-white",
      button: "bg-slate-900 hover:bg-slate-800 text-white",
    },
    startup: {
      preview: "bg-gradient-to-br from-cyan-100 via-sky-100 to-indigo-100",
      chip: "bg-cyan-900/80 text-cyan-50",
      button: "bg-cyan-700 hover:bg-cyan-800 text-white",
    },
    agency: {
      preview: "bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100",
      chip: "bg-amber-900/80 text-amber-50",
      button: "bg-amber-700 hover:bg-amber-800 text-white",
    },
    travel: {
      preview: "bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100",
      chip: "bg-emerald-900/80 text-emerald-50",
      button: "bg-emerald-700 hover:bg-emerald-800 text-white",
    },
    health: {
      preview: "bg-gradient-to-br from-green-100 via-lime-100 to-emerald-100",
      chip: "bg-green-900/80 text-green-50",
      button: "bg-green-700 hover:bg-green-800 text-white",
    },
    realestate: {
      preview: "bg-gradient-to-br from-stone-200 via-zinc-100 to-neutral-200",
      chip: "bg-zinc-900/80 text-zinc-50",
      button: "bg-zinc-800 hover:bg-zinc-900 text-white",
    },
  };

  const handleUseTemplate = (sections: SectionProps[]) => {
    // Generate new unique IDs for the template sections so that if a user uses a template multiple times, IDs don't collide
    const newSections = sections.map((s) => ({
      ...s,
      id: `${s.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));
    loadTemplate(newSections);
    onClose();
  };

  const renderMiniPreview = (id: string) => {
    switch (id) {
      case "travel":
        return (
          <div className="relative z-10 mt-5 space-y-2">
            <div className="h-[30px] rounded-md bg-white/85 border border-white/70" />
            <div className="grid grid-cols-3 gap-1.5">
              <div className="h-[22px] rounded bg-white/70" />
              <div className="h-[22px] rounded bg-white/60" />
              <div className="h-[22px] rounded bg-white/55" />
            </div>
            <div className="h-[8px] rounded-full bg-white/75 w-[62%]" />
          </div>
        );
      case "health":
        return (
          <div className="relative z-10 mt-5 space-y-2">
            <div className="h-[10px] rounded-full bg-white/85 w-[68%]" />
            <div className="h-[8px] rounded-full bg-white/70 w-[48%]" />
            <div className="grid grid-cols-2 gap-2">
              <div className="h-[26px] rounded-md bg-white/70" />
              <div className="h-[26px] rounded-md bg-white/60" />
            </div>
            <div className="h-[18px] rounded bg-white/55" />
          </div>
        );
      case "realestate":
        return (
          <div className="relative z-10 mt-5 space-y-2">
            <div className="h-[34px] rounded-md bg-white/85 border border-white/70" />
            <div className="h-[8px] rounded-full bg-white/70 w-[54%]" />
            <div className="grid grid-cols-2 gap-2">
              <div className="h-[24px] rounded bg-white/65" />
              <div className="h-[24px] rounded bg-white/55" />
            </div>
          </div>
        );
      case "blank":
        return (
          <div className="relative z-10 mt-6 border border-dashed border-slate-400/50 bg-white/55 rounded-md h-[64px] flex items-center justify-center">
            <span className="text-[10px] tracking-[0.08em] uppercase text-slate-500">Empty Canvas</span>
          </div>
        );
      default:
        return (
          <div className="relative z-10 mt-8 space-y-2">
            <div className="h-[9px] bg-white/85 rounded-full w-[74%]" />
            <div className="h-[8px] bg-white/70 rounded-full w-[58%]" />
            <div className="h-[8px] bg-white/60 rounded-full w-[66%]" />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[rgba(19,24,33,0.62)] backdrop-blur-[3px]">
      <div className="bg-white w-full max-w-[980px] max-h-[88vh] overflow-y-auto flex flex-col pointer-events-auto rounded-[12px] border border-slate-200 shadow-[0_40px_80px_rgba(15,23,42,0.22)]">
        
        {/* Header */}
        <div className="px-8 py-6 flex items-center justify-between border-b border-slate-200 shrink-0 sticky top-0 bg-white/95 backdrop-blur z-10">
          <div>
            <h2 className="font-heading font-bold text-[32px] text-slate-900 tracking-tight">
              Choose a Template
            </h2>
            <p className="text-[13px] text-slate-500 mt-1">Pick a polished starting point and customize every detail.</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 transition-colors p-1 rounded-full hover:bg-slate-100">
            <X size={24} />
          </button>
        </div>

        {/* Gallery */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.08),_transparent_40%)]">
          {TEMPLATES.map((template) => {
            const theme = TEMPLATE_THEME[template.id] || TEMPLATE_THEME.startup;

            return (
              <div
                key={template.id}
                className="group flex flex-col rounded-[10px] border border-slate-200 bg-white overflow-hidden shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(15,23,42,0.16)]"
              >
                {/* Thumbnail Area */}
                <div className={`h-[158px] ${theme.preview} relative border-b border-slate-200 p-4`}>
                  <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.65) 0%, transparent 45%), linear-gradient(0deg, rgba(15,23,42,0.06), rgba(15,23,42,0.02))" }} />
                  <div className="relative z-10 flex items-start justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] tracking-[0.08em] uppercase font-semibold ${theme.chip}`}>
                      {template.id}
                    </span>
                    <span className="text-[11px] text-slate-700 font-medium bg-white/70 rounded-full px-2 py-1">
                      {template.sections.length} Section{template.sections.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {renderMiniPreview(template.id)}
                </div>
                
                {/* Info Area */}
                <div className="px-5 py-4 flex flex-col flex-1 gap-2">
                  <h3 className="font-heading font-bold text-[18px] text-slate-900 leading-tight">
                    {template.title}
                  </h3>
                  <p className="font-sans text-[13px] text-slate-600 leading-relaxed flex-1">
                    {template.description}
                  </p>
                </div>

                {/* Action */}
                <button
                  onClick={() => handleUseTemplate(template.sections)}
                  className={`w-full font-sans text-[13px] py-3 transition-colors mt-auto ${theme.button}`}
                >
                  Use Template
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
