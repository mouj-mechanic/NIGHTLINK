"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  BIRTHDAY,
  CLUBS,
  CURRENT_USER,
  DEMO_TRACKS,
  generateCrowd,
  MAYA_CHAT_OPENERS,
  MAYA_CHAT_REPLIES,
  MAYA_WAVE,
} from "./mock-data";
import type {
  Attendee,
  BirthdayParty,
  ChatMessage,
  Club,
  Conversation,
  GiftType,
  NotificationItem,
  SocialTable,
  TableSeat,
  UserProfile,
} from "./types";

function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

interface NightlinkState {
  hydrated: boolean;
  ageVerified: boolean;
  demoMode: boolean;
  guidedStep: number | null;
  clubs: Club[];
  crowdByClub: Record<string, Attendee[]>;
  conversations: Record<string, Conversation>;
  myTable: SocialTable | null;
  activeClubId: string | null;
  profile: UserProfile;
  birthday: BirthdayParty;
  notifications: NotificationItem[];
  favoriteClubs: string[];
  blockedUsers: string[];
  mutedUsers: string[];
  audienceBoost: number;
  selectedProfileId: string | null;
  chatOpenWith: string | null;
  showAgeGate: boolean;
  pendingClubId: string | null;
  toastQueue: string[];
  giftAnimation: GiftType | null;
  seatRequests: string[];
  matchCeremony: boolean;
  trackIndex: number;
  guidedHighlight: string | null;

  setHydrated: (v: boolean) => void;
  setDemoMode: (v: boolean) => void;
  setGuidedStep: (v: number | null) => void;
  setGuidedHighlight: (v: string | null) => void;
  setAgeVerified: (v: boolean) => void;
  resetAgeVerification: () => void;
  requestEnterClub: (clubId: string) => void;
  completeAgeGate: () => void;
  cancelAgeGate: () => void;
  leaveClub: () => void;
  getCrowd: (clubId: string) => Attendee[];
  ensureCrowd: (clubId: string) => void;
  selectProfile: (id: string | null) => void;
  sendPoke: (userId: string, opts?: { instant?: boolean }) => void;
  receivePokeFromMaya: (opts?: { instant?: boolean }) => void;
  pokeBack: (userId: string) => void;
  unlockChat: (userId: string) => void;
  openChat: (userId: string | null) => void;
  seedMayaChat: () => void;
  sendMessage: (userId: string, text: string) => void;
  simulateReply: (userId: string, text: string) => void;
  createTable: (withUserId: string) => void;
  inviteToTable: (userId: string) => void;
  upgradeVip: () => void;
  leaveTable: () => void;
  setTableCamera: (on: boolean) => void;
  setTableMuted: (muted: boolean) => void;
  setDjVolume: (v: number) => void;
  setTableVoices: (v: number) => void;
  setMayaCamera: (on: boolean) => void;
  askMayaCamera: () => void;
  sendTableChat: (text: string) => void;
  addTableReaction: (emoji: string) => void;
  sendTableGift: (gift: GiftType, toUserId: string) => void;
  requestSeat: (tableId: string) => void;
  toggleFavorite: (clubId: string) => void;
  createDjRoom: (room: Omit<Club, "id" | "isLive" | "listeners" | "track" | "sessionMinutes" | "isUserCreated"> & { trackTitle: string; trackArtist: string }) => string;
  updateProfile: (partial: Partial<UserProfile>) => void;
  updatePrivacy: (partial: Partial<UserProfile["privacy"]>) => void;
  setSubscription: (key: "nightlinkPlus" | "djPro", value: boolean) => void;
  sendGift: (gift: GiftType) => void;
  writeWall: (text: string) => void;
  increaseAudience: (n?: number) => void;
  nextTrack: () => void;
  driftListeners: () => void;
  addNotification: (text: string) => void;
  markNotificationsRead: () => void;
  blockUser: (userId: string) => void;
  muteUser: (userId: string) => void;
  pushToast: (text: string) => void;
  clearToast: () => void;
  clearGiftAnimation: () => void;
  dismissMatchCeremony: () => void;
  directorAction: (action: string) => void;
  applyPreset: (preset: "start" | "social" | "table" | "vip") => void;
  resetEverything: () => void;
  getAttendee: (id: string) => Attendee | undefined;
}

const defaultConv = (userId: string): Conversation => ({
  userId,
  unlocked: false,
  matched: false,
  pokeSent: false,
  pokeBack: false,
  pokePhase: "idle",
  messages: [],
});

const STORAGE_KEY = "nightlink-demo-v2";

function emptyTableSeats(n: number, filled: (string | null)[]): TableSeat[] {
  const seats: TableSeat[] = filled.map((userId) => ({ userId }));
  while (seats.length < n) seats.push({ userId: null });
  return seats;
}

export const useNightlink = create<NightlinkState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      ageVerified: false,
      demoMode: false,
      guidedStep: null,
      clubs: CLUBS,
      crowdByClub: {},
      conversations: {},
      myTable: null,
      activeClubId: null,
      profile: CURRENT_USER,
      birthday: BIRTHDAY,
      notifications: [
        {
          id: "n1",
          text: "Neon Athens is peaking — 327 listeners with DJ KOSMOS.",
          at: Date.now() - 60000,
          read: false,
        },
      ],
      favoriteClubs: [],
      blockedUsers: [],
      mutedUsers: [],
      audienceBoost: 0,
      selectedProfileId: null,
      chatOpenWith: null,
      showAgeGate: false,
      pendingClubId: null,
      toastQueue: [],
      giftAnimation: null,
      seatRequests: [],
      matchCeremony: false,
      trackIndex: 0,
      guidedHighlight: null,

      setHydrated: (v) => set({ hydrated: v }),
      setDemoMode: (v) => set({ demoMode: v }),
      setGuidedStep: (v) => set({ guidedStep: v }),
      setGuidedHighlight: (v) => set({ guidedHighlight: v }),
      setAgeVerified: (v) => set({ ageVerified: v }),
      resetAgeVerification: () =>
        set({ ageVerified: false, showAgeGate: false, pendingClubId: null }),

      dismissMatchCeremony: () => set({ matchCeremony: false }),

      requestEnterClub: (clubId) => {
        const { ageVerified } = get();
        if (ageVerified) {
          get().ensureCrowd(clubId);
          set({ activeClubId: clubId, showAgeGate: false, pendingClubId: null });
        } else {
          set({ showAgeGate: true, pendingClubId: clubId });
        }
      },

      completeAgeGate: () => {
        const { pendingClubId } = get();
        set({ ageVerified: true, showAgeGate: false });
        if (pendingClubId) {
          get().ensureCrowd(pendingClubId);
          set({ activeClubId: pendingClubId, pendingClubId: null });
          get().pushToast("Age verified 18+ · Welcome to NIGHTLINK");
          get().addNotification("Age verification complete (demo).");
        }
      },

      cancelAgeGate: () => set({ showAgeGate: false, pendingClubId: null }),

      leaveClub: () => set({ activeClubId: null, chatOpenWith: null, selectedProfileId: null }),

      getCrowd: (clubId) => {
        const existing = get().crowdByClub[clubId];
        if (existing) return existing;
        return generateCrowd(clubId);
      },

      ensureCrowd: (clubId) => {
        if (!get().crowdByClub[clubId]) {
          set({
            crowdByClub: {
              ...get().crowdByClub,
              [clubId]: generateCrowd(clubId),
            },
          });
        }
      },

      selectProfile: (id) => set({ selectedProfileId: id }),

      sendPoke: (userId, opts) => {
        const conv = get().conversations[userId] ?? defaultConv(userId);
        set({
          conversations: {
            ...get().conversations,
            [userId]: { ...conv, pokeSent: true, pokePhase: "waiting" },
          },
          selectedProfileId: userId,
        });
        get().pushToast("Poke sent · waiting…");
        const attendee = get().getAttendee(userId);
        const isMaya = attendee?.isMayaWave || userId === MAYA_WAVE.id;
        if (isMaya) {
          if (opts?.instant) {
            get().receivePokeFromMaya({ instant: true });
          } else {
            setTimeout(() => get().receivePokeFromMaya(), 1800);
          }
        }
      },

      receivePokeFromMaya: (opts) => {
        const userId = MAYA_WAVE.id;
        const conv = get().conversations[userId] ?? defaultConv(userId);
        const openers = MAYA_CHAT_OPENERS.map((text, i) => ({
          id: uid("msg"),
          from: "them" as const,
          text,
          at: Date.now() + i,
        }));
        set({
          conversations: {
            ...get().conversations,
            [userId]: {
              ...conv,
              pokeSent: true,
              pokeBack: true,
              matched: true,
              unlocked: true,
              pokePhase: "matched",
              messages: conv.messages.length === 0 ? openers : conv.messages,
            },
          },
          matchCeremony: true,
        });
        get().pushToast("MayaWave poked you back");
        get().addNotification("YOU MATCHED IN THE CROWD 🔥");
        if (opts?.instant) {
          /* keep ceremony visible briefly via UI */
        }
      },

      pokeBack: (userId) => {
        const conv = get().conversations[userId] ?? defaultConv(userId);
        set({
          conversations: {
            ...get().conversations,
            [userId]: {
              ...conv,
              pokeBack: true,
              matched: true,
              unlocked: true,
              pokePhase: "matched",
            },
          },
          matchCeremony: true,
        });
        get().pushToast("Matched in the crowd");
      },

      unlockChat: (userId) => {
        const conv = get().conversations[userId] ?? defaultConv(userId);
        set({
          conversations: {
            ...get().conversations,
            [userId]: {
              ...conv,
              unlocked: true,
              matched: true,
              pokePhase: "matched",
            },
          },
          chatOpenWith: userId,
          matchCeremony: false,
        });
      },

      openChat: (userId) =>
        set({ chatOpenWith: userId, matchCeremony: false, selectedProfileId: null }),

      seedMayaChat: () => {
        const userId = MAYA_WAVE.id;
        const conv = get().conversations[userId] ?? defaultConv(userId);
        if (conv.messages.length > 0) {
          set({ chatOpenWith: userId, matchCeremony: false });
          return;
        }
        get().receivePokeFromMaya({ instant: true });
        set({ chatOpenWith: userId, matchCeremony: false });
      },

      sendMessage: (userId, text) => {
        const conv = get().conversations[userId] ?? defaultConv(userId);
        if (!conv.unlocked) return;
        const msg: ChatMessage = {
          id: uid("msg"),
          from: "me",
          text,
          at: Date.now(),
        };
        set({
          conversations: {
            ...get().conversations,
            [userId]: { ...conv, messages: [...conv.messages, msg] },
          },
        });
        if (userId === MAYA_WAVE.id) {
          setTimeout(() => {
            const replies = MAYA_CHAT_REPLIES;
            get().simulateReply(
              userId,
              replies[Math.floor(Math.random() * replies.length)]
            );
          }, 1200);
        }
      },

      simulateReply: (userId, text) => {
        const conv = get().conversations[userId] ?? defaultConv(userId);
        const msg: ChatMessage = {
          id: uid("msg"),
          from: "them",
          text,
          at: Date.now(),
        };
        set({
          conversations: {
            ...get().conversations,
            [userId]: { ...conv, messages: [...conv.messages, msg] },
          },
        });
      },

      createTable: (withUserId) => {
        const table: SocialTable = {
          id: uid("table"),
          number: 12,
          name: "Table 12",
          clubId: get().activeClubId ?? "neon-athens",
          seats: emptyTableSeats(4, ["me", withUserId]),
          maxSeats: 4,
          isVip: false,
          visibility: "PRIVATE",
          ownerId: "me",
          chat: [
            {
              id: uid("tc"),
              from: "them",
              text: "Still hearing KOSMOS perfectly from here ✨",
              at: Date.now(),
            },
          ],
          myCameraOn: false,
          myMuted: false,
          djVolume: 72,
          tableVoices: 65,
          mayaCameraOn: false,
          reactions: [],
          giftFlash: null,
        };
        set({
          myTable: table,
          chatOpenWith: null,
          selectedProfileId: null,
          matchCeremony: false,
          activeClubId: get().activeClubId ?? "neon-athens",
        });
        get().pushToast("Table 12 · 2/4 — music continues");
        get().addNotification("Your social table is live inside the club.");
      },

      inviteToTable: (userId) => {
        const table = get().myTable;
        if (!table) return;
        const emptyIdx = table.seats.findIndex((s) => !s.userId);
        if (emptyIdx === -1) {
          get().pushToast("Table is full — upgrade to VIP for more seats.");
          return;
        }
        const seats = [...table.seats];
        seats[emptyIdx] = { userId };
        const who = get().getAttendee(userId)?.pseudo ?? "Guest";
        set({
          myTable: {
            ...table,
            seats,
            chat: [
              ...table.chat,
              {
                id: uid("tc"),
                from: "them",
                text: `${who}: Hey 👋`,
                at: Date.now(),
              },
            ],
          },
        });
        get().pushToast(`${who} joined · Seat ${emptyIdx + 1}`);
      },

      upgradeVip: () => {
        const table = get().myTable;
        if (!table) return;
        const seats = [...table.seats];
        while (seats.length < 10) seats.push({ userId: null, isVipCamera: true });
        set({
          myTable: {
            ...table,
            isVip: true,
            maxSeats: 10,
            visibility: "VIP",
            name: "MIDNIGHT CREW 👑",
            seats,
          },
        });
        get().pushToast("VIP UNLOCKED · MIDNIGHT CREW · 10 seats");
        get().addNotification("VIP table upgrade (demo €4.99).");
      },

      leaveTable: () => {
        set({ myTable: null });
        get().pushToast("Left the table");
      },

      setTableCamera: (on) => {
        const t = get().myTable;
        if (t) set({ myTable: { ...t, myCameraOn: on } });
      },
      setTableMuted: (muted) => {
        const t = get().myTable;
        if (t) set({ myTable: { ...t, myMuted: muted } });
      },
      setDjVolume: (v) => {
        const t = get().myTable;
        if (t) set({ myTable: { ...t, djVolume: v } });
      },
      setTableVoices: (v) => {
        const t = get().myTable;
        if (t) set({ myTable: { ...t, tableVoices: v } });
      },
      setMayaCamera: (on) => {
        const t = get().myTable;
        if (t) set({ myTable: { ...t, mayaCameraOn: on } });
      },
      askMayaCamera: () => {
        get().pushToast("Camera request sent…");
        setTimeout(() => {
          get().setMayaCamera(true);
          get().pushToast("MayaWave accepted.");
        }, 900);
      },
      sendTableChat: (text) => {
        const t = get().myTable;
        if (!t) return;
        set({
          myTable: {
            ...t,
            chat: [
              ...t.chat,
              { id: uid("tc"), from: "me", text, at: Date.now() },
            ],
          },
        });
      },
      addTableReaction: (emoji) => {
        const t = get().myTable;
        if (!t) return;
        const reaction = { id: uid("rx"), emoji, at: Date.now() };
        set({
          myTable: {
            ...t,
            reactions: [...t.reactions.slice(-12), reaction],
          },
        });
      },
      sendTableGift: (gift, toUserId) => {
        const t = get().myTable;
        if (!t) return;
        const to = get().getAttendee(toUserId)?.pseudo ?? "friend";
        set({
          myTable: {
            ...t,
            giftFlash: { gift, to, at: Date.now() },
          },
          giftAnimation: gift,
        });
        get().pushToast(`${gift} sent to ${to} (demo)`);
        setTimeout(() => {
          const cur = get().myTable;
          if (cur) set({ myTable: { ...cur, giftFlash: null } });
          get().clearGiftAnimation();
        }, 2800);
      },

      requestSeat: (tableId) => {
        if (get().seatRequests.includes(tableId)) return;
        set({ seatRequests: [...get().seatRequests, tableId] });
        get().pushToast("Request sent.");
        setTimeout(() => {
          get().pushToast("Seat request accepted (demo).");
        }, 1800);
      },

      toggleFavorite: (clubId) => {
        const favs = get().favoriteClubs;
        set({
          favoriteClubs: favs.includes(clubId)
            ? favs.filter((id) => id !== clubId)
            : [...favs, clubId],
        });
      },

      createDjRoom: (room) => {
        const id = uid("club");
        const club: Club = {
          id,
          name: room.name,
          djName: room.djName,
          djAvatar: room.djAvatar,
          city: room.city,
          country: room.country,
          flag: room.flag,
          genre: room.genre,
          capacity: room.capacity,
          musicSource: room.musicSource,
          mood: room.mood,
          headphoneRec: room.headphoneRec,
          listeners: 12,
          sessionMinutes: 0,
          isLive: true,
          isUserCreated: true,
          track: {
            title: room.trackTitle,
            artist: room.trackArtist,
            artwork: `https://api.dicebear.com/9.x/shapes/svg?seed=${id}`,
            progress: 5,
            durationSec: 300,
            source: room.musicSource,
          },
        };
        set({ clubs: [club, ...get().clubs] });
        get().pushToast(`${club.name} is now live on the lobby`);
        get().addNotification(`Your demo room “${club.name}” is open.`);
        return id;
      },

      updateProfile: (partial) =>
        set({ profile: { ...get().profile, ...partial } }),
      updatePrivacy: (partial) =>
        set({
          profile: {
            ...get().profile,
            privacy: { ...get().profile.privacy, ...partial },
          },
        }),
      setSubscription: (key, value) =>
        set({
          profile: {
            ...get().profile,
            subscriptions: { ...get().profile.subscriptions, [key]: value },
          },
        }),

      sendGift: (gift) => {
        const b = get().birthday;
        set({
          birthday: {
            ...b,
            giftsReceived: [
              ...b.giftsReceived,
              { gift, from: get().profile.pseudo, at: Date.now() },
            ],
          },
          giftAnimation: gift,
        });
        get().pushToast(`${gift} sent to Emma (demo)`);
        setTimeout(() => get().clearGiftAnimation(), 2800);
      },

      writeWall: (text) => {
        const b = get().birthday;
        set({
          birthday: {
            ...b,
            wall: [
              {
                id: uid("wall"),
                author: get().profile.pseudo,
                text,
                at: Date.now(),
              },
              ...b.wall,
            ],
          },
        });
      },

      increaseAudience: (n = 40) => {
        const boost = get().audienceBoost + n;
        const clubs = get().clubs.map((c) =>
          c.id === (get().activeClubId ?? "neon-athens")
            ? { ...c, listeners: c.listeners + n }
            : c
        );
        set({ audienceBoost: boost, clubs });
        get().pushToast(`Audience +${n}`);
      },

      nextTrack: () => {
        const idx = (get().trackIndex + 1) % DEMO_TRACKS.length;
        const track = DEMO_TRACKS[idx];
        const clubId = get().activeClubId ?? "neon-athens";
        set({
          trackIndex: idx,
          clubs: get().clubs.map((c) =>
            c.id === clubId
              ? {
                  ...c,
                  track: {
                    ...track,
                    progress: 2,
                  },
                }
              : c
          ),
        });
        get().pushToast(`Now playing · ${track.title}`);
      },

      driftListeners: () => {
        const clubId = get().activeClubId ?? "neon-athens";
        const delta = Math.random() > 0.45 ? 1 : -1;
        set({
          clubs: get().clubs.map((c) =>
            c.id === clubId
              ? { ...c, listeners: Math.max(120, c.listeners + delta * (1 + Math.floor(Math.random() * 3))) }
              : c
          ),
        });
      },

      addNotification: (text) =>
        set({
          notifications: [
            { id: uid("n"), text, at: Date.now(), read: false },
            ...get().notifications,
          ].slice(0, 30),
        }),
      markNotificationsRead: () =>
        set({
          notifications: get().notifications.map((n) => ({ ...n, read: true })),
        }),
      blockUser: (userId) => {
        set({
          blockedUsers: [...new Set([...get().blockedUsers, userId])],
          selectedProfileId: null,
          chatOpenWith: null,
        });
        get().pushToast("User blocked (local demo)");
      },
      muteUser: (userId) => {
        set({ mutedUsers: [...new Set([...get().mutedUsers, userId])] });
        get().pushToast("User muted (local demo)");
      },
      pushToast: (text) =>
        set({ toastQueue: [...get().toastQueue, text] }),
      clearToast: () =>
        set({ toastQueue: get().toastQueue.slice(1) }),
      clearGiftAnimation: () => set({ giftAnimation: null }),

      directorAction: (action) => {
        const maya = MAYA_WAVE.id;
        switch (action) {
          case "reset-demo":
            get().resetEverything();
            break;
          case "go-lobby":
            set({ activeClubId: null, showAgeGate: false });
            break;
          case "enter-athens":
            get().requestEnterClub("neon-athens");
            break;
          case "verify-age":
            set({ pendingClubId: "neon-athens", ageVerified: false });
            get().completeAgeGate();
            set({ ageVerified: true, activeClubId: "neon-athens", showAgeGate: false });
            get().ensureCrowd("neon-athens");
            break;
          case "open-maya":
            set({ activeClubId: "neon-athens", ageVerified: true });
            get().ensureCrowd("neon-athens");
            get().selectProfile(maya);
            break;
          case "send-poke":
            get().sendPoke(maya, { instant: false });
            break;
          case "maya-poke-back":
            get().receivePokeFromMaya({ instant: true });
            break;
          case "open-chat":
            if (!get().conversations[maya]?.unlocked) {
              get().receivePokeFromMaya({ instant: true });
            }
            get().openChat(maya);
            break;
          case "maya-message":
            if (!get().conversations[maya]?.unlocked) {
              get().receivePokeFromMaya({ instant: true });
            }
            get().openChat(maya);
            get().simulateReply(maya, MAYA_CHAT_REPLIES[0]);
            break;
          case "create-table":
            if (!get().conversations[maya]?.unlocked) {
              get().receivePokeFromMaya({ instant: true });
            }
            get().createTable(maya);
            break;
          case "maya-camera":
            if (!get().myTable) get().createTable(maya);
            get().askMayaCamera();
            break;
          case "invite-alex":
            if (!get().myTable) get().createTable(maya);
            get().inviteToTable("alex-bass");
            break;
          case "upgrade-vip":
            if (!get().myTable) {
              get().createTable(maya);
              get().inviteToTable("alex-bass");
            }
            get().upgradeVip();
            break;
          case "send-champagne":
            if (!get().myTable) {
              get().createTable(maya);
              get().inviteToTable("alex-bass");
            }
            get().sendTableGift("Champagne", maya);
            break;
          case "add-listeners":
            get().increaseAudience(100);
            break;
          case "next-track":
            get().nextTrack();
            break;
          case "crowd-reaction":
            if (typeof window !== "undefined") {
              window.dispatchEvent(
                new CustomEvent("nightlink-crowd-reaction", {
                  detail: { emoji: "🔥" },
                })
              );
            }
            get().pushToast("Crowd reacted 🔥");
            break;
          case "start-birthday":
            get().pushToast("Birthday party is live — open Events");
            get().addNotification("Emma's 30th Birthday is LIVE in Paris.");
            break;
          // legacy aliases
          case "receive-poke":
            get().directorAction("maya-poke-back");
            break;
          case "poke-back":
            get().directorAction("send-poke");
            break;
          case "start-chat":
            get().directorAction("open-chat");
            break;
          case "add-third":
            get().directorAction("invite-alex");
            break;
          case "receive-gift":
            get().directorAction("send-champagne");
            break;
          case "increase-audience":
            get().directorAction("add-listeners");
            break;
          default:
            break;
        }
      },

      applyPreset: (preset) => {
        const maya = MAYA_WAVE.id;
        get().ensureCrowd("neon-athens");
        if (preset === "start") {
          set({
            ageVerified: false,
            activeClubId: null,
            conversations: {},
            myTable: null,
            selectedProfileId: null,
            chatOpenWith: null,
            matchCeremony: false,
            showAgeGate: false,
            pendingClubId: null,
            audienceBoost: 0,
            clubs: CLUBS.map((c) => ({ ...c })),
            trackIndex: 0,
            demoMode: true,
          });
          get().pushToast("Preset START · clean lobby");
          return;
        }
        if (preset === "social") {
          set({
            ageVerified: true,
            activeClubId: "neon-athens",
            conversations: {},
            myTable: null,
            selectedProfileId: maya,
            chatOpenWith: null,
            matchCeremony: false,
            showAgeGate: false,
            demoMode: true,
          });
          get().pushToast("Preset SOCIAL · Maya ready");
          return;
        }
        if (preset === "table") {
          get().receivePokeFromMaya({ instant: true });
          get().createTable(maya);
          set({
            ageVerified: true,
            activeClubId: "neon-athens",
            matchCeremony: false,
            demoMode: true,
          });
          get().pushToast("Preset TABLE · 2/4");
          return;
        }
        if (preset === "vip") {
          get().receivePokeFromMaya({ instant: true });
          get().createTable(maya);
          get().inviteToTable("alex-bass");
          get().upgradeVip();
          set({
            ageVerified: true,
            activeClubId: "neon-athens",
            matchCeremony: false,
            demoMode: true,
          });
          get().pushToast("Preset VIP · 3/10 Midnight Crew");
        }
      },

      resetEverything: () => {
        try {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem("nightlink-demo-v1");
        } catch {
          /* noop */
        }
        set({
          hydrated: true,
          ageVerified: false,
          demoMode: true,
          guidedStep: null,
          guidedHighlight: null,
          clubs: CLUBS.map((c) => ({ ...c })),
          crowdByClub: {},
          conversations: {},
          myTable: null,
          activeClubId: null,
          profile: CURRENT_USER,
          birthday: { ...BIRTHDAY, giftsReceived: [], wall: [...BIRTHDAY.wall] },
          notifications: [],
          favoriteClubs: [],
          blockedUsers: [],
          mutedUsers: [],
          audienceBoost: 0,
          selectedProfileId: null,
          chatOpenWith: null,
          showAgeGate: false,
          pendingClubId: null,
          toastQueue: [],
          giftAnimation: null,
          seatRequests: [],
          matchCeremony: false,
          trackIndex: 0,
        });
        get().pushToast("Demo reset — clean slate");
      },

      getAttendee: (id) => {
        if (id === MAYA_WAVE.id) return MAYA_WAVE;
        for (const crowd of Object.values(get().crowdByClub)) {
          const found = crowd.find((a) => a.id === id);
          if (found) return found;
        }
        return generateCrowd("neon-athens").find((a) => a.id === id);
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (s) => ({
        ageVerified: s.ageVerified,
        clubs: s.clubs,
        conversations: s.conversations,
        myTable: s.myTable,
        profile: s.profile,
        birthday: s.birthday,
        notifications: s.notifications,
        favoriteClubs: s.favoriteClubs,
        blockedUsers: s.blockedUsers,
        mutedUsers: s.mutedUsers,
        audienceBoost: s.audienceBoost,
        demoMode: s.demoMode,
        trackIndex: s.trackIndex,
        activeClubId: s.activeClubId,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
