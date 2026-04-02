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
        bgImage: "https://picsum.photos/id/1018/1920/1080",
      },
      style: {
        desktop: {
          backgroundColor: "#F8F4EE",
          minHeight: 680,
          paddingTop: 96,
          paddingBottom: 96,
          boxShadow: "inset 0 0 0 9999px rgba(248,244,238,0.35)",
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
          backgroundColor: "#FCF9F5",
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
          backgroundColor: "#F3ECE5",
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
        bgImage: "https://picsum.photos/id/1015/1920/1080",
      },
      style: {
        desktop: {
          backgroundColor: "#272119",
          minHeight: 520,
          paddingTop: 92,
          paddingBottom: 92,
          boxShadow: "inset 0 0 0 9999px rgba(39,33,25,0.55)",
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
      },
      style: {
        desktop: {
          backgroundColor: "#1E1A16",
          minHeight: 260,
          paddingTop: 42,
          paddingBottom: 42,
        },
      },
      elements: [],
    },
  ],
};
