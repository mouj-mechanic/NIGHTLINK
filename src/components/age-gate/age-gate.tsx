"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, IdCard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNightlink } from "@/lib/store";

export function AgeGate() {
  const show = useNightlink((s) => s.showAgeGate);
  const complete = useNightlink((s) => s.completeAgeGate);
  const cancel = useNightlink((s) => s.cancelAgeGate);
  const [phase, setPhase] = useState<"choose" | "verifying" | "done">("choose");

  useEffect(() => {
    if (show) setPhase("choose");
  }, [show]);

  if (!show) return null;

  const startDemo = () => {
    setPhase("verifying");
    setTimeout(() => setPhase("done"), 1600);
    setTimeout(() => complete(), 2600);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ y: 12 }}
        animate={{ y: 0 }}
        className="mx-4 w-full max-w-md rounded-2xl border border-white/10 bg-[#0c0a14] p-8 shadow-2xl"
      >
        <p className="font-display text-xs tracking-[0.3em] text-amber-300/90">
          VIRTUAL BOUNCER
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-white">
          ID please.
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          NIGHTLINK is an 18+ nightlife space. Choose a verification path to
          enter the room.
        </p>

        <AnimatePresence mode="wait">
          {phase === "choose" && (
            <motion.div
              key="choose"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 space-y-3"
            >
              <Button
                variant="outline"
                className="h-auto w-full justify-start gap-3 border-white/15 py-3"
                disabled
              >
                <IdCard className="h-5 w-5 text-electric" />
                <span className="text-left">
                  <span className="block font-medium">Verify with EU Age Proof</span>
                  <span className="text-xs text-muted-foreground">
                    Integration preview
                  </span>
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-auto w-full justify-start gap-3 border-white/15 py-3"
                disabled
              >
                <ShieldCheck className="h-5 w-5 text-violet-300" />
                <span className="text-left">
                  <span className="block font-medium">Verify with ID provider</span>
                  <span className="text-xs text-muted-foreground">
                    Integration preview
                  </span>
                </span>
              </Button>
              <Button
                className="h-auto w-full justify-start gap-3 bg-gradient-to-r from-violet-600 to-blue-600 py-3 text-white"
                onClick={startDemo}
              >
                <Sparkles className="h-5 w-5" />
                <span className="text-left">
                  <span className="block font-medium">Demo verification</span>
                  <span className="text-xs text-white/80">
                    Instant 18+ pass for investors
                  </span>
                </span>
              </Button>
              <Button variant="ghost" className="w-full" onClick={cancel}>
                Not now
              </Button>
            </motion.div>
          )}

          {phase === "verifying" && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-10 flex flex-col items-center gap-4 py-6"
            >
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
              <p className="text-sm text-muted-foreground">Checking age proof…</p>
            </motion.div>
          )}

          {phase === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 flex flex-col items-center gap-3 py-4 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <p className="font-display text-xl text-white">AGE VERIFIED 18+</p>
              <p className="text-sm text-muted-foreground">Welcome to NIGHTLINK.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-muted-foreground/80">
          Demo environment. No identity document is uploaded or stored.
        </p>
      </motion.div>
    </div>
  );
}
