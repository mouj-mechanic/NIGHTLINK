"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  CameraOff,
  Crown,
  Flag,
  Heart,
  Headphones,
  LogOut,
  Mic,
  MicOff,
  Send,
  ShieldAlert,
  Volume2,
  VolumeX,
  X,
  UserPlus,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { OPEN_TABLES_META } from "@/lib/mock-data";
import { useNightlink } from "@/lib/store";
import {
  setDemoVolume,
  startDemoAudio,
  stopDemoAudio,
  playUploadedFile,
} from "@/lib/audio";
import type { Attendee, Club } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ClubRoom({ clubId }: { clubId: string }) {
  const router = useRouter();
  const clubs = useNightlink((s) => s.clubs);
  const ageVerified = useNightlink((s) => s.ageVerified);
  const requestEnter = useNightlink((s) => s.requestEnterClub);
  const ensureCrowd = useNightlink((s) => s.ensureCrowd);
  const getCrowd = useNightlink((s) => s.getCrowd);
  const leaveClub = useNightlink((s) => s.leaveClub);
  const favoriteClubs = useNightlink((s) => s.favoriteClubs);
  const toggleFavorite = useNightlink((s) => s.toggleFavorite);
  const selectedProfileId = useNightlink((s) => s.selectedProfileId);
  const selectProfile = useNightlink((s) => s.selectProfile);
  const chatOpenWith = useNightlink((s) => s.chatOpenWith);
  const myTable = useNightlink((s) => s.myTable);
  const showAgeGate = useNightlink((s) => s.showAgeGate);
  const crowdByClub = useNightlink((s) => s.crowdByClub);

  const club = clubs.find((c) => c.id === clubId);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.12);
  const [reportOpen, setReportOpen] = useState(false);
  const stopUploadRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!ageVerified && !showAgeGate) {
      requestEnter(clubId);
    } else if (ageVerified) {
      ensureCrowd(clubId);
    }
  }, [clubId, ageVerified, showAgeGate, requestEnter, ensureCrowd]);

  useEffect(() => {
    if (!ageVerified) return;
    startDemoAudio(volume);
    return () => {
      stopDemoAudio();
      stopUploadRef.current?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ageVerified, clubId]);

  useEffect(() => {
    setDemoVolume(muted ? 0 : volume);
  }, [muted, volume]);

  const crowd = useMemo(() => {
    if (!crowdByClub[clubId] && ageVerified) ensureCrowd(clubId);
    return getCrowd(clubId).filter(
      (a) => !useNightlink.getState().blockedUsers.includes(a.id)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubId, crowdByClub, ageVerified, getCrowd]);

  if (!club) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-muted-foreground">This club is closed or unknown.</p>
        <Button className="mt-4" onClick={() => router.push("/")}>
          Back to lobby
        </Button>
      </div>
    );
  }

  if (!ageVerified) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="font-display text-2xl text-white">Waiting at the door…</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Complete age verification to enter {club.name}.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">
              {club.name}
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 live-pulse" />
              LIVE
            </span>
            <span className="text-sm text-muted-foreground">
              {club.flag} {club.city}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {club.djName} · {club.listeners} listening · session{" "}
            {club.sessionMinutes}m · Moderator online
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-white/15"
            onClick={() => toggleFavorite(club.id)}
          >
            <Heart
              className={cn(
                "h-4 w-4",
                favoriteClubs.includes(club.id) && "fill-pink-500 text-pink-500"
              )}
            />
            Favorite
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/15"
            onClick={() => setReportOpen(true)}
          >
            <Flag className="h-4 w-4" />
            Report
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              leaveClub();
              router.push("/");
            }}
          >
            <LogOut className="h-4 w-4" />
            Leave
          </Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <DjStage club={club} />
          <TrackBar
            club={club}
            muted={muted}
            volume={volume}
            onMute={() => setMuted((m) => !m)}
            onVolume={(v) => setVolume(v)}
            onUpload={async (file) => {
              stopUploadRef.current?.();
              stopDemoAudio();
              const stop = await playUploadedFile(file, muted ? 0 : volume);
              stopUploadRef.current = stop;
            }}
          />
          <HeadphoneRec text={club.headphoneRec} />
          <CrowdGrid
            crowd={crowd}
            onSelect={(id) => selectProfile(id)}
          />
          <TableDiscovery />
        </div>

        <div className="space-y-5">
          {myTable ? <SocialTablePanel /> : (
            <div className="rounded-2xl border border-dashed border-white/15 p-6 text-center">
              <p className="font-display text-lg text-white">No table yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Match with someone in the crowd to start a private table.
              </p>
            </div>
          )}
          {chatOpenWith && <ChatPanel userId={chatOpenWith} />}
        </div>
      </div>

      <AnimatePresence>
        {selectedProfileId && (
          <ProfileModal
            userId={selectedProfileId}
            onClose={() => selectProfile(null)}
          />
        )}
      </AnimatePresence>

      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="border-white/10 bg-[#12101a] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report an issue</DialogTitle>
            <DialogDescription>
              Trust & safety · demo only. Moderators are marked online in every room.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {["Harassment", "Spam", "Inappropriate content", "Other"].map((r) => (
              <Button
                key={r}
                variant="outline"
                className="w-full justify-start border-white/10"
                onClick={() => {
                  useNightlink.getState().pushToast("Report received.");
                  setReportOpen(false);
                }}
              >
                <ShieldAlert className="h-4 w-4" />
                {r}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DjStage({ club }: { club: Club }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [camDenied, setCamDenied] = useState(false);
  const [tryingCam, setTryingCam] = useState(false);

  const tryCam = async () => {
    setTryingCam(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCamDenied(false);
    } catch {
      setCamDenied(true);
    } finally {
      setTryingCam(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black">
      <div className="aspect-video w-full">
        <video
          ref={videoRef}
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        {!videoRef.current?.srcObject && (
          <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-[#0a0814] to-blue-950">
            <motion.div
              className="absolute inset-0 opacity-40"
              animate={{
                background: [
                  "radial-gradient(circle at 30% 40%, #8b5cf6 0%, transparent 50%)",
                  "radial-gradient(circle at 70% 60%, #3b82f6 0%, transparent 50%)",
                  "radial-gradient(circle at 40% 70%, #ec4899 0%, transparent 50%)",
                  "radial-gradient(circle at 30% 40%, #8b5cf6 0%, transparent 50%)",
                ],
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={club.djAvatar}
                alt=""
                className="h-24 w-24 rounded-full border-2 border-white/30 shadow-xl"
              />
              <p className="font-display text-xl text-white">{club.djName}</p>
              <p className="text-xs text-muted-foreground">
                Demo stage · DJ camera is the only public feed by default
              </p>
              {camDenied && (
                <p className="text-xs text-amber-300">
                  Camera denied — using animated stage fallback
                </p>
              )}
              <Button
                size="sm"
                variant="outline"
                className="border-white/20"
                onClick={tryCam}
                disabled={tryingCam}
              >
                <Camera className="h-4 w-4" />
                Preview webcam (optional)
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TrackBar({
  club,
  muted,
  volume,
  onMute,
  onVolume,
  onUpload,
}: {
  club: Club;
  muted: boolean;
  volume: number;
  onMute: () => void;
  onVolume: (v: number) => void;
  onUpload: (f: File) => void;
}) {
  const [progress, setProgress] = useState(club.track.progress);
  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 0.4));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-card/50 p-4">
      <div className="flex gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={club.track.artwork}
          alt=""
          className="h-16 w-16 rounded-lg object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-white">{club.track.title}</p>
          <p className="truncate text-sm text-muted-foreground">
            {club.track.artist}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-[10px]">
              {club.musicSource} · Connected platform
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              Integration preview · demo audio (Web Audio)
            </span>
          </div>
        </div>
      </div>
      <Progress value={progress} className="mt-3 h-1.5" />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onMute}>
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        <Slider
          value={[volume * 100]}
          onValueChange={(v) => {
            const val = Array.isArray(v) ? v[0] : v;
            onVolume((val ?? 12) / 100);
          }}
          max={100}
          step={1}
          className="w-32"
        />
        <label className="cursor-pointer text-xs text-violet-300 hover:underline">
          Upload local audio
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpload(f);
            }}
          />
        </label>
      </div>
    </div>
  );
}

function HeadphoneRec({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
      <Headphones className="mt-0.5 h-4 w-4 text-amber-300" />
      <div>
        <p className="text-xs font-semibold tracking-wide text-amber-200">
          OPTIMAL EXPERIENCE
        </p>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

function CrowdGrid({
  crowd,
  onSelect,
}: {
  crowd: Attendee[];
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg text-white">The crowd</h2>
        <span className="text-xs text-muted-foreground">
          ~{crowd.length} in the room
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
        {crowd.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => onSelect(a.id)}
            className={cn(
              "rounded-xl border border-white/10 bg-white/[0.03] p-2 text-left transition hover:border-violet-500/40",
              a.isMayaWave && "border-violet-500/50 bg-violet-500/10"
            )}
          >
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={a.avatar}
                alt=""
                className="aspect-square w-full rounded-lg bg-muted object-cover"
              />
              <span
                className={cn(
                  "absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full border border-[#0a0812]",
                  a.online ? "bg-emerald-400" : "bg-zinc-500"
                )}
              />
            </div>
            <p className="mt-1.5 truncate text-xs font-medium text-white">
              {a.pseudo}
            </p>
            <p className="truncate text-[10px] text-muted-foreground">
              {a.ageRange} · {a.flag}
            </p>
            <p className="mt-0.5 truncate text-[10px] text-violet-300/90">
              {a.availability}
            </p>
            {a.tableId && (
              <p className="text-[9px] text-amber-300">At a table</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function TableDiscovery() {
  const requestSeat = useNightlink((s) => s.requestSeat);
  const seatRequests = useNightlink((s) => s.seatRequests);

  return (
    <div>
      <h2 className="mb-3 font-display text-lg text-white">Tables in the room</h2>
      <div className="grid gap-2 sm:grid-cols-3">
        {OPEN_TABLES_META.map((t) => (
          <div
            key={t.id}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
          >
            <p className="text-sm font-medium text-white">
              TABLE {t.number} · {t.seatsTaken}/{t.maxSeats}
            </p>
            <p className="text-xs text-muted-foreground">Host {t.host}</p>
            <Badge
              className={cn(
                "mt-2 text-[10px]",
                t.visibility === "VIP" && "bg-amber-500/20 text-amber-200",
                t.visibility === "OPEN" && "bg-emerald-500/20 text-emerald-200"
              )}
            >
              {t.visibility}
            </Badge>
            {t.visibility === "OPEN" && (
              <Button
                size="sm"
                variant="outline"
                className="mt-2 w-full border-white/15"
                disabled={seatRequests.includes(t.id)}
                onClick={() => requestSeat(t.id)}
              >
                {seatRequests.includes(t.id) ? "Requested" : "Request seat"}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileModal({
  userId,
  onClose,
}: {
  userId: string;
  onClose: () => void;
}) {
  const getAttendee = useNightlink((s) => s.getAttendee);
  const sendPoke = useNightlink((s) => s.sendPoke);
  const conversations = useNightlink((s) => s.conversations);
  const openChat = useNightlink((s) => s.openChat);
  const createTable = useNightlink((s) => s.createTable);
  const blockUser = useNightlink((s) => s.blockUser);
  const muteUser = useNightlink((s) => s.muteUser);
  const a = getAttendee(userId);
  const conv = conversations[userId];

  if (!a) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#12101a] p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={a.avatar}
              alt=""
              className="h-16 w-16 rounded-full border border-white/20"
            />
            <div>
              <h3 className="font-display text-xl text-white">{a.pseudo}</h3>
              <p className="text-sm text-muted-foreground">
                {a.ageRange}
                {a.gender ? ` · ${a.gender}` : ""} · {a.city}, {a.country}{" "}
                {a.flag}
              </p>
              <p className="mt-1 text-sm text-violet-300">
                {a.compatibility}% music compatibility
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {a.bio}
        </p>

        <div className="mt-4 grid gap-3 text-sm">
          <Row label="Availability" value={a.availability} />
          <Row label="Genres" value={a.genres.join(" · ")} />
          <Row label="Top artists" value={a.topArtists.join(" · ")} />
          <Row label="Favorite DJs" value={a.favoriteDjs.join(" · ")} />
          <Row label="Listening gear" value={a.gear} />
          <Row label="Recent parties" value={a.recentParties.join(" · ")} />
          <Row label="Mutual interests" value={a.mutualInterests.join(" · ")} />
          <div className="flex flex-wrap gap-1.5">
            {a.badges.map((b) => (
              <Badge key={b} variant="secondary" className="text-[10px]">
                {b}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto">
          {a.photos.map((p) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p}
              src={p}
              alt=""
              className="h-20 w-20 shrink-0 rounded-lg object-cover"
            />
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {!conv?.pokeSent ? (
            <Button
              className="bg-gradient-to-r from-violet-600 to-pink-600 text-white"
              onClick={() => sendPoke(a.id)}
            >
              <Sparkles className="h-4 w-4" />
              Poke
            </Button>
          ) : !conv.pokeBack ? (
            <Button disabled variant="secondary">
              Poke sent…
            </Button>
          ) : (
            <>
              <Button
                className="bg-violet-600 text-white"
                onClick={() => {
                  openChat(a.id);
                  onClose();
                }}
              >
                <MessageCircle className="h-4 w-4" />
                Chat
              </Button>
              <Button
                variant="outline"
                className="border-white/15"
                onClick={() => {
                  createTable(a.id);
                  onClose();
                }}
              >
                Start a table
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" onClick={() => muteUser(a.id)}>
            Mute
          </Button>
          <Button variant="ghost" size="sm" onClick={() => blockUser(a.id)}>
            Block
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-white/90">{value}</p>
    </div>
  );
}

function ChatPanel({ userId }: { userId: string }) {
  const getAttendee = useNightlink((s) => s.getAttendee);
  const conversations = useNightlink((s) => s.conversations);
  const sendMessage = useNightlink((s) => s.sendMessage);
  const openChat = useNightlink((s) => s.openChat);
  const createTable = useNightlink((s) => s.createTable);
  const [text, setText] = useState("");
  const a = getAttendee(userId);
  const conv = conversations[userId];

  if (!a || !conv?.unlocked) {
    return (
      <div className="rounded-2xl border border-white/10 p-4 text-sm text-muted-foreground">
        Messaging unlocks after a mutual poke.
      </div>
    );
  }

  return (
    <div className="flex h-[420px] flex-col rounded-2xl border border-white/10 bg-card/50">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a.avatar} alt="" className="h-8 w-8 rounded-full" />
          <div>
            <p className="text-sm font-medium text-white">{a.pseudo}</p>
            <p className="text-[10px] text-emerald-400">Matched in the crowd</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            className="border-white/15"
            onClick={() => createTable(userId)}
          >
            Start a table
          </Button>
          <Button variant="ghost" size="icon" onClick={() => openChat(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 px-4 py-3">
        <div className="space-y-2">
          {conv.messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                m.from === "me"
                  ? "ml-auto bg-violet-600 text-white"
                  : "bg-white/10 text-white"
              )}
            >
              {m.text}
            </div>
          ))}
        </div>
      </ScrollArea>
      <form
        className="flex gap-2 border-t border-white/10 p-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          sendMessage(userId, text.trim());
          setText("");
        }}
      >
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Say something…"
          className="border-white/10 bg-white/5"
        />
        <Button type="submit" size="icon" className="bg-violet-600 text-white">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

function SocialTablePanel() {
  const myTable = useNightlink((s) => s.myTable)!;
  const getAttendee = useNightlink((s) => s.getAttendee);
  const inviteToTable = useNightlink((s) => s.inviteToTable);
  const upgradeVip = useNightlink((s) => s.upgradeVip);
  const leaveTable = useNightlink((s) => s.leaveTable);
  const setTableCamera = useNightlink((s) => s.setTableCamera);
  const setTableMuted = useNightlink((s) => s.setTableMuted);
  const setDjVolume = useNightlink((s) => s.setDjVolume);
  const sendTableChat = useNightlink((s) => s.sendTableChat);
  const [text, setText] = useState("");
  const [checkout, setCheckout] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const occupied = myTable.seats.filter((s) => s.userId).length;

  const toggleCam = async () => {
    if (myTable.myCameraOn) {
      const stream = videoRef.current?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((t) => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
      setTableCamera(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setTableCamera(true);
    } catch {
      setTableCamera(true);
      useNightlink.getState().pushToast("Camera unavailable — mock feed on");
    }
  };

  return (
    <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-b from-violet-950/40 to-card/60 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-lg text-white">
            TABLE {myTable.number} · {occupied}/{myTable.maxSeats}
          </p>
          <p className="text-xs text-muted-foreground">
            {myTable.isVip ? "VIP · video seats" : "Private · still hearing the DJ"}
          </p>
        </div>
        <Badge className={myTable.isVip ? "bg-amber-500/20 text-amber-200" : ""}>
          {myTable.visibility}
        </Badge>
      </div>

      <div
        className={cn(
          "mt-4 grid gap-2",
          myTable.isVip ? "grid-cols-5" : "grid-cols-4"
        )}
      >
        {myTable.seats.map((seat, i) => {
          const person =
            seat.userId === "me"
              ? { pseudo: "You", avatar: useNightlink.getState().profile.avatar }
              : seat.userId
                ? getAttendee(seat.userId)
                : null;
          return (
            <div
              key={i}
              className="aspect-square overflow-hidden rounded-xl border border-white/10 bg-black/40"
            >
              {seat.userId === "me" && myTable.myCameraOn ? (
                <video
                  ref={videoRef}
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : person ? (
                <div className="flex h-full flex-col items-center justify-center gap-1 p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={person.avatar}
                    alt=""
                    className="h-10 w-10 rounded-full"
                  />
                  <p className="truncate text-[10px] text-white">
                    {person.pseudo}
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground hover:bg-white/5"
                  onClick={() => setInviteOpen(true)}
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="text-[9px]">Invite</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" className="border-white/15" onClick={toggleCam}>
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
        {!myTable.isVip && (
          <Button
            size="sm"
            className="bg-amber-500/90 text-black"
            onClick={() => setCheckout(true)}
          >
            <Crown className="h-3.5 w-3.5" />
            Upgrade VIP €4.99
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={leaveTable}>
          Leave table
        </Button>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Volume2 className="h-3.5 w-3.5" />
        DJ volume
        <Slider
          value={[myTable.djVolume]}
          onValueChange={(v) => {
            const val = Array.isArray(v) ? v[0] : v;
            setDjVolume(val ?? 70);
          }}
          max={100}
          className="w-28"
        />
      </div>

      <div className="mt-3 max-h-28 space-y-1 overflow-y-auto rounded-lg bg-black/30 p-2 text-xs">
        {myTable.chat.map((m) => (
          <p key={m.id} className={m.from === "me" ? "text-violet-200" : "text-white/80"}>
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
            <DialogTitle>VIP Table upgrade</DialogTitle>
            <DialogDescription>
              Demo checkout only — no real payment. Unlocks 10 seats + mock camera
              feeds.
            </DialogDescription>
          </DialogHeader>
          <p className="text-2xl font-display text-white">€4.99</p>
          <Button
            className="w-full bg-amber-500 text-black"
            onClick={() => {
              upgradeVip();
              setCheckout(false);
            }}
          >
            DEMO PURCHASE
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="border-white/10 bg-[#12101a]">
          <DialogHeader>
            <DialogTitle>Invite someone</DialogTitle>
            <DialogDescription>Pull a friend into your table.</DialogDescription>
          </DialogHeader>
          {["alex-bass", "sofia-night", "luna-beat", "rico-808"].map((id) => {
            const p = getAttendee(id);
            if (!p) return null;
            return (
              <Button
                key={id}
                variant="outline"
                className="w-full justify-start border-white/10"
                onClick={() => {
                  inviteToTable(id);
                  setInviteOpen(false);
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.avatar} alt="" className="h-6 w-6 rounded-full" />
                {p.pseudo}
              </Button>
            );
          })}
        </DialogContent>
      </Dialog>
    </div>
  );
}
