import { SectionProps } from "../types";
import { TemplateDefinition } from "./blank";

export const agencyTemplate: TemplateDefinition = {
  id: "agency",
  title: "Agency Portfolio",
  description: "Showcase your work and client success stories.",
  sections: [
    {
      id: "agency-hero",
      type: "hero",
      order: 0,
      props: {
        headline: "Award-Winning Digital Agency",
        subheadline: "We build digital experiences that matter.",
        ctaText: "View Portfolio",
        bgColor: "#FDFAF8"
      }
    },
    {
      id: "agency-features",
      type: "features",
      order: 1,
      props: {
        subtitle: "CAPABILITIES",
        title: "Our Expertise",
        bgColor: "#FDFAF8",
        features: [
          { title: "Brand Strategy", description: "Positioning your brand for the modern era." },
          { title: "Digital Design", description: "Award-winning interfaces and experiences." },
          { title: "Full-Stack Dev", description: "Robust engineering for complex problems." }
        ]
      }
    },
    {
      id: "agency-testimonials",
      type: "testimonials",
      order: 2,
      props: {
        title: "Client Success",
        bgColor: "#F5EEF0",
        testimonials: [
          { author: "Jane Doe", quote: "They completely transformed our business." },
          { author: "John Smith", quote: "The best agency we've ever worked with." },
          { author: "Alice Johnson", quote: "Increible attention to detail and design." }
        ]
      }
    },
    {
      id: "agency-footer",
      type: "footer",
      order: 3,
      props: {
        companyName: "Creative Agency",
        bgColor: "#2A2228"
      }
    }
  ]
};
