"use client";

import { motion } from "framer-motion";

export interface TestimonialItem {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
}

export interface TestimonialsSectionProps {
  label?: string;
  testimonials?: TestimonialItem[];
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
  testimonials = defaultTestimonials,
}: TestimonialsSectionProps) {
  return (
    <section className="w-full bg-cream py-[96px] px-4 flex flex-col items-center">
      <div className="w-full max-w-[1200px] flex flex-col items-center">
        <div className="uppercase text-[11px] tracking-[0.14em] text-wine mb-16 font-sans">
          {label}
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
              <div className="w-full h-[1px] bg-divider mb-8" />
              <p className="font-heading italic text-[20px] text-charcoal leading-[1.6] mb-8">
                {testimonial.quote}
              </p>
              <div className="mt-auto">
                <h4 className="font-sans font-semibold text-[13px] tracking-[0.06em] uppercase text-charcoal mb-1">
                  {testimonial.authorName}
                </h4>
                <p className="font-sans text-[13px] text-stone">
                  {testimonial.authorRole}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
