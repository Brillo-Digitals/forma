"use client";

import { motion } from "framer-motion";

export interface FooterSectionProps {
  brandName?: string;
  tagline?: string;
}

export default function FooterSection({
  brandName = "FORMA",
  tagline = "Built with FORMA.",
}: FooterSectionProps) {
  return (
    <footer className="w-full bg-charcoal">
      <div 
        className="w-full h-[1px]" 
        style={{ backgroundColor: "rgba(255,255,255,0.08)" }} 
      />
      
      <div className="w-full flex justify-center py-[40px] px-4">
        <div className="w-full max-w-[1200px] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="font-heading text-white text-[24px]">
            {brandName}
          </div>
          
          <div className="font-sans text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>
            {tagline}
          </div>
        </div>
      </div>
    </footer>
  );
}
