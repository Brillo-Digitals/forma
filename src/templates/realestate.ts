import { TemplateDefinition } from "./blank";

export const realEstateTemplate: TemplateDefinition = {
  id: "realestate",
  title: "Luxury Real Estate",
  description: "High-end property showcase with premium visuals, proof, and inquiry-focused CTAs.",
  sections: [
    {
      id: "realestate-hero",
      type: "hero",
      order: 0,
      props: {
        headline: "Signature Homes in Prime Locations",
        subheadline: "Discover architect-designed residences represented with discretion and expertise.",
        ctaText: "Browse Listings",
        ctaHref: "#",
        bgImage: "https://picsum.photos/id/1043/1920/1080",
      },
      style: {
        desktop: {
          backgroundColor: "#F6F3EF",
          minHeight: 690,
          paddingTop: 100,
          paddingBottom: 100,
          boxShadow: "inset 0 0 0 9999px rgba(246,243,239,0.35)",
        },
      },
      elements: [],
    },
    {
      id: "realestate-features",
      type: "features",
      order: 1,
      props: {
        label: "OUR EDGE",
        title: "A Refined Buying Experience",
        features: [
          {
            id: "re-f1",
            title: "Exclusive Inventory",
            description: "Access off-market opportunities before they appear publicly.",
            iconName: "LayoutGrid",
          },
          {
            id: "re-f2",
            title: "Market Intelligence",
            description: "Data-driven pricing and timing insights for confident decisions.",
            iconName: "MousePointer2",
          },
          {
            id: "re-f3",
            title: "Negotiation Mastery",
            description: "Protecting value while securing terms aligned with your priorities.",
            iconName: "Download",
          },
        ],
      },
      style: {
        desktop: {
          backgroundColor: "#FCFAF8",
          minHeight: 620,
          paddingTop: 92,
          paddingBottom: 92,
        },
      },
      elements: [],
    },
    {
      id: "realestate-pricing",
      type: "pricing",
      order: 2,
      props: {
        title: "Representation Packages",
        tiers: [
          {
            id: "re-p1",
            name: "Buyer Advisory",
            price: "$2,500",
            features: ["Neighborhood strategy", "Tour planning", "Offer guidance"],
            ctaText: "Start Advisory",
            ctaHref: "#",
          },
          {
            id: "re-p2",
            name: "Full Acquisition",
            price: "1.5%",
            features: ["End-to-end representation", "Negotiation and legal coordination", "Post-close support"],
            isPopular: true,
            ctaText: "Discuss Acquisition",
            ctaHref: "#",
          },
        ],
      },
      style: {
        desktop: {
          backgroundColor: "#2A2228",
          minHeight: 620,
          paddingTop: 92,
          paddingBottom: 92,
        },
      },
      elements: [],
    },
    {
      id: "realestate-testimonials",
      type: "testimonials",
      order: 3,
      props: {
        label: "CLIENT STORIES",
        testimonials: [
          {
            id: "re-t1",
            quote: "Their guidance helped us secure our dream penthouse under asking.",
            authorName: "OLIVIA ROSS",
            authorRole: "Home Buyer",
          },
          {
            id: "re-t2",
            quote: "We felt informed at every step and never rushed into decisions.",
            authorName: "DANIEL WEBB",
            authorRole: "Investor",
          },
          {
            id: "re-t3",
            quote: "Professional, discreet, and incredibly effective from first call to close.",
            authorName: "MIA CHO",
            authorRole: "Seller",
          },
        ],
      },
      style: {
        desktop: {
          backgroundColor: "#F1EAE1",
          minHeight: 600,
          paddingTop: 90,
          paddingBottom: 90,
        },
      },
      elements: [],
    },
    {
      id: "realestate-footer",
      type: "footer",
      order: 4,
      props: {
        brandName: "ATELIER ESTATES",
        tagline: "Exceptional properties, intelligently represented.",
      },
      style: {
        desktop: {
          backgroundColor: "#1D181D",
          minHeight: 250,
          paddingTop: 40,
          paddingBottom: 40,
        },
      },
      elements: [],
    },
  ],
};
