"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPublishedPage } from "@/lib/publish";

export default function PublishedPage() {
  const params = useParams();
  const id = params?.id as string;
  const [html, setHtml] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id) {
      const stored = getPublishedPage(id);
      if (stored) {
        setHtml(stored);
      } else {
        setNotFound(true);
      }
    }
  }, [id]);

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-cream font-sans gap-4">
        <div className="font-heading font-bold text-[32px] text-wine">FORMA</div>
        <p className="text-[14px] text-stone">This page was not found or has expired.</p>
        <p className="text-[12px] text-stone/60">Pages are stored locally. Try publishing again from the same browser.</p>
      </div>
    );
  }

  if (!html) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream">
        <div className="font-sans text-[13px] tracking-widest text-stone animate-pulse uppercase">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <iframe
      srcDoc={html}
      className="w-full min-h-screen border-0"
      title="Published page"
      sandbox="allow-same-origin allow-scripts"
    />
  );
}
