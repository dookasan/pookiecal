export type Relationship = 'family' | 'friend' | 'colleague' | 'partner' | 'other';

export interface ReminderSetting {
  sameDay: boolean;
  oneDayBefore: boolean;
  threeDaysBefore: boolean;
  oneWeekBefore: boolean;
  time: string; // "09:00"
}

export interface GuestItem {
  id: string;
  name: string;
  phone?: string;
  status: 'confirmed' | 'pending' | 'declined';
  role?: string; // e.g. "Brings Cake", "Decorator"
}

export interface WishlistItem {
  id: string;
  title: string;
  estimatedCost: number;
  contributedAmount: number;
  contributors: { name: string; amount: number }[];
  link?: string;
}

export interface PartyPlan {
  id: string;
  birthdayId: string;
  title: string;
  theme: string;
  date: string;
  time: string;
  location: string;
  isSurprise: boolean;
  budgetGoal: number;
  guests: GuestItem[];
  wishlist: WishlistItem[];
  checklist: { id: string; text: string; done: boolean }[];
  notes: string;
}

export interface GooglePhotoItem {
  id: string;
  url: string;
  caption: string;
  date: string;
  album: string;
}

export interface GoogleChatMessage {
  id: string;
  sender: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
}

export interface GoogleEmailItem {
  id: string;
  subject: string;
  snippet: string;
  date: string;
  isUnread?: boolean;
  from: string;
}

export interface YouTubeChannelInfo {
  channelTitle: string;
  channelUrl: string;
  subscriberCount?: string;
  highlightVideos: {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    url: string;
  }[];
}

export interface BirthdayPerson {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  phone: string;
  email?: string;
  relationship: Relationship;
  avatarColor: string;
  avatarEmoji: string;
  notes?: string;
  favoriteThings?: string[];
  reminders: ReminderSetting;
  customCardTheme?: string;
  googleConnected?: boolean;
  googleProfile?: {
    googleEmail: string;
    photoUrl?: string;
    youtubeChannel?: YouTubeChannelInfo;
    recentEmails?: GoogleEmailItem[];
    chatConversations?: GoogleChatMessage[];
    sharedPhotos?: GooglePhotoItem[];
    connectedSince?: string;
    driveFolderUrl?: string;
  };
}

export type CardThemeId = 'aurora' | 'sunset' | 'retro' | 'champagne' | 'midnight' | 'confetti';

export interface CardTheme {
  id: CardThemeId;
  name: string;
  gradientCss: string;
  textColor: string;
  accentColor: string;
  borderStyle: string;
  fontClass: string;
  pattern?: string;
}

export type EventType = 'festival' | 'visit' | 'anniversary' | 'party' | 'custom';

export interface PrepItem {
  id: string;
  text: string;
  category: 'to-carry' | 'to-shop' | 'todo';
  done: boolean;
  webShopQuery?: string;
}

export interface CustomEvent {
  id: string;
  title: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  time?: string;
  personId?: string;
  personName?: string;
  personPhone?: string;
  location?: string;
  notes?: string;
  prepItems: PrepItem[];
  reminders: {
    sameDay: boolean;
    oneDayBefore: boolean;
    threeDaysBefore: boolean;
    twoHoursBefore: boolean;
  };
  isAddedToReminder: boolean;
  festivalId?: string;
  emoji?: string;
  color?: string;
}

export interface FestivalCatalogItem {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD in 2026/2027
  description: string;
  traditions: string[];
  suggestedCarryItems: string[];
  suggestedShopItems: string[];
  emoji: string;
  category: 'cultural' | 'global' | 'seasonal';
  color: string;
  defaultWishes: string[];
}

export interface DownstreamMember {
  id: string;
  name: string;
  relationship: string;
  avatarEmoji?: string;
  phone?: string;
  status: 'joined' | 'invited';
  addedAt: string;
}

export interface InviteRecord {
  id: string;
  inviteeName: string;
  relationship: Relationship;
  contactMethod: 'whatsapp' | 'sms' | 'email' | 'link' | 'qr';
  contactValue?: string;
  customMessage?: string;
  includeReferralRequest: boolean;
  referralNote?: string;
  status: 'sent' | 'viewed' | 'joined' | 'chain_active';
  sentAt: string;
  inviteCode: string;
  inviteUrl: string;
  downstreamReferrals: DownstreamMember[];
}

