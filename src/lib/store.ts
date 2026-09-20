"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  BIRTHDAY,
  CLUBS,
  CURRENT_USER,
  generateCrowd,
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

  setHydrated: (v: boolean) => void;
  setDemoMode: (v: boolean) => void;
  setGuidedStep: (v: number | null) => void;
  setAgeVerified: (v: boolean) => void;
  resetAgeVerification: () => void;
  requestEnterClub: (clubId: string) => void;
  completeAgeGate: () => void;
  cancelAgeGate: () => void;
  leaveClub: () => void;
  getCrowd: (clubId: string) => Attendee[];
  ensureCrowd: (clubId: string) => void;
  selectProfile: (id: string | null) => void;
  sendPoke: (userId: string) => void;
  receivePokeFromMaya: () => void;
  pokeBack: (userId: string) => void;
  unlockChat: (userId: string) => void;
  openChat: (userId: string | null) => void;
  sendMessage: (userId: string, text: string) => void;
  simulateReply: (userId: string, text: string) => void;
  createTable: (withUserId: string) => void;
  inviteToTable: (userId: string) => void;
  upgradeVip: () => void;
  leaveTable: () => void;
  setTableCamera: (on: boolean) => void;
  setTableMuted: (muted: boolean) => void;
  setDjVolume: (v: number) => void;
  sendTableChat: (text: string) => void;
  requestSeat: (tableId: string) => void;
  toggleFavorite: (clubId: string) => void;
  createDjRoom: (room: Omit<Club, "id" | "isLive" | "listeners" | "track" | "sessionMinutes" | "isUserCreated"> & { trackTitle: string; trackArtist: string }) => string;
  updateProfile: (partial: Partial<UserProfile>) => void;
  updatePrivacy: (partial: Partial<UserProfile["privacy"]>) => void;
  setSubscription: (key: "nightlinkPlus" | "djPro", value: boolean) => void;
  sendGift: (gift: GiftType) => void;
  writeWall: (text: string) => void;
  increaseAudience: (n?: number) => void;
  addNotification: (text: string) => void;
  markNotificationsRead: () => void;
  blockUser: (userId: string) => void;
  muteUser: (userId: string) => void;
  pushToast: (text: string) => void;
  clearToast: () => void;
  clearGiftAnimation: () => void;
  directorAction: (action: string) => void;
  getAttendee: (id: string) => Attendee | undefined;
}

const defaultConv = (userId: string): Conversation => ({
  userId,
  unlocked: false,
  matched: false,
  pokeSent: false,
  pokeBack: false,
  messages: [],
});

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

      setHydrated: (v) => set({ hydrated: v }),
      setDemoMode: (v) => set({ demoMode: v }),
      setGuidedStep: (v) => set({ guidedStep: v }),
      setAgeVerified: (v) => set({ ageVerified: v }),
      resetAgeVerification: () =>
        set({ ageVerified: false, showAgeGate: false, pendingClubId: null }),

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

      sendPoke: (userId) => {
        const conv = get().conversations[userId] ?? defaultConv(userId);
        set({
          conversations: {
            ...get().conversations,
            [userId]: { ...conv, pokeSent: true },
          },
        });
        get().pushToast("Poke sent.");
        const attendee = get().getAttendee(userId);
        if (attendee?.isMayaWave || userId === MAYA_WAVE.id) {
          setTimeout(() => {
            get().receivePokeFromMaya();
          }, 2000);
        }
      },

      receivePokeFromMaya: () => {
        const userId = MAYA_WAVE.id;
        const conv = get().conversations[userId] ?? defaultConv(userId);
        set({
          conversations: {
            ...get().conversations,
            [userId]: {
              ...conv,
              pokeSent: true,
              pokeBack: true,
              matched: true,
              unlocked: true,
              messages:
                conv.messages.length === 0
                  ? [
                      {
                        id: uid("msg"),
                        from: "them",
                        text: "Hey! Felt that poke from across the room ✨ You're into Midnight Signals too?",
                        at: Date.now(),
                      },
                    ]
                  : conv.messages,
            },
          },
        });
        get().pushToast("MayaWave poked back · MATCHED IN THE CROWD");
        get().addNotification("Matched with MayaWave — chat unlocked.");
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
            },
          },
        });
        get().pushToast("Matched · Chat unlocked");
      },

      unlockChat: (userId) => {
        const conv = get().conversations[userId] ?? defaultConv(userId);
        set({
          conversations: {
            ...get().conversations,
            [userId]: { ...conv, unlocked: true, matched: true },
          },
          chatOpenWith: userId,
        });
      },

      openChat: (userId) => set({ chatOpenWith: userId }),

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
            const replies = [
              "Love that — want to grab a table while KOSMOS is still on?",
              "Same energy. Table for two?",
              "Perfect timing. Let's start a private table.",
            ];
            get().simulateReply(
              userId,
              replies[Math.floor(Math.random() * replies.length)]
            );
          }, 1400);
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
          number: 4,
          clubId: get().activeClubId ?? "neon-athens",
          seats: [
            { userId: "me" },
            { userId: withUserId },
            { userId: null },
            { userId: null },
          ],
          maxSeats: 4,
          isVip: false,
          visibility: "PRIVATE",
          ownerId: "me",
          chat: [
            {
              id: uid("tc"),
              from: "them",
              text: "Table's open — still hearing the DJ loud and clear.",
              at: Date.now(),
            },
          ],
          myCameraOn: false,
          myMuted: false,
          djVolume: 70,
        };
        set({ myTable: table, chatOpenWith: null });
        get().pushToast("Private table created · 2/4 seats");
        get().addNotification("Your social table is live.");
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
        set({ myTable: { ...table, seats } });
        const who = get().getAttendee(userId)?.pseudo ?? "Guest";
        get().pushToast(`${who} joined your table`);
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
            seats,
          },
        });
        get().pushToast("VIP unlocked · up to 10 seats + video");
        get().addNotification("VIP table upgrade (demo purchase €4.99).");
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
          case "receive-poke": {
            const conv = get().conversations[maya] ?? defaultConv(maya);
            set({
              conversations: {
                ...get().conversations,
                [maya]: { ...conv, pokeSent: false },
              },
              selectedProfileId: maya,
            });
            get().addNotification("MayaWave wants to poke you…");
            get().pushToast("Incoming poke from MayaWave");
            break;
          }
          case "poke-back":
            get().sendPoke(maya);
            break;
          case "start-chat":
            get().receivePokeFromMaya();
            get().openChat(maya);
            break;
          case "create-table":
            if (!get().conversations[maya]?.unlocked) {
              get().receivePokeFromMaya();
            }
            get().createTable(maya);
            break;
          case "add-third":
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
          case "receive-gift":
            get().sendGift("Champagne");
            break;
          case "increase-audience":
            get().increaseAudience(55);
            break;
          case "start-birthday":
            get().pushToast("Birthday party is live — open Events");
            get().addNotification("Emma's 30th Birthday is LIVE in Paris.");
            break;
          default:
            break;
        }
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
      name: "nightlink-demo-v1",
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
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
