export type SectionType = 'hero' | 'features' | 'testimonials' | 'pricing' | 'footer';

export interface SectionProps {
  id: string;
  type: SectionType;
  props: Record<string, any>;
  order: number;
}

export interface PageState {
  sections: SectionProps[];
  selectedId: string | null;
  isDragging: boolean;
  history: SectionProps[][];
  historyIndex: number;
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
    bgColor: '#FDFAF8'
  }
};
