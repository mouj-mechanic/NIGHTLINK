"use client";

import Link from "next/link";
import { useNightlink } from "@/lib/store";

export function MessagesPage() {
  const conversations = useNightlink((s) => s.conversations);
  const getAttendee = useNightlink((s) => s.getAttendee);
  const openChat = useNightlink((s) => s.openChat);
  const list = Object.values(conversations).filter((c) => c.unlocked);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-white">
        Messages
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Chat unlocks only after a mutual poke.
      </p>

      {list.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-white/15 py-16 text-center">
          <p className="text-muted-foreground">No unlocked conversations yet.</p>
          <Link
            href="/club/neon-athens"
            className="mt-4 inline-flex text-sm text-violet-300 underline"
          >
            Find MayaWave in Neon Athens
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-2">
          {list.map((c) => {
            const a = getAttendee(c.userId);
            const last = c.messages[c.messages.length - 1];
            return (
              <li key={c.userId}>
                <Link
                  href={`/club/neon-athens`}
                  onClick={() => openChat(c.userId)}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:border-violet-500/40"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a?.avatar}
                    alt=""
                    className="h-10 w-10 rounded-full bg-muted"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">
                      {a?.pseudo ?? c.userId}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {last?.text ?? "Matched · say hello"}
                    </p>
                  </div>
                  {c.matched && (
                    <span className="text-[10px] text-emerald-400">MATCHED</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
