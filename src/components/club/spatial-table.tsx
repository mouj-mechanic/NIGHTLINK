"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  CameraOff,
  Crown,
  Gift,
  Mic,
  MicOff,
  Send,
  UserPlus,
  Volume2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GIFT_CATALOG, TABLE_INVITEES } from "@/lib/mock-data";
import { useNightlink } from "@/lib/store";
import type { GiftType } from "@/lib/types";
import { cn } from "@/lib/utils";

const REACT_EMOJIS = ["🥂", "🔥", "❤️", "😂", "🙌"];

function seatPosition(i: number, total: number, radius: number) {
  // Start from top, clockwise
  const angle = -Math.PI / 2 + (i / total) * Math.PI * 2;
  return {
    left: `calc(50% + ${Math.cos(angle) * radius}px)`,
    top: `calc(50% + ${Math.sin(angle) * radius}px)`,
  };
}

export function SpatialTablePanel() {
  const myTable = useNightlink((s) => s.myTable)!;
  const getAttendee = useNightlink((s) => s.getAttendee);
  const profile = useNightlink((s) => s.profile);
  const inviteToTable = useNightlink((s) => s.inviteToTable);
  const upgradeVip = useNightlink((s) => s.upgradeVip);
  const leaveTable = useNightlink((s) => s.leaveTable);
  const setTableCamera = useNightlink((s) => s.setTableCamera);
  const setTableMuted = useNightlink((s) => s.setTableMuted);
  const setDjVolume = useNightlink((s) => s.setDjVolume);
  const setTableVoices = useNightlink((s) => s.setTableVoices);
  const askMayaCamera = useNightlink((s) => s.askMayaCamera);
  const sendTableChat = useNightlink((s) => s.sendTableChat);
  const addTableReaction = useNightlink((s) => s.addTableReaction);
  const sendTableGift = useNightlink((s) => s.sendTableGift);
  const selectProfile = useNightlink((s) => s.selectProfile);

  const [text, setText] = useState("");
  const [checkout, setCheckout] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [giftTo, setGiftTo] = useState("maya-wave");

  const occupied = myTable.seats.filter((s) => s.userId).length;
  const radius = myTable.isVip ? 132 : 118;
  const displaySeats = myTable.isVip
    ? myTable.seats
    : myTable.seats.slice(0, 4);

  const primaryIds = useMemo(
    () =>
      myTable.seats
        .map((s) => s.userId)
        .filter((id): id is string => Boolean(id)),
    [myTable.seats]
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0.6, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative overflow-hidden rounded-3xl border p-4",
        myTable.isVip
          ? "border-amber-400/40 bg-gradient-to-b from-amber-950/40 via-[#14101c] to-violet-950/30 shadow-[0_0_40px_rgb(245_158_11/0.15)]"
          : "border-violet-500/35 bg-gradient-to-b from-violet-950/45 to-card/70"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-display text-lg text-white">{myTable.name}</p>
          <p className="text-xs text-muted-foreground">
            {occupied}/{myTable.maxSeats} · still inside the club · DJ in background
          </p>
        </div>
        <div className="flex items-center gap-2">
          {myTable.isVip && (
            <Badge className="bg-amber-500/25 text-amber-100">VIP</Badge>
          )}
          <Badge variant="secondary" className="text-[10px]">
            {myTable.visibility}
          </Badge>
          <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] text-violet-200">
            NIGHTLINK+
          </span>
        </div>
      </div>

      {/* Spatial table */}
      <div className="relative mx-auto mt-4 h-[300px] w-full max-w-[340px]">
        <div className="absolute left-1/2 top-1/2 h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-gradient-to-br from-white/10 to-transparent shadow-inner" />
        <div className="absolute left-1/2 top-1/2 h-[70px] w-[70px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-400/20 bg-black/40" />
        <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] tracking-widest text-white/40">
          TABLE
        </p>

        {displaySeats.map((seat, i) => {
          const pos = seatPosition(i, displaySeats.length, radius);
          const person =
            seat.userId === "me"
              ? { pseudo: "You", avatar: profile.avatar, id: "me" }
              : seat.userId
                ? getAttendee(seat.userId)
                : null;
          const showMayaCam =
            seat.userId === "maya-wave" && myTable.mayaCameraOn;
          const showMyCam = seat.userId === "me" && myTable.myCameraOn;

          return (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={pos}
            >
              {person ? (
                <button
                  type="button"
                  onClick={() =>
                    seat.userId &&
                    seat.userId !== "me" &&
                    selectProfile(seat.userId)
                  }
                  className="group relative flex w-[72px] flex-col items-center"
                >
                  <div
                    className={cn(
                      "relative h-14 w-14 overflow-hidden rounded-full border-2 bg-black/50",
                      myTable.isVip
                        ? "border-amber-300/50"
                        : "border-violet-400/40"
                    )}
                  >
                    {showMayaCam || showMyCam ? (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-700 to-blue-900 text-[10px] text-white">
                        LIVE
                        <motion.span
                          className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-transparent"
                          animate={{ opacity: [0.2, 0.5, 0.2] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={person.avatar}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <span className="mt-1 max-w-[72px] truncate text-[10px] text-white">
                    {person.pseudo}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setInviteOpen(true)}
                  className="flex h-14 w-14 flex-col items-center justify-center rounded-full border border-dashed border-white/25 bg-black/30 text-muted-foreground hover:border-violet-400/50 hover:text-white"
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="text-[8px]">Invite</span>
                </button>
              )}
            </div>
          );
        })}

        {/* Floating table reactions */}
        <AnimatePresence>
          {myTable.reactions.slice(-5).map((r) => (
            <motion.span
              key={r.id}
              initial={{ opacity: 0, y: 10, scale: 0.5 }}
              animate={{ opacity: 1, y: -20, scale: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute left-1/2 top-1/2 text-lg"
            >
              {r.emoji}
            </motion.span>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {myTable.giftFlash && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.15 }}
              exit={{ opacity: 0, y: -30 }}
              className="absolute inset-0 z-10 flex items-center justify-center"
            >
              <div className="rounded-2xl bg-pink-500/20 px-6 py-4 text-center backdrop-blur-md">
                <p className="text-3xl">
                  {
                    GIFT_CATALOG.find((g) => g.type === myTable.giftFlash!.gift)
                      ?.emoji
                  }
                </p>
                <p className="mt-1 text-sm text-white">
                  {myTable.giftFlash.gift} → {myTable.giftFlash.to}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          className="border-white/15"
          onClick={() => setTableCamera(!myTable.myCameraOn)}
        >
          {myTable.myCameraOn ? (
            <CameraOff className="h-3.5 w-3.5" />
          ) : (
            <Camera className="h-3.5 w-3.5" />
          )}
          Cam
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-white/15"
          onClick={() => setTableMuted(!myTable.myMuted)}
        >
          {myTable.myMuted ? (
            <MicOff className="h-3.5 w-3.5" />
          ) : (
            <Mic className="h-3.5 w-3.5" />
          )}
          Mic
        </Button>
        {!myTable.mayaCameraOn && (
          <Button
            size="sm"
            variant="outline"
            className="border-white/15"
            onClick={askMayaCamera}
          >
            Ask to open camera
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          className="border-white/15"
          onClick={() => setInviteOpen(true)}
        >
          <UserPlus className="h-3.5 w-3.5" />
          Invite
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-white/15"
          onClick={() => setGiftOpen(true)}
        >
          <Gift className="h-3.5 w-3.5" />
          Send gift
        </Button>
        {!myTable.isVip && occupied >= 3 && (
          <Button
            size="sm"
            className="bg-amber-500 text-black"
            onClick={() => setCheckout(true)}
          >
            <Crown className="h-3.5 w-3.5" />
            Make this a VIP table
          </Button>
        )}
        {!myTable.isVip && occupied < 3 && (
          <Button
            size="sm"
            variant="outline"
            className="border-amber-500/40 text-amber-200"
            onClick={() => setCheckout(true)}
          >
            <Crown className="h-3.5 w-3.5" />
            VIP €4.99
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={leaveTable}>
          <X className="h-3.5 w-3.5" />
          Leave
        </Button>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <Volume2 className="h-3.5 w-3.5" />
          Club volume
          <Slider
            value={[myTable.djVolume]}
            onValueChange={(v) => {
              const val = Array.isArray(v) ? v[0] : v;
              setDjVolume(val ?? 70);
            }}
            max={100}
            className="flex-1"
          />
        </label>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          Table voices
          <Slider
            value={[myTable.tableVoices]}
            onValueChange={(v) => {
              const val = Array.isArray(v) ? v[0] : v;
              setTableVoices(val ?? 65);
            }}
            max={100}
            className="flex-1"
          />
        </label>
      </div>

      <div className="mt-3 flex gap-1">
        {REACT_EMOJIS.map((e) => (
          <button
            key={e}
            type="button"
            className="rounded-lg bg-white/5 px-2 py-1 text-sm hover:bg-white/10"
            onClick={() => addTableReaction(e)}
          >
            {e}
          </button>
        ))}
      </div>

      <div className="mt-3 max-h-28 space-y-1 overflow-y-auto rounded-lg bg-black/30 p-2 text-xs">
        {myTable.chat.map((m) => (
          <p
            key={m.id}
            className={m.from === "me" ? "text-violet-200" : "text-white/80"}
          >
            <span className="text-muted-foreground">
              {m.from === "me" ? "You" : "Table"}:{" "}
            </span>
            {m.text}
          </p>
        ))}
      </div>
      <form
        className="mt-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          sendTableChat(text.trim());
          setText("");
        }}
      >
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Table chat…"
          className="h-8 border-white/10 bg-white/5 text-xs"
        />
        <Button type="submit" size="icon" className="size-8 bg-violet-600">
          <Send className="h-3.5 w-3.5" />
        </Button>
      </form>

      <Dialog open={checkout} onOpenChange={setCheckout}>
        <DialogContent className="border-white/10 bg-[#12101a]">
          <DialogHeader>
            <DialogTitle>Make this a VIP table</DialogTitle>
            <DialogDescription>
              Demo checkout only — unlocks 10 seats, VIP glow, and Midnight Crew
              naming.
            </DialogDescription>
          </DialogHeader>
          <p className="font-display text-3xl text-white">€4.99</p>
          <Button
            className="w-full bg-amber-500 text-black"
            onClick={() => {
              upgradeVip();
              setCheckout(false);
            }}
          >
            DEMO PURCHASE · VIP UNLOCKED
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="border-white/10 bg-[#12101a]">
          <DialogHeader>
            <DialogTitle>Invite someone</DialogTitle>
            <DialogDescription>
              Music match scores · demo invites only.
            </DialogDescription>
          </DialogHeader>
          {TABLE_INVITEES.map(({ id, compatibility }) => {
            const p = getAttendee(id);
            if (!p) return null;
            const taken = myTable.seats.some((s) => s.userId === id);
            return (
              <Button
                key={id}
                variant="outline"
                disabled={taken}
                className="w-full justify-between border-white/10"
                onClick={() => {
                  inviteToTable(id);
                  setInviteOpen(false);
                }}
              >
                <span className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.avatar} alt="" className="h-6 w-6 rounded-full" />
                  {p.pseudo}
                </span>
                <span className="text-xs text-violet-300">{compatibility}% match</span>
              </Button>
            );
          })}
        </DialogContent>
      </Dialog>

      <Dialog open={giftOpen} onOpenChange={setGiftOpen}>
        <DialogContent className="border-white/10 bg-[#12101a]">
          <DialogHeader>
            <DialogTitle>Send a gift</DialogTitle>
            <DialogDescription>
              Hypothetical prices · demo only · no real money.
            </DialogDescription>
          </DialogHeader>
          <label className="text-xs text-muted-foreground">
            Recipient
            <select
              value={giftTo}
              onChange={(e) => setGiftTo(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-sm text-white"
            >
              {primaryIds
                .filter((id) => id !== "me")
                .map((id) => (
                  <option key={id} value={id}>
                    {getAttendee(id)?.pseudo ?? id}
                  </option>
                ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {GIFT_CATALOG.map((g) => (
              <button
                key={g.type}
                type="button"
                className="rounded-xl border border-white/10 bg-white/5 p-3 text-center hover:border-pink-500/40"
                onClick={() => {
                  sendTableGift(g.type as GiftType, giftTo);
                  setGiftOpen(false);
                }}
              >
                <span className="text-2xl">{g.emoji}</span>
                <p className="mt-1 text-xs text-white">{g.label}</p>
                <p className="text-[10px] text-muted-foreground">€{g.price}</p>
              </button>
            ))}
          </div>
          <Button
            className="w-full bg-pink-600 text-white"
            onClick={() => {
              sendTableGift("Champagne", giftTo);
              setGiftOpen(false);
            }}
          >
            SEND DEMO · Champagne
          </Button>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
