"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Disc3, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNightlink } from "@/lib/store";
import type { MusicSource } from "@/lib/types";

const FLAGS: Record<string, string> = {
  Greece: "🇬🇷",
  France: "🇫🇷",
  Germany: "🇩🇪",
  UK: "🇬🇧",
  Brazil: "🇧🇷",
  Japan: "🇯🇵",
  Spain: "🇪🇸",
  Tunisia: "🇹🇳",
  Netherlands: "🇳🇱",
  Bulgaria: "🇧🇬",
  Portugal: "🇵🇹",
};

export function DjDashboard() {
  const createDjRoom = useNightlink((s) => s.createDjRoom);
  const profile = useNightlink((s) => s.profile);
  const setSubscription = useNightlink((s) => s.setSubscription);
  const pushToast = useNightlink((s) => s.pushToast);
  const router = useRouter();

  const [name, setName] = useState("My Neon Room");
  const [djName, setDjName] = useState("DJ " + profile.pseudo);
  const [country, setCountry] = useState("Portugal");
  const [city, setCity] = useState(profile.city);
  const [genre, setGenre] = useState("Melodic Techno");
  const [capacity, setCapacity] = useState(200);
  const [source, setSource] = useState<MusicSource>("Own");
  const [visibility, setVisibility] = useState("Public");
  const [trackTitle, setTrackTitle] = useState("Demo Loop");
  const [trackArtist, setTrackArtist] = useState("NIGHTLINK Demo");

  const start = () => {
    const id = createDjRoom({
      name,
      djName,
      djAvatar: profile.avatar,
      flyer: "/flyers/neon-athens.svg",
      city,
      country,
      flag: FLAGS[country] ?? "🌍",
      genre,
      capacity,
      musicSource: source,
      mood: "Creator session",
      headphoneRec: "ANC ON · Demo audio",
      trackTitle,
      trackArtist,
    });
    router.push(`/club/${id}`);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600">
          <Disc3 className="h-6 w-6 text-white" />
        </span>
        <div>
          <h1 className="font-display text-3xl font-semibold text-white">
            Become a DJ
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Open a demo room. Streaming platforms are marked Integration preview —
            audio stays local / Web Audio.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <form
          className="space-y-4 rounded-2xl border border-white/10 bg-card/50 p-5 lg:col-span-3"
          onSubmit={(e) => {
            e.preventDefault();
            start();
          }}
        >
          <Field label="Club name">
            <Input value={name} onChange={(e) => setName(e.target.value)} className="border-white/10 bg-white/5" />
          </Field>
          <Field label="DJ stage name">
            <Input value={djName} onChange={(e) => setDjName(e.target.value)} className="border-white/10 bg-white/5" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Country">
              <Select value={country} onValueChange={(v) => setCountry(v ?? "Portugal")}>
                <SelectTrigger className="border-white/10 bg-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(FLAGS).map((c) => (
                    <SelectItem key={c} value={c}>
                      {FLAGS[c]} {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="City">
              <Input value={city} onChange={(e) => setCity(e.target.value)} className="border-white/10 bg-white/5" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Genre">
              <Input value={genre} onChange={(e) => setGenre(e.target.value)} className="border-white/10 bg-white/5" />
            </Field>
            <Field label="Capacity">
              <Input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value) || 100)}
                className="border-white/10 bg-white/5"
              />
            </Field>
          </div>
          <Field label="Music source">
            <Select
              value={source}
              onValueChange={(v) => setSource((v as MusicSource) ?? "Own")}
            >
              <SelectTrigger className="border-white/10 bg-white/5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["Own", "Spotify", "YouTube", "Deezer", "Other"] as MusicSource[]).map(
                  (s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                      {s !== "Own" ? " · Integration preview" : ""}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Visibility">
            <Select value={visibility} onValueChange={(v) => setVisibility(v ?? "Public")}>
              <SelectTrigger className="border-white/10 bg-white/5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Public">Public</SelectItem>
                <SelectItem value="Friends">Friends</SelectItem>
                <SelectItem value="Unlisted">Unlisted</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Now playing title (metadata)">
              <Input value={trackTitle} onChange={(e) => setTrackTitle(e.target.value)} className="border-white/10 bg-white/5" />
            </Field>
            <Field label="Artist (metadata)">
              <Input value={trackArtist} onChange={(e) => setTrackArtist(e.target.value)} className="border-white/10 bg-white/5" />
            </Field>
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white">
            Start Demo Room
          </Button>
        </form>

        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-white/10 bg-card/50 p-5">
            <h2 className="flex items-center gap-2 font-display text-lg text-white">
              <BarChart3 className="h-5 w-5 text-violet-300" />
              Mock analytics
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Stat label="Peak listeners (last session)" value="184" />
              <Stat label="Avg. session" value="47 min" />
              <Stat label="Pokes received" value="62" />
              <Stat label="Tables started" value="11" />
              <Stat label="VIP upgrades" value="3" />
            </dl>
          </div>
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <h3 className="font-display text-white">DJ PRO</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              €19.99/mo · demo checkout only
            </p>
            <Button
              className="mt-3 w-full bg-amber-500 text-black"
              onClick={() => {
                setSubscription("djPro", true);
                pushToast("DJ PRO activated (demo)");
              }}
            >
              {profile.subscriptions.djPro ? "DJ PRO active" : "Upgrade demo"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-white">{value}</dd>
    </div>
  );
}
