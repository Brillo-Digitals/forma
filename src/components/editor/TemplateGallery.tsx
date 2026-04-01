"use client";

import { X } from "lucide-react";
import { TEMPLATES } from "@/templates";
import { useBuilderStore } from "@/store/builderStore";

interface TemplateGalleryProps {
  onClose: () => void;
}

export default function TemplateGallery({ onClose }: TemplateGalleryProps) {
  const { loadTemplate } = useBuilderStore();

  const handleUseTemplate = (sections: any[]) => {
    // Generate new unique IDs for the template sections so that if a user uses a template multiple times, IDs don't collide
    const newSections = sections.map((s) => ({
      ...s,
      id: `${s.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));
    loadTemplate(newSections);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[rgba(42,34,40,0.7)]">
      <div className="bg-white w-full max-w-[780px] max-h-[85vh] overflow-y-auto flex flex-col pointer-events-auto">
        
        {/* Header */}
        <div className="px-8 py-6 flex items-center justify-between border-b border-divider shrink-0 sticky top-0 bg-white z-10">
          <h2 className="font-heading font-bold text-[32px] text-charcoal tracking-tight">
            Choose a Template
          </h2>
          <button onClick={onClose} className="text-stone hover:text-charcoal transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Gallery */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEMPLATES.map((template) => (
            <div key={template.id} className="flex flex-col border border-divider group">
              {/* Thumbnail Area */}
              <div className="h-[140px] bg-wine-muted flex items-center justify-center border-b border-divider transition-colors group-hover:bg-[#EBE2E5]">
                <span className="font-sans text-[13px] text-stone">
                  {template.sections.length} Section{template.sections.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              {/* Info Area */}
              <div className="px-5 py-4 flex flex-col flex-1 gap-1">
                <h3 className="font-sans font-semibold text-[14px] text-charcoal">
                  {template.title}
                </h3>
                <p className="font-sans text-[13px] text-stone leading-relaxed flex-1">
                  {template.description}
                </p>
              </div>

              {/* Action */}
              <button
                onClick={() => handleUseTemplate(template.sections)}
                className="w-full bg-wine text-white font-sans text-[13px] py-3 hover:bg-wine-light transition-colors mt-auto"
              >
                Use Template
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
