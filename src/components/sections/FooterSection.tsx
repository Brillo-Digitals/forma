"use client";

export interface FooterSectionProps {
  brandName?: string;
  tagline?: string;
  bgColor?: string;
  brandColor?: string;
  taglineColor?: string;
  dividerColor?: string;
}

export default function FooterSection({
  brandName = "FORMA",
  tagline = "Built with FORMA.",
  bgColor = "#111827",
  brandColor = "#FFFFFF",
  taglineColor = "rgba(255,255,255,0.65)",
  dividerColor = "rgba(255,255,255,0.12)",
}: FooterSectionProps) {
  return (
    <footer className="w-full" style={{ backgroundColor: bgColor }}>
      <div 
        className="w-full h-[1px]" 
        style={{ backgroundColor: dividerColor }} 
      />
      
      <div className="w-full flex justify-center py-[40px] px-4">
        <div className="w-full max-w-[1200px] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="font-heading text-[24px]" style={{ color: brandColor }}>
            {brandName}
          </div>
          
          <div className="font-sans text-[13px]" style={{ color: taglineColor }}>
            {tagline}
          </div>
        </div>
      </div>
    </footer>
  );
}
