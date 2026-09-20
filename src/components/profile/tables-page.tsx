"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useNightlink } from "@/lib/store";

export function TablesPage() {
  const myTable = useNightlink((s) => s.myTable);
  const leaveTable = useNightlink((s) => s.leaveTable);
  const getAttendee = useNightlink((s) => s.getAttendee);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-white">
        My tables
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Private social tables persist locally while you navigate.
      </p>

      {!myTable ? (
        <div className="mt-10 rounded-2xl border border-dashed border-white/15 py-16 text-center">
          <p className="text-muted-foreground">No active table.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Match with MayaWave in Neon Athens to start one.
          </p>
          <Link
            href="/club/neon-athens"
            className="mt-4 inline-flex h-8 items-center rounded-lg bg-violet-600 px-3 text-sm text-white"
          >
            Enter Neon Athens
          </Link>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-violet-500/30 bg-card/50 p-6">
          <p className="font-display text-xl text-white">
            TABLE {myTable.number} ·{" "}
            {myTable.seats.filter((s) => s.userId).length}/{myTable.maxSeats}
          </p>
          <p className="text-sm text-muted-foreground">
            {myTable.isVip ? "VIP" : "Normal"} · {myTable.visibility} · club{" "}
            {myTable.clubId}
          </p>
          <ul className="mt-4 space-y-2">
            {myTable.seats
              .filter((s) => s.userId)
              .map((s, i) => {
                const name =
                  s.userId === "me"
                    ? "You"
                    : getAttendee(s.userId!)?.pseudo ?? s.userId;
                return (
                  <li key={i} className="text-sm text-white/90">
                    Seat {i + 1}: {name}
                  </li>
                );
              })}
          </ul>
          <div className="mt-4 flex gap-2">
            <Link
              href={`/club/${myTable.clubId}`}
              className="inline-flex h-8 items-center rounded-lg bg-violet-600 px-3 text-sm text-white"
            >
              Back to club
            </Link>
            <Button variant="outline" className="border-white/15" onClick={leaveTable}>
              Leave table
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
