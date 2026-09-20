"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, IdCard, Sparkles } from "lucide-react";
import { useNightlink } from "@/lib/store";

/** Inline bouncer — rendered inside ClubRoom so it shares the hydrated client tree. */
export function ClubAgeGate({ clubId }: { clubId: string }) {
  const router = useRouter();
  const ageVerified = useNightlink((s) => s.ageVerified);
  const requestEnter = useNightlink((s) => s.requestEnterClub);
  const [phase, setPhase] = useState<"choose" | "verifying" | "done">("choose");

  useEffect(() => {
    if (!ageVerified) requestEnter(clubId);
  }, [clubId, ageVerified, requestEnter]);

  if (ageVerified) return null;

  const startDemo = () => {
    setPhase("verifying");
    window.setTimeout(() => setPhase("done"), 700);
    window.setTimeout(() => {
      useNightlink.setState({ pendingClubId: clubId, showAgeGate: true });
      useNightlink.getState().completeAgeGate();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-md"
      data-testid="age-gate"
    >
      <div className="mx-4 w-full max-w-md rounded-2xl border border-white/10 bg-[#0c0a14] p-8 shadow-2xl">
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

        {phase === "choose" && (
          <div className="mt-6 space-y-3">
            <div className="flex w-full items-center gap-3 rounded-lg border border-white/15 px-3 py-3 opacity-60">
              <IdCard className="h-5 w-5 text-blue-400" />
              <span className="text-left text-sm">
                <span className="block font-medium">Verify with EU Age Proof</span>
                <span className="text-xs text-muted-foreground">Integration preview</span>
              </span>
            </div>
            <div className="flex w-full items-center gap-3 rounded-lg border border-white/15 px-3 py-3 opacity-60">
              <ShieldCheck className="h-5 w-5 text-violet-300" />
              <span className="text-left text-sm">
                <span className="block font-medium">Verify with ID provider</span>
                <span className="text-xs text-muted-foreground">Integration preview</span>
              </span>
            </div>
            <button
              type="button"
              data-testid="demo-age-verify"
              className="flex w-full items-center gap-3 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-3 py-3 text-sm font-medium text-white"
              onClick={startDemo}
            >
              <Sparkles className="h-5 w-5" />
              <span className="text-left">
                <span className="block font-medium">Demo verification</span>
                <span className="block text-xs text-white/80">
                  Instant 18+ pass for investors
                </span>
              </span>
            </button>
            <button
              type="button"
              className="w-full rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-white"
              onClick={() => {
                useNightlink.getState().cancelAgeGate();
                router.push("/");
              }}
            >
              Not now
            </button>
          </div>
        )}

        {phase === "verifying" && (
          <div className="mt-10 flex flex-col items-center gap-4 py-6">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
            <p className="text-sm text-muted-foreground">Checking age proof…</p>
          </div>
        )}

        {phase === "done" && (
          <div className="mt-8 flex flex-col items-center gap-3 py-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <p className="font-display text-xl text-white">AGE VERIFIED 18+</p>
            <p className="text-sm text-muted-foreground">Welcome to NIGHTLINK.</p>
          </div>
        )}

        <p className="mt-6 text-center text-[11px] leading-relaxed text-muted-foreground/80">
          Demo environment. No identity document is uploaded or stored.
        </p>
      </div>
    </div>
  );
}
