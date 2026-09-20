"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Clapperboard,
  Gift,
  MessageSquare,
  Sparkles,
  Users,
  Crown,
  PartyPopper,
  Hand,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNightlink } from "@/lib/store";
import { MAYA_WAVE } from "@/lib/mock-data";

const STEPS = [
  { id: 0, title: "World lobby", hint: "Scan clubs open worldwide." },
  { id: 1, title: "Choose Neon Athens", hint: "Enter the flagship room." },
  { id: 2, title: "Age verification", hint: "Pass the virtual bouncer." },
  { id: 3, title: "Inside the club", hint: "Feel DJ KOSMOS live." },
  { id: 4, title: "Browse the crowd", hint: "Open MayaWave’s profile." },
  { id: 5, title: "Poke", hint: "Send a tasteful poke." },
  { id: 6, title: "Poke back", hint: "Wait for the match (~2s)." },
  { id: 7, title: "Private chat", hint: "Message after mutual poke." },
  { id: 8, title: "Start a table", hint: "Private mini-room for 2." },
  { id: 9, title: "Invite a third", hint: "AlexBass joins · 3/4." },
  { id: 10, title: "Upgrade VIP", hint: "Demo checkout · 10 seats." },
  { id: 11, title: "Send a gift", hint: "Champagne for Emma’s party." },
];

const ACTIONS = [
  { id: "receive-poke", label: "Receive poke", icon: Hand },
  { id: "poke-back", label: "Poke MayaWave", icon: Sparkles },
  { id: "start-chat", label: "Start private chat", icon: MessageSquare },
  { id: "create-table", label: "Create table", icon: Users },
  { id: "add-third", label: "Add third attendee", icon: Users },
  { id: "upgrade-vip", label: "Upgrade VIP", icon: Crown },
  { id: "receive-gift", label: "Receive gift", icon: Gift },
  { id: "increase-audience", label: "Increase audience", icon: Users },
  { id: "start-birthday", label: "Start birthday", icon: PartyPopper },
];

export function DemoDirector() {
  const demoMode = useNightlink((s) => s.demoMode);
  const setDemoMode = useNightlink((s) => s.setDemoMode);
  const guidedStep = useNightlink((s) => s.guidedStep);
  const setGuidedStep = useNightlink((s) => s.setGuidedStep);
  const directorAction = useNightlink((s) => s.directorAction);
  const requestEnterClub = useNightlink((s) => s.requestEnterClub);
  const selectProfile = useNightlink((s) => s.selectProfile);
  const sendPoke = useNightlink((s) => s.sendPoke);
  const openChat = useNightlink((s) => s.openChat);
  const createTable = useNightlink((s) => s.createTable);
  const inviteToTable = useNightlink((s) => s.inviteToTable);
  const upgradeVip = useNightlink((s) => s.upgradeVip);
  const sendGift = useNightlink((s) => s.sendGift);
  const conversations = useNightlink((s) => s.conversations);
  const resetAge = useNightlink((s) => s.resetAgeVerification);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const ageVerified = useNightlink((s) => s.ageVerified);

  useEffect(() => {
    if (searchParams.get("demo") === "1") setDemoMode(true);
  }, [searchParams, setDemoMode]);

  const hideForGate = !ageVerified && pathname.startsWith("/club/");

  if ((!demoMode && searchParams.get("demo") !== "1") || hideForGate) return null;

  const runGuided = (step: number) => {
    setGuidedStep(step);
    switch (step) {
      case 0:
        router.push("/?demo=1");
        break;
      case 1:
      case 2:
        requestEnterClub("neon-athens");
        router.push("/club/neon-athens?demo=1");
        break;
      case 3:
        router.push("/club/neon-athens?demo=1");
        break;
      case 4:
        router.push("/club/neon-athens?demo=1");
        selectProfile(MAYA_WAVE.id);
        break;
      case 5:
        router.push("/club/neon-athens?demo=1");
        selectProfile(MAYA_WAVE.id);
        sendPoke(MAYA_WAVE.id);
        break;
      case 6:
        // poke back handled by auto timer
        break;
      case 7:
        openChat(MAYA_WAVE.id);
        break;
      case 8:
        createTable(MAYA_WAVE.id);
        break;
      case 9:
        inviteToTable("alex-bass");
        break;
      case 10:
        upgradeVip();
        break;
      case 11:
        router.push("/birthday/emma-30?demo=1");
        setTimeout(() => sendGift("Champagne"), 400);
        break;
      default:
        break;
    }
  };

  const next = () => {
    const cur = guidedStep ?? -1;
    const n = Math.min(cur + 1, STEPS.length - 1);
    runGuided(n);
  };

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: 24 }}
        animate={{ x: 0 }}
        className="fixed bottom-4 right-4 z-50 w-[min(100vw-2rem,340px)] rounded-2xl border border-violet-500/30 bg-[#0c0a14]/95 p-4 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="flex items-center gap-1.5 font-display text-xs tracking-[0.2em] text-violet-300">
              <Clapperboard className="h-3.5 w-3.5" />
              DEMO DIRECTOR
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Investor controls · local only
            </p>
          </div>
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-white"
            onClick={() => {
              setDemoMode(false);
              setGuidedStep(null);
            }}
          >
            Close
          </button>
        </div>

        <div className="mt-3 flex gap-2">
          <Button
            size="sm"
            className="flex-1 bg-gradient-to-r from-violet-600 to-blue-600 text-white"
            onClick={() => {
              if (guidedStep === null) runGuided(0);
              else next();
            }}
          >
            {guidedStep === null ? "Start guided demo" : "Next step"}
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          {guidedStep !== null && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setGuidedStep(null)}
            >
              Skip
            </Button>
          )}
        </div>

        {guidedStep !== null && (
          <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-2.5">
            <p className="text-xs font-medium text-white">
              Step {guidedStep + 1}/{STEPS.length}: {STEPS[guidedStep].title}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {STEPS[guidedStep].hint}
            </p>
            {guidedStep === 6 && !conversations[MAYA_WAVE.id]?.pokeBack && (
              <p className="mt-1 text-[11px] text-amber-300">
                Waiting for MayaWave auto poke-back…
              </p>
            )}
          </div>
        )}

        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {ACTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => directorAction(id)}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-left text-[11px] text-muted-foreground transition hover:border-violet-500/40 hover:text-white"
            >
              <Icon className="h-3 w-3 shrink-0 text-violet-300" />
              {label}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
          <Link href="/club/neon-athens?demo=1" className="underline">
            Neon Athens
          </Link>
          <Link href="/birthday/emma-30?demo=1" className="underline">
            Birthday
          </Link>
          <button type="button" className="underline" onClick={resetAge}>
            Reset age gate
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
