"use client";

import { motion } from "framer-motion";

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  features?: string[];
  isPopular?: boolean;
  ctaText?: string;
  buttonText?: string;
  ctaHref?: string;
}

export interface PricingSectionProps {
  title?: string;
  tiers?: PricingTier[];
  bgColor?: string;
  titleColor?: string;
  cardBackground?: string;
  cardBorderColor?: string;
  textColor?: string;
  mutedTextColor?: string;
  badgeBackground?: string;
  badgeTextColor?: string;
  buttonBorderColor?: string;
  buttonTextColor?: string;
  buttonHoverBg?: string;
  buttonHoverText?: string;
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
  bgColor = "#1D4ED8",
  titleColor = "#FFFFFF",
  cardBackground = "rgba(255,255,255,0.08)",
  cardBorderColor = "rgba(255,255,255,0.15)",
  textColor = "#FFFFFF",
  mutedTextColor = "rgba(255,255,255,0.72)",
  badgeBackground = "#FBBF24",
  badgeTextColor = "#111827",
  buttonBorderColor = "#FFFFFF",
  buttonTextColor = "#FFFFFF",
  buttonHoverBg = "#FFFFFF",
  buttonHoverText = "#1D4ED8",
}: PricingSectionProps) {
  return (
    <section className="w-full py-[96px] px-4 flex flex-col items-center" style={{ backgroundColor: bgColor }}>
      <div className="w-full max-w-[900px] flex flex-col items-center">
        <h2 className="font-heading font-bold text-[48px] max-w-[560px] leading-[1.15] mb-16 text-center" style={{ color: titleColor }}>
          {title}
        </h2>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-[32px]">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.id || `tier-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative p-[40px] flex flex-col"
              style={{
                backgroundColor: cardBackground,
                border: `1px solid ${cardBorderColor}`,
                borderRadius: "0px",
              }}
            >
              {tier.isPopular && (
                <div className="absolute top-0 right-0 -mt-3 mr-6 text-[11px] font-sans tracking-[0.14em] px-3 py-1 uppercase font-bold" style={{ backgroundColor: badgeBackground, color: badgeTextColor }}>
                  Most Popular
                </div>
              )}

              <h3 className="font-sans font-semibold text-[20px] mb-4" style={{ color: textColor }}>
                {tier.name || `Plan ${index + 1}`}
              </h3>

              <div className="font-heading font-bold text-[40px] mb-6" style={{ color: textColor }}>
                {tier.price || "$0/mo"}
              </div>

              <ul className="mb-8 flex-grow flex flex-col gap-3">
                {(Array.isArray(tier.features) && tier.features.length > 0 ? tier.features : ["Feature details coming soon"]).map((feature, i) => (
                  <li key={i} className="font-sans text-[15px]" style={{ color: mutedTextColor }}>
                    • {feature}
                  </li>
                ))}
              </ul>

              <motion.a
                href={tier.ctaHref || "#"}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="w-full block text-center font-sans font-medium text-[14px] py-[14px] px-[36px] transition-colors duration-200"
                style={{
                  border: `1px solid ${buttonBorderColor}`,
                  backgroundColor: "transparent",
                  color: buttonTextColor,
                  borderRadius: "2px",
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = buttonHoverBg;
                  (e.currentTarget as HTMLAnchorElement).style.color = buttonHoverText;
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color = buttonTextColor;
                }}
              >
                {tier.ctaText || tier.buttonText || "Get Started"}
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
