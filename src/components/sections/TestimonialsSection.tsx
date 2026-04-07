"use client";

import { motion } from "framer-motion";

export interface TestimonialItem {
  id: string;
  quote: string;
  authorName?: string;
  author?: string;
  authorRole?: string;
}

export interface TestimonialsSectionProps {
  label?: string;
  title?: string;
  testimonials?: TestimonialItem[];
  bgColor?: string;
  accentColor?: string;
  lineColor?: string;
  quoteColor?: string;
  authorColor?: string;
  roleColor?: string;
}

const defaultTestimonials: TestimonialItem[] = [
  {
    id: "t1",
    quote: "&ldquo;FORMA is the first builder that actually respects our design system instead of fighting against it.&rdquo;",
    authorName: "SARAH JENKINS",
    authorRole: "Design Director, Acme Corp"
  },
  {
    id: "t2",
    quote: "&ldquo;We launched three new product pages this week. Before FORMA, that would have taken a month.&rdquo;",
    authorName: "MARCUS CHEN",
    authorRole: "Head of Growth, StartupInc"
  },
  {
    id: "t3",
    quote: "&ldquo;The pixel-perfect export is what sold us. Production ready code right out of the box.&rdquo;",
    authorName: "ELENA ROSTOVA",
    authorRole: "Lead Engineer, TechFlow"
  }
];

export default function TestimonialsSection({
  label = "WHAT THEY SAY",
  title,
  testimonials = defaultTestimonials,
  bgColor = "#FFFFFF",
  accentColor = "#2563EB",
  lineColor = "#D1D5DB",
  quoteColor = "#111827",
  authorColor = "#111827",
  roleColor = "#64748B",
}: TestimonialsSectionProps) {
  const sectionLabel = label || title || "WHAT THEY SAY";

  return (
    <section className="w-full py-[96px] px-4 flex flex-col items-center" style={{ backgroundColor: bgColor }}>
      <div className="w-full max-w-[1200px] flex flex-col items-center">
        <div className="uppercase text-[11px] tracking-[0.14em] mb-16 font-sans" style={{ color: accentColor }}>
          {sectionLabel}
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-[48px] md:gap-[32px]">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col border-none shadow-none rounded-none"
            >
              <div className="w-full h-[1px] mb-8" style={{ backgroundColor: lineColor }} />
              <p className="font-heading italic text-[20px] leading-[1.6] mb-8" style={{ color: quoteColor }}>
                {testimonial.quote}
              </p>
              <div className="mt-auto">
                <h4 className="font-sans font-semibold text-[13px] tracking-[0.06em] uppercase mb-1" style={{ color: authorColor }}>
                  {testimonial.authorName || testimonial.author || "AUTHOR"}
                </h4>
                <p className="font-sans text-[13px]" style={{ color: roleColor }}>
                  {testimonial.authorRole || ""}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
