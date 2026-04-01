"use client";

import { motion } from "framer-motion";

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  ctaText?: string;
  ctaHref?: string;
}

export interface PricingSectionProps {
  title?: string;
  tiers?: PricingTier[];
}

const defaultTiers: PricingTier[] = [
  {
    id: "p1",
    name: "Starter",
    price: "$29/mo",
    features: ["Build up to 5 pages", "Export HTML"],
    ctaText: "Start Free Trial",
    ctaHref: "#"
  },
  {
    id: "p2",
    name: "Pro",
    price: "$79/mo",
    features: ["Unlimited pages", "AI generator", "Live publish"],
    isPopular: true,
    ctaText: "Upgrade to Pro",
    ctaHref: "#"
  }
];

export default function PricingSection({
  title = "Simple, Transparent Pricing",
  tiers = defaultTiers,
}: PricingSectionProps) {
  return (
    <section className="w-full bg-wine py-[96px] px-4 flex flex-col items-center">
      <div className="w-full max-w-[900px] flex flex-col items-center">
        <h2 className="font-heading font-bold text-[48px] text-white max-w-[560px] leading-[1.15] mb-16 text-center">
          {title}
        </h2>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-[32px]">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative p-[40px] flex flex-col"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "0px",
              }}
            >
              {tier.isPopular && (
                <div className="absolute top-0 right-0 -mt-3 mr-6 bg-gold text-[11px] font-sans text-charcoal tracking-[0.14em] px-3 py-1 uppercase font-bold">
                  Most Popular
                </div>
              )}

              <h3 className="font-sans font-semibold text-[20px] text-white mb-4">
                {tier.name}
              </h3>

              <div className="font-heading font-bold text-[40px] text-white mb-6">
                {tier.price}
              </div>

              <ul className="mb-8 flex-grow flex flex-col gap-3">
                {tier.features.map((feature, i) => (
                  <li key={i} className="font-sans text-[15px]" style={{ color: "rgba(255,255,255,0.7)" }}>
                    • {feature}
                  </li>
                ))}
              </ul>

              <motion.a
                href={tier.ctaHref}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="w-full block text-center font-sans font-medium text-[14px] py-[14px] px-[36px] transition-colors duration-200"
                style={{
                  border: "1px solid white",
                  backgroundColor: "transparent",
                  color: "white",
                  borderRadius: "2px",
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "white";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-wine)";
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color = "white";
                }}
              >
                {tier.ctaText}
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
