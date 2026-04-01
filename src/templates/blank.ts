import { SectionProps } from "../types";

export interface TemplateDefinition {
  id: string;
  title: string;
  description: string;
  sections: SectionProps[];
}

export const blankTemplate: TemplateDefinition = {
  id: "blank",
  title: "Blank Page",
  description: "Start with an empty canvas and build from scratch.",
  sections: []
};
