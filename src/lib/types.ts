export type MusicSource = "Spotify" | "YouTube" | "Deezer" | "Own" | "Other";

export type SocialAvailability =
  | "Open to talk"
  | "Just listening"
  | "With a table"
  | "Private"
  | "Looking to meet";

export type TableVisibility = "OPEN" | "FRIENDS ONLY" | "PRIVATE" | "VIP";

export type EventCategory =
  | "Virtual Clubs"
  | "Birthdays"
  | "Real Nightclubs"
  | "Concerts"
  | "Festivals"
  | "Sports Watch Parties";

export interface TrackInfo {
  title: string;
  artist: string;
  artwork: string;
  progress: number; // 0-100
  durationSec: number;
  source: MusicSource;
}

export interface Club {
  id: string;
  name: string;
  djName: string;
  djAvatar: string;
  city: string;
  country: string;
  flag: string;
  genre: string;
  track: TrackInfo;
  listeners: number;
  capacity: number;
  musicSource: MusicSource;
  mood: string;
  sessionMinutes: number;
  headphoneRec: string;
  isLive: boolean;
  isUserCreated?: boolean;
  friendsInside?: number;
}

export interface Attendee {
  id: string;
  pseudo: string;
  avatar: string;
  ageRange: string;
  gender?: string;
  city: string;
  country: string;
  flag: string;
  online: boolean;
  availability: SocialAvailability;
  bio: string;
  genres: string[];
  topArtists: string[];
  favoriteDjs: string[];
  gear: string;
  recentParties: string[];
  badges: string[];
  photos: string[];
  mutualInterests: string[];
  compatibility: number;
  tableId?: string;
  isMayaWave?: boolean;
}

export interface ChatMessage {
  id: string;
  from: "me" | "them";
  text: string;
  at: number;
}

export interface Conversation {
  userId: string;
  unlocked: boolean;
  matched: boolean;
  pokeSent: boolean;
  pokeBack: boolean;
  messages: ChatMessage[];
}

export interface TableSeat {
  userId: string | null;
  isVipCamera?: boolean;
}

export interface SocialTable {
  id: string;
  number: number;
  clubId: string;
  seats: TableSeat[];
  maxSeats: number;
  isVip: boolean;
  visibility: TableVisibility;
  ownerId: string;
  chat: ChatMessage[];
  myCameraOn: boolean;
  myMuted: boolean;
  djVolume: number;
}

export interface BirthdayParty {
  id: string;
  hostName: string;
  title: string;
  city: string;
  country: string;
  flag: string;
  guests: number;
  countries: number;
  age: number;
  wall: { id: string; author: string; text: string; at: number }[];
  giftsReceived: { gift: GiftType; from: string; at: number }[];
}

export type GiftType = "Champagne" | "Roses" | "Cake" | "Diamond" | "DJ Request";

export interface NightEvent {
  id: string;
  title: string;
  category: EventCategory;
  city: string;
  country: string;
  flag: string;
  date: string;
  price: number | "Free";
  image: string;
  description: string;
  realWorldTicket?: boolean;
}

export interface UserProfile {
  pseudo: string;
  avatar: string;
  ageRange: string;
  city: string;
  country: string;
  bio: string;
  genres: string[];
  topArtists: string[];
  gear: string;
  musicDna: string[];
  nightlife: string[];
  privacy: {
    showAge: boolean;
    showCity: boolean;
    allowPokes: boolean;
    showOnline: boolean;
    showTables: boolean;
    cameraDefaultOff: boolean;
  };
  subscriptions: {
    nightlinkPlus: boolean;
    djPro: boolean;
  };
}

export interface DemoState {
  ageVerified: boolean;
  demoMode: boolean;
  guidedStep: number | null;
  notifications: NotificationItem[];
  pokedUsers: string[];
  blockedUsers: string[];
  mutedUsers: string[];
  favoriteClubs: string[];
  audienceBoost: number;
}

export interface NotificationItem {
  id: string;
  text: string;
  at: number;
  read: boolean;
}
