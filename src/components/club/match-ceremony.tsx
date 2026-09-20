"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNightlink } from "@/lib/store";
import { MAYA_WAVE } from "@/lib/mock-data";

export function MatchCeremony() {
  const open = useNightlink((s) => s.matchCeremony);
  const dismiss = useNightlink((s) => s.dismissMatchCeremony);
  const openChat = useNightlink((s) => s.openChat);
  const createTable = useNightlink((s) => s.createTable);
  const profile = useNightlink((s) => s.profile);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-violet-500/40 bg-gradient-to-b from-[#1a1030] to-[#0c0a14] p-8 text-center shadow-2xl"
          >
            <button
              type="button"
              className="absolute right-3 top-3 text-muted-foreground hover:text-white"
              onClick={dismiss}
            >
              <X className="h-4 w-4" />
            </button>
            <p className="text-[10px] font-semibold tracking-[0.3em] text-pink-300">
              CROWD MATCH
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatar}
                alt=""
                className="h-16 w-16 rounded-full border-2 border-white/30"
              />
              <Sparkles className="h-5 w-5 text-amber-300" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={MAYA_WAVE.avatar}
                alt=""
                className="h-16 w-16 rounded-full border-2 border-violet-400/50"
              />
            </div>
            <h2 className="mt-5 font-display text-2xl font-semibold text-white">
              YOU MATCHED IN THE CROWD 🔥
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              MayaWave poked you back · chat + table unlocked
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button
                className="flex-1 bg-violet-600 text-white"
                onClick={() => openChat(MAYA_WAVE.id)}
              >
                <MessageCircle className="h-4 w-4" />
                Open chat
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-pink-600 to-violet-600 text-white"
                onClick={() => createTable(MAYA_WAVE.id)}
              >
                Start a table
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
