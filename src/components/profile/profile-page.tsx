"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useNightlink } from "@/lib/store";

export function ProfilePage() {
  const profile = useNightlink((s) => s.profile);
  const updateProfile = useNightlink((s) => s.updateProfile);
  const updatePrivacy = useNightlink((s) => s.updatePrivacy);
  const setSubscription = useNightlink((s) => s.setSubscription);
  const resetAge = useNightlink((s) => s.resetAgeVerification);
  const pushToast = useNightlink((s) => s.pushToast);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.avatar}
          alt=""
          className="h-20 w-20 rounded-full border border-white/20"
        />
        <div>
          <h1 className="font-display text-3xl font-semibold text-white">
            {profile.pseudo}
          </h1>
          <p className="text-sm text-muted-foreground">
            {profile.ageRange} · {profile.city}, {profile.country}
          </p>
        </div>
      </div>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-xl text-white">Profile</h2>
        <Input
          value={profile.pseudo}
          onChange={(e) => updateProfile({ pseudo: e.target.value })}
          className="border-white/10 bg-white/5"
          placeholder="Pseudo"
        />
        <Textarea
          value={profile.bio}
          onChange={(e) => updateProfile({ bio: e.target.value })}
          className="border-white/10 bg-white/5"
        />
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl text-white">Music DNA</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {profile.musicDna.map((t) => (
            <span
              key={t}
              className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-200"
            >
              {t}
            </span>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Genres: {profile.genres.join(" · ")}
        </p>
        <p className="text-sm text-muted-foreground">
          Top artists: {profile.topArtists.join(" · ")}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl text-white">My setup</h2>
        <Input
          value={profile.gear}
          onChange={(e) => updateProfile({ gear: e.target.value })}
          className="mt-3 border-white/10 bg-white/5"
        />
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl text-white">My nightlife</h2>
        <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
          {profile.nightlife.map((n) => (
            <li key={n}>· {n}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl text-white">Media</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Photos & short clips stay local in this demo. Add media in a future
          build with storage.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="font-display text-xl text-white">Privacy settings</h2>
        {(
          [
            ["showAge", "Show age range"],
            ["showCity", "Show city"],
            ["allowPokes", "Allow pokes"],
            ["showOnline", "Show online status"],
            ["showTables", "Show tables I'm at"],
            ["cameraDefaultOff", "Camera off by default"],
          ] as const
        ).map(([key, label]) => (
          <div
            key={key}
            className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3"
          >
            <span className="text-sm">{label}</span>
            <Switch
              checked={profile.privacy[key]}
              onCheckedChange={(v) => updatePrivacy({ [key]: v })}
            />
          </div>
        ))}
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-violet-500/30 p-5">
          <h3 className="font-display text-lg text-white">NIGHTLINK+</h3>
          <p className="text-sm text-muted-foreground">€6.99/mo · demo only</p>
          <Button
            className="mt-3 w-full bg-violet-600 text-white"
            onClick={() => {
              setSubscription("nightlinkPlus", true);
              pushToast("NIGHTLINK+ activated (demo)");
            }}
          >
            {profile.subscriptions.nightlinkPlus ? "Active" : "Demo checkout"}
          </Button>
        </div>
        <div className="rounded-2xl border border-white/10 p-5">
          <h3 className="font-display text-lg text-white">Demo settings</h3>
          <Button
            variant="outline"
            className="mt-3 w-full border-white/15"
            onClick={() => {
              resetAge();
              pushToast("Age verification reset");
            }}
          >
            Reset age verification
          </Button>
        </div>
      </section>
    </div>
  );
}
