"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useNightlink } from "@/lib/store";

export function ToastBridge() {
  const queue = useNightlink((s) => s.toastQueue);
  const clear = useNightlink((s) => s.clearToast);

  useEffect(() => {
    if (queue.length === 0) return;
    const text = queue[0];
    toast(text, {
      className: "glass border-white/10",
    });
    clear();
  }, [queue, clear]);

  return null;
}
