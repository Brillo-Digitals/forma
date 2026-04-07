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
        bgColor: "#F1F5FF",
      },
      style: {
        desktop: {
          backgroundColor: "#F1F5FF",
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
        bgColor: "#EEF2FF",
        cardBgColor: "#FFFFFF",
        accentColor: "#7C3AED",
        headlineColor: "#1E1B4B",
        bodyColor: "#374151",
        features: [
          { title: "Brand Strategy", description: "Positioning your brand for the modern era." },
          { title: "Digital Design", description: "Award-winning interfaces and experiences." },
          { title: "Full-Stack Dev", description: "Robust engineering for complex problems." }
        ]
      },
      style: {
        desktop: {
          backgroundColor: "#EEF2FF",
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
        bgColor: "#F5F3FF",
        accentColor: "#EC4899",
        lineColor: "#C4B5FD",
        quoteColor: "#1F2937",
        authorColor: "#111827",
        roleColor: "#6B7280",
        testimonials: [
          { author: "Jane Doe", quote: "They completely transformed our business." },
          { author: "John Smith", quote: "The best agency we've ever worked with." },
          { author: "Alice Johnson", quote: "Increible attention to detail and design." }
        ]
      },
      style: {
        desktop: {
          backgroundColor: "#F5F3FF",
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
        brandName: "Creative Agency",
        bgColor: "#1F2937",
        brandColor: "#F9FAFB",
        taglineColor: "rgba(249,250,251,0.72)",
        dividerColor: "rgba(249,250,251,0.2)",
      },
      style: {
        desktop: {
          backgroundColor: "#1F2937",
          minHeight: 300,
          paddingTop: 48,
          paddingBottom: 48,
        }
      },
      elements: []
    }
  ]
};
