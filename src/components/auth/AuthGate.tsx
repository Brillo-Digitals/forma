"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Loading — show spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream">
        <div className="font-sans text-[13px] tracking-widest text-stone animate-pulse uppercase">
          Loading...
        </div>
      </div>
    );
  }

  // Not logged in — will redirect, show nothing
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream">
        <div className="font-sans text-[13px] tracking-widest text-stone animate-pulse uppercase">
          Redirecting...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
