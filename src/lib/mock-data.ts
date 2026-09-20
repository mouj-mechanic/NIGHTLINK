import type {
  Attendee,
  BirthdayParty,
  Club,
  NightEvent,
  UserProfile,
} from "./types";

/** Local demo-safe assets under /public — no remote CDN dependency. */
const flyer = (clubId: string) => `/flyers/${clubId}.svg`;
const EVENT_FLYERS = [
  "neon-athens",
  "pulse-paris",
  "sofia-voltage",
  "berlin-echo",
  "london-grid",
  "roof-tunis",
  "barca-signal",
  "sao-pulse",
] as const;
const art = (seed: string, _hue = 270) => {
  const hash = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0);
  return `/flyers/${EVENT_FLYERS[hash % EVENT_FLYERS.length]}.svg`;
};
const avatar = (seed: string) => {
  const slug = seed
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/([A-Za-z])(\d)/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `/avatars/${slug}.svg`;
};

export const CURRENT_USER: UserProfile = {
  pseudo: "You",
  avatar: avatar("nightlink-you"),
  ageRange: "25–29",
  city: "Lisbon",
  country: "Portugal",
  bio: "Here for the bassline and good tables. ANC always on.",
  genres: ["Melodic Techno", "House", "Afro House"],
  topArtists: ["NOVA", "Amelie Lens", "Keinemusik"],
  gear: "Sony WH-1000XM5 · Spatial ON",
  musicDna: ["Late-night techno", "Warm house", "Peak-time energy"],
  nightlife: ["Neon Athens", "Pulse Berlin", "Roof Tunis"],
  privacy: {
    showAge: true,
    showCity: true,
    allowPokes: true,
    showOnline: true,
    showTables: true,
    cameraDefaultOff: true,
  },
  subscriptions: {
    nightlinkPlus: false,
    djPro: false,
  },
};

export const CLUBS: Club[] = [
  {
    id: "neon-athens",
    name: "Neon Athens",
    djName: "DJ KOSMOS",
    djAvatar: avatar("kosmos"),
    flyer: flyer("neon-athens"),
    city: "Athens",
    country: "Greece",
    flag: "🇬🇷",
    genre: "Melodic Techno",
    track: {
      title: "Midnight Signals",
      artist: "NOVA",
      artwork: flyer("neon-athens"),
      progress: 42,
      durationSec: 384,
      source: "Spotify",
    },
    listeners: 327,
    capacity: 500,
    musicSource: "Spotify",
    mood: "Hypnotic peak",
    sessionMinutes: 94,
    headphoneRec: "ANC ON · Spatial preferred",
    isLive: true,
    friendsInside: 3,
  },
  {
    id: "pulse-paris",
    name: "Pulse Paris",
    djName: "Lina Verve",
    djAvatar: avatar("lina-verve"),
    flyer: flyer("pulse-paris"),
    city: "Paris",
    country: "France",
    flag: "🇫🇷",
    genre: "French House",
    track: {
      title: "Seine After Dark",
      artist: "Atelier 12",
      artwork: flyer("pulse-paris"),
      progress: 61,
      durationSec: 312,
      source: "Deezer",
    },
    listeners: 412,
    capacity: 600,
    musicSource: "Deezer",
    mood: "Velvet groove",
    sessionMinutes: 128,
    headphoneRec: "Bass boost light · ANC ON",
    isLive: true,
    friendsInside: 1,
  },
  {
    id: "sofia-voltage",
    name: "Sofia Voltage",
    djName: "Niki Drift",
    djAvatar: avatar("niki-drift"),
    flyer: flyer("sofia-voltage"),
    city: "Sofia",
    country: "Bulgaria",
    flag: "🇧🇬",
    genre: "Techno",
    track: {
      title: "Vitosha Pulse",
      artist: "GRID",
      artwork: flyer("sofia-voltage"),
      progress: 18,
      durationSec: 420,
      source: "Own",
    },
    listeners: 198,
    capacity: 350,
    musicSource: "Own",
    mood: "Warehouse heat",
    sessionMinutes: 67,
    headphoneRec: "Closed-back · Volume 60%",
    isLive: true,
  },
  {
    id: "berlin-echo",
    name: "Berlin Echo",
    djName: "Klaus Amplitude",
    djAvatar: avatar("klaus"),
    flyer: flyer("berlin-echo"),
    city: "Berlin",
    country: "Germany",
    flag: "🇩🇪",
    genre: "Minimal Techno",
    track: {
      title: "Kreuzberg Drift",
      artist: "Mono Field",
      artwork: flyer("berlin-echo"),
      progress: 77,
      durationSec: 540,
      source: "Spotify",
    },
    listeners: 489,
    capacity: 800,
    musicSource: "Spotify",
    mood: "4am precision",
    sessionMinutes: 210,
    headphoneRec: "ANC ON · Flat EQ",
    isLive: true,
    friendsInside: 2,
  },
  {
    id: "london-grid",
    name: "London Grid",
    djName: "Nova Lane",
    djAvatar: avatar("nova-lane"),
    flyer: flyer("london-grid"),
    city: "London",
    country: "UK",
    flag: "🇬🇧",
    genre: "UK Garage",
    track: {
      title: "Thames Skip",
      artist: "RIVET",
      artwork: flyer("london-grid"),
      progress: 33,
      durationSec: 248,
      source: "YouTube",
    },
    listeners: 356,
    capacity: 500,
    musicSource: "YouTube",
    mood: "Bounce & chat",
    sessionMinutes: 81,
    headphoneRec: "Spatial ON · Bass medium",
    isLive: true,
  },
  {
    id: "roof-tunis",
    name: "Roof Tunis",
    djName: "Amira Frequencies",
    djAvatar: avatar("amira"),
    flyer: flyer("roof-tunis"),
    city: "Tunis",
    country: "Tunisia",
    flag: "🇹🇳",
    genre: "Afro House",
    track: {
      title: "Medina Horizon",
      artist: "SAHARA LAB",
      artwork: flyer("roof-tunis"),
      progress: 55,
      durationSec: 360,
      source: "Deezer",
    },
    listeners: 241,
    capacity: 400,
    musicSource: "Deezer",
    mood: "Warm & open",
    sessionMinutes: 102,
    headphoneRec: "ANC optional · Warm EQ",
    isLive: true,
  },
  {
    id: "barca-signal",
    name: "Barça Signal",
    djName: "Miquel Orbit",
    djAvatar: avatar("miquel"),
    flyer: flyer("barca-signal"),
    city: "Barcelona",
    country: "Spain",
    flag: "🇪🇸",
    genre: "Melodic House",
    track: {
      title: "Gothic Quarter",
      artist: "Costa Line",
      artwork: flyer("barca-signal"),
      progress: 12,
      durationSec: 298,
      source: "Spotify",
    },
    listeners: 278,
    capacity: 450,
    musicSource: "Spotify",
    mood: "Sunset afterglow",
    sessionMinutes: 45,
    headphoneRec: "Spatial preferred",
    isLive: true,
  },
  {
    id: "sao-pulse",
    name: "São Pulse",
    djName: "Carla Neon",
    djAvatar: avatar("carla"),
    flyer: flyer("sao-pulse"),
    city: "São Paulo",
    country: "Brazil",
    flag: "🇧🇷",
    genre: "Baile / Tech",
    track: {
      title: "Avenida Loop",
      artist: "FAVELA WAVE",
      artwork: flyer("sao-pulse"),
      progress: 88,
      durationSec: 276,
      source: "Own",
    },
    listeners: 512,
    capacity: 700,
    musicSource: "Own",
    mood: "Carnival energy",
    sessionMinutes: 156,
    headphoneRec: "Bass boost · Volume careful",
    isLive: true,
    friendsInside: 4,
  },
  {
    id: "ams-canal",
    name: "Amsterdam Canal",
    djName: "Dutch Frequency",
    djAvatar: avatar("dutch"),
    flyer: flyer("ams-canal"),
    city: "Amsterdam",
    country: "Netherlands",
    flag: "🇳🇱",
    genre: "Progressive House",
    track: {
      title: "North Sea Glow",
      artist: "DELTA",
      artwork: flyer("ams-canal"),
      progress: 49,
      durationSec: 402,
      source: "Spotify",
    },
    listeners: 301,
    capacity: 480,
    musicSource: "Spotify",
    mood: "Smooth ascent",
    sessionMinutes: 118,
    headphoneRec: "ANC ON · Spatial ON",
    isLive: true,
  },
  {
    id: "tokyo-neon",
    name: "Tokyo Neon",
    djName: "Kenji Pulse",
    djAvatar: avatar("kenji-dj"),
    flyer: flyer("tokyo-neon"),
    city: "Tokyo",
    country: "Japan",
    flag: "🇯🇵",
    genre: "Future Bass",
    track: {
      title: "Shibuya Afterimage",
      artist: "PIXEL RAIN",
      artwork: flyer("tokyo-neon"),
      progress: 26,
      durationSec: 220,
      source: "YouTube",
    },
    listeners: 445,
    capacity: 600,
    musicSource: "YouTube",
    mood: "Electric clarity",
    sessionMinutes: 73,
    headphoneRec: "ANC ON · Detail focus",
    isLive: true,
  },
];

export const COUNTRY_LIVE: { country: string; flag: string; count: number }[] = [
  { country: "France", flag: "🇫🇷", count: 1842 },
  { country: "Germany", flag: "🇩🇪", count: 1620 },
  { country: "UK", flag: "🇬🇧", count: 1411 },
  { country: "Brazil", flag: "🇧🇷", count: 1288 },
  { country: "Japan", flag: "🇯🇵", count: 1195 },
  { country: "Greece", flag: "🇬🇷", count: 892 },
  { country: "Spain", flag: "🇪🇸", count: 867 },
  { country: "Netherlands", flag: "🇳🇱", count: 744 },
  { country: "Bulgaria", flag: "🇧🇬", count: 512 },
  { country: "Tunisia", flag: "🇹🇳", count: 398 },
];

const LOCAL_AVATARS = [
  "luna-beat",
  "rio-soul",
  "tunis-groove",
  "kenji-pulse",
  "sofia-night",
  "rico-808",
  "alex-bass",
  "amira",
  "carla",
  "dutch",
  "klaus",
  "miquel",
  "nova-lane",
  "niki-drift",
  "lina-verve",
] as const;

const NAMED_AVATAR_IDS = new Set([
  "maya-wave",
  "alex-bass",
  "sofia-night",
  "rico-808",
  "luna-beat",
  "rio-soul",
  "kenji-pulse",
  "tunis-groove",
]);

function makeAttendee(
  partial: Partial<Attendee> & Pick<Attendee, "id" | "pseudo" | "city" | "country" | "flag">
): Attendee {
  const hash = [...partial.id].reduce((a, c) => a + c.charCodeAt(0), 0);
  const poolPick =
    `/avatars/${LOCAL_AVATARS[Math.abs(hash) % LOCAL_AVATARS.length]}.svg`;
  const resolved =
    partial.avatar ??
    (NAMED_AVATAR_IDS.has(partial.id) ? `/avatars/${partial.id}.svg` : poolPick);

  return {
    ageRange: "24–28",
    online: true,
    availability: "Open to talk",
    bio: "In the room for the music and the people.",
    genres: ["Techno", "House"],
    topArtists: ["NOVA", "Amelie Lens"],
    favoriteDjs: ["DJ KOSMOS"],
    gear: "AirPods Max · ANC",
    recentParties: ["Neon Athens", "Berlin Echo"],
    badges: ["Early Adopter"],
    mutualInterests: ["Melodic Techno", "Late nights"],
    compatibility: 62,
    photos: [resolved, poolPick],
    ...partial,
    avatar: partial.avatar ?? resolved,
  };
}

export const MAYA_WAVE: Attendee = makeAttendee({
  id: "maya-wave",
  pseudo: "MayaWave",
  city: "Athens",
  country: "Greece",
  flag: "🇬🇷",
  ageRange: "26–30",
  gender: "She/Her",
  availability: "Looking to meet",
  bio: "Techno nights, rooftop sunsets, and tables that feel like real rooms. Based in Athens — currently in Neon Athens with DJ KOSMOS.",
  genres: ["Melodic Techno", "Progressive", "Ambient"],
  topArtists: ["NOVA", "Tale of Us", "Stephan Bodzin"],
  favoriteDjs: ["DJ KOSMOS", "Lina Verve"],
  gear: "Bose QC Ultra · Spatial ON · Bass medium",
  recentParties: ["Neon Athens", "Barça Signal", "Roof Tunis"],
  badges: ["Crowd Favorite", "Table Host", "Verified 18+"],
  mutualInterests: ["Melodic Techno", "DJ KOSMOS", "ANC headphones", "Athens nights"],
  compatibility: 87,
  isMayaWave: true,
});

export const NAMED_ATTENDEES: Attendee[] = [
  MAYA_WAVE,
  makeAttendee({
    id: "alex-bass",
    pseudo: "AlexBass",
    city: "Berlin",
    country: "Germany",
    flag: "🇩🇪",
    availability: "Open to talk",
    genres: ["Techno", "Minimal", "Melodic Techno"],
    compatibility: 92,
    gear: "Sennheiser HD 660S",
    mutualInterests: ["Techno", "DJ KOSMOS", "Late nights"],
  }),
  makeAttendee({
    id: "sofia-night",
    pseudo: "SofiaNight",
    city: "Sofia",
    country: "Bulgaria",
    flag: "🇧🇬",
    availability: "Just listening",
    genres: ["Techno", "Industrial"],
    compatibility: 81,
  }),
  makeAttendee({
    id: "rico-808",
    pseudo: "Rico808",
    city: "São Paulo",
    country: "Brazil",
    flag: "🇧🇷",
    availability: "Looking to meet",
    genres: ["Baile", "Tech House"],
    compatibility: 71,
    tableId: "open-table-2",
  }),
  makeAttendee({
    id: "luna-beat",
    pseudo: "LunaBeat",
    city: "Barcelona",
    country: "Spain",
    flag: "🇪🇸",
    availability: "With a table",
    genres: ["Melodic House", "Melodic Techno"],
    compatibility: 74,
    tableId: "open-table-1",
  }),
  makeAttendee({
    id: "tunis-groove",
    pseudo: "TunisGroove",
    city: "Tunis",
    country: "Tunisia",
    flag: "🇹🇳",
    availability: "Open to talk",
    genres: ["Afro House"],
    compatibility: 66,
  }),
  makeAttendee({
    id: "kenji-pulse",
    pseudo: "KenjiPulse",
    city: "Tokyo",
    country: "Japan",
    flag: "🇯🇵",
    availability: "Private",
    genres: ["Future Bass", "Techno"],
    compatibility: 58,
  }),
  makeAttendee({
    id: "rio-soul",
    pseudo: "RioSoul",
    city: "Rio de Janeiro",
    country: "Brazil",
    flag: "🇧🇷",
    availability: "Looking to meet",
    genres: ["House", "Disco"],
    compatibility: 73,
  }),
];

const FIRST = [
  "Nova", "Kai", "Mira", "Leo", "Zara", "Omar", "Ines", "Theo", "Yara", "Nico",
  "Sasha", "Elena", "Jonas", "Aya", "Hugo", "Vera", "Dario", "Noor", "Felix", "Iris",
];
const LAST = [
  "Vibe", "Wave", "Pulse", "Echo", "Drift", "Glow", "Beat", "Flux", "Orbit", "Spark",
];

export function generateCrowd(clubId: string, count = 30): Attendee[] {
  const base = NAMED_ATTENDEES.map((a) => ({ ...a }));
  const cities = [
    { city: "Athens", country: "Greece", flag: "🇬🇷" },
    { city: "Paris", country: "France", flag: "🇫🇷" },
    { city: "Berlin", country: "Germany", flag: "🇩🇪" },
    { city: "London", country: "UK", flag: "🇬🇧" },
    { city: "Tokyo", country: "Japan", flag: "🇯🇵" },
  ];
  const availabilities = [
    "Open to talk",
    "Just listening",
    "With a table",
    "Private",
    "Looking to meet",
  ] as const;

  const generated: Attendee[] = [];
  for (let i = base.length; i < count; i++) {
    const loc = cities[i % cities.length];
    const pseudo = `${FIRST[i % FIRST.length]}${LAST[i % LAST.length]}${i}`;
    generated.push(
      makeAttendee({
        id: `${clubId}-att-${i}`,
        pseudo,
        city: loc.city,
        country: loc.country,
        flag: loc.flag,
        ageRange: `${22 + (i % 8)}–${26 + (i % 8)}`,
        availability: availabilities[i % availabilities.length],
        compatibility: 45 + (i * 7) % 40,
        online: i % 9 !== 0,
        tableId: i % 7 === 0 ? `crowd-table-${(i % 3) + 1}` : undefined,
      })
    );
  }
  return [...base, ...generated].slice(0, count);
}

export const OPEN_TABLES_META = [
  {
    id: "open-table-1",
    number: 3,
    visibility: "OPEN" as const,
    seatsTaken: 2,
    maxSeats: 4,
    host: "LunaBeat",
  },
  {
    id: "open-table-2",
    number: 7,
    visibility: "FRIENDS ONLY" as const,
    seatsTaken: 3,
    maxSeats: 4,
    host: "Rico808",
  },
  {
    id: "open-table-3",
    number: 12,
    visibility: "VIP" as const,
    seatsTaken: 5,
    maxSeats: 10,
    host: "AlexBass",
  },
];

export const BIRTHDAY: BirthdayParty = {
  id: "emma-30",
  hostName: "Emma",
  title: "Emma's 30th Birthday",
  city: "Paris",
  country: "France",
  flag: "🇫🇷",
  guests: 86,
  countries: 14,
  age: 30,
  wall: [
    {
      id: "w1",
      author: "LunaBeat",
      text: "Happy birthday Emma — save me a seat at the VIP table!",
      at: Date.now() - 1000 * 60 * 12,
    },
    {
      id: "w2",
      author: "Rico808",
      text: "Champagne incoming from São Paulo 🥂",
      at: Date.now() - 1000 * 60 * 8,
    },
  ],
  giftsReceived: [],
};

export const EVENTS: NightEvent[] = [
  {
    id: "e1",
    title: "Neon Athens — Melodic Marathon",
    category: "Virtual Clubs",
    city: "Athens",
    country: "Greece",
    flag: "🇬🇷",
    date: "Tonight · 22:00",
    price: "Free",
    image: art("event-athens", 0x6b2cff),
    description: "DJ KOSMOS holds the room until sunrise.",
  },
  {
    id: "e2",
    title: "Emma's 30th Birthday",
    category: "Birthdays",
    city: "Paris",
    country: "France",
    flag: "🇫🇷",
    date: "Tonight · Live now",
    price: "Free",
    image: art("event-bday", 0xff2d8a),
    description: "Join the party, send gifts, write on the wall.",
  },
  {
    id: "e3",
    title: "Rex Club — Paris (Official)",
    category: "Real Nightclubs",
    city: "Paris",
    country: "France",
    flag: "🇫🇷",
    date: "Sat · 23:59",
    price: 28,
    image: art("event-rex", 0x1a6bff),
    description: "Buy official ticket placeholder — demo checkout only.",
    realWorldTicket: true,
  },
  {
    id: "e4",
    title: "Keinemusik Night — Virtual",
    category: "Concerts",
    city: "Berlin",
    country: "Germany",
    flag: "🇩🇪",
    date: "Fri · 21:00",
    price: 9.99,
    image: art("event-concert", 0x2dffc8),
    description: "Integration preview · demo seating.",
  },
  {
    id: "e5",
    title: "DGTL Amsterdam Watch Party",
    category: "Festivals",
    city: "Amsterdam",
    country: "Netherlands",
    flag: "🇳🇱",
    date: "Next week",
    price: 14.99,
    image: art("event-fest", 0xffa31a),
    description: "Festival energy, living-room tables.",
  },
  {
    id: "e6",
    title: "Champions League Final Watch",
    category: "Sports Watch Parties",
    city: "London",
    country: "UK",
    flag: "🇬🇧",
    date: "Wed · 20:00",
    price: "Free",
    image: art("event-sport", 0x00d68f),
    description:
      "Powered by NIGHTLINK social rooms — one layer for any live moment.",
  },
  {
    id: "e7",
    title: "Tomorrowland Virtual Stage",
    category: "Festivals",
    city: "Boom",
    country: "Belgium",
    flag: "🇧🇪",
    date: "Summer · Preview",
    price: 12.99,
    image: art("event-tomorrow", 0x7c3aed),
    description: "Powered by NIGHTLINK social rooms · festival tables.",
  },
  {
    id: "e8",
    title: "Arena Concert — Hybrid Night",
    category: "Concerts",
    city: "Berlin",
    country: "Germany",
    flag: "🇩🇪",
    date: "Fall · Preview",
    price: 9.99,
    image: art("event-arena", 0x2563eb),
    description: "Powered by NIGHTLINK social rooms · concert presence.",
  },
];

export const GIFT_CATALOG = [
  { type: "Champagne" as const, price: 4.99, emoji: "🥂", label: "Champagne" },
  { type: "Roses" as const, price: 2.99, emoji: "🌹", label: "Roses" },
  { type: "Cake" as const, price: 3.49, emoji: "🎂", label: "Cake" },
  { type: "Diamond" as const, price: 9.99, emoji: "💎", label: "Diamond" },
  { type: "DJ Request" as const, price: 6.99, emoji: "🎧", label: "DJ Request" },
];

export const TOTAL_PARTYING = 12482;

export const DEMO_TRACKS = [
  {
    title: "Midnight Signals",
    artist: "NOVA",
    artwork: art("midnight-signals", 0x6b2cff),
    durationSec: 384,
    source: "Spotify" as const,
  },
  {
    title: "Aegean Drift",
    artist: "KOSMOS",
    artwork: art("aegean-drift", 0x3b82f6),
    durationSec: 312,
    source: "Spotify" as const,
  },
  {
    title: "Neon Horizon",
    artist: "Lumen Field",
    artwork: art("neon-horizon", 0xec4899),
    durationSec: 278,
    source: "Own" as const,
  },
];

export const TABLE_INVITEES = [
  { id: "alex-bass", compatibility: 92 },
  { id: "luna-beat", compatibility: 74 },
  { id: "sofia-night", compatibility: 81 },
];

export const CLUB_PARTY_FROM = [
  { country: "Greece", flag: "🇬🇷", pct: 28 },
  { country: "Germany", flag: "🇩🇪", pct: 18 },
  { country: "France", flag: "🇫🇷", pct: 14 },
  { country: "UK", flag: "🇬🇧", pct: 12 },
  { country: "Brazil", flag: "🇧🇷", pct: 9 },
  { country: "Other", flag: "🌍", pct: 19 },
];

export const MAYA_CHAT_OPENERS = [
  "This DJ is insane 🔥",
  "First time at Neon Athens?",
];

export const MAYA_CHAT_REPLIES = [
  "Same — the bassline just hit different with ANC on.",
  "Want to grab a table while KOSMOS is still peaking?",
  "I can still hear the room from a private table — start one?",
  "Love that energy. Table for two?",
];

export const AMBIENT_EVENTS = [
  "LunaBeat joined the crowd",
  "AlexBass reacted 🔥",
  "SofiaNight is just listening",
  "Someone poked across the room",
  "Table 7 went VIP",
  "Rico808 opened a seat",
  "327 → peaking",
  "New listeners from Berlin",
];

