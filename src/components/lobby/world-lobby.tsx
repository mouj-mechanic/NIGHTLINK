"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Headphones, Radio, Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { COUNTRY_LIVE, TOTAL_PARTYING } from "@/lib/mock-data";
import { useNightlink } from "@/lib/store";
import type { Club, MusicSource } from "@/lib/types";
import {
  CinematicEntrance,
  type CinematicPhase,
} from "@/components/cinematic/cinematic-entrance";
import { SafeImage } from "@/components/shared/safe-image";

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-red-400">
      <span className="h-1.5 w-1.5 rounded-full bg-red-500 live-pulse" />
      LIVE
    </span>
  );
}

function PosterCard({
  club,
  onEnter,
}: {
  club: Club;
  onEnter: (id: string) => void;
}) {
  return (
    <motion.article
      layout
      initial={false}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-none border border-white/10 bg-black"
      data-testid="poster-card"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <SafeImage
          src={club.flyer || club.track.artwork}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
          <LiveBadge />
          <Badge
            variant="secondary"
            className="rounded-none bg-black/55 text-[10px] tracking-wide"
          >
            {club.musicSource}
          </Badge>
        </div>
        <div className="absolute inset-x-0 bottom-0 space-y-3 p-4">
          <div className="flex items-end gap-3">
            <SafeImage
              src={club.djAvatar}
              alt=""
              className="h-14 w-14 rounded-full border-2 border-white/30 bg-muted object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="font-display text-[10px] tracking-[0.35em] text-violet-200">
                {club.flag} {club.city.toUpperCase()}
              </p>
              <h3 className="font-display text-2xl font-semibold leading-tight text-white sm:text-3xl">
                {club.name}
              </h3>
              <p className="truncate text-sm text-white/70">
                {club.djName} · {club.genre}
              </p>
            </div>
          </div>
          <div className="border-t border-white/15 pt-3">
            <p className="truncate font-display text-sm text-white">
              {club.track.title}
            </p>
            <p className="truncate text-xs text-white/60">
              {club.track.artist} · {club.mood}
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-white/55">
              <span className="inline-flex items-center gap-1">
                <Users className="h-3 w-3" />
                {club.listeners}/{club.capacity}
              </span>
              <span className="inline-flex items-center gap-1">
                <Headphones className="h-3 w-3" />
                {club.headphoneRec}
              </span>
              <span className="inline-flex items-center gap-1">
                <Radio className="h-3 w-3" />
                {club.musicSource} Connected
              </span>
              {club.friendsInside ? (
                <span className="text-violet-300">
                  {club.friendsInside} friends inside
                </span>
              ) : null}
              {club.isUserCreated && (
                <Badge className="rounded-none bg-amber-500/20 text-amber-200">
                  Your room
                </Badge>
              )}
            </div>
          </div>
          <Link
            href={`/club/${club.id}`}
            onClick={() => onEnter(club.id)}
            className="inline-flex h-10 w-full items-center justify-center bg-gradient-to-r from-violet-600 to-blue-600 text-sm font-semibold tracking-wide text-white"
          >
            Enter room
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function WorldLobby() {
  const clubs = useNightlink((s) => s.clubs);
  const requestEnter = useNightlink((s) => s.requestEnterClub);
  const hydrated = useNightlink((s) => s.hydrated);
  const introComplete = useNightlink((s) => s.introComplete);
  const skipIntro = useNightlink((s) => s.skipIntro);
  const cinematicForcePhase = useNightlink((s) => s.cinematicForcePhase);
  const [q, setQ] = useState("");
  const [country, setCountry] = useState<string>("all");
  const [genre, setGenre] = useState<string>("all");
  const [platform, setPlatform] = useState<string>("all");
  const [sort, setSort] = useState<string>("populated");
  const [showCinematic, setShowCinematic] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    setShowCinematic(!(introComplete || skipIntro));
  }, [hydrated, introComplete, skipIntro]);

  const onIntroComplete = useCallback(() => {
    setShowCinematic(false);
  }, []);

  const countries = useMemo(
    () => [...new Set(clubs.map((c) => c.country))],
    [clubs]
  );
  const genres = useMemo(
    () => [...new Set(clubs.map((c) => c.genre))],
    [clubs]
  );

  const filtered = useMemo(() => {
    let list = [...clubs];
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(s) ||
          c.djName.toLowerCase().includes(s) ||
          c.city.toLowerCase().includes(s) ||
          c.genre.toLowerCase().includes(s)
      );
    }
    if (country !== "all") list = list.filter((c) => c.country === country);
    if (genre !== "all") list = list.filter((c) => c.genre === genre);
    if (platform !== "all")
      list = list.filter((c) => c.musicSource === (platform as MusicSource));
    if (sort === "populated") list.sort((a, b) => b.listeners - a.listeners);
    if (sort === "new")
      list.sort((a, b) => Number(b.isUserCreated) - Number(a.isUserCreated));
    if (sort === "friends")
      list.sort((a, b) => (b.friendsInside ?? 0) - (a.friendsInside ?? 0));
    return list;
  }, [clubs, q, country, genre, platform, sort]);

  const enter = (id: string) => {
    requestEnter(id);
  };

  return (
    <div>
      {showCinematic && (
        <CinematicEntrance
          onComplete={onIntroComplete}
          forcePhase={
            (cinematicForcePhase as CinematicPhase | null) ?? undefined
          }
        />
      )}

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
        </div>
        <div className="relative mx-auto flex min-h-[42vh] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6">
          <motion.p
            initial={{ y: 8 }}
            animate={{ y: 0 }}
            className="font-display text-sm tracking-[0.35em] text-violet-300"
          >
            NIGHTLINK · PARTY HALL
          </motion.p>
          <motion.h1
            initial={{ y: 16 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl neon-text"
          >
            YOU&apos;RE INSIDE.
          </motion.h1>
          <motion.p
            initial={{ y: 12 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg"
          >
            Premium rooms. Live posters. Pick a night.{" "}
            <span className="text-white">
              {TOTAL_PARTYING.toLocaleString()} people partying right now.
            </span>
          </motion.p>
          <motion.div
            initial={{ y: 8 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              href="/club/neon-athens"
              onClick={() => requestEnter("neon-athens")}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-6 text-sm font-medium text-white"
            >
              Enter Neon Athens
            </Link>
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-white/20 bg-transparent px-6 text-sm font-medium text-white hover:bg-white/5"
              onClick={() =>
                document
                  .getElementById("clubs")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Browse posters
            </button>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">
          Active now by country
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Live presence across the network — counts drift gently.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {COUNTRY_LIVE.map((c, i) => (
            <motion.div
              key={c.country}
              initial={{ y: 6 }}
              animate={{ y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3"
            >
              <p className="text-sm">
                {c.flag} {c.country}
              </p>
              <p className="mt-1 font-display text-lg text-violet-200">
                <LiveCount base={c.count} />
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="clubs" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">
              Party discovery hall
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {filtered.length} event posters · music source badges are
              connection metadata only
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search clubs, DJs, cities…"
              className="border-white/10 bg-white/5 pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterSelect
              value={country}
              onChange={setCountry}
              label="Country"
              options={countries}
            />
            <FilterSelect
              value={genre}
              onChange={setGenre}
              label="Genre"
              options={genres}
            />
            <FilterSelect
              value={platform}
              onChange={setPlatform}
              label="Platform"
              options={["Spotify", "Deezer", "YouTube", "Own"]}
            />
            <FilterSelect
              value={sort}
              onChange={setSort}
              label="Sort"
              options={[
                { value: "populated", label: "Most populated" },
                { value: "new", label: "New rooms" },
                { value: "friends", label: "Friends inside" },
              ]}
              allValue={undefined}
            />
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((club) => (
            <PosterCard key={club.id} club={club} onEnter={enter} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed border-white/15 py-16 text-center">
            <p className="text-muted-foreground">No clubs match these filters.</p>
            <Button
              variant="ghost"
              className="mt-2"
              onClick={() => {
                setQ("");
                setCountry("all");
                setGenre("all");
                setPlatform("all");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

function LiveCount({ base }: { base: number }) {
  const [n, setN] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      setN((v) => v + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3));
    }, 3200 + Math.random() * 2000);
    return () => clearInterval(id);
  }, []);
  return <>{Math.max(0, n).toLocaleString()}</>;
}

function FilterSelect({
  value,
  onChange,
  label,
  options,
  allValue = "all",
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  options: string[] | { value: string; label: string }[];
  allValue?: string | undefined;
}) {
  const items = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );
  return (
    <label className="flex flex-col gap-0.5 text-[10px] text-muted-foreground">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-[150px] rounded-lg border border-white/10 bg-white/5 px-2 text-sm text-white outline-none focus:border-violet-500/50"
        aria-label={label}
      >
        {allValue !== undefined && (
          <option value={allValue}>All {label.toLowerCase()}</option>
        )}
        {items.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
