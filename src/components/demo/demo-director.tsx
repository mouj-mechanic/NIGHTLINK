"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Gift,
  MessageSquare,
  Sparkles,
  Users,
  Crown,
  PartyPopper,
  Hand,
  RotateCcw,
  Home,
  DoorOpen,
  ShieldCheck,
  User,
  Camera,
  Music2,
  Zap,
  Plus,
  SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNightlink } from "@/lib/store";
import { MAYA_WAVE } from "@/lib/mock-data";

const GUIDE = [
  { title: "World lobby", hint: "Feel the global room energy.", highlight: "lobby", route: "/?demo=1" },
  { title: "Enter Neon Athens", hint: "Tap Enter Neon Athens.", highlight: "enter", route: "/club/neon-athens?demo=1" },
  { title: "Virtual bouncer", hint: "Demo verification · 18+.", highlight: "age", route: "/club/neon-athens?demo=1" },
  { title: "Feel the club", hint: "DJ KOSMOS · live crowd · track.", highlight: "club", route: "/club/neon-athens?demo=1" },
  { title: "Open MayaWave", hint: "87% MUSIC MATCH in the crowd.", highlight: "maya", route: "/club/neon-athens?demo=1" },
  { title: "Send a poke", hint: "Wait for the poke-back beat.", highlight: "poke", route: "/club/neon-athens?demo=1" },
  { title: "Matched → chat", hint: "Open chat after the ceremony.", highlight: "chat", route: "/club/neon-athens?demo=1" },
  { title: "Start Table 12", hint: "Spatial table · music continues.", highlight: "table", route: "/club/neon-athens?demo=1" },
  { title: "Invite AlexBass", hint: "92% match joins seat 3.", highlight: "invite", route: "/club/neon-athens?demo=1" },
  { title: "VIP upgrade", hint: "€4.99 demo · Midnight Crew.", highlight: "vip", route: "/club/neon-athens?demo=1" },
  { title: "Send Champagne", hint: "Gift animation over the table.", highlight: "gift", route: "/club/neon-athens?demo=1" },
];

const ACTIONS: { id: string; label: string; icon: typeof Hand }[] = [
  { id: "reset-demo", label: "Reset Demo", icon: RotateCcw },
  { id: "go-lobby", label: "Go to Lobby", icon: Home },
  { id: "enter-athens", label: "Enter Neon Athens", icon: DoorOpen },
  { id: "verify-age", label: "Verify Age", icon: ShieldCheck },
  { id: "open-maya", label: "Open Maya", icon: User },
  { id: "send-poke", label: "Send Poke", icon: Hand },
  { id: "maya-poke-back", label: "Maya Poke Back", icon: Sparkles },
  { id: "open-chat", label: "Open Chat", icon: MessageSquare },
  { id: "maya-message", label: "Maya Message", icon: MessageSquare },
  { id: "create-table", label: "Create Table", icon: Users },
  { id: "maya-camera", label: "Maya Camera On", icon: Camera },
  { id: "invite-alex", label: "Invite AlexBass", icon: Plus },
  { id: "upgrade-vip", label: "Upgrade VIP", icon: Crown },
  { id: "send-champagne", label: "Send Champagne", icon: Gift },
  { id: "add-listeners", label: "+100 listeners", icon: Users },
  { id: "next-track", label: "Next Track", icon: Music2 },
  { id: "crowd-reaction", label: "Crowd Reaction", icon: Zap },
  { id: "start-birthday", label: "Birthday Party", icon: PartyPopper },
];

export function DemoDirector() {
  const demoMode = useNightlink((s) => s.demoMode);
  const setDemoMode = useNightlink((s) => s.setDemoMode);
  const guidedStep = useNightlink((s) => s.guidedStep);
  const setGuidedStep = useNightlink((s) => s.setGuidedStep);
  const setGuidedHighlight = useNightlink((s) => s.setGuidedHighlight);
  const directorAction = useNightlink((s) => s.directorAction);
  const applyPreset = useNightlink((s) => s.applyPreset);
  const resetEverything = useNightlink((s) => s.resetEverything);
  const selectProfile = useNightlink((s) => s.selectProfile);
  const sendPoke = useNightlink((s) => s.sendPoke);
  const openChat = useNightlink((s) => s.openChat);
  const createTable = useNightlink((s) => s.createTable);
  const inviteToTable = useNightlink((s) => s.inviteToTable);
  const upgradeVip = useNightlink((s) => s.upgradeVip);
  const sendTableGift = useNightlink((s) => s.sendTableGift);
  const completeAgeGate = useNightlink((s) => s.completeAgeGate);
  const setSkipIntro = useNightlink((s) => s.setSkipIntro);
  const markIntroComplete = useNightlink((s) => s.markIntroComplete);
  const introComplete = useNightlink((s) => s.introComplete);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const ageVerified = useNightlink((s) => s.ageVerified);

  useEffect(() => {
    if (searchParams.get("demo") === "1") setDemoMode(true);
  }, [searchParams, setDemoMode]);

  const hideForGate = !ageVerified && pathname.startsWith("/club/");
  if ((!demoMode && searchParams.get("demo") !== "1") || hideForGate) return null;

  const goStep = (step: number) => {
    const s = Math.max(0, Math.min(step, GUIDE.length - 1));
    setGuidedStep(s);
    setGuidedHighlight(GUIDE[s].highlight);
    router.push(GUIDE[s].route);
    // Highlight-only — optional soft staging, no forced timers for director
    if (s === 4) selectProfile(MAYA_WAVE.id);
    if (s === 2) {
      useNightlink.setState({ pendingClubId: "neon-athens" });
    }
  };

  const runAction = (id: string) => {
    if (id === "go-lobby") {
      directorAction(id);
      router.push("/?demo=1");
      return;
    }
    if (id === "enter-athens") {
      directorAction(id);
      router.push("/club/neon-athens?demo=1");
      return;
    }
    if (id === "verify-age") {
      useNightlink.setState({ pendingClubId: "neon-athens", showAgeGate: true });
      completeAgeGate();
      router.push("/club/neon-athens?demo=1");
      return;
    }
    if (id === "open-maya" || id === "send-poke" || id === "maya-poke-back" || id === "open-chat" || id === "maya-message" || id === "create-table" || id === "maya-camera" || id === "invite-alex" || id === "upgrade-vip" || id === "send-champagne" || id === "add-listeners" || id === "next-track" || id === "crowd-reaction") {
      if (!pathname.startsWith("/club/")) router.push("/club/neon-athens?demo=1");
      if (!useNightlink.getState().ageVerified) {
        useNightlink.setState({ pendingClubId: "neon-athens" });
        completeAgeGate();
      }
    }
    if (id === "start-birthday") {
      directorAction(id);
      router.push("/birthday/emma-30?demo=1");
      return;
    }
    if (id === "reset-demo") {
      resetEverything();
      router.push("/?demo=1");
      return;
    }
    directorAction(id);
  };

  const apply = (preset: "start" | "social" | "table" | "vip") => {
    applyPreset(preset);
    if (preset === "start") router.push("/?demo=1");
    else router.push("/club/neon-athens?demo=1");
  };

  return (
    <motion.aside
      initial={{ x: 24 }}
      animate={{ x: 0 }}
      className="fixed bottom-4 right-4 z-50 max-h-[min(92vh,640px)] w-[min(100vw-2rem,360px)] overflow-y-auto rounded-2xl border border-violet-500/30 bg-[#0c0a14]/96 p-4 shadow-2xl backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="flex items-center gap-1.5 font-display text-xs tracking-[0.2em] text-violet-300">
            <Clapperboard className="h-3.5 w-3.5" />
            DEMO DIRECTOR
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Instant controls · local only
          </p>
        </div>
        <button
          type="button"
          className="text-xs text-muted-foreground hover:text-white"
          onClick={() => {
            setDemoMode(false);
            setGuidedStep(null);
            setGuidedHighlight(null);
          }}
        >
          Close
        </button>
      </div>

      <Button
        size="sm"
        className="mt-3 w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white"
        onClick={() => goStep(guidedStep === null ? 0 : Math.min((guidedStep ?? 0) + 1, GUIDE.length - 1))}
      >
        {guidedStep === null ? "START 3-MINUTE DEMO" : "NEXT"}
        <ChevronRight className="h-3.5 w-3.5" />
      </Button>

      {!introComplete && (
        <button
          type="button"
          data-testid="director-skip-intro"
          onClick={() => {
            setSkipIntro(true);
            markIntroComplete();
            useNightlink.setState({ ageVerified: true, showAgeGate: false });
            router.push("/?demo=1");
          }}
          className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2 py-2 text-[11px] font-medium text-amber-100 hover:bg-amber-500/20"
        >
          <SkipForward className="h-3.5 w-3.5" />
          Skip Intro / Go straight inside
        </button>
      )}

      {guidedStep !== null && (
        <div className="mt-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5">
          <p className="text-xs font-medium text-white">
            Highlight {guidedStep + 1}/{GUIDE.length}: {GUIDE[guidedStep].title}
          </p>
          <p className="text-[11px] text-amber-100/90">{GUIDE[guidedStep].hint}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            No auto-click — perform the action, then NEXT.
          </p>
          <div className="mt-2 flex gap-1">
            <Button
              size="sm"
              variant="outline"
              className="h-7 flex-1 border-white/15"
              disabled={guidedStep <= 0}
              onClick={() => goStep(guidedStep - 1)}
            >
              <ChevronLeft className="h-3 w-3" /> BACK
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7"
              onClick={() => {
                setGuidedStep(null);
                setGuidedHighlight(null);
              }}
            >
              EXIT
            </Button>
          </div>
        </div>
      )}

      <div className="mt-3">
        <p className="mb-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground">
          PRESETS
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {(
            [
              ["start", "1 START"],
              ["social", "2 SOCIAL"],
              ["table", "3 TABLE"],
              ["vip", "4 VIP"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => apply(id)}
              className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-[11px] text-violet-100 hover:border-violet-500/40"
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            resetEverything();
            router.push("/?demo=1");
          }}
          className="mt-1.5 w-full rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1.5 text-[11px] text-red-200 hover:bg-red-500/20"
        >
          RESET EVERYTHING
        </button>
      </div>

      <div className="mt-3">
        <p className="mb-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground">
          CONTROLS
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {ACTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => runAction(id)}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-left text-[11px] text-muted-foreground transition hover:border-violet-500/40 hover:text-white"
            >
              <Icon className="h-3 w-3 shrink-0 text-violet-300" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
        <Link href="/club/neon-athens?demo=1" className="underline">
          Neon Athens
        </Link>
        <Link href="/birthday/emma-30?demo=1" className="underline">
          Birthday
        </Link>
        <button
          type="button"
          className="underline"
          onClick={() => {
            sendPoke(MAYA_WAVE.id);
          }}
        >
          Quick poke
        </button>
        <button
          type="button"
          className="underline"
          onClick={() => {
            openChat(MAYA_WAVE.id);
          }}
        >
          Chat
        </button>
        <button
          type="button"
          className="underline"
          onClick={() => createTable(MAYA_WAVE.id)}
        >
          Table
        </button>
        <button
          type="button"
          className="underline"
          onClick={() => {
            inviteToTable("alex-bass");
            upgradeVip();
            sendTableGift("Champagne", MAYA_WAVE.id);
          }}
        >
          VIP+gift
        </button>
      </div>
    </motion.aside>
  );
}
