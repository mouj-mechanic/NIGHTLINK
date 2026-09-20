"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  CalendarDays,
  Disc3,
  Home,
  Menu,
  MessageCircle,
  Table2,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNightlink } from "@/lib/store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Explore", icon: Home },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/tables", label: "My Tables", icon: Table2 },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: User },
];

export function SiteHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const notifications = useNightlink((s) => s.notifications);
  const markRead = useNightlink((s) => s.markNotificationsRead);
  const setDemoMode = useNightlink((s) => s.setDemoMode);
  const demoMode = useNightlink((s) => s.demoMode);
  const profile = useNightlink((s) => s.profile);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (searchParams.get("demo") === "1") setDemoMode(true);
  }, [searchParams, setDemoMode]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07060c]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-[0_0_24px_rgb(139_92_246/0.35)]">
            <Disc3 className="h-5 w-5 text-white" />
          </span>
          <span className="font-display text-lg font-semibold tracking-[0.18em] text-white neon-text">
            NIGHTLINK
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-white",
                pathname === href && "bg-white/10 text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <Link
            href="/dj"
            className="ml-1 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-3 py-2 text-sm font-medium text-white"
          >
            Become a DJ
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="hidden text-xs text-violet-300 sm:inline-flex"
            onClick={() => {
              setDemoMode(true);
              router.push("/?demo=1");
            }}
          >
            {demoMode ? "Demo ON" : "Investor Demo"}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="relative inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-500 px-1 text-[10px] text-white">
                  {unread}
                </span>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-sm font-medium">Notifications</span>
                <button
                  type="button"
                  className="text-xs text-violet-300"
                  onClick={() => markRead()}
                >
                  Mark read
                </button>
              </div>
              {notifications.slice(0, 6).map((n) => (
                <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5">
                  <span className="text-sm">{n.text}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(n.at).toLocaleTimeString()}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/profile" className="hidden items-center gap-2 sm:flex">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.avatar}
              alt=""
              className="h-8 w-8 rounded-full border border-white/20 bg-muted"
            />
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0b0912] px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-white"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/dj"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-violet-300"
            >
              Become a DJ
            </Link>
            <Badge variant="secondary" className="mt-2 w-fit">
              Moderator online
            </Badge>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#05040a]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="max-w-2xl">
          <p className="font-display text-xs tracking-[0.25em] text-violet-300">
            BEYOND NIGHTLIFE
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">
            One social layer. Any live moment.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Sports, concerts, festivals, birthdays, private events, creators, and
            hybrid real clubs — NIGHTLINK is the presence layer that turns any
            live stream into a room you can feel.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} NIGHTLINK</span>
          <span>18+ demo environment</span>
          <span>No copyrighted music rebroadcast</span>
          <Link href="/?demo=1" className="text-violet-300 hover:underline">
            Investor demo
          </Link>
        </div>
      </div>
    </footer>
  );
}
