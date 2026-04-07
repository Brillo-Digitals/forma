import { TemplateDefinition } from "./blank";

export const travelTemplate: TemplateDefinition = {
  id: "travel",
  title: "Luxury Travel Escapes",
  description: "Premium travel agency page with immersive destinations and polished conversion flow.",
  sections: [
    {
      id: "travel-hero",
      type: "hero",
      order: 0,
      props: {
        headline: "Curated Journeys for Modern Explorers",
        subheadline: "Private villas, hidden coastlines, and seamless itineraries tailored to your style.",
        ctaText: "Plan My Escape",
        ctaHref: "#",
        bgColor: "#E6F4FF",
        bgImage: "https://picsum.photos/id/1018/1920/1080",
      },
      style: {
        desktop: {
          backgroundColor: "#E6F4FF",
          minHeight: 680,
          paddingTop: 96,
          paddingBottom: 96,
          boxShadow: "inset 0 0 0 9999px rgba(230,244,255,0.42)",
        },
      },
      elements: [],
    },
    {
      id: "travel-features",
      type: "features",
      order: 1,
      props: {
        label: "EXPERIENCES",
        title: "Travel Designed Around You",
        bgColor: "#EAF8FF",
        cardBgColor: "#FFFFFF",
        accentColor: "#0284C7",
        headlineColor: "#0F172A",
        bodyColor: "#334155",
        features: [
          {
            id: "tr-f1",
            title: "Concierge Planning",
            description: "From flights to dining, every detail is arranged before you depart.",
            iconName: "LayoutGrid",
          },
          {
            id: "tr-f2",
            title: "Handpicked Stays",
            description: "Boutique resorts and private retreats selected for design and comfort.",
            iconName: "MousePointer2",
          },
          {
            id: "tr-f3",
            title: "On-Trip Support",
            description: "Local specialists and 24/7 support keep your journey effortless.",
            iconName: "Download",
          },
        ],
      },
      style: {
        desktop: {
          backgroundColor: "#EAF8FF",
          minHeight: 620,
          paddingTop: 92,
          paddingBottom: 92,
        },
      },
      elements: [],
    },
    {
      id: "travel-testimonials",
      type: "testimonials",
      order: 2,
      props: {
        label: "TRAVELER NOTES",
        bgColor: "#F0FAFF",
        accentColor: "#0891B2",
        lineColor: "#BAE6FD",
        quoteColor: "#0F172A",
        authorColor: "#1E293B",
        roleColor: "#475569",
        testimonials: [
          {
            id: "tr-t1",
            quote: "They turned our anniversary trip into a story we will tell forever.",
            authorName: "NORA LEWIS",
            authorRole: "New York",
          },
          {
            id: "tr-t2",
            quote: "Everything felt quietly luxurious, from airport pickup to our final dinner.",
            authorName: "JAMES PARK",
            authorRole: "Toronto",
          },
          {
            id: "tr-t3",
            quote: "The itinerary was flawless and still felt spontaneous in the best way.",
            authorName: "AMELIA KHAN",
            authorRole: "London",
          },
        ],
      },
      style: {
        desktop: {
          backgroundColor: "#F0FAFF",
          minHeight: 600,
          paddingTop: 92,
          paddingBottom: 92,
        },
      },
      elements: [],
    },
    {
      id: "travel-cta",
      type: "cta",
      order: 3,
      props: {
        headline: "Let Your Next Journey Begin",
        subheadline: "Tell us your dream destination and we will design the perfect route.",
        ctaText: "Book Consultation",
        ctaHref: "#",
        bgColor: "#0B2239",
        bgImage: "https://picsum.photos/id/1015/1920/1080",
      },
      style: {
        desktop: {
          backgroundColor: "#0B2239",
          minHeight: 520,
          paddingTop: 92,
          paddingBottom: 92,
          boxShadow: "inset 0 0 0 9999px rgba(11,34,57,0.58)",
        },
      },
      elements: [],
    },
    {
      id: "travel-footer",
      type: "footer",
      order: 4,
      props: {
        brandName: "AURELIA TRAVEL",
        tagline: "Luxury itineraries crafted worldwide.",
        bgColor: "#0A2F4E",
        brandColor: "#E0F2FE",
        taglineColor: "rgba(224,242,254,0.72)",
        dividerColor: "rgba(224,242,254,0.2)",
      },
      style: {
        desktop: {
          backgroundColor: "#0A2F4E",
          minHeight: 260,
          paddingTop: 42,
          paddingBottom: 42,
        },
      },
      elements: [],
    },
  ],
};
