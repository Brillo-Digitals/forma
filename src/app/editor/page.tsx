"use client";

import { useState } from "react";
import Canvas from "@/components/editor/Canvas";
import Toolbar from "@/components/editor/Toolbar";
import Sidebar from "@/components/editor/Sidebar";
import { Undo2, Redo2, Monitor, Smartphone, LayoutTemplate } from "lucide-react";
import { useBuilderStore } from "@/store/builderStore";
import { AnimatePresence, motion } from "framer-motion";
import TemplateGallery from "@/components/editor/TemplateGallery";
import { exportToHTML } from "@/utils/exportHTML";
import { saveProject } from "@/lib/db";
import { useEffect } from "react";
import AuthGate from "@/components/auth/AuthGate";
import { useAuth } from "@/context/AuthContext";

export default function EditorPage() {
  const { sections, undo, redo, historyIndex, history, selectedId, lastSavedHistoryIndex, markSaved } = useBuilderStore();
  const { user } = useAuth();
  
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [showTemplates, setShowTemplates] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState("Untitled Page");

  const isUnsaved = historyIndex !== lastSavedHistoryIndex;
  
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      const newProjectId = await saveProject(user.uid, pageTitle, sections, projectId);
      setProjectId(newProjectId);
      markSaved();
      showToast("Project saved");
    } catch (error) {
      console.error(error);
      showToast("Save failed");
    }
  };

  // Auto-save every 60 seconds if unsaved
  useEffect(() => {
    const interval = setInterval(() => {
      if (isUnsaved) {
        handleSave();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [isUnsaved, sections, pageTitle, projectId]);

  const handleExport = () => {
    const html = exportToHTML(sections);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "forma-page.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast("Page exported successfully");
  };

  return (
    <AuthGate>
      <div className="flex flex-col h-screen overflow-hidden bg-cream">
      {/* Top Bar */}
      <div className="h-[52px] bg-white border-b border-divider flex items-center justify-between px-6 shrink-0 z-20">
        {/* Left */}
        <div className="font-heading font-bold text-[20px] text-wine">
          FORMA
        </div>

        {/* Center */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
            className="font-sans text-[14px] text-charcoal bg-transparent outline-none text-center hover:bg-black/5 focus:bg-white focus:border-wine px-2 py-1 rounded transition-colors w-[200px]"
          />
          {isUnsaved && (
            <div className="w-2 h-2 rounded-full bg-stone" title="Unsaved changes" />
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border-r border-divider pr-3 mr-1">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded-[2px] hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent text-charcoal transition-colors"
            >
              <Undo2 size={16} />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded-[2px] hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent text-charcoal transition-colors"
            >
              <Redo2 size={16} />
            </button>
          </div>

          <div className="flex items-center gap-1 border-r border-divider pr-3 mr-1">
            <button
              onClick={() => setViewMode("desktop")}
              className={`p-1.5 rounded-[2px] transition-colors ${viewMode === "desktop" ? "bg-black/5 text-charcoal" : "text-stone hover:bg-black/5 hover:text-charcoal"}`}
            >
              <Monitor size={16} />
            </button>
            <button
              onClick={() => setViewMode("mobile")}
              className={`p-1.5 rounded-[2px] transition-colors ${viewMode === "mobile" ? "bg-black/5 text-charcoal" : "text-stone hover:bg-black/5 hover:text-charcoal"}`}
            >
              <Smartphone size={16} />
            </button>
          </div>

            <button
              onClick={() => setShowTemplates(true)}
              className="font-sans flex items-center gap-2 text-[13px] text-charcoal border border-divider px-3 py-1.5 rounded-[2px] transition-colors hover:bg-black/5 mr-2"
            >
              <LayoutTemplate size={14} /> Templates
            </button>

            <button 
              onClick={handleSave} 
              className="font-sans text-[13px] text-charcoal border border-charcoal px-4 py-1.5 rounded-[2px] hover:bg-charcoal hover:text-white transition-colors"
            >
              Save
            </button>
            <button className="font-sans text-[13px] text-charcoal border border-charcoal px-4 py-1.5 rounded-[2px] hover:bg-charcoal hover:text-white transition-colors">
              Preview
            </button>
            <button onClick={handleExport} className="font-sans text-[13px] text-white bg-wine px-4 py-1.5 rounded-[2px] hover:bg-wine-light transition-colors">
              Export
            </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT COLUMN: Toolbar */}
        <div className="w-[64px] shrink-0 bg-charcoal border-r border-white/5 z-10 flex flex-col">
          <Toolbar />
        </div>

        {/* CENTER COLUMN: Canvas */}
        <div className={`flex-1 overflow-y-auto relative transition-colors duration-350 ${viewMode === "mobile" ? "bg-wine-muted" : "bg-cream"}`}>
          {/* Noise overlay */}
          <div className="pointer-events-none absolute inset-0 z-0 opacity-4" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
          
          <div className="relative z-10 w-full h-full flex justify-center py-8">
            <div 
              style={{ width: viewMode === "mobile" ? "390px" : "100%", transition: "width 0.35s ease" }}
              className={`min-h-full bg-cream mx-auto ${viewMode === "mobile" ? "border-x border-divider shadow-sm" : ""}`}
            >
              <Canvas />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar */}
        <AnimatePresence>
          {selectedId && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-[320px] shrink-0 bg-white border-l border-divider z-10 h-full overflow-y-auto overflow-x-hidden"
            >
               <Sidebar />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showTemplates && <TemplateGallery onClose={() => setShowTemplates(false)} />}
      
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 50, opacity: 0 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 text-white font-sans text-[13px] px-6 py-3 shadow-lg z-50 rounded-[2px] ${toastMessage.includes('failed') ? 'bg-red-500' : 'bg-charcoal'}`}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </AuthGate>
  );
}
