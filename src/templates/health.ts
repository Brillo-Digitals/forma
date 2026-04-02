import { TemplateDefinition } from "./blank";

export const healthTemplate: TemplateDefinition = {
  id: "health",
  title: "Modern Health Clinic",
  description: "Clean, trusted healthcare landing page focused on appointments and patient confidence.",
  sections: [
    {
      id: "health-hero",
      type: "hero",
      order: 0,
      props: {
        headline: "Care That Feels Personal",
        subheadline: "Board-certified physicians, same-day appointments, and compassionate guidance.",
        ctaText: "Book Appointment",
        ctaHref: "#",
        bgImage: "https://picsum.photos/id/1025/1920/1080",
      },
      style: {
        desktop: {
          backgroundColor: "#F3F9F7",
          minHeight: 660,
          paddingTop: 96,
          paddingBottom: 96,
          boxShadow: "inset 0 0 0 9999px rgba(243,249,247,0.45)",
        },
      },
      elements: [],
    },
    {
      id: "health-features",
      type: "features",
      order: 1,
      props: {
        label: "WHY PATIENTS CHOOSE US",
        title: "Trusted Care for Every Stage",
        features: [
          {
            id: "hl-f1",
            title: "Preventive Programs",
            description: "Personalized screenings and wellness plans designed for long-term health.",
            iconName: "LayoutGrid",
          },
          {
            id: "hl-f2",
            title: "Specialist Access",
            description: "Fast referrals and coordinated care across top medical specialties.",
            iconName: "MousePointer2",
          },
          {
            id: "hl-f3",
            title: "Digital Follow-up",
            description: "Secure virtual check-ins and care updates directly from your provider.",
            iconName: "Download",
          },
        ],
      },
      style: {
        desktop: {
          backgroundColor: "#EEF7F4",
          minHeight: 620,
          paddingTop: 92,
          paddingBottom: 92,
        },
      },
      elements: [],
    },
    {
      id: "health-faq",
      type: "faq",
      order: 2,
      props: {
        headline: "Questions Patients Ask Most",
        faqs: [
          { question: "Do you accept walk-ins?", answer: "Yes. We keep limited same-day slots available for urgent needs." },
          { question: "Can I consult online?", answer: "Absolutely. Video consultations are available for follow-up and non-emergency care." },
          { question: "How quickly can I get test results?", answer: "Most lab results are available within 24 to 48 hours through your patient portal." },
          { question: "Do you support family care?", answer: "Yes, we provide pediatric and adult care with coordinated family health records." },
        ],
      },
      style: {
        desktop: {
          backgroundColor: "#FFFFFF",
          minHeight: 620,
          paddingTop: 88,
          paddingBottom: 88,
        },
      },
      elements: [],
    },
    {
      id: "health-cta",
      type: "cta",
      order: 3,
      props: {
        headline: "Your Health Journey Starts Here",
        subheadline: "Schedule a visit and get a care plan built around your goals.",
        ctaText: "Request Visit",
        ctaHref: "#",
      },
      style: {
        desktop: {
          backgroundColor: "#123B33",
          minHeight: 460,
          paddingTop: 88,
          paddingBottom: 88,
        },
      },
      elements: [],
    },
    {
      id: "health-footer",
      type: "footer",
      order: 4,
      props: {
        brandName: "NOVA CLINIC",
        tagline: "Evidence-based care with a human touch.",
      },
      style: {
        desktop: {
          backgroundColor: "#0F2F29",
          minHeight: 250,
          paddingTop: 40,
          paddingBottom: 40,
        },
      },
      elements: [],
    },
  ],
};
