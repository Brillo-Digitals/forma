import { TemplateDefinition } from "./blank";

export const startupTemplate: TemplateDefinition = {
  id: "startup",
  title: "Startup Launch",
  description: "A high-conversion landing page for modern startups.",
  sections: [
    {
      id: "startup-hero",
      type: "hero",
      order: 0,
      props: {
        headline: "Launch Faster, Grow Stronger",
        subheadline: "The ultimate platform for scaling your next big idea.",
        ctaText: "Start Building",
        bgColor: "#EEF4FF",
      },
      style: {
        desktop: {
          backgroundColor: "#EEF4FF",
          minHeight: 600,
          paddingTop: 96,
          paddingBottom: 96,
        }
      },
      elements: []
    },
    {
      id: "startup-features",
      type: "features",
      order: 1,
      props: {
        subtitle: "FEATURES",
        title: "Everything you need",
        bgColor: "#E8F1FF",
        cardBgColor: "#FFFFFF",
        accentColor: "#2563EB",
        headlineColor: "#0F172A",
        bodyColor: "#334155",
        features: [
          { title: "Lightning Fast", description: "Built on a modern microservices architecture." },
          { title: "Secure by Design", description: "Enterprise-grade security out of the box." },
          { title: "Beautiful UI", description: "Crafted with attention to every pixel." }
        ]
      },
      style: {
        desktop: {
          backgroundColor: "#E8F1FF",
          minHeight: 600,
          paddingTop: 96,
          paddingBottom: 96,
        }
      },
      elements: []
    },
    {
      id: "startup-pricing",
      type: "pricing",
      order: 2,
      props: {
        title: "Simple, transparent pricing",
        bgColor: "#1E3A8A",
        titleColor: "#DBEAFE",
        cardBackground: "rgba(191,219,254,0.12)",
        cardBorderColor: "rgba(191,219,254,0.3)",
        mutedTextColor: "rgba(219,234,254,0.8)",
        buttonBorderColor: "#BFDBFE",
        buttonTextColor: "#DBEAFE",
        buttonHoverBg: "#DBEAFE",
        buttonHoverText: "#1E3A8A",
        tiers: [
          { name: "Starter", price: "$29/mo", buttonText: "Get Starter" },
          { name: "Pro", price: "$99/mo", buttonText: "Get Pro" }
        ]
      },
      style: {
        desktop: {
          backgroundColor: "#1E3A8A",
          minHeight: 600,
          paddingTop: 96,
          paddingBottom: 96,
        }
      },
      elements: []
    },
    {
      id: "startup-footer",
      type: "footer",
      order: 3,
      props: {
        brandName: "Acme Inc.",
        bgColor: "#0B1E4B",
        brandColor: "#E2E8F0",
        taglineColor: "rgba(226,232,240,0.7)",
        dividerColor: "rgba(226,232,240,0.2)",
      },
      style: {
        desktop: {
          backgroundColor: "#0B1E4B",
          minHeight: 300,
          paddingTop: 48,
          paddingBottom: 48,
        }
      },
      elements: []
    }
  ]
};
