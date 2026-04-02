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
  convertSectionToFreeformContent: (id: string) => void;
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
    case 'hero':         return { headline: 'New Hero', subheadline: 'Add your text here', ctaText: 'Click Me' };
    case 'features':     return { title: 'Our Features', label: 'FEATURES', features: [] };
    case 'testimonials': return { label: 'TESTIMONIALS', testimonials: [] };
    case 'pricing':      return { title: 'Simple Pricing', tiers: [] };
    case 'footer':       return { brandName: 'YOUR BRAND', tagline: 'Built with FORMA.' };
    case 'logobar':      return { label: 'TRUSTED BY', logos: ['Acme Corp', 'Initech', 'Hooli', 'Pied Piper', 'Globex'] };
    case 'cta':          return { headline: 'Ready to get started?', subheadline: 'Join thousands of teams already using the platform.', ctaText: 'Start Free Trial', ctaHref: '#' };
    case 'faq':          return { headline: 'Frequently asked questions', faqs: [
      { question: 'How do I get started?', answer: 'Sign up and create your first project in under 2 minutes.' },
      { question: 'Is there a free plan?', answer: 'Yes — our Starter plan is free forever with up to 3 projects.' },
      { question: 'Can I export my pages?', answer: 'Absolutely. Export clean HTML/CSS with one click at any time.' },
    ]};
    default: return {};
  }
};

const getDefaultSectionStyle = (type: SectionType) => ({
  desktop: {
    backgroundColor: type === 'cta' ? '#2A2A2A' : '#FDFAF8',
    minHeight: type === 'footer' ? 300 : 600,
    paddingTop: 96,
    paddingBottom: 96,
  }
});

const getDefaultElementStyle = (type: ElementType): ElementStyle => {
  switch (type) {
    case 'text':      return { top: 80, left: 80, width: 280, height: 60, zIndex: 1, fontSize: 18, color: '#2A2A2A', fontWeight: '400' };
    case 'button':    return { top: 80, left: 80, width: 180, height: 50, zIndex: 1, backgroundColor: '#7A2535', color: '#FFFFFF', fontSize: 14, borderRadius: 2 };
    case 'image':     return { top: 80, left: 80, width: 320, height: 200, zIndex: 1, borderRadius: 4 };
    case 'container': return { top: 80, left: 80, width: 320, height: 160, zIndex: 1, backgroundColor: 'transparent', border: '1px solid #E0DBD4' };
    default:          return { top: 80, left: 80, width: 200, height: 60, zIndex: 1 };
  }
};

function createTextElement(content: string, top: number, left: number, width: number, height: number, extras: Partial<ElementStyle> = {}): FreeformElement {
  return {
    id: `el-${generateId()}`,
    type: 'text',
    content,
    style: {
      desktop: {
        ...getDefaultElementStyle('text'),
        top,
        left,
        width,
        height,
        ...extras,
      },
    },
  };
}

function createButtonElement(content: string, top: number, left: number, width: number, height: number, href?: string): FreeformElement {
  return {
    id: `el-${generateId()}`,
    type: 'button',
    content,
    link: {
      type: 'url',
      value: href || '#',
      openInNewTab: false,
      underline: false,
      color: '',
      hoverColor: '',
      hoverUnderline: false,
    },
    style: {
      desktop: {
        ...getDefaultElementStyle('button'),
        top,
        left,
        width,
        height,
      },
    },
  };
}

function createImageElement(src: string, top: number, left: number, width: number, height: number): FreeformElement {
  return {
    id: `el-${generateId()}`,
    type: 'image',
    src,
    style: {
      desktop: {
        ...getDefaultElementStyle('image'),
        top,
        left,
        width,
        height,
      },
    },
  };
}

function buildSectionContentElements(section: SectionProps): FreeformElement[] {
  const p = (section.props || {}) as Record<string, unknown>;
  const elements: FreeformElement[] = [];

  const str = (value: unknown): string => (typeof value === 'string' ? value : '');

  if (p.bgImage && typeof p.bgImage === 'string') {
    elements.push(createImageElement(p.bgImage, 0, 0, 1200, 600));
  }

  switch (section.type) {
    case 'hero': {
      elements.push(createTextElement((p.headline as string) || 'Build Pages That Convert', 140, 240, 720, 120, { fontSize: 72, fontWeight: '700', textAlign: 'center', lineHeight: '1.1' }));
      elements.push(createTextElement((p.subheadline as string) || 'A refined, powerful landing page builder for serious products.', 290, 330, 540, 90, { fontSize: 20, textAlign: 'center', color: '#6F6464' }));
      elements.push(createButtonElement((p.ctaText as string) || 'Start Building', 390, 510, 180, 50, p.ctaHref as string));
      break;
    }
    case 'cta': {
      elements.push(createTextElement((p.headline as string) || 'Start building today.', 150, 220, 760, 120, { fontSize: 56, fontWeight: '700', textAlign: 'center', color: '#FFFFFF', lineHeight: '1.1' }));
      elements.push(createTextElement((p.subheadline as string) || 'Join thousands of teams already shipping better landing pages.', 290, 300, 600, 80, { fontSize: 18, textAlign: 'center', color: 'rgba(255,255,255,0.7)' }));
      elements.push(createButtonElement((p.ctaText as string) || 'Get Started Free', 390, 510, 180, 50, p.ctaHref as string));
      break;
    }
    case 'features': {
      const items = Array.isArray(p.features) ? (p.features as Array<Record<string, unknown>>) : [];
      elements.push(createTextElement((p.label as string) || (p.subtitle as string) || 'WHY FORMA', 80, 490, 220, 24, { fontSize: 12, fontWeight: '500', textAlign: 'center' }));
      elements.push(createTextElement((p.title as string) || 'Design Without Compromise', 120, 300, 600, 80, { fontSize: 48, fontWeight: '700', textAlign: 'center' }));
      items.slice(0, 3).forEach((f, i: number) => {
        const colLeft = 100 + i * 340;
        elements.push(createTextElement(str(f?.title) || `Feature ${i + 1}`, 260, colLeft, 280, 44, { fontSize: 22, fontWeight: '600' }));
        elements.push(createTextElement(str(f?.description) || 'Describe this feature.', 310, colLeft, 280, 80, { fontSize: 15, color: '#6F6464' }));
      });
      break;
    }
    case 'testimonials': {
      const items = Array.isArray(p.testimonials) ? (p.testimonials as Array<Record<string, unknown>>) : [];
      elements.push(createTextElement((p.label as string) || (p.title as string) || 'WHAT THEY SAY', 80, 470, 260, 24, { fontSize: 12, fontWeight: '500', textAlign: 'center' }));
      items.slice(0, 3).forEach((t, i: number) => {
        const colLeft = 90 + i * 350;
        elements.push(createTextElement(str(t?.quote) || 'Great product.', 180, colLeft, 300, 150, { fontSize: 24, fontWeight: '400', lineHeight: '1.5' }));
        elements.push(createTextElement(str(t?.authorName) || str(t?.author) || 'Author Name', 340, colLeft, 300, 30, { fontSize: 13, fontWeight: '600' }));
        elements.push(createTextElement(str(t?.authorRole), 370, colLeft, 300, 28, { fontSize: 13, color: '#6F6464' }));
      });
      break;
    }
    case 'pricing': {
      const tiers = Array.isArray(p.tiers) ? (p.tiers as Array<Record<string, unknown>>) : [];
      elements.push(createTextElement((p.title as string) || 'Simple, Transparent Pricing', 80, 250, 700, 80, { fontSize: 48, fontWeight: '700', textAlign: 'center', color: '#FFFFFF' }));
      tiers.slice(0, 3).forEach((tier, i: number) => {
        const colLeft = 120 + i * 320;
        elements.push(createTextElement(str(tier?.name) || `Plan ${i + 1}`, 220, colLeft, 250, 40, { fontSize: 24, fontWeight: '600', color: '#FFFFFF' }));
        elements.push(createTextElement(str(tier?.price) || '$0/mo', 270, colLeft, 250, 44, { fontSize: 36, fontWeight: '700', color: '#FFFFFF' }));
        elements.push(createButtonElement(str(tier?.ctaText) || str(tier?.buttonText) || 'Select Plan', 410, colLeft, 220, 48, str(tier?.ctaHref) || '#'));
      });
      break;
    }
    case 'faq': {
      const faqs = Array.isArray(p.faqs) ? (p.faqs as Array<Record<string, unknown>>) : [];
      elements.push(createTextElement((p.headline as string) || 'Frequently asked questions', 80, 220, 760, 70, { fontSize: 44, fontWeight: '700' }));
      faqs.slice(0, 4).forEach((faq, i: number) => {
        const top = 190 + i * 100;
        elements.push(createTextElement(str(faq?.question) || `Question ${i + 1}`, top, 220, 760, 40, { fontSize: 24, fontWeight: '600' }));
        elements.push(createTextElement(str(faq?.answer) || 'Answer text', top + 42, 220, 760, 50, { fontSize: 15, color: '#6F6464' }));
      });
      break;
    }
    case 'logobar': {
      const logos = Array.isArray(p.logos) ? p.logos : [];
      elements.push(createTextElement((p.label as string) || 'TRUSTED BY TEAMS AT', 70, 420, 360, 24, { fontSize: 12, textAlign: 'center' }));
      logos.slice(0, 6).forEach((logo: string, i: number) => {
        elements.push(createTextElement(logo, 140, 90 + i * 180, 160, 30, { fontSize: 20, fontWeight: '700', color: '#2A2A2A' }));
      });
      break;
    }
    case 'footer': {
      elements.push(createTextElement((p.brandName as string) || (p.companyName as string) || 'FORMA', 120, 90, 360, 44, { fontSize: 30, fontWeight: '700', color: '#FFFFFF' }));
      elements.push(createTextElement((p.tagline as string) || 'Built with FORMA.', 125, 780, 320, 36, { fontSize: 14, color: 'rgba(255,255,255,0.65)' }));
      break;
    }
    default:
      break;
  }

  return elements;
}

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
        style: getDefaultSectionStyle(type),
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

    convertSectionToFreeformContent: (id) => set((state) => {
      const section = findSection(state, id);
      if (!section) return;

      section.elements = buildSectionContentElements(section);
      section.props = {
        ...section.props,
        freeformContent: true,
      };

      const firstId = section.elements[0]?.id || null;
      state.selectedSectionForElement = firstId ? section.id : null;
      state.selectedElementId = firstId;
      state.selectedId = null;
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
