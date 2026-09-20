"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IdCard, ShieldCheck, Sparkles, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNightlink } from "@/lib/store";

export type CinematicPhase =
  | "exterior"
  | "approach"
  | "id-check"
  | "verifying"
  | "verified"
  | "doors"
  | "corridor"
  | "done";

export function CinematicEntrance({
  onComplete,
  forcePhase,
}: {
  onComplete: () => void;
  forcePhase?: CinematicPhase | null;
}) {
  const completeAgeGate = useNightlink((s) => s.completeAgeGate);
  const skipIntro = useNightlink((s) => s.skipIntro);
  const markIntroComplete = useNightlink((s) => s.markIntroComplete);
  const [phase, setPhase] = useState<CinematicPhase>("exterior");
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (forcePhase) setPhase(forcePhase);
  }, [forcePhase]);

  useEffect(() => {
    if (skipIntro) {
      onComplete();
    }
  }, [skipIntro, onComplete]);

  useEffect(() => {
    if (phase === "approach") {
      setZoom(1.12);
      const t = setTimeout(() => setPhase("id-check"), 1600);
      return () => clearTimeout(t);
    }
    if (phase === "verified") {
      const t = setTimeout(() => setPhase("doors"), 1600);
      return () => clearTimeout(t);
    }
    if (phase === "doors") {
      const t = setTimeout(() => setPhase("corridor"), 2200);
      return () => clearTimeout(t);
    }
    if (phase === "corridor") {
      const t = setTimeout(() => {
        markIntroComplete();
        setPhase("done");
        onComplete();
      }, 2400);
      return () => clearTimeout(t);
    }
  }, [phase, markIntroComplete, onComplete]);

  const startDemoVerify = () => {
    setPhase("verifying");
    window.setTimeout(() => {
      useNightlink.setState({ pendingClubId: null });
      completeAgeGate();
      // completeAgeGate may no-op without pendingClubId — force verify
      useNightlink.setState({ ageVerified: true, showAgeGate: false });
      setPhase("verified");
    }, 1400);
  };

  const skip = () => {
    useNightlink.getState().setSkipIntro(true);
    useNightlink.setState({ ageVerified: true, showAgeGate: false });
    markIntroComplete();
    onComplete();
  };

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-[55] overflow-hidden bg-black">
      <button
        type="button"
        onClick={skip}
        className="absolute right-4 top-4 z-[60] inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur-md hover:bg-black/70"
      >
        <SkipForward className="h-3.5 w-3.5" />
        Skip Intro
      </button>

      <AnimatePresence mode="wait">
        {(phase === "exterior" || phase === "approach") && (
          <motion.div
            key="exterior"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: zoom }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cinematic/exterior.svg"
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
            {/* guards */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cinematic/guard.svg"
              alt=""
              className="absolute bottom-[8%] left-[18%] h-[48%] w-auto opacity-95 drop-shadow-2xl md:left-[22%]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cinematic/guard.svg"
              alt=""
              className="absolute bottom-[8%] right-[18%] h-[48%] w-auto scale-x-[-1] opacity-95 drop-shadow-2xl md:right-[22%]"
            />
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 px-4 pb-16 text-center">
              <p className="font-display text-xs tracking-[0.4em] text-violet-300">
                NIGHTLINK
              </p>
              <h1 className="max-w-2xl font-display text-3xl font-semibold text-white sm:text-5xl neon-text">
                The night is already waiting.
              </h1>
              <p className="max-w-md text-sm text-muted-foreground">
                Luxury nightlife. Neon city. Enter the room.
              </p>
              {phase === "exterior" && (
                <Button
                  size="lg"
                  className="mt-2 bg-gradient-to-r from-violet-600 to-pink-600 px-8 text-white"
                  onClick={() => setPhase("approach")}
                  data-testid="cinematic-enter"
                >
                  Approach the entrance
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {(phase === "id-check" || phase === "verifying") && (
          <motion.div
            key="id"
            className="absolute inset-0 flex items-end justify-center bg-black sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cinematic/exterior.svg"
              alt=""
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-[2px]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cinematic/guard.svg"
              alt=""
              className="absolute bottom-0 left-1/2 hidden h-[70%] -translate-x-[120%] opacity-90 sm:block"
            />
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative z-10 m-4 w-full max-w-md rounded-2xl border border-amber-500/30 bg-[#0c0a14]/95 p-7 shadow-2xl backdrop-blur-xl"
              data-testid="cinematic-id-check"
            >
              <p className="font-display text-xs tracking-[0.3em] text-amber-300">
                VIRTUAL BOUNCER
              </p>
              <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">
                ID check please.
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                One guard raises a hand. NIGHTLINK is 18+. Choose a verification
                path.
              </p>

              {phase === "verifying" ? (
                <div className="mt-10 flex flex-col items-center gap-3 py-6">
                  <div className="h-12 w-12 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                  <p className="text-sm text-muted-foreground">Checking age proof…</p>
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  <Button
                    variant="outline"
                    className="h-auto w-full justify-start gap-3 border-white/15 py-3"
                    disabled
                  >
                    <IdCard className="h-5 w-5 text-blue-400" />
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
                  <button
                    type="button"
                    data-testid="cinematic-demo-verify"
                    className="flex h-auto w-full items-center justify-start gap-3 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-3 py-3 text-sm font-medium text-white"
                    onClick={startDemoVerify}
                  >
                    <Sparkles className="h-5 w-5" />
                    <span className="text-left">
                      <span className="block font-medium">Demo verification</span>
                      <span className="block text-xs text-white/80">
                        Instant 18+ pass for investors
                      </span>
                    </span>
                  </button>
                </div>
              )}
              <p className="mt-5 text-center text-[11px] text-muted-foreground/80">
                Demo environment. No identity document is uploaded or stored.
              </p>
            </motion.div>
          </motion.div>
        )}

        {phase === "verified" && (
          <motion.div
            key="verified"
            className="absolute inset-0 flex items-center justify-center bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <p className="mt-4 font-display text-2xl text-white sm:text-3xl">
                ✓ AGE VERIFIED 18+
              </p>
              <p className="mt-2 font-display text-lg tracking-[0.2em] text-violet-300">
                WELCOME TO NIGHTLINK
              </p>
            </div>
          </motion.div>
        )}

        {phase === "doors" && (
          <motion.div
            key="doors"
            className="absolute inset-0 overflow-hidden bg-[#050308]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            data-testid="cinematic-doors"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cinematic/exterior.svg"
              alt=""
              className="absolute inset-0 h-full w-full scale-125 object-cover opacity-40"
            />
            <motion.div
              className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#0c0814] to-[#1a1028] shadow-2xl"
              initial={{ x: 0 }}
              animate={{ x: "-96%" }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#0c0814] to-[#1a1028] shadow-2xl"
              initial={{ x: 0 }}
              animate={{ x: "96%" }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-rose-900/40 via-violet-500/20 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1.2 }}
            />
            <div className="absolute inset-x-0 bottom-16 text-center">
              <p className="font-display text-sm tracking-[0.3em] text-rose-200">
                DOORS OPEN
              </p>
              <div className="mx-auto mt-4 h-2 w-48 rounded-full bg-gradient-to-r from-transparent via-rose-600 to-transparent opacity-80" />
            </div>
          </motion.div>
        )}

        {phase === "corridor" && (
          <motion.div
            key="corridor"
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            data-testid="cinematic-corridor"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cinematic/corridor.svg"
              alt=""
              className="h-full w-full object-cover"
            />
            <motion.div
              className="absolute inset-0 bg-violet-500/10"
              animate={{ opacity: [0.1, 0.35, 0.1] }}
              transition={{ duration: 0.6, repeat: 3 }}
            />
            <div className="absolute inset-x-0 bottom-20 text-center">
              <p className="font-display text-xs tracking-[0.35em] text-violet-200">
                VESTIAIRE · CORRIDOR
              </p>
              <p className="mt-2 text-sm text-white/70">
                Mirrors. Cloakroom. The bass is already here.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
