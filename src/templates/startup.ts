import { SectionProps } from "../types";
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
        bgColor: "#FDFAF8"
      }
    },
    {
      id: "startup-features",
      type: "features",
      order: 1,
      props: {
        subtitle: "FEATURES",
        title: "Everything you need",
        bgColor: "#FDFAF8",
        features: [
          { title: "Lightning Fast", description: "Built on a modern microservices architecture." },
          { title: "Secure by Design", description: "Enterprise-grade security out of the box." },
          { title: "Beautiful UI", description: "Crafted with attention to every pixel." }
        ]
      }
    },
    {
      id: "startup-pricing",
      type: "pricing",
      order: 2,
      props: {
        title: "Simple, transparent pricing",
        bgColor: "#F5EEF0",
        tiers: [
          { name: "Starter", price: "$29/mo", buttonText: "Get Starter" },
          { name: "Pro", price: "$99/mo", buttonText: "Get Pro" }
        ]
      }
    },
    {
      id: "startup-footer",
      type: "footer",
      order: 3,
      props: {
        companyName: "Acme Inc.",
        bgColor: "#2A2228"
      }
    }
  ]
};
