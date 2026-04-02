"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cream gap-6 font-sans">
      <div className="font-heading font-bold text-[32px] text-wine">FORMA</div>
      <p className="text-[14px] text-stone text-center max-w-[360px]">
        Something went wrong. Please try again.
      </p>
      <button
        onClick={reset}
        className="border border-charcoal text-charcoal text-[13px] px-6 py-2.5 hover:bg-charcoal hover:text-white transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
