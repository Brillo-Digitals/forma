import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { SectionProps, SectionType, PageState, DEFAULT_PAGE } from '@/types';
import { generateId } from '@/utils/generateId';

type BuilderStore = PageState & {
  addSection: (type: SectionType) => void;
  deleteSection: (id: string) => void;
  selectSection: (id: string | null) => void;
  updateSectionProp: (id: string, key: string, value: any) => void;
  reorderSections: (newOrder: SectionProps[]) => void;
  undo: () => void;
  redo: () => void;
  setDragging: (isDragging: boolean) => void;
  setGenerating: (isGenerating: boolean) => void;
  loadTemplate: (sections: SectionProps[]) => void;
  markSaved: () => void;
};

const MAX_HISTORY = 30;

const getDefaultProps = (type: SectionType): Record<string, any> => {
  switch (type) {
    case 'hero': return { headline: 'New Hero', subheadline: 'Add your text here', ctaText: 'Click Me', bgColor: 'var(--color-cream)' };
    case 'features': return { title: 'New Features', label: 'FEATURES', features: [] };
    case 'testimonials': return { label: 'TESTIMONIALS', testimonials: [] };
    case 'pricing': return { title: 'Pricing', tiers: [] };
    case 'footer': return { brandName: 'YOUR BRAND', tagline: 'Built with FORMA.' };
    default: return {};
  }
};

function saveHistory(state: any) {
  let newHistory = state.history.slice(0, state.historyIndex + 1);
  const currentSections = JSON.parse(JSON.stringify(state.sections));
  newHistory.push(currentSections);
  if (newHistory.length > MAX_HISTORY) {
    newHistory.shift();
  }
  state.history = newHistory;
  state.historyIndex = newHistory.length - 1;
}

export const useBuilderStore = create<BuilderStore>()(
  immer((set, get) => ({
    sections: [DEFAULT_PAGE],
    selectedId: null,
    isDragging: false,
    isGenerating: false,
    history: [[DEFAULT_PAGE]],
    historyIndex: 0,
    lastSavedHistoryIndex: 0,

    setDragging: (isDragging) => set((state) => { state.isDragging = isDragging; }),
    setGenerating: (isGenerating) => set((state) => { state.isGenerating = isGenerating; }),

    selectSection: (id) => set((state) => {
      state.selectedId = id;
    }),

    addSection: (type) => set((state) => {
      const newSection: SectionProps = {
        id: generateId(),
        type,
        props: getDefaultProps(type),
        order: state.sections.length,
      };
      
      state.sections.push(newSection);
      state.selectedId = newSection.id;
      
      saveHistory(state);
    }),

    deleteSection: (id) => set((state) => {
      state.sections = state.sections.filter(s => s.id !== id);
      if (state.selectedId === id) {
        state.selectedId = null;
      }
      saveHistory(state);
    }),

    updateSectionProp: (id, key, value) => set((state) => {
      const section = state.sections.find(s => s.id === id);
      if (section) {
        section.props[key] = value;
      }
      saveHistory(state);
    }),

    reorderSections: (newOrder) => set((state) => {
      state.sections = newOrder.map((s, i) => ({ ...s, order: i }));
      saveHistory(state);
    }),

    undo: () => set((state) => {
      if (state.historyIndex > 0) {
        state.historyIndex--;
        state.sections = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
        state.selectedId = null;
      }
    }),

    redo: () => set((state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        state.sections = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
        state.selectedId = null;
      }
    }),

    loadTemplate: (newSections) => set((state) => {
      state.sections = newSections;
      state.selectedId = null;
      saveHistory(state);
    }),

    markSaved: () => set((state) => {
      state.lastSavedHistoryIndex = state.historyIndex;
    }),
  }))
);
