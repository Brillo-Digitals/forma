"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const STUB_PROJECTS = [
  { id: "p1", name: "Startup Launch", updated: "Last edited 2 hours ago" },
  { id: "p2", name: "Agency Portfolio", updated: "Last edited 1 day ago" },
  { id: "p3", name: "Blank Page", updated: "Last edited 3 days ago" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-cream font-sans">
      {/* Top Nav */}
      <nav className="h-[72px] px-8 flex items-center justify-between shrink-0">
        <div className="font-heading font-bold text-[24px] text-wine">FORMA</div>
        <button
          onClick={() => router.push("/editor")}
          className="bg-wine text-white text-[13px] px-[24px] py-[10px] rounded-none hover:bg-wine-light transition-colors"
        >
          New Project
        </button>
      </nav>

      {/* Main Area */}
      <main className="flex-1 flex flex-col px-8 py-16">
        <div className="max-w-[1040px] mx-auto w-full">
          <div className="mb-10">
            <h1 className="font-heading font-bold text-[34px] text-charcoal mb-2">
              Your Projects
            </h1>
            <p className="text-[15px] text-stone">
              Start from a template or open an existing project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[180px] bg-wine-muted border-t-[3px] border-t-wine/20 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
                  </div>
                ))
              : STUB_PROJECTS.map((project, i) => (
                  <motion.button
                    key={project.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                      delay: i * 0.08,
                    }}
                    onClick={() => router.push("/editor")}
                    className="group flex flex-col text-left h-[180px] bg-wine-muted px-6 py-5 border-t-[3px] border-t-wine transition-all duration-220 hover:bg-white hover:shadow-[0_2px_16px_rgba(107,26,42,0.08)] cursor-pointer"
                  >
                    <h2 className="font-heading font-bold text-[20px] text-charcoal mt-1 mb-auto">
                      {project.name}
                    </h2>
                    <p className="text-[12px] text-stone">
                      {project.updated}
                    </p>
                  </motion.button>
                ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 shrink-0 text-center">
        <p className="text-[12px] text-stone">
          FORMA — Built for builders who care about craft.
        </p>
      </footer>

      {/* Add shimmer keyframes globally for this component */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}} />
    </div>
  );
}
