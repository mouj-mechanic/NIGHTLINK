"use client";

import { useEffect } from "react";
import { useNightlink } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  const setHydrated = useNightlink((s) => s.setHydrated);

  useEffect(() => {
    setHydrated(true);
  }, [setHydrated]);

  return <>{children}</>;
}
