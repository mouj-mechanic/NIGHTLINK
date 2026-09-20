"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AMBIENT_EVENTS, CLUB_PARTY_FROM } from "@/lib/mock-data";
import { useNightlink } from "@/lib/store";

const REACTIONS = ["🔥", "❤️", "🎧", "⚡", "🙌"];

export function FloatingReactions() {
  const [items, setItems] = useState<
    { id: string; emoji: string; x: number; y: number }[]
  >([]);

  useEffect(() => {
    const id = setInterval(() => {
      const emoji = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
      const item = {
        id: `${Date.now()}-${Math.random()}`,
        emoji,
        x: 20 + Math.random() * 60,
        y: 55 + Math.random() * 30,
      };
      setItems((prev) => [...prev.slice(-8), item]);
      setTimeout(() => {
        setItems((prev) => prev.filter((p) => p.id !== item.id));
      }, 2800);
    }, 4200 + Math.random() * 2000);
    return () => clearInterval(id);
  }, []);

  // Allow director to inject
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { emoji?: string } | undefined;
      const emoji = detail?.emoji ?? REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
      const item = {
        id: `${Date.now()}-dir`,
        emoji,
        x: 30 + Math.random() * 40,
        y: 50 + Math.random() * 25,
      };
      setItems((prev) => [...prev, item]);
      setTimeout(() => {
        setItems((prev) => prev.filter((p) => p.id !== item.id));
      }, 2800);
    };
    window.addEventListener("nightlink-crowd-reaction", handler);
    return () => window.removeEventListener("nightlink-crowd-reaction", handler);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <AnimatePresence>
        {items.map((item) => (
          <motion.span
            key={item.id}
            initial={{ opacity: 0, y: 12, scale: 0.6 }}
            animate={{ opacity: 0.9, y: -40, scale: 1 }}
            exit={{ opacity: 0, y: -70 }}
            transition={{ duration: 2.4, ease: "easeOut" }}
            className="absolute text-lg"
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
          >
            {item.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function AmbientTicker() {
  const pushToast = useNightlink((s) => s.pushToast);
  const [line, setLine] = useState(AMBIENT_EVENTS[0]);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % AMBIENT_EVENTS.length;
      setLine(AMBIENT_EVENTS[i]);
      if (Math.random() > 0.55) pushToast(AMBIENT_EVENTS[i]);
    }, 5500);
    return () => clearInterval(id);
  }, [pushToast]);

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-muted-foreground">
      <span className="mr-2 text-violet-300">LIVE</span>
      <motion.span
        key={line}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {line}
      </motion.span>
    </div>
  );
}

export function PartyFromStrip() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-[10px] font-semibold tracking-[0.2em] text-violet-300">
        PARTYING FROM
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {CLUB_PARTY_FROM.map((c) => (
          <span
            key={c.country}
            className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/80"
          >
            {c.flag} {c.country} · {c.pct}%
          </span>
        ))}
      </div>
    </div>
  );
}

export function LiveElapsed({ startMinutes = 94 }: { startMinutes?: number }) {
  const [mins, setMins] = useState(startMinutes);
  useEffect(() => {
    const id = setInterval(() => setMins((m) => m + 1), 60000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return (
    <span className="tabular-nums">
      LIVE {h > 0 ? `${h}h ` : ""}
      {m}m
    </span>
  );
}

export function MiniVisualizer() {
  return (
    <div className="flex h-4 items-end gap-0.5">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.span
          key={i}
          className="w-0.5 rounded-full bg-violet-400/80"
          animate={{ height: [4, 12 + (i % 3) * 4, 6, 14, 4] }}
          transition={{
            duration: 0.9 + (i % 4) * 0.15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
