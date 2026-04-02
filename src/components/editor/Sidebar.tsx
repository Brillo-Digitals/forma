"use client";

import { useBuilderStore } from "@/store/builderStore";
import { X, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

const HIDDEN_PROPS = new Set(["features", "testimonials", "tiers", "plans", "faqs", "logos"]);

const FONT_FAMILY_OPTIONS = [
  "inherit",
  "Georgia, serif",
  "Times New Roman, serif",
  "Helvetica, Arial, sans-serif",
  "Arial, sans-serif",
  "Verdana, sans-serif",
  "Tahoma, sans-serif",
  "Trebuchet MS, sans-serif",
  "Courier New, monospace",
  "monospace",
];

export default function Sidebar() {
  const [tab, setTab] = useState<"props" | "layers">("props");
  const { 
    sections, selectedId, selectedElementId, selectedSectionForElement, 
    selectSection, selectElement, updateSectionProp, updateSectionStyle, deleteSection, duplicateSection,
    updateElement, updateElementStyle, deleteElement, duplicateElement, convertSectionToFreeformContent,
    currentViewport
  } = useBuilderStore();

  const activeSectionId = selectedSectionForElement || selectedId;
  const section = sections.find((s) => s.id === activeSectionId);
  const element = section?.elements?.find((e) => e.id === selectedElementId);

  if (!section) {
    return (
      <div className="p-6 text-stone font-sans text-[13px]">
        Select a section or element to edit its properties.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative font-sans bg-white border-l border-divider w-full">
      {/* Header Tabs */}
      <div className="h-[52px] border-b border-divider flex items-center shrink-0">
        <button
          onClick={() => setTab("props")}
          className={`px-6 h-full flex items-center text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors ${tab === "props" ? "text-wine border-b-2 border-wine" : "text-stone hover:text-charcoal"}`}
        >
          Properties
        </button>
        <button
          onClick={() => setTab("layers")}
          className={`px-6 h-full flex items-center text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors ${tab === "layers" ? "text-wine border-b-2 border-wine" : "text-stone hover:text-charcoal"}`}
        >
          Layers
        </button>
        <button onClick={() => selectSection(null)} className="ml-auto px-4 text-stone hover:text-charcoal transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto w-full">
        {tab === "props" ? (
          element ? (
            <ElementPropertiesPanel
              sectionId={section.id}
              element={element}
              viewport={currentViewport}
              updateElement={updateElement}
              updateElementStyle={updateElementStyle}
              deleteElement={deleteElement}
              duplicateElement={duplicateElement}
              sections={sections}
            />
          ) : (
            <SectionPropertiesPanel
              id={section.id}
              type={section.type}
              props={section.props}
              style={section.style}
              viewport={currentViewport}
              updateSectionProp={updateSectionProp}
              updateSectionStyle={updateSectionStyle}
              convertSectionToFreeformContent={convertSectionToFreeformContent}
              deleteSection={deleteSection}
              duplicateSection={duplicateSection}
              selectSection={selectSection}
            />
          )
        ) : (
          <div className="p-4 flex flex-col gap-2">
            <div className="font-heading font-semibold text-[14px] text-wine mb-2">PAGE HIERARCHY</div>
            {sections.map(s => (
              <div key={s.id} className="flex flex-col gap-1 w-full">
                <div 
                  onClick={() => selectSection(s.id)}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${activeSectionId === s.id && !selectedElementId ? "bg-wine/10 text-wine" : "hover:bg-charcoal/5"}`}
                >
                  <span className="text-[12px] font-semibold">{s.type.toUpperCase()} SECTION</span>
                </div>
                {s.elements && s.elements.length > 0 && (
                  <div className="ml-4 pl-2 border-l border-divider flex flex-col gap-1">
                    {[...s.elements].reverse().map(e => (
                      <div
                        key={e.id}
                        onClick={() => selectElement(s.id, e.id)}
                        className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition-colors ${selectedElementId === e.id ? "bg-wine/10 text-wine" : "hover:bg-charcoal/5"}`}
                      >
                         <span className="text-[12px] text-charcoal flex items-center gap-2">
                           <span className="text-[10px] text-stone w-4 capitalize">{e.type.charAt(0)}</span>
                           {e.content ? (e.content.slice(0,16)+(e.content.length>16?"...":"")) : `${e.type} block`}
                         </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// SECTION PROPERTIES PANEL
function SectionPropertiesPanel({ id, type, props, style, viewport, updateSectionProp, updateSectionStyle, convertSectionToFreeformContent, deleteSection, duplicateSection, selectSection }: {
  id: string;
  type: string;
  props: Record<string, unknown>;
  style?: Record<string, Record<string, unknown>>;
  viewport: string;
  updateSectionProp: (id: string, key: string, value: unknown) => void;
  updateSectionStyle: (id: string, key: string, value: unknown, viewport: string) => void;
  convertSectionToFreeformContent: (id: string) => void;
  deleteSection: (id: string) => void;
  duplicateSection: (id: string) => void;
  selectSection: (id: string | null) => void;
}) {
  const scalarProps = Object.entries(props).filter(([key]) => !HIDDEN_PROPS.has(key));
  const secStyle = { ...(style?.desktop || {}), ...(viewport !== 'desktop' ? style?.[viewport] || {} : {}) };
  const freeformContentEnabled = Boolean(props.freeformContent);

  const handleStyleChange = (key: string, value: any) => updateSectionStyle(id, key, value, viewport);
  const bgImageValue = typeof props.bgImage === "string" ? props.bgImage : "";

  const handleBgImageFileSelect = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateSectionProp(id, "bgImage", reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-5 p-6 pb-20 h-full overflow-y-auto">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between mb-2 border-b border-divider pb-4">
        <span className="text-[14px] font-bold text-wine capitalize">{type} Section</span>
        <span className="text-[10px] bg-charcoal/5 px-2 py-1 rounded text-stone uppercase">{viewport}</span>
      </div>

      {/* STYLING SECTION */}
      <div className="border-t border-divider pt-4">
        <div className="text-[11px] font-semibold text-wine tracking-widest uppercase mb-4">Styling</div>
        
        {/* Background Color */}
        <div className="flex flex-col gap-2 mb-4">
          <label className="text-[11px] uppercase tracking-[0.1em] text-stone">Background Color</label>
          <div className="flex items-center gap-3">
            <div className="relative w-7 h-7 border border-divider cursor-pointer shrink-0">
              <div className="w-full h-full" style={{ backgroundColor: secStyle.backgroundColor || "#FDFAF8" }} />
              <input
                type="color"
                value={secStyle.backgroundColor || "#FDFAF8"}
                onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
            <input
              type="text"
              value={secStyle.backgroundColor || ""}
              onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
              className="font-mono text-[12px] text-charcoal bg-transparent border-none outline-none flex-1"
              placeholder="#FDFAF8"
            />
          </div>
        </div>

        {/* Padding */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase text-stone tracking-wide">Padding Top</label>
            <input type="number" value={secStyle.paddingTop ?? 0} onChange={e => handleStyleChange("paddingTop", Number(e.target.value))}
              className="w-full text-[13px] border border-divider px-2 py-1 outline-none focus:border-wine" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase text-stone tracking-wide">Padding Bottom</label>
            <input type="number" value={secStyle.paddingBottom ?? 0} onChange={e => handleStyleChange("paddingBottom", Number(e.target.value))}
              className="w-full text-[13px] border border-divider px-2 py-1 outline-none focus:border-wine" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase text-stone tracking-wide">Padding Left</label>
            <input type="number" value={secStyle.paddingLeft ?? 0} onChange={e => handleStyleChange("paddingLeft", Number(e.target.value))}
              className="w-full text-[13px] border border-divider px-2 py-1 outline-none focus:border-wine" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase text-stone tracking-wide">Padding Right</label>
            <input type="number" value={secStyle.paddingRight ?? 0} onChange={e => handleStyleChange("paddingRight", Number(e.target.value))}
              className="w-full text-[13px] border border-divider px-2 py-1 outline-none focus:border-wine" />
          </div>
        </div>

        {/* Height */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase text-stone tracking-wide">Min Height</label>
            <input type="number" value={secStyle.minHeight ?? 600} onChange={e => handleStyleChange("minHeight", Number(e.target.value))}
              className="w-full text-[13px] border border-divider px-2 py-1 outline-none focus:border-wine" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase text-stone tracking-wide">Max Height</label>
            <input type="number" value={secStyle.maxHeight ?? ""} onChange={e => handleStyleChange("maxHeight", e.target.value ? Number(e.target.value) : undefined)}
              className="w-full text-[13px] border border-divider px-2 py-1 outline-none focus:border-wine" placeholder="none" />
          </div>
        </div>

        {/* Opacity & Border Radius */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase text-stone tracking-wide">Opacity</label>
            <input type="number" step="0.1" min="0" max="1" value={secStyle.opacity ?? 1} onChange={e => handleStyleChange("opacity", Number(e.target.value))}
              className="w-full text-[13px] border border-divider px-2 py-1 outline-none focus:border-wine" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase text-stone tracking-wide">Border Radius</label>
            <input type="number" value={secStyle.borderRadius ?? 0} onChange={e => handleStyleChange("borderRadius", Number(e.target.value))}
              className="w-full text-[13px] border border-divider px-2 py-1 outline-none focus:border-wine" />
          </div>
        </div>

        {/* Border */}
        <div className="flex flex-col gap-1 mb-4">
          <label className="text-[10px] uppercase text-stone tracking-wide">Border</label>
          <input type="text" value={secStyle.border || ""} onChange={e => handleStyleChange("border", e.target.value || undefined)}
            className="w-full text-[13px] border border-divider px-2 py-1 outline-none focus:border-wine" placeholder="e.g. 1px solid #ddd" />
        </div>

        {/* Box Shadow */}
        <div className="flex flex-col gap-1 mb-4">
          <label className="text-[10px] uppercase text-stone tracking-wide">Box Shadow</label>
          <input type="text" value={secStyle.boxShadow || ""} onChange={e => handleStyleChange("boxShadow", e.target.value || undefined)}
            className="w-full text-[13px] border border-divider px-2 py-1 outline-none focus:border-wine" placeholder="0 2px 8px rgba(0,0,0,0.1)" />
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="border-t border-divider pt-4">
        <div className="text-[11px] font-semibold text-wine tracking-widest uppercase mb-4">Content</div>

        <div className="mb-4 border border-divider p-3 bg-charcoal/[0.02]">
          <p className="text-[12px] text-stone mb-2 leading-relaxed">
            {freeformContentEnabled
              ? "Section content is in draggable element mode. Select items on the canvas to edit text, links, buttons, and images."
              : "Convert this section's default text/buttons/images into draggable elements."}
          </p>
          <button
            onClick={() => convertSectionToFreeformContent(id)}
            className="text-[12px] px-3 py-1.5 bg-wine text-white hover:bg-wine-light transition-colors"
          >
            {freeformContentEnabled ? "Regenerate Draggable Content" : "Make Content Draggable"}
          </button>
        </div>

        <div className="flex flex-col gap-2 pb-4 border-b border-divider">
          <label className="text-[11px] uppercase tracking-[0.1em] text-stone flex items-center gap-1.5">
            <ImageIcon size={12} /> Background Image
          </label>
          <input
            type="text"
            value={bgImageValue}
            onChange={(e) => updateSectionProp(id, "bgImage", e.target.value || undefined)}
            placeholder="Paste image URL..."
            className="w-full font-sans text-[13px] text-charcoal border border-divider focus:border-wine focus:outline-none px-3 py-2"
          />
          <label className="text-[10px] uppercase tracking-[0.1em] text-stone mt-1">Upload From Computer</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleBgImageFileSelect(e.target.files?.[0] || null)}
            className="w-full text-[12px] border border-divider px-2 py-2 outline-none file:mr-3 file:border-0 file:bg-wine/10 file:text-wine file:px-2 file:py-1"
          />
          {bgImageValue && (
            <div className="relative h-[80px] w-full overflow-hidden border border-divider mt-2">
              <img src={bgImageValue} alt="bg preview" className="w-full h-full object-cover" />
              <button
                onClick={() => updateSectionProp(id, "bgImage", undefined)}
                className="absolute top-1 right-1 bg-white/80 text-charcoal p-1 text-[11px] hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>

        {scalarProps.map(([key, value]) => {
          const isColor = typeof value === "string" && (value.startsWith("#") || value.startsWith("var("));
          const isBoolean = typeof value === "boolean";
          const isUrl = key.toLowerCase().includes("href") || key.toLowerCase().includes("url");
          const isText = typeof value === "string" && !isColor && !isUrl;

          return (
            <div key={key} className="flex flex-col gap-2 mb-4">
              <label className="text-[11px] uppercase tracking-[0.1em] text-stone">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </label>

              {isText && (
                <textarea
                  value={value as string}
                  onChange={(e) => updateSectionProp(id, key, e.target.value)}
                  className="w-full font-sans text-[13px] text-charcoal border border-divider focus:border-wine focus:outline-none p-[10px] resize-none"
                  rows={key === "headline" ? 2 : 3}
                />
              )}
              {isUrl && (
                <input
                  type="url"
                  value={value as string}
                  onChange={(e) => updateSectionProp(id, key, e.target.value)}
                  className="w-full font-sans text-[13px] text-charcoal border border-divider focus:border-wine focus:outline-none px-3 py-2"
                />
              )}
              {isColor && (
                <div className="flex items-center gap-3">
                  <div className="relative w-7 h-7 border border-divider cursor-pointer shrink-0">
                    <div className="w-full h-full" style={{ backgroundColor: value as string }} />
                    <input
                      type="color"
                      value={(value as string).startsWith("var(") ? "#fdfaf8" : value as string}
                      onChange={(e) => updateSectionProp(id, key, e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                  <input
                    type="text"
                    value={value as string}
                    onChange={(e) => updateSectionProp(id, key, e.target.value)}
                    className="font-mono text-[12px] text-charcoal bg-transparent border-none outline-none flex-1"
                  />
                </div>
              )}
              {isBoolean && (
                <button
                  onClick={() => updateSectionProp(id, key, !value)}
                  className={`relative inline-flex h-[20px] w-[36px] items-center rounded-full transition-colors duration-200 ${value ? "bg-wine" : "bg-divider"}`}
                >
                  <span className={`inline-block h-[16px] w-[16px] rounded-full bg-white transition-transform duration-200 shadow-sm ${value ? "translate-x-[18px]" : "translate-x-[2px]"}`} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* ACTIONS */}
      <div className="mt-4 border-t border-divider pt-4 flex items-center justify-between">
        <button onClick={() => duplicateSection(id)} className="text-[12px] text-stone hover:text-charcoal transition-all">Duplicate</button>
        <button onClick={() => { deleteSection(id); selectSection(null); }} className="text-[12px] text-wine hover:underline transition-all">Delete Section</button>
      </div>
    </div>
  );
}

// ELEMENT PROPERTIES PANEL
function ElementPropertiesPanel({ sectionId, element, viewport, updateElement, updateElementStyle, deleteElement, duplicateElement }: {
  sectionId: string;
  element: any;
  viewport: string;
  updateElement: (sectionId: string, elementId: string, updates: any) => void;
  updateElementStyle: (sectionId: string, elementId: string, key: string, value: any, viewport: string) => void;
  deleteElement: (sectionId: string, elementId: string) => void;
  duplicateElement: (sectionId: string, elementId: string) => void;
}) {
  const st = { ...element.style.desktop, ...(viewport !== 'desktop' ? element.style[viewport] || {} : {}) };

  const handleStyle = (k: string, v: any) => updateElementStyle(sectionId, element.id, k, v, viewport);
  const handleLink = (k: string, v: any) => {
    const newLink = { ...(element.link || { type: 'url', value: '', openInNewTab: false, underline: false, color: '', hoverColor: '', hoverUnderline: false }), [k]: v };
    updateElement(sectionId, element.id, { link: newLink });
  };

  const handleImageFileSelect = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateElement(sectionId, element.id, { src: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-6 p-6 pb-24 h-full relative">
      <div className="flex items-center justify-between mb-2 border-b border-divider pb-4">
        <span className="text-[14px] font-bold text-wine capitalize">{element.type} Element</span>
        <span className="text-[10px] bg-charcoal/5 px-2 py-1 rounded text-stone uppercase">{viewport}</span>
      </div>

      {element.type === 'image' && (
        <div className="flex flex-col gap-2">
          <label className="text-[11px] uppercase tracking-[0.1em] text-stone">Image Source</label>
          <input type="text" value={element.src || ""} onChange={e => updateElement(sectionId, element.id, { src: e.target.value })}
            className="w-full text-[13px] border border-divider px-3 py-2 outline-none focus:border-wine" placeholder="https://..." />
          <label className="text-[10px] uppercase tracking-[0.1em] text-stone mt-2">Upload From Computer</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageFileSelect(e.target.files?.[0] || null)}
            className="w-full text-[12px] border border-divider px-2 py-2 outline-none file:mr-3 file:border-0 file:bg-wine/10 file:text-wine file:px-2 file:py-1"
          />
        </div>
      )}

      {(element.type === 'text' || element.type === 'button') && (
        <div className="flex flex-col gap-2">
          <label className="text-[11px] uppercase tracking-[0.1em] text-stone">Content</label>
          <textarea value={element.content || ""} onChange={e => updateElement(sectionId, element.id, { content: e.target.value })}
            className="w-full text-[13px] border border-divider p-2 outline-none focus:border-wine font-sans resize-none" rows={3} />
        </div>
      )}

      {/* POS / SIZE */}
      <div className="grid grid-cols-2 gap-4">
        {['width', 'height', 'top', 'left'].map(k => (
          <div key={k} className="flex flex-col gap-1">
             <label className="text-[10px] uppercase text-stone tracking-wide">{k}</label>
             <input type="number" value={st[k] ?? ''} onChange={e => handleStyle(k, Number(e.target.value))}
               className="w-full text-[13px] border border-divider px-2 py-1 outline-none" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
           <label className="text-[10px] uppercase text-stone tracking-wide">z-index</label>
           <input type="number" value={st.zIndex ?? 1} onChange={e => handleStyle('zIndex', Number(e.target.value))}
             className="w-full text-[13px] border border-divider px-2 py-1 outline-none" />
        </div>
        <div className="flex flex-col gap-1">
           <label className="text-[10px] uppercase text-stone tracking-wide">Opacity</label>
           <input type="number" step="0.1" min="0" max="1" value={st.opacity ?? 1} onChange={e => handleStyle('opacity', Number(e.target.value))}
             className="w-full text-[13px] border border-divider px-2 py-1 outline-none" />
        </div>
      </div>

      {/* SPACING */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
           <label className="text-[10px] uppercase text-stone tracking-wide">Padding</label>
           <input type="text" value={st.padding || ""} onChange={e => handleStyle('padding', e.target.value)}
             className="w-full text-[13px] border border-divider px-2 py-1 outline-none" placeholder="10px 20px" />
        </div>
        <div className="flex flex-col gap-1">
           <label className="text-[10px] uppercase text-stone tracking-wide">Border Radius</label>
           <input type="number" value={st.borderRadius ?? 0} onChange={e => handleStyle('borderRadius', Number(e.target.value))}
             className="w-full text-[13px] border border-divider px-2 py-1 outline-none" />
        </div>
      </div>

      {/* TYPOGRAPHY */}
      {(element.type === 'text' || element.type === 'button') && (
        <div className="flex flex-col gap-4 border-t border-divider pt-4">
          <div className="text-[11px] font-semibold text-wine tracking-widest uppercase">Typography</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
               <label className="text-[10px] uppercase text-stone">Size</label>
               <input type="number" value={st.fontSize ?? 16} onChange={e => handleStyle('fontSize', Number(e.target.value))} className="w-full border p-1 text-[13px]" />
            </div>
            <div className="flex flex-col gap-1">
               <label className="text-[10px] uppercase text-stone">Weight</label>
               <select value={st.fontWeight || "400"} onChange={e => handleStyle('fontWeight', e.target.value)} className="w-full border p-1 text-[13px]">
                 <option value="300">Light</option><option value="400">Regular</option><option value="500">Medium</option><option value="600">SemiBold</option><option value="700">Bold</option>
               </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
               <label className="text-[10px] uppercase text-stone">Color</label>
               <div className="flex items-center gap-2">
                 <div className="relative w-7 h-7 border border-divider cursor-pointer shrink-0">
                   <div className="w-full h-full" style={{ backgroundColor: st.color || '#000' }} />
                   <input type="color" value={st.color || '#000'} onChange={e => handleStyle('color', e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                 </div>
                 <input type="text" value={st.color || ''} onChange={e => handleStyle('color', e.target.value)} className="flex-1 border p-1 text-[12px] font-mono" />
               </div>
            </div>
            <div className="flex flex-col gap-1">
               <label className="text-[10px] uppercase text-stone">Align</label>
               <select value={st.textAlign || "left"} onChange={e => handleStyle('textAlign', e.target.value)} className="w-full border p-1 text-[13px]">
                 <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
               </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
             <label className="text-[10px] uppercase text-stone">Font Family</label>
             <select
               value={st.fontFamily || "inherit"}
               onChange={e => handleStyle('fontFamily', e.target.value)}
               className="w-full border p-1 text-[13px]"
             >
               {FONT_FAMILY_OPTIONS.map((family) => (
                 <option key={family} value={family}>{family}</option>
               ))}
             </select>
          </div>
        </div>
      )}

      {/* BACKGROUND & BORDERS */}
      {element.type !== 'text' && (
        <div className="flex flex-col gap-4 border-t border-divider pt-4">
          <div className="text-[11px] font-semibold text-wine tracking-widest uppercase">Appearance</div>
          <div className="flex flex-col gap-1">
             <label className="text-[10px] uppercase text-stone">Background Color</label>
             <div className="flex items-center gap-2">
               <div className="relative w-7 h-7 border border-divider cursor-pointer shrink-0">
                 <div className="w-full h-full" style={{ backgroundColor: st.backgroundColor || 'transparent' }} />
                 <input type="color" value={st.backgroundColor && !st.backgroundColor.includes('transparent') ? st.backgroundColor : '#ffffff'} onChange={e => handleStyle('backgroundColor', e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
               </div>
               <input type="text" value={st.backgroundColor || ''} onChange={e => handleStyle('backgroundColor', e.target.value)} className="flex-1 border p-1 text-[12px] font-mono" placeholder="transparent" />
             </div>
          </div>
          <div className="flex flex-col gap-1">
             <label className="text-[10px] uppercase text-stone">Border</label>
             <input type="text" value={st.border || ''} onChange={e => handleStyle('border', e.target.value)} className="w-full border p-1 text-[12px]" placeholder="1px solid #ddd" />
          </div>
          <div className="flex flex-col gap-1">
             <label className="text-[10px] uppercase text-stone">Box Shadow</label>
             <input type="text" value={st.boxShadow || ''} onChange={e => handleStyle('boxShadow', e.target.value)} className="w-full border p-1 text-[12px]" placeholder="0 2px 8px rgba(0,0,0,0.1)" />
          </div>
        </div>
      )}

      {/* LINK SECTION */}
      {(element.type === 'text' || element.type === 'button') && (
        <div className="flex flex-col gap-4 border-t border-divider pt-4">
          <div className="text-[11px] font-semibold text-wine tracking-widest uppercase">Link</div>
          <div className="flex flex-col gap-1">
             <label className="text-[10px] uppercase text-stone">Type</label>
             <select value={element.link?.type || 'url'} onChange={e => handleLink('type', e.target.value)} className="w-full border p-1 text-[13px]">
               <option value="url">External URL</option>
               <option value="section">Jump to Section</option>
               <option value="email">Email</option>
               <option value="phone">Phone</option>
             </select>
          </div>
          <div className="flex flex-col gap-1">
             <label className="text-[10px] uppercase text-stone">Value</label>
             <input type="text" value={element.link?.value || ''} onChange={e => handleLink('value', e.target.value)} className="w-full border p-1 text-[13px]" placeholder="https://..." />
          </div>
          <button onClick={() => handleLink('openInNewTab', !element.link?.openInNewTab)} className={`relative inline-flex h-[20px] w-[36px] items-center rounded-full transition-colors ${element.link?.openInNewTab ? "bg-wine" : "bg-divider"}`}>
            <span className={`inline-block h-[16px] w-[16px] rounded-full bg-white transition-transform ${element.link?.openInNewTab ? "translate-x-[18px]" : "translate-x-[2px]"}`} />
          </button>
          <span className="text-[11px] text-stone">Open in New Tab</span>
        </div>
      )}

      {/* DELETE / DUPLICATE */}
      <div className="mt-auto border-t border-divider pt-6 flex items-center justify-between">
        <button onClick={() => duplicateElement(sectionId, element.id)} className="text-[12px] text-stone hover:text-charcoal transition-all">Duplicate</button>
        <button onClick={() => deleteElement(sectionId, element.id)} className="text-[12px] text-wine hover:underline transition-all">Delete Element</button>
      </div>
    </div>
  );
}
