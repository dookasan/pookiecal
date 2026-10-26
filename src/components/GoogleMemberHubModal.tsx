import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mail,
  MessageSquare,
  Image as ImageIcon,
  Youtube,
  ExternalLink,
  Phone,
  Send,
  Plus,
  Check,
  Sparkles,
  Calendar,
  Video,
  Clock,
  Reply,
  Search,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Gift,
  Upload,
  Maximize2,
  FolderOpen,
  RefreshCw,
  LogIn
} from 'lucide-react';
import {
  BirthdayPerson,
  GoogleEmailItem,
  GoogleChatMessage,
  GooglePhotoItem
} from '../types/birthday';
import {
  calculateDaysUntilBirthday,
  formatBirthDateShort,
  getDirectCallUri,
  getWhatsAppShareUrl
} from '../utils/birthdayUtils';
import { fetchLiveGmailMessages } from '../utils/gmailApi';
import { User } from 'firebase/auth';

interface GoogleMemberHubModalProps {
  person: BirthdayPerson;
  allContacts?: BirthdayPerson[];
  onSelectPerson?: (person: BirthdayPerson) => void;
  onClose: () => void;
  onUpdatePerson: (updated: BirthdayPerson) => void;
  onOpenCardStudio: (person: BirthdayPerson) => void;
  onAddGiftToPartyPool?: (giftTitle: string, estimatedPrice: number, personName: string) => void;
  googleAccessToken?: string | null;
  googleUser?: User | null;
  onConnectGoogleAccount?: () => void;
}

type HubTab = 'all' | 'gmail' | 'chat' | 'photos' | 'youtube' | 'suggestions';

const STAT_CARD_VARIANTS = [
  'feature-card-pink',
  'feature-card-teal',
  'feature-card-peach',
  'feature-card-ochre'
] as const;

export const GoogleMemberHubModal: React.FC<GoogleMemberHubModalProps> = ({
  person,
  allContacts = [],
  onSelectPerson,
  onClose,
  onUpdatePerson,
  onOpenCardStudio,
  onAddGiftToPartyPool,
  googleAccessToken,
  googleUser,
  onConnectGoogleAccount
}) => {
  const [activeTab, setActiveTab] = useState<HubTab>('all');

  // Search filter across emails & chats
  const [searchQuery, setSearchQuery] = useState('');

  // Gmail compose state
  const [isComposingEmail, setIsComposingEmail] = useState(false);
  const [emailSubject, setEmailSubject] = useState(`Happy Birthday ${person.name}!`);
  const [emailBody, setEmailBody] = useState(
    `Hi ${person.name},\n\nWishing you the happiest of birthdays and an incredible year ahead! Let's catch up soon.\n\nWarmly,\nYour Circle`
  );
  const [emailSentToast, setEmailSentToast] = useState(false);

  // Real Gmail API sync state
  const [isSyncingRealGmail, setIsSyncingRealGmail] = useState(false);
  const [gmailSyncStatus, setGmailSyncStatus] = useState<string | null>(null);

  // Chat state
  const [chatInput, setChatInput] = useState('');

  // Photo add & upload state
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoAlbum, setNewPhotoAlbum] = useState('Birthday Memories');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Memory Reel / Lightbox Slideshow state
  const [slideshowActive, setSlideshowActive] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlayingSlideshow, setIsPlayingSlideshow] = useState(true);

  // Track which smart gift ideas were added to pool
  const [addedSuggestions, setAddedSuggestions] = useState<Record<string, boolean>>({});

  const profile = person.googleProfile;
  const emailAddress =
    profile?.googleEmail ||
    person.email ||
    `${person.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`;
  const daysUntil = calculateDaysUntilBirthday(person.birthDate);
  const callUri = getDirectCallUri(person.phone || '');
  const whatsappUrl = getWhatsAppShareUrl(
    person.phone || '',
    `Hey ${person.name}! Checking in from PookieCal!`
  );

  // Google Web App Deep Links
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    emailAddress
  )}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  const googleChatDeepLink = `https://mail.google.com/chat/u/0/#chat/home`;
  const googlePhotosDeepLink = `https://photos.google.com/search/${encodeURIComponent(person.name)}`;
  const googleMeetUrl = `https://meet.google.com/new`;
  const googleDriveUrl = `https://drive.google.com/drive/search?q=${encodeURIComponent(person.name)}`;
  const googleCalendarUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${encodeURIComponent(
    `${person.name}'s Birthday Celebration`
  )}&details=${encodeURIComponent(
    `Birthday celebration for ${person.name}! Don't forget to call at ${person.phone || ''}`
  )}&add=${encodeURIComponent(emailAddress)}`;

  const photosList = profile?.sharedPhotos || [];

  // Auto-sync real Gmail threads when connected with Google Account
  const handleSyncRealGmail = async () => {
    if (!googleAccessToken || !emailAddress) return;
    setIsSyncingRealGmail(true);
    setGmailSyncStatus(null);
    try {
      const res = await fetchLiveGmailMessages(googleAccessToken, emailAddress);
      if (res.success && res.messages.length > 0 && profile) {
        const existingIds = new Set(res.messages.map((e) => e.id));
        const mergedEmails = [
          ...res.messages,
          ...profile.recentEmails.filter((e) => !existingIds.has(e.id))
        ];
        onUpdatePerson({
          ...person,
          googleProfile: {
            ...profile,
            recentEmails: mergedEmails
          }
        });
        setGmailSyncStatus(`Synced ${res.messages.length} live Gmail message(s) with ${emailAddress}`);
      } else {
        setGmailSyncStatus(`Connected to live Gmail. No messages found with ${emailAddress}.`);
      }
    } catch {
      setGmailSyncStatus('Could not sync live Gmail messages. Check OAuth permissions.');
    } finally {
      setIsSyncingRealGmail(false);
    }
  };

  useEffect(() => {
    if (googleAccessToken && emailAddress) {
      handleSyncRealGmail();
    }
  }, [person.id, googleAccessToken]);

  // Auto-advance slideshow when active
  useEffect(() => {
    if (!slideshowActive || !isPlayingSlideshow || photosList.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % photosList.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [slideshowActive, isPlayingSlideshow, photosList.length]);

  const handleLogEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubject.trim() || !profile) return;

    const newEmail: GoogleEmailItem = {
      id: `em-${Date.now()}`,
      subject: emailSubject.trim(),
      snippet: emailBody.trim().slice(0, 140),
      date: 'Just now',
      unread: false,
      direction: 'sent'
    };

    const updated: BirthdayPerson = {
      ...person,
      googleProfile: {
        ...profile,
        recentEmails: [newEmail, ...profile.recentEmails]
      }
    };

    onUpdatePerson(updated);
    setEmailSentToast(true);
    setTimeout(() => {
      setEmailSentToast(false);
      setIsComposingEmail(false);
    }, 1500);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !profile) return;

    const newMsg: GoogleChatMessage = {
      id: `ch-${Date.now()}`,
      sender: 'me',
      text: chatInput.trim(),
      timestamp: 'Just now',
      platform: 'google-chat'
    };

    const updated: BirthdayPerson = {
      ...person,
      googleProfile: {
        ...profile,
        chatConversations: [...profile.chatConversations, newMsg]
      }
    };

    onUpdatePerson(updated);
    setChatInput('');
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim() || !profile) return;

    const newPhoto: GooglePhotoItem = {
      id: `ph-${Date.now()}`,
      url: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim() || `Memory with ${person.name}`,
      date: 'Added today',
      album: newPhotoAlbum.trim() || 'Shared Album'
    };

    const updated: BirthdayPerson = {
      ...person,
      googleProfile: {
        ...profile,
        sharedPhotos: [newPhoto, ...profile.sharedPhotos]
      }
    };

    onUpdatePerson(updated);
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setIsAddingPhoto(false);
  };

  const handleLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const newPhoto: GooglePhotoItem = {
        id: `ph-local-${Date.now()}`,
        url: dataUrl,
        caption: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        date: 'Uploaded today',
        album: 'Device Uploads'
      };

      const updated: BirthdayPerson = {
        ...person,
        googleProfile: {
          ...profile,
          sharedPhotos: [newPhoto, ...profile.sharedPhotos]
        }
      };
      onUpdatePerson(updated);
    };
    reader.readAsDataURL(file);
  };

  const getSmartGiftSuggestions = () => {
    const suggestions: { id: string; title: string; reason: string; estimatedCost: number }[] = [];
    const favs = person.favoriteThings || [];
    const ytTitle = profile?.youtubeChannel?.channelTitle || '';

    favs.forEach((fav, idx) => {
      suggestions.push({
        id: `sug-fav-${idx}`,
        title: `Curated ${fav} Gift Box`,
        reason: `Matches ${person.name}'s favorite interest in "${fav}"`,
        estimatedCost: 45 + idx * 15
      });
    });

    if (ytTitle) {
      suggestions.push({
        id: `sug-yt`,
        title: `Creator Studio Gear for "${ytTitle}"`,
        reason: `Inspired by their YouTube channel (${ytTitle})`,
        estimatedCost: 85
      });
    }

    suggestions.push({
      id: `sug-photo`,
      title: `Printed Hardcover Google Photos Book`,
      reason: `Compiled from ${photosList.length} shared Google Photos memories`,
      estimatedCost: 35
    });

    return suggestions;
  };

  const smartSuggestions = getSmartGiftSuggestions();

  const handleAddGiftToPool = (sug: { id: string; title: string; estimatedCost: number }) => {
    if (onAddGiftToPartyPool) {
      onAddGiftToPartyPool(sug.title, sug.estimatedCost, person.name);
    }
    setAddedSuggestions((prev) => ({ ...prev, [sug.id]: true }));
  };

  const filteredEmails = (profile?.recentEmails || []).filter(
    (em) =>
      em.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      em.snippet.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredChats = (profile?.chatConversations || []).filter((ch) =>
    ch.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="google-hub-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#0a0a0a]/50 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-6xl bg-[#fffaf0] rounded-[24px] border border-[#e5e5e5] overflow-hidden my-auto max-h-[93vh] flex flex-col text-[#0a0a0a]">
        {/* Top Member Switcher Bar (`#faf5e8` soft cream) */}
        {allContacts.length > 1 && onSelectPerson && (
          <div className="px-4 sm:px-6 py-2.5 bg-[#faf5e8] border-b border-[#e5e5e5] flex items-center gap-2 overflow-x-auto shrink-0">
            <span className="text-[12px] font-semibold uppercase tracking-[1.5px] text-[#6a6a6a] shrink-0 mr-1">
              Circle Hub:
            </span>
            {allContacts.map((contact) => {
              const isSelected = contact.id === person.id;
              return (
                <button
                  key={contact.id}
                  onClick={() => onSelectPerson(contact)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#0a0a0a] text-[#ffffff]'
                      : 'bg-[#fffaf0] text-[#3a3a3a] border border-[#e5e5e5] hover:bg-[#f5f0e0]'
                  }`}
                >
                  <span>{contact.avatarEmoji || '🎂'}</span>
                  <span>{contact.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Member Hero Header (`#faf5e8` warm cream surface with Clay typography & primary CTAs) */}
        <div className="p-5 sm:p-7 bg-[#faf5e8] border-b border-[#e5e5e5] shrink-0">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Left: Member Identity */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#ffb084] text-[#0a0a0a] border border-[#e5e5e5] flex items-center justify-center text-3xl shrink-0">
                {person.avatarEmoji || '🎂'}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full bg-[#f5f0e0] border border-[#e5e5e5] text-[12px] font-semibold uppercase tracking-[1.2px] text-[#0a0a0a]">
                    Google Workspace Hub
                  </span>
                  <span className="px-3 py-0.5 rounded-full bg-[#a4d4c5] text-[#0a0a0a] text-[12px] font-semibold">
                    {daysUntil === 0 ? 'Birthday Today!' : `Birthday in ${daysUntil}d`} ·{' '}
                    {formatBirthDateShort(person.birthDate)}
                  </span>
                </div>

                <h2
                  id="google-hub-title"
                  className="clay-display-sm text-[26px] sm:text-[32px] text-[#0a0a0a] mt-1"
                >
                  {person.name}
                </h2>

                <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#3a3a3a] mt-1">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Mail className="w-3.5 h-3.5 text-[#0a0a0a]" />
                    {emailAddress}
                  </span>
                  {person.phone && (
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <Phone className="w-3.5 h-3.5 text-[#0a0a0a]" />
                      {person.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Clay Primary & Secondary Actions */}
            <div className="flex flex-wrap items-center gap-2">
              {googleUser ? (
                <button
                  onClick={handleSyncRealGmail}
                  disabled={isSyncingRealGmail}
                  className="h-[40px] px-4 rounded-[12px] bg-[#a4d4c5] text-[#0a0a0a] text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingRealGmail ? 'animate-spin' : ''}`} />
                  <span>{isSyncingRealGmail ? 'Syncing...' : 'Sync Gmail'}</span>
                </button>
              ) : (
                onConnectGoogleAccount && (
                  <button
                    onClick={onConnectGoogleAccount}
                    className="h-[40px] px-4 rounded-[12px] bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Connect Live Google</span>
                  </button>
                )
              )}

              {person.phone && (
                <a
                  href={callUri}
                  className="h-[40px] px-4 rounded-[12px] bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] text-[13px] font-semibold inline-flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              )}

              {person.phone && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-[40px] px-4 rounded-[12px] bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] text-[13px] font-semibold inline-flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              )}

              <button
                onClick={() => {
                  setActiveTab('gmail');
                  setIsComposingEmail(true);
                }}
                className="h-[40px] px-4 rounded-[12px] bg-[#0a0a0a] text-[#ffffff] text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Compose Gmail</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenCardStudio(person);
                }}
                className="h-[40px] px-4 rounded-[12px] bg-[#ff4d8b] text-[#ffffff] text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Wish Studio</span>
              </button>

              <button
                onClick={onClose}
                aria-label="Close Google Hub"
                className="w-10 h-10 rounded-full bg-[#fffaf0] border border-[#e5e5e5] text-[#0a0a0a] flex items-center justify-center hover:bg-[#f5f0e0] cursor-pointer ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {gmailSyncStatus && (
            <div className="mt-3 px-3.5 py-2 rounded-[12px] bg-[#fffaf0] border border-[#e5e5e5] text-[12px] font-medium text-[#3a3a3a] flex items-center justify-between">
              <span>{gmailSyncStatus}</span>
              <button
                onClick={() => setGmailSyncStatus(null)}
                className="text-[#6a6a6a] hover:text-[#0a0a0a] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Category Pill Tabs (`category-tab` / `category-tab-active`) + Search */}
        <div className="px-5 sm:px-7 py-3 bg-[#fffaf0] border-b border-[#e5e5e5] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: 'all', label: 'All-in-One Feed' },
              {
                id: 'gmail',
                label: 'Gmail',
                badge: profile?.recentEmails.length || 0
              },
              {
                id: 'chat',
                label: 'Google Chat',
                badge: profile?.chatConversations.length || 0
              },
              {
                id: 'photos',
                label: 'Google Photos',
                badge: photosList.length
              },
              {
                id: 'youtube',
                label: 'YouTube',
                badge: profile?.youtubeChannel?.highlightVideos.length || 0
              },
              {
                id: 'suggestions',
                label: 'Smart Gift Ideas',
                badge: smartSuggestions.length
              }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as HubTab)}
                  className={`px-4 py-2 rounded-full text-[14px] font-medium flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-[#f5f0e0] text-[#0a0a0a] font-semibold'
                      : 'text-[#6a6a6a] hover:text-[#0a0a0a]'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold tabular-nums ${
                        isActive
                          ? 'bg-[#0a0a0a] text-[#ffffff]'
                          : 'bg-[#faf5e8] text-[#6a6a6a]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-[#6a6a6a] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search emails or chats..."
              className="w-full h-[40px] pl-9 pr-3 text-[13px] bg-[#fffaf0] text-[#0a0a0a] placeholder-[#9a9a9a] border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-[#0a0a0a]"
            />
          </div>
        </div>

        {/* Main Scrollable Hub Content (`#fffaf0` Cream Canvas) */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 bg-[#fffaf0]">
          {/* TAB 1: ALL-IN-ONE UNIFIED FEED */}
          {activeTab === 'all' && (
            <div className="space-y-6">
              {/* 4 Saturated Clay Feature Cards for Connected Google Services */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: 'GMAIL THREADS',
                    value: `${profile?.recentEmails.length || 0} Synced`,
                    sub: emailAddress,
                    tab: 'gmail' as HubTab,
                    cardClass: STAT_CARD_VARIANTS[0],
                    isDark: true
                  },
                  {
                    label: 'GOOGLE CHAT',
                    value: `${profile?.chatConversations.length || 0} Messages`,
                    sub: profile?.lastSynced || 'Active thread',
                    tab: 'chat' as HubTab,
                    cardClass: STAT_CARD_VARIANTS[1],
                    isDark: true
                  },
                  {
                    label: 'GOOGLE PHOTOS',
                    value: `${photosList.length} Memories`,
                    sub: 'Play Memory Reel →',
                    tab: 'photos' as HubTab,
                    cardClass: STAT_CARD_VARIANTS[2],
                    isDark: false
                  },
                  {
                    label: 'YOUTUBE & GIFTS',
                    value: profile?.youtubeChannel?.channelTitle || 'Curated Ideas',
                    sub: `${smartSuggestions.length} tailored gifts`,
                    tab: 'youtube' as HubTab,
                    cardClass: STAT_CARD_VARIANTS[3],
                    isDark: false
                  }
                ].map((stat) => (
                  <button
                    key={stat.label}
                    onClick={() => setActiveTab(stat.tab)}
                    className={`${stat.cardClass} p-5 text-left flex flex-col justify-between gap-3 cursor-pointer`}
                  >
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-[1.5px] ${
                        stat.isDark ? 'text-white/80' : 'text-[#3a3a3a]'
                      }`}
                    >
                      {stat.label}
                    </span>
                    <div>
                      <p className="clay-display-sm text-[24px] leading-tight">{stat.value}</p>
                      <p
                        className={`text-[12px] truncate mt-1 ${
                          stat.isDark ? 'text-white/80' : 'text-[#3a3a3a]'
                        }`}
                      >
                        {stat.sub}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* 2-Column Saturated Feature Cards with Embedded Product Mockup Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Card: Lavender Feature Card for Gmail Threads */}
                <div className="feature-card-lavender p-6 sm:p-7 flex flex-col justify-between gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[12px] font-semibold uppercase tracking-[1.5px] text-[#3a3a3a]">
                        GMAIL COMMUNICATIONS
                      </span>
                      <h3 className="clay-display-sm text-[24px] text-[#0a0a0a] mt-0.5">
                        Recent Email Threads
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('gmail')}
                      className="h-[36px] px-3.5 rounded-[12px] bg-[#0a0a0a] text-[#ffffff] text-[12px] font-semibold cursor-pointer"
                    >
                      Open Gmail →
                    </button>
                  </div>

                  {/* Embedded Product Mockup Card (`bg-[#fffaf0] rounded-[16px] p-4`) */}
                  <div className="bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] rounded-[16px] p-4 space-y-3">
                    {filteredEmails.slice(0, 3).map((em) => (
                      <div
                        key={em.id}
                        className="p-3 rounded-[12px] bg-[#faf5e8] border border-[#e5e5e5] space-y-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-[13px] text-[#0a0a0a] truncate">
                            {em.subject}
                          </span>
                          <span className="text-[11px] text-[#6a6a6a] shrink-0">{em.date}</span>
                        </div>
                        <p className="text-[12px] text-[#3a3a3a] line-clamp-2">{em.snippet}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Card: Cream Feature Card for Google Chat */}
                <div className="feature-card-cream p-6 sm:p-7 flex flex-col justify-between gap-4 border border-[#e5e5e5]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[12px] font-semibold uppercase tracking-[1.5px] text-[#6a6a6a]">
                        GOOGLE CHAT
                      </span>
                      <h3 className="clay-display-sm text-[24px] text-[#0a0a0a] mt-0.5">
                        Direct Conversation
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('chat')}
                      className="h-[36px] px-3.5 rounded-[12px] bg-[#0a0a0a] text-[#ffffff] text-[12px] font-semibold cursor-pointer"
                    >
                      Reply in Chat →
                    </button>
                  </div>

                  {/* Embedded Product Mockup Card */}
                  <div className="bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] rounded-[16px] p-4 space-y-2.5">
                    {filteredChats.slice(-3).map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          msg.sender === 'me' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`max-w-[85%] px-3.5 py-2 rounded-[12px] text-[13px] ${
                            msg.sender === 'me'
                              ? 'bg-[#0a0a0a] text-[#ffffff]'
                              : 'bg-[#f5f0e0] text-[#0a0a0a] border border-[#e5e5e5]'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[11px] text-[#6a6a6a] mt-0.5">{msg.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Shared Google Photos Strip inside Warm Peach Feature Card */}
              <div className="feature-card-peach p-6 sm:p-7 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[12px] font-semibold uppercase tracking-[1.5px] text-[#3a3a3a]">
                      SHARED ALBUMS
                    </span>
                    <h3 className="clay-display-sm text-[24px] text-[#0a0a0a] mt-0.5">
                      Google Photos with {person.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {photosList.length > 0 && (
                      <button
                        onClick={() => {
                          setCurrentSlideIndex(0);
                          setSlideshowActive(true);
                        }}
                        className="h-[40px] px-4 rounded-[12px] bg-[#0a0a0a] text-[#ffffff] text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Play Memory Reel</span>
                      </button>
                    )}
                    <button
                      onClick={() => setActiveTab('photos')}
                      className="h-[40px] px-4 rounded-[12px] bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] text-[13px] font-semibold cursor-pointer"
                    >
                      All Photos ({photosList.length})
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {photosList.slice(0, 3).map((photo, index) => (
                    <div
                      key={photo.id}
                      onClick={() => {
                        setCurrentSlideIndex(index);
                        setSlideshowActive(true);
                      }}
                      className="bg-[#fffaf0] border border-[#e5e5e5] rounded-[16px] overflow-hidden cursor-pointer group"
                    >
                      <div className="aspect-16/10 bg-[#f5f0e0] overflow-hidden">
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3">
                        <p className="font-semibold text-[13px] text-[#0a0a0a] truncate">
                          {photo.caption}
                        </p>
                        <p className="text-[11px] text-[#6a6a6a] mt-0.5">
                          {photo.album} · {photo.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GMAIL COMMUNICATIONS */}
          {activeTab === 'gmail' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="clay-display-sm text-[26px] text-[#0a0a0a]">
                    Gmail History with {person.name}
                  </h3>
                  <p className="text-[14px] text-[#3a3a3a]">
                    Connected account: <span className="font-semibold">{emailAddress}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsComposingEmail(!isComposingEmail)}
                    className="h-[44px] px-5 bg-[#0a0a0a] text-[#ffffff] rounded-[12px] text-[14px] font-semibold inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Compose Birthday Email</span>
                  </button>

                  <a
                    href={gmailComposeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-[44px] px-4 bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] rounded-[12px] text-[14px] font-semibold inline-flex items-center gap-1.5"
                  >
                    <span>Open in Gmail</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Compose Drawer inside Clay Card */}
              {isComposingEmail && (
                <form
                  onSubmit={handleLogEmail}
                  className="feature-card-cream p-6 border border-[#e5e5e5] space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold uppercase tracking-[1.2px] text-[#0a0a0a]">
                      New Gmail Message to {emailAddress}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsComposingEmail(false)}
                      className="text-[#6a6a6a] hover:text-[#0a0a0a] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold text-[#3a3a3a] mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full h-[44px] px-4 text-[14px] bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-[#0a0a0a]"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold text-[#3a3a3a] mb-1">
                      Message Body
                    </label>
                    <textarea
                      rows={3}
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      className="w-full p-4 text-[14px] bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-[#0a0a0a]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <a
                      href={gmailComposeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] font-semibold text-[#0a0a0a] underline inline-flex items-center gap-1"
                    >
                      <span>Launch external Gmail window</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="submit"
                      className="h-[44px] px-5 bg-[#0a0a0a] text-[#ffffff] rounded-[12px] text-[14px] font-semibold inline-flex items-center gap-2 cursor-pointer"
                    >
                      {emailSentToast ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Sent & Logged!</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>{googleAccessToken ? 'Send via Gmail' : 'Send & Log in Hub'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Email Thread List */}
              <div className="space-y-3">
                {filteredEmails.map((em) => (
                  <div
                    key={em.id}
                    className="p-5 bg-[#faf5e8] rounded-[16px] border border-[#e5e5e5] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${
                            em.direction === 'received'
                              ? 'bg-[#b8a4ed] text-[#0a0a0a]'
                              : 'bg-[#f5f0e0] text-[#3a3a3a] border border-[#e5e5e5]'
                          }`}
                        >
                          {em.direction === 'received' ? 'Inbox' : 'Sent'}
                        </span>
                        <h4 className="font-semibold text-[16px] text-[#0a0a0a]">{em.subject}</h4>
                      </div>
                      <p className="text-[14px] text-[#3a3a3a]">{em.snippet}</p>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between gap-2 shrink-0">
                      <span className="text-[12px] text-[#6a6a6a]">{em.date}</span>
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                          emailAddress
                        )}&su=${encodeURIComponent(`Re: ${em.subject}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-[36px] px-3.5 rounded-[12px] bg-[#fffaf0] border border-[#e5e5e5] text-[12px] text-[#0a0a0a] font-semibold inline-flex items-center gap-1"
                      >
                        <Reply className="w-3.5 h-3.5" />
                        <span>Reply</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GOOGLE CHAT */}
          {activeTab === 'chat' && (
            <div className="bg-[#faf5e8] rounded-[24px] border border-[#e5e5e5] overflow-hidden flex flex-col h-[480px]">
              <div className="px-6 py-4 bg-[#f5f0e0] border-b border-[#e5e5e5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fffaf0] border border-[#e5e5e5] flex items-center justify-center text-lg">
                    {person.avatarEmoji || '🎂'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[16px] text-[#0a0a0a]">{person.name}</h4>
                    <p className="text-[12px] text-[#3a3a3a]">Google Chat · {emailAddress}</p>
                  </div>
                </div>

                <a
                  href={googleChatDeepLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-[38px] px-4 bg-[#0a0a0a] text-[#ffffff] rounded-[12px] text-[12px] font-semibold inline-flex items-center gap-1.5"
                >
                  <span>Open Google Chat</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-3 bg-[#fffaf0]">
                {filteredChats.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'me' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-3 rounded-[16px] text-[14px] ${
                        msg.sender === 'me'
                          ? 'bg-[#0a0a0a] text-[#ffffff]'
                          : 'bg-[#f5f0e0] text-[#0a0a0a] border border-[#e5e5e5]'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                    <span className="text-[11px] text-[#6a6a6a] mt-1 px-1">{msg.timestamp}</span>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleSendChatMessage}
                className="p-4 bg-[#faf5e8] border-t border-[#e5e5e5] flex items-center gap-2.5"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Message ${person.name} on Google Chat...`}
                  className="flex-1 h-[44px] px-4 text-[14px] bg-[#fffaf0] text-[#0a0a0a] placeholder-[#9a9a9a] border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-[#0a0a0a]"
                />
                <button
                  type="submit"
                  className="h-[44px] px-5 bg-[#0a0a0a] text-[#ffffff] font-semibold text-[14px] rounded-[12px] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: GOOGLE PHOTOS */}
          {activeTab === 'photos' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="clay-display-sm text-[26px] text-[#0a0a0a]">
                    Shared Google Photos with {person.name}
                  </h3>
                  <p className="text-[14px] text-[#3a3a3a]">
                    Celebration memories, family trips, and shared albums
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {photosList.length > 0 && (
                    <button
                      onClick={() => {
                        setCurrentSlideIndex(0);
                        setSlideshowActive(true);
                      }}
                      className="h-[44px] px-4 bg-[#ff4d8b] text-[#ffffff] rounded-[12px] text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Play Memory Reel</span>
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLocalFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-[44px] px-4 bg-[#f5f0e0] text-[#0a0a0a] border border-[#e5e5e5] rounded-[12px] text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                  </button>

                  <button
                    onClick={() => setIsAddingPhoto(!isAddingPhoto)}
                    className="h-[44px] px-4 bg-[#0a0a0a] text-[#ffffff] rounded-[12px] text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Photo URL</span>
                  </button>

                  <a
                    href={googlePhotosDeepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-[44px] px-4 bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] rounded-[12px] text-[13px] font-semibold inline-flex items-center gap-1.5"
                  >
                    <span>Google Photos</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {isAddingPhoto && (
                <form
                  onSubmit={handleAddPhoto}
                  className="feature-card-cream p-6 border border-[#e5e5e5] space-y-4"
                >
                  <h5 className="font-semibold text-[15px] text-[#0a0a0a]">
                    Add Memory to Shared Google Photos Album
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="url"
                      required
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      placeholder="Image URL (https://...)"
                      className="h-[44px] px-4 text-[13px] bg-[#fffaf0] border border-[#e5e5e5] rounded-[12px]"
                    />
                    <input
                      type="text"
                      value={newPhotoCaption}
                      onChange={(e) => setNewPhotoCaption(e.target.value)}
                      placeholder="Caption (e.g. Birthday Cake)"
                      className="h-[44px] px-4 text-[13px] bg-[#fffaf0] border border-[#e5e5e5] rounded-[12px]"
                    />
                    <input
                      type="text"
                      value={newPhotoAlbum}
                      onChange={(e) => setNewPhotoAlbum(e.target.value)}
                      placeholder="Album Name"
                      className="h-[44px] px-4 text-[13px] bg-[#fffaf0] border border-[#e5e5e5] rounded-[12px]"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingPhoto(false)}
                      className="h-[40px] px-4 text-[13px] bg-[#fffaf0] border border-[#e5e5e5] rounded-[12px] font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="h-[40px] px-5 text-[13px] bg-[#0a0a0a] text-[#ffffff] font-semibold rounded-[12px] cursor-pointer"
                    >
                      Save Memory
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {photosList.map((photo, idx) => (
                  <div
                    key={photo.id}
                    onClick={() => {
                      setCurrentSlideIndex(idx);
                      setSlideshowActive(true);
                    }}
                    className="bg-[#faf5e8] rounded-[20px] overflow-hidden border border-[#e5e5e5] group cursor-pointer"
                  >
                    <div className="aspect-4/3 relative overflow-hidden bg-[#f5f0e0]">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 p-2 bg-[#0a0a0a]/80 text-white rounded-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="p-4 space-y-1">
                      <h5 className="font-semibold text-[15px] text-[#0a0a0a]">{photo.caption}</h5>
                      <div className="flex justify-between text-[12px] text-[#6a6a6a]">
                        <span>{photo.date}</span>
                        <span className="font-medium text-[#0a0a0a]">{photo.album}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: YOUTUBE CHANNELS & GOOGLE WORKSPACE LINKS */}
          {activeTab === 'youtube' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="clay-display-sm text-[26px] text-[#0a0a0a]">
                    YouTube Channel & Videos for {person.name}
                  </h3>
                  <p className="text-[14px] text-[#3a3a3a]">
                    Birthday tributes, playlists, and connected Google Workspace shortcuts
                  </p>
                </div>

                {profile?.youtubeChannel?.channelUrl && (
                  <a
                    href={profile.youtubeChannel.channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-[44px] px-5 bg-[#0a0a0a] text-[#ffffff] rounded-[12px] text-[14px] font-semibold inline-flex items-center gap-2"
                  >
                    <Youtube className="w-4 h-4" />
                    <span>Open YouTube Channel</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {profile?.youtubeChannel ? (
                <div className="space-y-5">
                  {/* Clay Saturated Pink Feature Card for YouTube Channel */}
                  <div className="feature-card-pink p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-[16px] bg-[#fffaf0] text-[#0a0a0a] flex items-center justify-center text-2xl shrink-0">
                        🎬
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-white/80">
                          CONNECTED YOUTUBE CHANNEL
                        </span>
                        <h4 className="clay-display-sm text-[24px] text-white">
                          {profile.youtubeChannel.channelTitle}
                        </h4>
                        <p className="text-[13px] text-white/90">
                          {profile.youtubeChannel.subscriberCount}
                        </p>
                      </div>
                    </div>
                    <span className="px-4 py-1.5 bg-[#fffaf0] text-[#0a0a0a] rounded-full text-[12px] font-semibold self-start sm:self-center">
                      Subscribed
                    </span>
                  </div>

                  {/* Video Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {profile.youtubeChannel.highlightVideos.map((vid) => (
                      <a
                        key={vid.id}
                        href={vid.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#faf5e8] rounded-[20px] overflow-hidden border border-[#e5e5e5] group flex flex-col justify-between"
                      >
                        <div className="aspect-video relative overflow-hidden bg-[#1a3a3a]">
                          <img
                            src={vid.thumbnail}
                            alt={vid.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-[#0a0a0a] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                              ▶
                            </div>
                          </div>
                          <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-[#0a0a0a] text-white text-[11px] font-semibold rounded-[6px]">
                            {vid.duration}
                          </span>
                        </div>
                        <div className="p-4">
                          <h6 className="font-semibold text-[15px] text-[#0a0a0a] line-clamp-2">
                            {vid.title}
                          </h6>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="feature-card-cream p-8 text-center text-[#3a3a3a] border border-[#e5e5e5] text-[14px]">
                  No YouTube channel linked yet for {person.name}.
                </div>
              )}

              {/* Additional Google Workspace Quick Links (Meet, Calendar, Drive) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <a
                  href={googleMeetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-[16px] bg-[#faf5e8] border border-[#e5e5e5] flex items-center justify-between hover:bg-[#f5f0e0]"
                >
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-[#0a0a0a]" />
                    <div>
                      <p className="font-semibold text-[14px] text-[#0a0a0a]">Google Meet</p>
                      <p className="text-[12px] text-[#6a6a6a]">Start video call</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#6a6a6a]" />
                </a>

                <a
                  href={googleCalendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-[16px] bg-[#faf5e8] border border-[#e5e5e5] flex items-center justify-between hover:bg-[#f5f0e0]"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#0a0a0a]" />
                    <div>
                      <p className="font-semibold text-[14px] text-[#0a0a0a]">Google Calendar</p>
                      <p className="text-[12px] text-[#6a6a6a]">Schedule birthday invite</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#6a6a6a]" />
                </a>

                <a
                  href={googleDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-[16px] bg-[#faf5e8] border border-[#e5e5e5] flex items-center justify-between hover:bg-[#f5f0e0]"
                >
                  <div className="flex items-center gap-3">
                    <FolderOpen className="w-5 h-5 text-[#0a0a0a]" />
                    <div>
                      <p className="font-semibold text-[14px] text-[#0a0a0a]">Google Drive</p>
                      <p className="text-[12px] text-[#6a6a6a]">Shared folders & files</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#6a6a6a]" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 6: SMART GIFT IDEAS */}
          {activeTab === 'suggestions' && (
            <div className="space-y-5">
              <div>
                <h3 className="clay-display-sm text-[26px] text-[#0a0a0a]">
                  Smart Gift Ideas Tailored to {person.name}
                </h3>
                <p className="text-[14px] text-[#3a3a3a]">
                  Matched from {person.name}'s YouTube interests, favorites, and shared memories
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {smartSuggestions.map((sug, idx) => {
                  const isAdded = addedSuggestions[sug.id];
                  const cardClasses = [
                    'feature-card-peach',
                    'feature-card-lavender',
                    'feature-card-ochre',
                    'feature-card-cream'
                  ];
                  const cardClass = cardClasses[idx % cardClasses.length];

                  return (
                    <div
                      key={sug.id}
                      className={`${cardClass} p-6 flex flex-col justify-between gap-4 border border-[#e5e5e5]`}
                    >
                      <div className="bg-[#fffaf0] border border-[#e5e5e5] rounded-[16px] p-4 space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-semibold text-[16px] text-[#0a0a0a]">{sug.title}</h5>
                          <span className="px-2.5 py-1 bg-[#f5f0e0] text-[#0a0a0a] font-semibold text-[13px] rounded-[8px] shrink-0">
                            ${sug.estimatedCost}
                          </span>
                        </div>
                        <p className="text-[13px] text-[#3a3a3a]">{sug.reason}</p>
                      </div>

                      <button
                        onClick={() => handleAddGiftToPool(sug)}
                        disabled={isAdded}
                        className={`w-full h-[44px] px-4 rounded-[12px] text-[14px] font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                          isAdded
                            ? 'bg-[#a4d4c5] text-[#0a0a0a]'
                            : 'bg-[#0a0a0a] text-[#ffffff]'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Added to Party Pool</span>
                          </>
                        ) : (
                          <>
                            <Gift className="w-4 h-4" />
                            <span>+ Add to Party Chip-in Pool (${sug.estimatedCost})</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Memory Reel & Lightbox Modal (Warm Clay Cream Lightbox) */}
      {slideshowActive && photosList.length > 0 && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 bg-[#fffaf0] text-[#0a0a0a] flex flex-col justify-between p-4 sm:p-8"
        >
          <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-4">
            <div>
              <h3 className="clay-display-sm text-[22px] text-[#0a0a0a]">
                {person.name}'s Memory Reel
              </h3>
              <p className="text-[13px] text-[#6a6a6a]">
                Photo {currentSlideIndex + 1} of {photosList.length}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsPlayingSlideshow(!isPlayingSlideshow)}
                className="h-[40px] px-4 bg-[#f5f0e0] text-[#0a0a0a] border border-[#e5e5e5] text-[13px] font-semibold rounded-[12px] flex items-center gap-1.5 cursor-pointer"
              >
                {isPlayingSlideshow ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 fill-[#0a0a0a]" />
                )}
                <span>{isPlayingSlideshow ? 'Pause' : 'Autoplay'}</span>
              </button>
              <button
                onClick={() => setSlideshowActive(false)}
                className="w-10 h-10 rounded-full bg-[#0a0a0a] text-[#ffffff] flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <button
              onClick={() =>
                setCurrentSlideIndex((prev) => (prev - 1 + photosList.length) % photosList.length)
              }
              className="absolute left-2 sm:left-4 z-10 w-11 h-11 rounded-full bg-[#0a0a0a] text-white flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="max-h-[72vh] max-w-[85vw] flex flex-col items-center justify-center">
              <img
                src={photosList[currentSlideIndex].url}
                alt={photosList[currentSlideIndex].caption}
                className="max-h-[60vh] max-w-full rounded-[20px] border border-[#e5e5e5] object-contain"
              />
              <div className="mt-3 text-center space-y-0.5">
                <h4 className="text-[16px] font-semibold text-[#0a0a0a]">
                  {photosList[currentSlideIndex].caption}
                </h4>
                <p className="text-[13px] text-[#6a6a6a]">
                  {photosList[currentSlideIndex].album} · {photosList[currentSlideIndex].date}
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % photosList.length)}
              className="absolute right-2 sm:right-4 z-10 w-11 h-11 rounded-full bg-[#0a0a0a] text-white flex items-center justify-center cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
            {photosList.map((photo, i) => (
              <button
                key={photo.id}
                onClick={() => setCurrentSlideIndex(i)}
                className={`w-14 h-10 rounded-[8px] overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  i === currentSlideIndex ? 'border-[#0a0a0a] scale-105' : 'border-transparent opacity-60'
                }`}
              >
                <img src={photo.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
