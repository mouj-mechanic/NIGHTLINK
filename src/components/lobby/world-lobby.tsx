"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Headphones, Radio, Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { COUNTRY_LIVE, TOTAL_PARTYING } from "@/lib/mock-data";
import { useNightlink } from "@/lib/store";
import type { Club, MusicSource } from "@/lib/types";
import { cn } from "@/lib/utils";

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-red-400">
      <span className="h-1.5 w-1.5 rounded-full bg-red-500 live-pulse" />
      LIVE
    </span>
  );
}

function ClubCard({
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
      whileHover={{ y: -2 }}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-card/60 transition hover:border-violet-500/40"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-violet-900/40 via-[#12101a] to-blue-900/30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={club.track.artwork}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0812] via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <LiveBadge />
          <Badge variant="secondary" className="bg-black/40 text-[10px]">
            {club.musicSource} Connected
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={club.djAvatar}
            alt=""
            className="h-12 w-12 rounded-full border-2 border-white/20 bg-muted"
          />
          <div className="text-right text-xs text-white/80">
            <p className="font-medium">{club.listeners}/{club.capacity}</p>
            <p className="text-[10px] text-muted-foreground">listening</p>
          </div>
        </div>
      </div>
      <div className="space-y-3 p-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-semibold text-white">
              {club.name}
            </h3>
            <span>{club.flag}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {club.djName} · {club.city}, {club.country}
          </p>
        </div>
        <div className="rounded-xl bg-white/5 px-3 py-2">
          <p className="truncate text-sm font-medium text-white">
            {club.track.title}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {club.track.artist} · {club.genre}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Headphones className="h-3 w-3" />
            {club.headphoneRec}
          </span>
          <span className="inline-flex items-center gap-1">
            <Radio className="h-3 w-3" />
            {club.mood}
          </span>
          {club.friendsInside ? (
            <span className="inline-flex items-center gap-1 text-violet-300">
              <Users className="h-3 w-3" />
              {club.friendsInside} friends inside
            </span>
          ) : null}
          {club.isUserCreated && (
            <Badge className="bg-amber-500/20 text-amber-200">Your room</Badge>
          )}
        </div>
        <Button
          className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white"
          onClick={() => onEnter(club.id)}
        >
          Enter room
        </Button>
      </div>
    </motion.article>
  );
}

export function WorldLobby() {
  const clubs = useNightlink((s) => s.clubs);
  const requestEnter = useNightlink((s) => s.requestEnterClub);
  const router = useRouter();
  const [q, setQ] = useState("");
  const [country, setCountry] = useState<string>("all");
  const [genre, setGenre] = useState<string>("all");
  const [platform, setPlatform] = useState<string>("all");
  const [sort, setSort] = useState<string>("populated");

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
    router.push(`/club/${id}`);
  };

  return (
    <div>
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
        <div className="relative mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6">
          <motion.p
            initial={{ y: 8 }}
            animate={{ y: 0 }}
            className="font-display text-sm tracking-[0.35em] text-violet-300"
          >
            NIGHTLINK
          </motion.p>
          <motion.h1
            initial={{ y: 16 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl neon-text"
          >
            THE WORLD IS STILL AWAKE.
          </motion.h1>
          <motion.p
            initial={{ y: 12 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg"
          >
            Enter the room. Feel the crowd. Find your table.{" "}
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
            <Button
              size="lg"
              className="bg-gradient-to-r from-violet-600 to-blue-600 px-6 text-white"
              onClick={() => enter("neon-athens")}
            >
              Enter Neon Athens
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20"
              onClick={() =>
                document
                  .getElementById("clubs")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Browse clubs
            </Button>
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
              Clubs open now
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {filtered.length} rooms · music source badges are connection
              metadata only
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

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((club) => (
            <ClubCard key={club.id} club={club} onEnter={enter} />
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
