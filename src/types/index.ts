export type SectionType = 'hero' | 'features' | 'testimonials' | 'pricing' | 'footer' | 'logobar' | 'cta' | 'faq';
export type ElementType = 'text' | 'image' | 'button' | 'container';
export type ViewportType = 'desktop' | 'tablet' | 'mobile';
export type LinkType = 'url' | 'section' | 'email' | 'phone';

export interface LinkConfig {
  type: LinkType;
  value: string;
  openInNewTab: boolean;
  underline: boolean;
  color: string;
  hoverColor: string;
  hoverUnderline: boolean;
}

export interface ElementStyle {
  top: number;
  left: number;
  width: number;
  height: number;
  zIndex: number;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontFamily?: string;
  letterSpacing?: string;
  lineHeight?: string;
  backgroundColor?: string;
  borderRadius?: number;
  border?: string;
  boxShadow?: string;
  padding?: string;
  margin?: string;
  opacity?: number;
}

export interface FreeformElement {
  id: string;
  type: ElementType;
  content?: string;
  src?: string;
  style: {
    desktop: ElementStyle;
    tablet?: Partial<ElementStyle>;
    mobile?: Partial<ElementStyle>;
  };
  link?: LinkConfig;
}

export interface SectionStyle {
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: 'cover' | 'contain' | 'auto';
  backgroundPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  minHeight?: number;
  maxHeight?: number;
  padding?: string;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  margin?: string;
  marginTop?: number;
  marginBottom?: number;
  opacity?: number;
  borderRadius?: number;
  border?: string;
  boxShadow?: string;
}

export interface SectionProps {
  id: string;
  type: SectionType;
  props: Record<string, unknown>;
  order: number;
  elements?: FreeformElement[];
  style?: {
    desktop?: Partial<SectionStyle>;
    tablet?: Partial<SectionStyle>;
    mobile?: Partial<SectionStyle>;
  };
}

export interface PageState {
  sections: SectionProps[];
  selectedId: string | null;
  selectedElementId: string | null;
  selectedSectionForElement: string | null;
  currentViewport: ViewportType;
  isDragging: boolean;
  isGenerating: boolean;
  history: SectionProps[][];
  historyIndex: number;
  lastSavedHistoryIndex: number;
}

export const DEFAULT_PAGE: SectionProps = {
  id: 'section-1',
  type: 'hero',
  order: 0,
  props: {
    headline: 'Build Pages That Convert',
    subheadline: 'A refined, powerful landing page builder for serious products.',
    ctaText: 'Start Building',
    ctaHref: '#',
  },
  style: {
    desktop: {
      backgroundColor: '#FDFAF8',
      minHeight: 600,
      paddingTop: 96,
      paddingBottom: 96,
    }
  },
  elements: [],
};
