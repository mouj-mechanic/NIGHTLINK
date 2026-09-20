"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EVENTS } from "@/lib/mock-data";
import type { EventCategory } from "@/lib/types";
import { useNightlink } from "@/lib/store";
import { cn } from "@/lib/utils";

const CATS: (EventCategory | "All")[] = [
  "All",
  "Virtual Clubs",
  "Birthdays",
  "Real Nightclubs",
  "Concerts",
  "Festivals",
  "Sports Watch Parties",
];

export function EventsPage() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const pushToast = useNightlink((s) => s.pushToast);

  const list = useMemo(
    () => (cat === "All" ? EVENTS : EVENTS.filter((e) => e.category === cat)),
    [cat]
  );
  const selected = EVENTS.find((e) => e.id === checkoutId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
        Events
      </h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Virtual clubs, birthdays, real venues, concerts, festivals, and sports
        watch parties — one social layer for any live moment.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition",
              cat === c
                ? "border-violet-500 bg-violet-500/20 text-white"
                : "border-white/10 text-muted-foreground hover:border-white/25"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((e, i) => (
          <motion.article
            key={e.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-card/50"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={e.image}
              alt=""
              className="aspect-[16/9] w-full object-cover opacity-80"
            />
            <div className="space-y-3 p-4">
              <Badge variant="secondary" className="text-[10px]">
                {e.category}
              </Badge>
              <h2 className="font-display text-lg text-white">{e.title}</h2>
              <p className="text-sm text-muted-foreground">{e.description}</p>
              <p className="text-xs text-muted-foreground">
                {e.flag} {e.city} · {e.date}
              </p>
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-violet-200">
                  {e.price === "Free" ? "Free" : `€${e.price}`}
                </span>
                {e.category === "Birthdays" ? (
                  <Link
                    href="/birthday/emma-30"
                    className="inline-flex h-7 items-center rounded-lg bg-pink-600 px-2.5 text-[0.8rem] font-medium text-white"
                  >
                    Join party
                  </Link>
                ) : e.category === "Virtual Clubs" ? (
                  <Link
                    href="/club/neon-athens"
                    className="inline-flex h-7 items-center rounded-lg bg-violet-600 px-2.5 text-[0.8rem] font-medium text-white"
                  >
                    Enter club
                  </Link>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/15"
                    onClick={() => setCheckoutId(e.id)}
                  >
                    <Ticket className="h-3.5 w-3.5" />
                    {e.realWorldTicket ? "Buy official ticket" : "Get ticket"}
                  </Button>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <Dialog open={!!checkoutId} onOpenChange={(o) => !o && setCheckoutId(null)}>
        <DialogContent className="border-white/10 bg-[#12101a]">
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>
              Demo checkout only — no Stripe, no real charge.
              {selected?.realWorldTicket
                ? " Official ticket placeholder for real-world venues."
                : ""}
            </DialogDescription>
          </DialogHeader>
          <p className="font-display text-2xl text-white">
            {selected?.price === "Free" ? "Free" : `€${selected?.price}`}
          </p>
          <Button
            className="w-full bg-violet-600 text-white"
            onClick={() => {
              pushToast("Demo ticket confirmed.");
              setCheckoutId(null);
            }}
          >
            Confirm demo purchase
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
