"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AuthGate from "@/components/auth/AuthGate";
import { useAuth } from "@/context/AuthContext";
import { listProjects, ProjectDoc } from "@/lib/db";
import { useBuilderStore } from "@/store/builderStore";



export default function DashboardPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectDoc[]>([]);
  const loadTemplate = useBuilderStore(state => state.loadTemplate);

  useEffect(() => {
    async function fetchProjects() {
      if (user) {
        setIsLoading(true);
        try {
          const userProjects = await listProjects(user.uid);
          setProjects(userProjects);
        } catch (err) {
          console.error("Error loading projects", err);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchProjects();
  }, [user]);

  const handleOpenProject = (project: ProjectDoc) => {
    loadTemplate(project.sections);
    // Ideally we'd set the projectId in store, but our Editor currently works statelessly for now
    router.push("/editor");
  };

  return (
    <AuthGate>
      <div className="min-h-screen flex flex-col bg-cream font-sans">
        {/* Top Nav */}
        <nav className="h-[72px] px-8 flex items-center justify-between shrink-0 border-b border-divider/10 bg-white">
          <div className="font-heading font-bold text-[24px] text-wine">FORMA</div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-stone">{user?.displayName}</span>
              <button
                onClick={signOut}
                className="text-[12px] text-wine hover:underline transition-all"
              >
                Sign Out
              </button>
            </div>
            <button
              onClick={() => router.push("/editor")}
              className="bg-wine text-white text-[13px] px-[24px] py-[10px] rounded-none hover:bg-wine-light transition-colors"
            >
              New Project
            </button>
          </div>
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
              : projects.map((project, i) => (
                  <motion.button
                    key={project.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                      delay: i * 0.08,
                    }}
                    onClick={() => handleOpenProject(project)}
                    className="group flex flex-col text-left h-[180px] bg-wine-muted px-6 py-5 border-t-[3px] border-t-wine transition-all duration-220 hover:bg-white hover:shadow-[0_2px_16px_rgba(107,26,42,0.08)] cursor-pointer"
                  >
                    <h2 className="font-heading font-bold text-[20px] text-charcoal mt-1 mb-auto truncate w-full">
                      {project.title}
                    </h2>
                    <p className="text-[12px] text-stone">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                  </motion.button>
                ))}
            {!isLoading && projects.length === 0 && (
              <div className="col-span-1 md:col-span-3 text-center py-12 text-[14px] text-stone border border-dashed border-divider">
                No projects yet. Create your first landing page!
              </div>
            )}
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
    </AuthGate>
  );
}
