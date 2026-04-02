import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  SectionProps, SectionType, FreeformElement, ElementType,
  ElementStyle, PageState, DEFAULT_PAGE, ViewportType, SectionStyle,
} from '@/types';
import { generateId } from '@/utils/generateId';

type BuilderStore = PageState & {
  // Section ops
  addSection: (type: SectionType) => void;
  deleteSection: (id: string) => void;
  duplicateSection: (id: string) => void;
  moveSection: (id: string, direction: 'up' | 'down') => void;
  selectSection: (id: string | null) => void;
  updateSectionProp: (id: string, key: string, value: any) => void;
  updateSectionStyle: (id: string, key: keyof SectionStyle, value: any, viewport?: ViewportType) => void;
  reorderSections: (newOrder: SectionProps[]) => void;
  loadTemplate: (sections: SectionProps[]) => void;
  markSaved: () => void;
  // Element ops
  selectElement: (sectionId: string | null, elementId: string | null) => void;
  addElement: (sectionId: string, type: ElementType) => void;
  updateElement: (sectionId: string, elementId: string, updates: Partial<FreeformElement>) => void;
  updateElementStyle: (sectionId: string, elementId: string, key: keyof ElementStyle, value: any, viewport?: ViewportType) => void;
  deleteElement: (sectionId: string, elementId: string) => void;
  duplicateElement: (sectionId: string, elementId: string) => void;
  // Editor state
  setViewport: (viewport: ViewportType) => void;
  setDragging: (isDragging: boolean) => void;
  setGenerating: (isGenerating: boolean) => void;
  // History
  undo: () => void;
  redo: () => void;
};

const MAX_HISTORY = 50;

const getDefaultProps = (type: SectionType): Record<string, any> => {
  switch (type) {
    case 'hero':         return { headline: 'New Hero', subheadline: 'Add your text here', ctaText: 'Click Me', bgColor: 'var(--color-cream)' };
    case 'features':     return { title: 'Our Features', label: 'FEATURES', features: [] };
    case 'testimonials': return { label: 'TESTIMONIALS', testimonials: [] };
    case 'pricing':      return { title: 'Simple Pricing', tiers: [] };
    case 'footer':       return { brandName: 'YOUR BRAND', tagline: 'Built with FORMA.' };
    case 'logobar':      return { label: 'TRUSTED BY', logos: ['Acme Corp', 'Initech', 'Hooli', 'Pied Piper', 'Globex'] };
    case 'cta':          return { headline: 'Ready to get started?', subheadline: 'Join thousands of teams already using the platform.', ctaText: 'Start Free Trial', ctaHref: '#', bgColor: 'var(--color-charcoal)' };
    case 'faq':          return { headline: 'Frequently asked questions', faqs: [
      { question: 'How do I get started?', answer: 'Sign up and create your first project in under 2 minutes.' },
      { question: 'Is there a free plan?', answer: 'Yes — our Starter plan is free forever with up to 3 projects.' },
      { question: 'Can I export my pages?', answer: 'Absolutely. Export clean HTML/CSS with one click at any time.' },
    ]};
    default: return {};
  }
};

const getDefaultElementStyle = (type: ElementType): ElementStyle => {
  switch (type) {
    case 'text':      return { top: 80, left: 80, width: 280, height: 60, zIndex: 1, fontSize: 18, color: '#2A2A2A', fontWeight: '400' };
    case 'button':    return { top: 80, left: 80, width: 180, height: 50, zIndex: 1, backgroundColor: '#7A2535', color: '#FFFFFF', fontSize: 14, borderRadius: 2 };
    case 'image':     return { top: 80, left: 80, width: 320, height: 200, zIndex: 1, borderRadius: 4 };
    case 'container': return { top: 80, left: 80, width: 320, height: 160, zIndex: 1, backgroundColor: 'transparent', border: '1px solid #E0DBD4' };
    default:          return { top: 80, left: 80, width: 200, height: 60, zIndex: 1 };
  }
};

function saveHistory(state: any) {
  let newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(JSON.parse(JSON.stringify(state.sections)));
  if (newHistory.length > MAX_HISTORY) newHistory.shift();
  state.history = newHistory;
  state.historyIndex = newHistory.length - 1;
}

function findSection(state: any, sectionId: string): SectionProps | undefined {
  return state.sections.find((s: SectionProps) => s.id === sectionId);
}

export const useBuilderStore = create<BuilderStore>()(
  immer((set, get) => ({
    sections: [DEFAULT_PAGE],
    selectedId: null,
    selectedElementId: null,
    selectedSectionForElement: null,
    currentViewport: 'desktop',
    isDragging: false,
    isGenerating: false,
    history: [[DEFAULT_PAGE]],
    historyIndex: 0,
    lastSavedHistoryIndex: 0,

    setDragging: (isDragging) => set((state) => { state.isDragging = isDragging; }),
    setGenerating: (isGenerating) => set((state) => { state.isGenerating = isGenerating; }),
    setViewport: (viewport) => set((state) => { state.currentViewport = viewport; }),

    selectSection: (id) => set((state) => {
      state.selectedId = id;
      state.selectedElementId = null;
      state.selectedSectionForElement = null;
    }),

    selectElement: (sectionId, elementId) => set((state) => {
      state.selectedElementId = elementId;
      state.selectedSectionForElement = sectionId;
      state.selectedId = null;
      // Bring element to front (max z-index)
      if (sectionId && elementId) {
        const section = findSection(state, sectionId);
        if (section?.elements) {
          const maxZ = Math.max(0, ...section.elements.map(e => e.style.desktop.zIndex || 1));
          const el = section.elements.find(e => e.id === elementId);
          if (el) el.style.desktop.zIndex = maxZ + 1;
        }
      }
    }),

    addSection: (type) => set((state) => {
      const newSection: SectionProps = {
        id: generateId(),
        type,
        props: getDefaultProps(type),
        order: state.sections.length,
        elements: [],
      };
      state.sections.push(newSection);
      state.selectedId = newSection.id;
      state.selectedElementId = null;
      saveHistory(state);
    }),

    deleteSection: (id) => set((state) => {
      state.sections = state.sections.filter(s => s.id !== id);
      if (state.selectedId === id) state.selectedId = null;
      if (state.selectedSectionForElement === id) {
        state.selectedElementId = null;
        state.selectedSectionForElement = null;
      }
      saveHistory(state);
    }),

    duplicateSection: (id) => set((state) => {
      const idx = state.sections.findIndex(s => s.id === id);
      if (idx === -1) return;
      const clone: SectionProps = {
        ...JSON.parse(JSON.stringify(state.sections[idx])),
        id: generateId(),
        order: state.sections[idx].order + 0.5,
      };
      state.sections.splice(idx + 1, 0, clone);
      state.sections = state.sections.map((s, i) => ({ ...s, order: i }));
      state.selectedId = clone.id;
      saveHistory(state);
    }),

    moveSection: (id, direction) => set((state) => {
      const idx = state.sections.findIndex(s => s.id === id);
      if (idx === -1) return;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= state.sections.length) return;
      const sections = [...state.sections];
      [sections[idx], sections[targetIdx]] = [sections[targetIdx], sections[idx]];
      state.sections = sections.map((s, i) => ({ ...s, order: i }));
      saveHistory(state);
    }),

    updateSectionProp: (id, key, value) => set((state) => {
      const section = findSection(state, id);
      if (section) section.props[key] = value;
      saveHistory(state);
    }),

    updateSectionStyle: (id, key, value, viewport = 'desktop') => set((state) => {
      const section = findSection(state, id);
      if (!section) return;
      if (!section.style) section.style = {};
      if (!section.style[viewport]) section.style[viewport] = {};
      (section.style[viewport] as any)[key] = value;
      saveHistory(state);
    }),

    reorderSections: (newOrder) => set((state) => {
      state.sections = newOrder.map((s, i) => ({ ...s, order: i }));
      saveHistory(state);
    }),

    loadTemplate: (newSections) => set((state) => {
      state.sections = newSections;
      state.selectedId = null;
      state.selectedElementId = null;
      saveHistory(state);
    }),

    markSaved: () => set((state) => {
      state.lastSavedHistoryIndex = state.historyIndex;
    }),

    // --- Element ops ---
    addElement: (sectionId, type) => set((state) => {
      const section = findSection(state, sectionId);
      if (!section) return;
      if (!section.elements) section.elements = [];
      const el: FreeformElement = {
        id: `el-${generateId()}`,
        type,
        content: type === 'text' ? 'Edit this text' : type === 'button' ? 'Click Me' : undefined,
        style: { desktop: getDefaultElementStyle(type) },
      };
      section.elements.push(el);
      state.selectedElementId = el.id;
      state.selectedSectionForElement = sectionId;
      state.selectedId = null;
      saveHistory(state);
    }),

    updateElement: (sectionId, elementId, updates) => set((state) => {
      const section = findSection(state, sectionId);
      if (!section?.elements) return;
      const idx = section.elements.findIndex(e => e.id === elementId);
      if (idx !== -1) {
        section.elements[idx] = { ...section.elements[idx], ...updates } as FreeformElement;
      }
      saveHistory(state);
    }),

    updateElementStyle: (sectionId, elementId, key, value, viewport = 'desktop') => set((state) => {
      const section = findSection(state, sectionId);
      if (!section?.elements) return;
      const el = section.elements.find(e => e.id === elementId);
      if (!el) return;
      if (!el.style[viewport]) el.style[viewport] = {} as any;
      (el.style[viewport] as any)[key] = value;
      saveHistory(state);
    }),

    deleteElement: (sectionId, elementId) => set((state) => {
      const section = findSection(state, sectionId);
      if (!section?.elements) return;
      section.elements = section.elements.filter(e => e.id !== elementId);
      if (state.selectedElementId === elementId) {
        state.selectedElementId = null;
        state.selectedSectionForElement = null;
      }
      saveHistory(state);
    }),

    duplicateElement: (sectionId, elementId) => set((state) => {
      const section = findSection(state, sectionId);
      if (!section?.elements) return;
      const idx = section.elements.findIndex(e => e.id === elementId);
      if (idx === -1) return;
      const clone: FreeformElement = {
        ...JSON.parse(JSON.stringify(section.elements[idx])),
        id: `el-${generateId()}`,
        style: {
          desktop: {
            ...section.elements[idx].style.desktop,
            top: section.elements[idx].style.desktop.top + 20,
            left: section.elements[idx].style.desktop.left + 20,
          },
        },
      };
      section.elements.splice(idx + 1, 0, clone);
      state.selectedElementId = clone.id;
      state.selectedSectionForElement = sectionId;
      saveHistory(state);
    }),

    undo: () => set((state) => {
      if (state.historyIndex > 0) {
        state.historyIndex--;
        state.sections = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
        state.selectedId = null;
        state.selectedElementId = null;
      }
    }),

    redo: () => set((state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        state.sections = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
        state.selectedId = null;
        state.selectedElementId = null;
      }
    }),
  }))
);
