"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cake, Gift, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GIFT_CATALOG } from "@/lib/mock-data";
import { useNightlink } from "@/lib/store";
import type { GiftType } from "@/lib/types";

export function BirthdayPage() {
  const birthday = useNightlink((s) => s.birthday);
  const sendGift = useNightlink((s) => s.sendGift);
  const writeWall = useNightlink((s) => s.writeWall);
  const giftAnimation = useNightlink((s) => s.giftAnimation);
  const createTable = useNightlink((s) => s.createTable);
  const [wallText, setWallText] = useState("");
  const [giftOpen, setGiftOpen] = useState(false);

  return (
    <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-pink-500/30 bg-gradient-to-br from-pink-950/50 via-[#120a14] to-violet-950/40">
        <div className="relative aspect-[21/9] min-h-[200px]">
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, #ec489960, transparent 50%)",
                "radial-gradient(circle at 80% 40%, #a78bfa60, transparent 50%)",
                "radial-gradient(circle at 40% 80%, #f59e0b40, transparent 50%)",
                "radial-gradient(circle at 20% 50%, #ec489960, transparent 50%)",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-300">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400 live-pulse" />
              BIRTHDAY LIVE
            </span>
            <h1 className="mt-4 font-display text-3xl font-semibold text-white sm:text-5xl">
              {birthday.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Host camera · {birthday.flag} {birthday.city} · {birthday.guests}{" "}
              guests · {birthday.countries} countries
            </p>
          </div>
        </div>

        <div className="grid gap-4 border-t border-white/10 p-5 sm:grid-cols-4">
          <Button
            className="bg-pink-600 text-white"
            onClick={() =>
              useNightlink.getState().pushToast("Joined Emma's birthday party")
            }
          >
            <Users className="h-4 w-4" />
            Join party
          </Button>
          <Button
            variant="outline"
            className="border-white/15"
            onClick={() => setGiftOpen(true)}
          >
            <Gift className="h-4 w-4" />
            Send gift
          </Button>
          <Button
            variant="outline"
            className="border-white/15"
            onClick={() => createTable("maya-wave")}
          >
            Join table
          </Button>
          <Link
            href="/events"
            className="inline-flex h-8 items-center justify-center rounded-lg px-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            All events
          </Link>
        </div>
      </div>

      {giftOpen && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-card/60 p-5">
          <h2 className="font-display text-lg text-white">Send a gift</h2>
          <p className="text-xs text-muted-foreground">
            Hypothetical prices · demo only · no real money
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-5">
            {GIFT_CATALOG.map((g) => (
              <button
                key={g.type}
                type="button"
                onClick={() => {
                  sendGift(g.type as GiftType);
                  setGiftOpen(false);
                }}
                className="rounded-xl border border-white/10 bg-white/5 p-4 text-center transition hover:border-pink-500/40"
              >
                <span className="text-3xl">{g.emoji}</span>
                <p className="mt-2 text-sm text-white">{g.label}</p>
                <p className="text-xs text-muted-foreground">€{g.price}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-card/40 p-5">
          <h2 className="flex items-center gap-2 font-display text-lg text-white">
            <Cake className="h-5 w-5 text-pink-300" />
            Birthday wall
          </h2>
          <form
            className="mt-3 space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!wallText.trim()) return;
              writeWall(wallText.trim());
              setWallText("");
            }}
          >
            <Textarea
              value={wallText}
              onChange={(e) => setWallText(e.target.value)}
              placeholder="Write on the wall…"
              className="border-white/10 bg-white/5"
            />
            <Button type="submit" size="sm" className="bg-violet-600 text-white">
              Post
            </Button>
          </form>
          <div className="mt-4 space-y-3">
            {birthday.wall.map((w) => (
              <div key={w.id} className="rounded-xl bg-white/5 px-3 py-2">
                <p className="text-xs text-violet-300">{w.author}</p>
                <p className="text-sm text-white/90">{w.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-card/40 p-5">
          <h2 className="font-display text-lg text-white">Gifts received</h2>
          {birthday.giftsReceived.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              No gifts yet — be the first with Champagne.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {birthday.giftsReceived.map((g, i) => (
                <li
                  key={`${g.at}-${i}`}
                  className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm"
                >
                  <span>
                    {g.gift} from {g.from}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(g.at).toLocaleTimeString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <AnimatePresence>
        {giftAnimation && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.4, y: 40 }}
              animate={{ scale: 1.2, y: -20 }}
              exit={{ opacity: 0, y: -80 }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
              className="rounded-full bg-pink-500/20 px-10 py-8 text-center backdrop-blur-md"
            >
              <p className="text-5xl">
                {GIFT_CATALOG.find((g) => g.type === giftAnimation)?.emoji}
              </p>
              <p className="mt-2 font-display text-xl text-white">
                {giftAnimation} sent!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
