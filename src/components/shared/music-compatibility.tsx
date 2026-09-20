"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Deterministic music match viz — Maya always 87%, AlexBass 92%. */
export function MusicCompatibility({
  percent,
  shared = [],
  compact = false,
  className,
}: {
  percent: number;
  shared?: string[];
  compact?: boolean;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, percent));
  const r = compact ? 28 : 42;
  const stroke = compact ? 5 : 7;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative shrink-0">
        <svg
          width={(r + stroke) * 2}
          height={(r + stroke) * 2}
          className="-rotate-90"
        >
          <circle
            cx={r + stroke}
            cy={r + stroke}
            r={r}
            fill="none"
            stroke="rgb(255 255 255 / 0.08)"
            strokeWidth={stroke}
          />
          <motion.circle
            cx={r + stroke}
            cy={r + stroke}
            r={r}
            fill="none"
            stroke="url(#matchGrad)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="matchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-display font-semibold text-white", compact ? "text-sm" : "text-lg")}>
            {pct}%
          </span>
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-violet-300">
          MUSIC MATCH
        </p>
        {!compact && shared.length > 0 && (
          <p className="mt-1 text-xs text-muted-foreground">
            Shared: {shared.slice(0, 4).join(" · ")}
          </p>
        )}
      </div>
    </div>
  );
}
