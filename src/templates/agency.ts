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
      },
      style: {
        desktop: {
          backgroundColor: "#FDFAF8",
          minHeight: 600,
          paddingTop: 96,
          paddingBottom: 96,
        }
      },
      elements: []
    },
    {
      id: "agency-features",
      type: "features",
      order: 1,
      props: {
        subtitle: "CAPABILITIES",
        title: "Our Expertise",
        features: [
          { title: "Brand Strategy", description: "Positioning your brand for the modern era." },
          { title: "Digital Design", description: "Award-winning interfaces and experiences." },
          { title: "Full-Stack Dev", description: "Robust engineering for complex problems." }
        ]
      },
      style: {
        desktop: {
          backgroundColor: "#FDFAF8",
          minHeight: 600,
          paddingTop: 96,
          paddingBottom: 96,
        }
      },
      elements: []
    },
    {
      id: "agency-testimonials",
      type: "testimonials",
      order: 2,
      props: {
        title: "Client Success",
        testimonials: [
          { author: "Jane Doe", quote: "They completely transformed our business." },
          { author: "John Smith", quote: "The best agency we've ever worked with." },
          { author: "Alice Johnson", quote: "Increible attention to detail and design." }
        ]
      },
      style: {
        desktop: {
          backgroundColor: "#F5EEF0",
          minHeight: 600,
          paddingTop: 96,
          paddingBottom: 96,
        }
      },
      elements: []
    },
    {
      id: "agency-footer",
      type: "footer",
      order: 3,
      props: {
        companyName: "Creative Agency",
      },
      style: {
        desktop: {
          backgroundColor: "#2A2228",
          minHeight: 300,
          paddingTop: 48,
          paddingBottom: 48,
        }
      },
      elements: []
    }
  ]
};
