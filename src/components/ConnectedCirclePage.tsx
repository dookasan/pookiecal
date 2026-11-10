import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Copy,
  Check,
  Share2,
  UserPlus,
  Mail,
  Phone,
  Sparkles,
  Search,
  ExternalLink,
  Send,
  Users,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Clock,
  Link2,
  Cake,
  Gift,
  Loader2
} from 'lucide-react';
import { BirthdayPerson, InviteRecord, Relationship } from '../types/birthday';
import {
  calculateDaysUntilBirthday,
  calculateExactTimeUntilBirthday,
  calculateTurningAge,
  getZodiacSign,
  formatBirthDateShort,
  getWhatsAppShareUrl,
  getPersonRealisticPortrait,
  getFallbackPortraitDataUrl,
  getCelebrationBannerImage,
  getGiftCategoryImage
} from '../utils/birthdayUtils';
import {
  fetchPersonalizedGiftSuggestion,
  PersonalizedGiftSuggestion
} from '../utils/giftSuggestionClient';
import { AppUser } from '../utils/googleAuth';

function getEmailShareUrl(email: string, subject: string, body: string): string {
  return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

interface ConnectedCirclePageProps {
  birthdays: BirthdayPerson[];
  invites: InviteRecord[];
  googleUser?: AppUser | null;
  userName?: string;
  autoOpenCollectorForm?: boolean;
  inviterHostName?: string;
  onAddBirthdayPerson?: (person: BirthdayPerson) => void;
  onAddPerson?: (person: BirthdayPerson) => void;
  onAddInvite: (invite: InviteRecord) => void;
  onUpdateInvite: (invite: InviteRecord) => void;
  onOpenCardStudio: (person: BirthdayPerson) => void;
  onOpenCallModal: (person: BirthdayPerson) => void;
  onOpenGoogleHub: (person: BirthdayPerson) => void;
  onOpenInviteModal: () => void;
  onOpenAddBirthday?: () => void;
}

/**
 * Redesigned Realistic Editorial Photography Cards for the 3-Step Birthday Collector Flow.
 * Replaces flat vector circles with high-craft studio & lifestyle photography + glassmorphic badges.
 */
export const MasteryStepLinkIcon: React.FC = () => (
  <motion.div
    whileHover={{ y: -4 }}
    className="relative w-full aspect-[4/3] rounded-[24px] overflow-hidden border border-[#E6E0D3] bg-[#111B21] shadow-sm group"
  >
    <img
      src="/assets/mastery/step-1-personal-link.jpg"
      alt="Smartphone and wax-sealed personal invitation on travertine stone"
      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#111B21]/85 via-[#111B21]/15 to-transparent" />
    <motion.div
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute top-3.5 left-3.5"
    >
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111B21]/80 backdrop-blur-xs text-[#FCFBF7] text-[11px] font-bold uppercase tracking-[1.2px] border border-white/15">
        <Link2 className="w-3.5 h-3.5 text-[#FF5722]" />
        <span>Step 01 · Personal Link</span>
      </span>
    </motion.div>
    <div className="absolute bottom-3.5 left-3.5 right-3.5 px-3.5 py-2 rounded-[14px] bg-[#FCFBF7]/95 backdrop-blur-xs border border-[#E6E0D3] flex items-center justify-between gap-2 text-left">
      <span className="font-mono text-[12px] font-semibold text-[#111B21] truncate">
        pookiecal.com/?by=YourName
      </span>
      <span className="px-2 py-0.5 rounded-full bg-[#FF5722] text-white text-[10px] font-bold uppercase shrink-0">
        Custom URL
      </span>
    </div>
  </motion.div>
);

export const MasteryStepPhoneIcon: React.FC = () => (
  <motion.div
    whileHover={{ y: -4 }}
    className="relative w-full aspect-[4/3] rounded-[24px] overflow-hidden border border-[#E6E0D3] bg-[#111B21] shadow-sm group"
  >
    <img
      src="/assets/mastery/step-2-share-circle.jpg"
      alt="Friends and family gathered around a sunlit table sharing invitations"
      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#111B21]/85 via-[#111B21]/15 to-transparent" />
    <motion.div
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      className="absolute top-3.5 left-3.5"
    >
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111B21]/80 backdrop-blur-xs text-[#FCFBF7] text-[11px] font-bold uppercase tracking-[1.2px] border border-white/15">
        <Share2 className="w-3.5 h-3.5 text-[#FFB084]" />
        <span>Step 02 · Invite Circle</span>
      </span>
    </motion.div>
    <div className="absolute bottom-3.5 left-3.5 right-3.5 px-3.5 py-2 rounded-[14px] bg-[#FCFBF7]/95 backdrop-blur-xs border border-[#E6E0D3] flex items-center justify-between gap-2 text-left">
      <span className="text-[12px] font-semibold text-[#111B21] truncate">
        WhatsApp · Email · Contact Import
      </span>
      <span className="px-2 py-0.5 rounded-full bg-[#111B21] text-white text-[10px] font-bold uppercase shrink-0">
        1-Tap Send
      </span>
    </div>
  </motion.div>
);

export const MasteryStepCakeIcon: React.FC = () => (
  <motion.div
    whileHover={{ y: -4 }}
    className="relative w-full aspect-[4/3] rounded-[24px] overflow-hidden border border-[#E6E0D3] bg-[#111B21] shadow-sm group"
  >
    <img
      src="/assets/mastery/step-3-birthday-cake.jpg"
      alt="Artisanal tiered birthday cake with glowing beeswax candles"
      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#111B21]/85 via-[#111B21]/15 to-transparent" />
    <motion.div
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      className="absolute top-3.5 left-3.5"
    >
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111B21]/80 backdrop-blur-xs text-[#FCFBF7] text-[11px] font-bold uppercase tracking-[1.2px] border border-white/15">
        <Cake className="w-3.5 h-3.5 text-[#A4D4C5]" />
        <span>Step 03 · Auto-Sync</span>
      </span>
    </motion.div>
    <div className="absolute bottom-3.5 left-3.5 right-3.5 px-3.5 py-2 rounded-[14px] bg-[#FCFBF7]/95 backdrop-blur-xs border border-[#E6E0D3] flex items-center justify-between gap-2 text-left">
      <span className="text-[12px] font-semibold text-[#111B21] truncate">
        Name, Birth Date &amp; Gift Likes Saved
      </span>
      <span className="px-2 py-0.5 rounded-full bg-[#147D84] text-white text-[10px] font-bold uppercase shrink-0">
        Connected
      </span>
    </div>
  </motion.div>
);

export const ConnectedCirclePage: React.FC<ConnectedCirclePageProps> = ({
  birthdays,
  invites,
  googleUser,
  userName = 'Your Circle',
  autoOpenCollectorForm = false,
  inviterHostName,
  onAddBirthdayPerson,
  onAddPerson,
  onAddInvite,
  onUpdateInvite,
  onOpenCardStudio,
  onOpenCallModal,
  onOpenGoogleHub,
  onOpenInviteModal
}) => {
  const handleEmitNewPerson = (person: BirthdayPerson) => {
    if (onAddBirthdayPerson) onAddBirthdayPerson(person);
    else if (onAddPerson) onAddPerson(person);
  };

  // Personal Link Customization State
  const [hostName, setHostName] = useState(
    inviterHostName ||
      googleUser?.displayName?.split(' ')[0] ||
      (userName !== 'Your Circle' ? userName : 'Bhaskar')
  );
  const [linkCopied, setLinkCopied] = useState(false);

  // Batch Email / Contact Import Drawer State
  const [showBatchEmailDrawer, setShowBatchEmailDrawer] = useState(false);
  const [batchEmailsInput, setBatchEmailsInput] = useState('');
  const [batchSentNotice, setBatchSentNotice] = useState<string | null>(null);

  // Short Birthday Submission Form State ("You get the birthday")
  const [showCollectorForm, setShowCollectorForm] = useState(autoOpenCollectorForm);
  const [subName, setSubName] = useState('');
  const [subEmail, setSubEmail] = useState('');
  const [subPhone, setSubPhone] = useState('');
  const [subBirthDate, setSubBirthDate] = useState('1996-08-24');
  const [subRelation, setSubRelation] = useState<Relationship>('friend');
  const [subFavorites, setSubFavorites] = useState('Iced Matcha, Books, Travel');
  const [submittedSuccess, setSubmittedSuccess] = useState<string | null>(null);

  // Directory Filter & Search State
  const [activeFilter, setActiveFilter] = useState<'all' | Relationship | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [now, setNow] = useState<Date>(() => new Date());
  const [giftMap, setGiftMap] = useState<Record<string, PersonalizedGiftSuggestion>>({});
  const [loadingGiftId, setLoadingGiftId] = useState<string | null>(null);
  const [giftErrorMap, setGiftErrorMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const handleSuggestProfileGift = async (person: BirthdayPerson) => {
    setLoadingGiftId(person.id);
    setGiftErrorMap((prev) => {
      const next = { ...prev };
      delete next[person.id];
      return next;
    });
    try {
      const suggestion = await fetchPersonalizedGiftSuggestion(person);
      setGiftMap((prev) => ({ ...prev, [person.id]: suggestion }));
    } catch (err: unknown) {
      setGiftErrorMap((prev) => ({
        ...prev,
        [person.id]:
          err instanceof Error ? err.message : 'Unable to generate gift suggestion right now.'
      }));
    } finally {
      setLoadingGiftId(null);
    }
  };

  const cleanSlug =
    hostName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'my-circle';

  const personalCollectorUrl = `https://www.pookiecal.com/?collect=1&by=${encodeURIComponent(
    hostName.trim() || 'Friend'
  )}`;

  const shareText = `Hey! I'm putting together my family & friends birthday calendar on PookieCal so I never miss a celebration. Tap my personal link to add your birthday in 10 seconds: ${personalCollectorUrl}`;

  const handleCopyPersonalLink = () => {
    navigator.clipboard.writeText(personalCollectorUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2400);
  };

  const handleBatchSendEmails = (e: React.FormEvent) => {
    e.preventDefault();
    const rawEntries = batchEmailsInput
      .split(/[,;\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (rawEntries.length === 0) return;

    rawEntries.forEach((entry, idx) => {
      const nameGuess = entry.includes('@')
        ? entry
            .split('@')[0]
            .replace(/[._-]+/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase())
        : entry;

      const newInvite: InviteRecord = {
        id: `inv-batch-${Date.now()}-${idx}`,
        inviteeName: nameGuess,
        relationship: 'friend',
        contactMethod: 'email',
        contactValue: entry,
        customMessage: shareText,
        includeReferralRequest: true,
        status: 'sent',
        sentAt: new Date().toISOString(),
        inviteCode: `${cleanSlug.toUpperCase()}-${100 + idx}`,
        inviteUrl: personalCollectorUrl,
        downstreamReferrals: []
      };
      onAddInvite(newInvite);
    });

    setBatchSentNotice(
      `Sent birthday collector link to ${rawEntries.length} contact${
        rawEntries.length > 1 ? 's' : ''
      }!`
    );
    setBatchEmailsInput('');
    setTimeout(() => {
      setBatchSentNotice(null);
      setShowBatchEmailDrawer(false);
    }, 2500);
  };

  const handleLoadSampleContacts = () => {
    setBatchEmailsInput(
      'ananya.sharma@gmail.com, rohan.kapoor@outlook.com, priya.patel@yahoo.com, vikram.mehta@gmail.com'
    );
  };

  const handleShortFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim() || !subBirthDate) return;

    const emojiMap: Record<Relationship, string> = {
      family: '🏡',
      friend: '🎉',
      partner: '💖',
      colleague: '💼',
      other: '✨'
    };

    const newPerson: BirthdayPerson = {
      id: `conn-${Date.now()}`,
      name: subName.trim(),
      birthDate: subBirthDate,
      phone: subPhone.trim() || '+1 (555) 345-6789',
      email:
        subEmail.trim() ||
        `${subName.trim().toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      relationship: subRelation,
      avatarColor: 'bg-[#a4d4c5]',
      avatarEmoji: emojiMap[subRelation] || '🎂',
      notes: `Connected via ${hostName}'s Personal Birthday Link`,
      favoriteThings: subFavorites
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      reminders: {
        sameDay: true,
        oneDayBefore: true,
        threeDaysBefore: true,
        oneWeekBefore: true,
        time: '09:00'
      },
      googleConnected: true,
      googleProfile: {
        googleEmail:
          subEmail.trim() ||
          `${subName.trim().toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
        connectedSince: 'Connected Today via Personal Link',
        recentEmails: [],
        chatConversations: [],
        sharedPhotos: []
      }
    };

    handleEmitNewPerson(newPerson);
    setSubmittedSuccess(`${subName.trim()}’s birthday is now connected to your circle!`);
    setSubName('');
    setSubEmail('');
    setSubPhone('');
    setTimeout(() => {
      setSubmittedSuccess(null);
      setShowCollectorForm(false);
    }, 2200);
  };

  const handleSimulateInviteAccepted = (invite: InviteRecord) => {
    const updated: InviteRecord = {
      ...invite,
      status: 'joined'
    };
    onUpdateInvite(updated);

    const randomMonth = String(Math.floor(1 + Math.random() * 12)).padStart(2, '0');
    const randomDay = String(Math.floor(1 + Math.random() * 28)).padStart(2, '0');

    handleEmitNewPerson({
      id: `joined-${Date.now()}`,
      name: invite.inviteeName,
      birthDate: `1995-${randomMonth}-${randomDay}`,
      phone:
        invite.contactValue && !invite.contactValue.includes('@')
          ? invite.contactValue
          : '+1 (555) 778-9900',
      email:
        invite.contactValue && invite.contactValue.includes('@')
          ? invite.contactValue
          : `${invite.inviteeName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      relationship: invite.relationship,
      avatarColor: 'bg-[#ffb084]',
      avatarEmoji: invite.relationship === 'family' ? '🏡' : '🎉',
      notes: `Submitted birthday via your personal collector link (${invite.inviteCode})`,
      favoriteThings: ['Surprise Cake', 'Coffee', 'Warm Wishes'],
      reminders: {
        sameDay: true,
        oneDayBefore: true,
        threeDaysBefore: true,
        oneWeekBefore: false,
        time: '09:00'
      },
      googleConnected: true
    });
  };

  // Filtered connected profiles
  const filteredProfiles = birthdays.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (person.email && person.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (person.notes && person.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (person.favoriteThings &&
        person.favoriteThings.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase())));

    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'pending') return false;
    return matchesSearch && person.relationship === activeFilter;
  });

  const familyCount = birthdays.filter((b) => b.relationship === 'family').length;
  const friendCount = birthdays.filter((b) => b.relationship === 'friend').length;
  const pendingInvites = invites.filter((i) => i.status === 'sent' || i.status === 'viewed');

  return (
    <div className="space-y-12">
      {/* EDITORIAL PHOTOGRAPHIC HERO BANNER FOR CONNECTED CIRCLE */}
      <section className="relative rounded-[32px] overflow-hidden border border-[#E6E0D3] bg-[#111B21] text-[#FCFBF7]">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left 7 Cols: Editorial Copy + Quick Collector Link */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#FFB084] text-[12px] font-semibold uppercase tracking-[1.4px]">
                <span>Connected Friends &amp; Family Circle</span>
              </span>
              <h1
                className="text-[32px] sm:text-[44px] font-bold text-white tracking-tight leading-[1.08]"
                style={{ textWrap: 'balance' }}
              >
                Your closest people, their exact birthdays, one personal link.
              </h1>
              <p className="text-[15px] sm:text-[16px] text-[#D0D8DD] leading-relaxed max-w-[54ch]">
                Share your customized PookieCal collector link with family and friends. When they fill out our 10-second birthday card, their portrait, birth date, live countdown timer, and gift preferences appear here automatically.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-[18px] bg-white/8 border border-white/10">
                <div className="text-[22px] sm:text-[26px] font-bold text-white tabular-nums">
                  {birthdays.length}
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-[1px] text-[#A4D4C5]">
                  Connected Profiles
                </div>
              </div>
              <div className="p-3.5 rounded-[18px] bg-white/8 border border-white/10">
                <div className="text-[22px] sm:text-[26px] font-bold text-[#FF5722] tabular-nums">
                  {familyCount + friendCount}
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-[1px] text-[#D0D8DD]">
                  Family &amp; Friends
                </div>
              </div>
              <div className="p-3.5 rounded-[18px] bg-white/8 border border-white/10">
                <div className="text-[22px] sm:text-[26px] font-bold text-[#FFB084] tabular-nums">
                  {pendingInvites.length}
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-[1px] text-[#D0D8DD]">
                  Awaiting Reply
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Realistic Editorial Celebration Photograph */}
          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
            <img
              src="/assets/mastery/hero-circle-celebration.jpg"
              alt="Multi-generational family and friends celebrating a birthday around a sunlit table"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#111B21] via-[#111B21]/25 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-[18px] bg-[#111B21]/85 backdrop-blur-xs border border-white/15 text-white flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[1px] text-[#A4D4C5]">
                  Automatic Birthday Collector
                </div>
                <div className="text-[14px] font-bold">
                  Zero manual spreadsheets · Instant countdowns
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCollectorForm(true)}
                className="px-3.5 py-2 rounded-full bg-[#FF5722] hover:bg-[#E64A19] text-white text-[12px] font-semibold shrink-0 cursor-pointer"
              >
                Try Form
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MODULE 1: REDESIGNED 3 STEPS TO BIRTHDAY MASTERY WITH REALISTIC EDITORIAL PHOTOGRAPHY */}
      <section className="rounded-[32px] bg-[#FCFBF7] border border-[#E6E0D3] p-6 sm:p-10 lg:p-12 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E6E0D3] pb-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[1.4px] text-[#FF5722]">
              Effortless Birthday Collection · 3-Step Workflow
            </span>
            <h2 className="text-[28px] sm:text-[38px] font-bold text-[#111B21] tracking-tight leading-tight">
              3 steps to birthday mastery!
            </h2>
          </div>
          <p className="text-[14px] sm:text-[15px] text-[#4A5560] max-w-md">
            Send your personalized collector link once and let your family and friends add their exact birth dates and gift wishlists directly.
          </p>
        </div>

        {/* 3 Realistic Photographic Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 lg:gap-8">
          {/* Step 1 Card */}
          <div className="rounded-[28px] bg-[#F4EFE6] border border-[#E6E0D3] p-4 sm:p-5 flex flex-col justify-between space-y-4">
            <MasteryStepLinkIcon />
            <div className="px-1 pb-1 space-y-2">
              <h3 className="text-[21px] font-bold text-[#111B21] tracking-tight">
                We give you a personal link
              </h3>
              <p className="text-[14px] text-[#4A5560] leading-relaxed">
                It’s customized with your name so everyone in your family and friend group immediately recognizes it’s from you.
              </p>
            </div>
          </div>

          {/* Step 2 Card */}
          <div className="rounded-[28px] bg-[#F4EFE6] border border-[#E6E0D3] p-4 sm:p-5 flex flex-col justify-between space-y-4">
            <MasteryStepPhoneIcon />
            <div className="px-1 pb-1 space-y-2">
              <h3 className="text-[21px] font-bold text-[#111B21] tracking-tight">
                Send your link to family &amp; friends
              </h3>
              <p className="text-[14px] text-[#4A5560] leading-relaxed">
                Import your contacts’ emails in one click, or share directly on WhatsApp and iMessage—it’s completely up to you.
              </p>
            </div>
          </div>

          {/* Step 3 Card */}
          <div className="rounded-[28px] bg-[#F4EFE6] border border-[#E6E0D3] p-4 sm:p-5 flex flex-col justify-between space-y-4">
            <MasteryStepCakeIcon />
            <div className="px-1 pb-1 space-y-2">
              <h3 className="text-[21px] font-bold text-[#111B21] tracking-tight">
                You get the birthday automatically
              </h3>
              <p className="text-[14px] text-[#4A5560] leading-relaxed">
                They enter their name, email, birth date, and favorite treats in our short form—and their live countdown starts immediately!
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Personal Collector Link Studio Bar */}
        <div className="rounded-[24px] bg-[#F4EFE6] border border-[#E6E0D3] p-5 sm:p-7 space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Customize Host Name */}
            <div className="lg:col-span-3">
              <label
                htmlFor="collector-host-name"
                className="block text-[12px] font-semibold text-[#374248] mb-1"
              >
                Your Name on the Link
              </label>
              <input
                id="collector-host-name"
                type="text"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="Your Name"
                className="w-full h-[44px] px-3.5 rounded-[12px] bg-[#FCFBF7] border border-[#D6CFC0] text-[14px] font-semibold text-[#111B21] focus:outline-none focus:border-[#111B21]"
              />
            </div>

            {/* Generated Personal Link Display */}
            <div className="lg:col-span-5">
              <label className="block text-[12px] font-semibold text-[#374248] mb-1">
                Your Personal Birthday Collector Link
              </label>
              <div className="h-[44px] px-4 rounded-[12px] bg-[#FCFBF7] border border-[#D6CFC0] flex items-center justify-between gap-2 overflow-hidden">
                <span className="text-[13px] font-mono text-[#147D84] font-semibold truncate">
                  pookiecal.com/?collect=1&amp;by={encodeURIComponent(hostName.trim() || 'Friend')}
                </span>
                <button
                  type="button"
                  onClick={handleCopyPersonalLink}
                  className="px-3 py-1 rounded-full bg-[#111B21] text-white text-[12px] font-semibold inline-flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  {linkCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#A4D4C5]" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Primary Share & Collect Buttons */}
            <div className="lg:col-span-4 flex flex-wrap items-center gap-2.5 lg:justify-end pt-1 lg:pt-5">
              <a
                href={getWhatsAppShareUrl('', shareText)}
                target="_blank"
                rel="noopener noreferrer"
                className="h-[44px] px-4 rounded-full bg-[#FF5722] hover:bg-[#E64A19] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
              >
                <Share2 className="w-4 h-4" />
                <span>Send on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setShowBatchEmailDrawer(!showBatchEmailDrawer);
                  setShowCollectorForm(false);
                }}
                className="h-[44px] px-4 rounded-full bg-[#FCFBF7] hover:bg-[#EAE3D5] text-[#111B21] border border-[#D6CFC0] text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Import / Email Contacts</span>
              </button>
            </div>
          </div>

          {/* Bottom Bar: Open Short Birthday Form or Full Invite Modal */}
          <div className="pt-3 border-t border-[#E6E0D3] flex flex-wrap items-center justify-between gap-3 text-[13px]">
            <div className="text-[#4A5560]">
              Preview or fill out the short birthday collector form your friends see:
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowCollectorForm(!showCollectorForm);
                  setShowBatchEmailDrawer(false);
                }}
                className="px-4 py-2 rounded-full bg-[#111B21] hover:bg-[#24323B] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[#FF5722]" />
                <span>
                  {showCollectorForm ? 'Hide Short Birthday Form' : 'Open Short Birthday Form (Receive Birthday)'}
                </span>
              </button>

              <button
                type="button"
                onClick={onOpenInviteModal}
                className="font-semibold text-[#111B21] underline underline-offset-4 cursor-pointer whitespace-nowrap"
              >
                Advanced Referral Tracker →
              </button>
            </div>
          </div>

          {/* Drawer A: Step 2 — Import / Enter Contacts' Emails to Send Link */}
          {showBatchEmailDrawer && (
            <form
              onSubmit={handleBatchSendEmails}
              className="mt-4 p-5 rounded-[20px] bg-[#FCFBF7] border border-[#D6CFC0] space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-[16px] font-bold text-[#111B21]">
                    Step 2: Send Your Link via Email or Imported Contacts
                  </h3>
                  <p className="text-[13px] text-[#525E66]">
                    Paste email addresses or names separated by commas, or load sample contacts to test.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLoadSampleContacts}
                  className="px-3.5 py-1.5 rounded-full bg-[#F4EFE6] hover:bg-[#EAE3D5] text-[#111B21] text-[12px] font-semibold cursor-pointer whitespace-nowrap"
                >
                  Load Sample Contacts
                </button>
              </div>

              <textarea
                rows={2}
                required
                value={batchEmailsInput}
                onChange={(e) => setBatchEmailsInput(e.target.value)}
                placeholder="e.g., mom@family.com, cousin.aarav@gmail.com, bestie@work.com"
                className="w-full p-3.5 rounded-[12px] bg-white border border-[#D6CFC0] text-[14px] text-[#111B21] focus:outline-none focus:border-[#111B21]"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                {batchSentNotice ? (
                  <span className="text-[13px] font-semibold text-[#147D84] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{batchSentNotice}</span>
                  </span>
                ) : (
                  <span className="text-[12px] text-[#525E66]">
                    Recipients will receive your personalized link to enter their birth date.
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <a
                    href={getEmailShareUrl(
                      batchEmailsInput.split(',')[0]?.trim() || '',
                      `${hostName} wants to add your birthday on PookieCal!`,
                      shareText
                    )}
                    className="h-[40px] px-4 rounded-full bg-[#F4EFE6] text-[#111B21] text-[13px] font-semibold inline-flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <span>Open Email App</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="submit"
                    className="h-[40px] px-5 rounded-full bg-[#111B21] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Birthday Requests</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Drawer B: Step 3 — "You get the birthday" Short Form */}
          {showCollectorForm && (
            <form
              onSubmit={handleShortFormSubmit}
              className="mt-4 p-6 rounded-[20px] bg-[#FCFBF7] border-2 border-[#FF5722] space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E6E0D3] pb-3">
                <div>
                  <span className="text-[12px] font-semibold text-[#FF5722]">
                    Step 3 Short Form · Recognized as {hostName}’s Personal Link
                  </span>
                  <h3 className="text-[18px] font-bold text-[#111B21] mt-0.5">
                    Add your birthday to {hostName}’s Circle!
                  </h3>
                </div>
                <span className="text-[12px] text-[#525E66]">Takes 10 seconds</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div>
                  <label
                    htmlFor="sub-name"
                    className="block text-[12px] font-semibold text-[#111B21] mb-1"
                  >
                    Full Name *
                  </label>
                  <input
                    id="sub-name"
                    type="text"
                    required
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    placeholder="e.g., Kabir Verma"
                    className="w-full h-[42px] px-3.5 rounded-[12px] bg-white border border-[#D6CFC0] text-[14px] text-[#111B21] focus:outline-none focus:border-[#111B21]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="sub-email"
                    className="block text-[12px] font-semibold text-[#111B21] mb-1"
                  >
                    Email Address *
                  </label>
                  <input
                    id="sub-email"
                    type="email"
                    required
                    value={subEmail}
                    onChange={(e) => setSubEmail(e.target.value)}
                    placeholder="kabir@example.com"
                    className="w-full h-[42px] px-3.5 rounded-[12px] bg-white border border-[#D6CFC0] text-[14px] text-[#111B21] focus:outline-none focus:border-[#111B21]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="sub-birthdate"
                    className="block text-[12px] font-semibold text-[#111B21] mb-1"
                  >
                    Birth Date *
                  </label>
                  <input
                    id="sub-birthdate"
                    type="date"
                    required
                    value={subBirthDate}
                    onChange={(e) => setSubBirthDate(e.target.value)}
                    className="w-full h-[42px] px-3.5 rounded-[12px] bg-white border border-[#D6CFC0] text-[14px] text-[#111B21] focus:outline-none focus:border-[#111B21]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="sub-relation"
                    className="block text-[12px] font-semibold text-[#111B21] mb-1"
                  >
                    Relationship
                  </label>
                  <select
                    id="sub-relation"
                    value={subRelation}
                    onChange={(e) => setSubRelation(e.target.value as Relationship)}
                    className="w-full h-[42px] px-3.5 rounded-[12px] bg-white border border-[#D6CFC0] text-[14px] text-[#111B21] focus:outline-none focus:border-[#111B21]"
                  >
                    <option value="family">Family</option>
                    <option value="friend">Close Friend</option>
                    <option value="partner">Partner</option>
                    <option value="colleague">Colleague</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="sub-phone"
                    className="block text-[12px] font-semibold text-[#111B21] mb-1"
                  >
                    WhatsApp / Phone (Optional)
                  </label>
                  <input
                    id="sub-phone"
                    type="tel"
                    value={subPhone}
                    onChange={(e) => setSubPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full h-[42px] px-3.5 rounded-[12px] bg-white border border-[#D6CFC0] text-[14px] text-[#111B21] focus:outline-none focus:border-[#111B21]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="sub-favs"
                    className="block text-[12px] font-semibold text-[#111B21] mb-1"
                  >
                    Favorite Treats / Gift Hints (Optional)
                  </label>
                  <input
                    id="sub-favs"
                    type="text"
                    value={subFavorites}
                    onChange={(e) => setSubFavorites(e.target.value)}
                    placeholder="e.g., Dark Chocolate, Sneakers, Coffee"
                    className="w-full h-[42px] px-3.5 rounded-[12px] bg-white border border-[#D6CFC0] text-[14px] text-[#111B21] focus:outline-none focus:border-[#111B21]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                {submittedSuccess ? (
                  <span className="text-[14px] font-semibold text-[#147D84] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{submittedSuccess}</span>
                  </span>
                ) : (
                  <span className="text-[12px] text-[#525E66]">
                    Submitting adds this profile directly to the Connected Friends &amp; Family directory below.
                  </span>
                )}

                <button
                  type="submit"
                  className="h-[44px] px-6 rounded-full bg-[#FF5722] hover:bg-[#E64A19] text-white text-[14px] font-semibold inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>Send My Birthday to {hostName}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* MODULE 2: CONNECTED FRIENDS & FAMILY PROFILES DIRECTORY (WITH REALISTIC PORTRAITS & LIVE COUNTDOWNS) */}
      <section className="space-y-6">
        {/* Directory Header & Summary Metrics */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E6E0D3] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-[#FF5722] tabular-nums">
              <span>{birthdays.length} Connected Profiles</span>
              <span aria-hidden="true">·</span>
              <span>{familyCount} Family</span>
              <span aria-hidden="true">·</span>
              <span>{friendCount} Friends</span>
              <span aria-hidden="true">·</span>
              <span>{pendingInvites.length} Pending Invites</span>
            </div>
            <h2 className="text-[28px] sm:text-[34px] font-bold text-[#111B21] tracking-tight">
              Connected Friends &amp; Family Profiles
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowCollectorForm(true)}
              className="h-[42px] px-4 rounded-full bg-[#F4EFE6] hover:bg-[#EAE3D5] text-[#111B21] border border-[#D6CFC0] text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Receive / Add Profile</span>
            </button>
            <button
              type="button"
              onClick={onOpenInviteModal}
              className="h-[42px] px-5 rounded-full bg-[#111B21] hover:bg-[#24323B] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Share2 className="w-4 h-4" />
              <span>Invite to Connect</span>
            </button>
          </div>
        </div>

        {/* Search & Relationship Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#6a6a6a] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search connected profiles, emails, likes..."
              className="w-full h-[44px] pl-10 pr-4 rounded-[12px] bg-[#FCFBF7] border border-[#D6CFC0] text-[14px] text-[#111B21] focus:outline-none focus:border-[#111B21]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: `All Connected (${birthdays.length})` },
              { id: 'family', label: `Family (${familyCount})` },
              { id: 'friend', label: `Friends (${friendCount})` },
              { id: 'partner', label: 'Partner' },
              { id: 'colleague', label: 'Colleagues' },
              { id: 'pending', label: `Pending Requests (${pendingInvites.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#111B21] text-white'
                    : 'bg-[#F4EFE6] text-[#4A5560] hover:text-[#111B21]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pending Invites View */}
        {(activeFilter === 'pending' || (activeFilter === 'all' && pendingInvites.length > 0)) && (
          <div className="rounded-[24px] bg-[#F4EFE6] border border-[#E6E0D3] p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-[17px] font-bold text-[#111B21]">
                  Awaiting Birthday Submissions ({pendingInvites.length})
                </h3>
                <p className="text-[13px] text-[#525E66]">
                  Friends &amp; family who received your link. Click “Simulate Birthday Received” to test receiving their birthday!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {pendingInvites.map((inv) => (
                <div
                  key={inv.id}
                  className="p-4 rounded-[18px] bg-[#FCFBF7] border border-[#D6CFC0] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-[12px] text-[#525E66]">
                      <Clock className="w-3.5 h-3.5 text-[#FF5722] shrink-0" />
                      <span className="capitalize">{inv.relationship}</span>
                      <span aria-hidden="true">·</span>
                      <span>Link sent via {inv.contactMethod}</span>
                    </div>
                    <h4 className="text-[16px] font-bold text-[#111B21] truncate">
                      {inv.inviteeName}
                    </h4>
                    {inv.contactValue && (
                      <p className="text-[12px] text-[#525E66] truncate">{inv.contactValue}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleSimulateInviteAccepted(inv)}
                      className="h-[36px] px-3.5 rounded-full bg-[#FF5722] hover:bg-[#E64A19] text-white text-[12px] font-semibold cursor-pointer whitespace-nowrap"
                    >
                      Simulate Birthday Received
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connected Profiles Grid with Animated Scenic Banners, Realistic Portraits & Gemini Gift Suggestions */}
        {activeFilter !== 'pending' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((person, index) => {
              const daysUntil = calculateDaysUntilBirthday(person.birthDate, now);
              const exactCountdown = calculateExactTimeUntilBirthday(person.birthDate, now);
              const turningAge = calculateTurningAge(person.birthDate, now);
              const zodiac = getZodiacSign(person.birthDate);
              const shortDate = formatBirthDateShort(person.birthDate);
              const portraitUrl = getPersonRealisticPortrait(person, index);
              const bannerUrl = getCelebrationBannerImage(person, index);
              const activeGift = giftMap[person.id];
              const isSuggestingThis = loadingGiftId === person.id;
              const giftErr = giftErrorMap[person.id];
              const emailAddr =
                person.email ||
                person.googleProfile?.googleEmail ||
                `${person.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`;

              return (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: (index % 6) * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="rounded-[24px] bg-[#F4EFE6] border border-[#E6E0D3] p-5 flex flex-col justify-between gap-4 group overflow-hidden"
                >
                  <div className="space-y-3.5">
                    {/* Animated Scenic Celebration Banner + Realistic Portrait Header */}
                    <div className="relative h-28 rounded-[18px] overflow-hidden bg-[#111B21] border border-[#D6CFC0]">
                      <img
                        src={bannerUrl}
                        alt={`${person.name} celebration cover`}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111B21]/85 via-[#111B21]/20 to-transparent" />

                      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#111B21]/80 backdrop-blur-xs text-[#FCFBF7] text-[11px] font-semibold">
                        {zodiac.symbol} {zodiac.sign} · Turning {turningAge}
                      </div>

                      <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-[#FF5722] text-white text-[11px] font-bold font-mono tabular-nums">
                        {daysUntil === 0 ? 'TODAY!' : `${daysUntil}d · ${shortDate}`}
                      </div>

                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#111B21] border-2 border-[#FCFBF7] shadow-xs shrink-0">
                          <img
                            src={portraitUrl}
                            alt={person.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.onerror = null;
                              target.src = getFallbackPortraitDataUrl(person.name);
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 text-white">
                          <h3 className="text-[17px] font-bold leading-tight truncate">
                            {person.name}
                          </h3>
                          <div className="flex items-center gap-1.5 text-[11px] text-white/85">
                            <span className="capitalize font-semibold">{person.relationship}</span>
                            <span aria-hidden="true">·</span>
                            <span>{person.googleConnected ? 'Verified Profile' : 'Circle Member'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Live Visual Countdown Timer */}
                    <div className="p-3.5 rounded-[16px] bg-[#FCFBF7] border border-[#E6E0D3] space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.8px] text-[#525E66]">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#FF5722] animate-pulse" />
                          <span>Next Birthday Countdown</span>
                        </span>
                        <span className="tabular-nums text-[#111B21]">
                          {exactCountdown.isToday ? 'Today! 🎂' : `${exactCountdown.yearProgressPercent}%`}
                        </span>
                      </div>

                      {exactCountdown.isToday ? (
                        <div className="py-1.5 px-3 rounded-[10px] bg-[#FF5722] text-white text-center font-bold text-[13px]">
                          🎉 Happy Birthday Today! 🎉
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-4 gap-1.5 text-center">
                            <div className="bg-[#F4EFE6] rounded-[10px] py-1 px-1">
                              <div className="font-mono text-[16px] font-bold text-[#111B21] tabular-nums">
                                {String(exactCountdown.days).padStart(2, '0')}
                              </div>
                              <div className="text-[9px] font-semibold uppercase text-[#525E66]">Days</div>
                            </div>
                            <div className="bg-[#F4EFE6] rounded-[10px] py-1 px-1">
                              <div className="font-mono text-[16px] font-bold text-[#111B21] tabular-nums">
                                {String(exactCountdown.hours).padStart(2, '0')}
                              </div>
                              <div className="text-[9px] font-semibold uppercase text-[#525E66]">Hrs</div>
                            </div>
                            <div className="bg-[#F4EFE6] rounded-[10px] py-1 px-1">
                              <div className="font-mono text-[16px] font-bold text-[#111B21] tabular-nums">
                                {String(exactCountdown.minutes).padStart(2, '0')}
                              </div>
                              <div className="text-[9px] font-semibold uppercase text-[#525E66]">Min</div>
                            </div>
                            <div className="bg-[#F4EFE6] rounded-[10px] py-1 px-1">
                              <div className="font-mono text-[16px] font-bold text-[#FF5722] tabular-nums">
                                {String(exactCountdown.seconds).padStart(2, '0')}
                              </div>
                              <div className="text-[9px] font-semibold uppercase text-[#525E66]">Sec</div>
                            </div>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-[#E6E0D3] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#FF5722] transition-all duration-500"
                              style={{ width: `${exactCountdown.yearProgressPercent}%` }}
                            />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Birthday & Contact Metadata + Gemini Suggest Gift Button */}
                    <div className="p-4 rounded-[16px] bg-[#FCFBF7] border border-[#E6E0D3] space-y-2.5 text-[13px]">
                      <div className="space-y-1 text-[12px] text-[#525E66]">
                        <div className="truncate">Email: {emailAddr}</div>
                        <div className="truncate tabular-nums">Phone: {person.phone}</div>
                      </div>

                      <div className="pt-2 border-t border-[#E6E0D3] flex flex-wrap items-center justify-between gap-2">
                        <div className="text-[12px] text-[#374248]">
                          <span className="font-semibold text-[#111B21]">Likes: </span>
                          <span>
                            {person.favoriteThings && person.favoriteThings.length > 0
                              ? person.favoriteThings.join(' · ')
                              : 'Coffee · Books · Celebration'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSuggestProfileGift(person)}
                          disabled={isSuggestingThis}
                          className="h-[30px] px-3 rounded-full bg-[#FF5722] hover:bg-[#E64A19] disabled:opacity-60 text-white text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          {isSuggestingThis ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Suggesting...</span>
                            </>
                          ) : (
                            <>
                              <Gift className="w-3 h-3" />
                              <span>Suggest Gift</span>
                            </>
                          )}
                        </button>
                      </div>

                      <AnimatePresence mode="wait">
                        {giftErr && (
                          <motion.div
                            key="err"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-2.5 rounded-[10px] bg-[#fff3ee] border border-[#FF5722]/30 text-[11px] text-[#3a3a3a]"
                          >
                            {giftErr}
                          </motion.div>
                        )}

                        {activeGift && !giftErr && (
                          <motion.div
                            key={activeGift.title}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="p-3 rounded-[12px] bg-[#F4EFE6] border border-[#E6E0D3] space-y-2"
                          >
                            <div className="flex items-center gap-2.5">
                              <img
                                src={getGiftCategoryImage(
                                  `${activeGift.title} ${activeGift.matchedInterest}`
                                )}
                                alt={activeGift.title}
                                className="w-12 h-12 rounded-[8px] object-cover border border-[#D6CFC0] shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-[10px] font-bold uppercase text-[#FF5722] truncate">
                                    Matched: {activeGift.matchedInterest}
                                  </span>
                                  <span className="text-[10px] font-mono font-semibold text-[#111B21] shrink-0">
                                    {activeGift.priceRange}
                                  </span>
                                </div>
                                <div className="text-[13px] font-bold text-[#111B21] truncate">
                                  {activeGift.title}
                                </div>
                              </div>
                            </div>
                            <p className="text-[11px] text-[#4A5560] leading-relaxed">
                              {activeGift.reason}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Profile Action Row */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onOpenCardStudio(person)}
                      className="h-[38px] px-3 rounded-full bg-[#FF5722] hover:bg-[#E64A19] text-white text-[12px] font-semibold inline-flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Send Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenCallModal(person)}
                      className="h-[38px] px-3 rounded-full bg-[#FCFBF7] hover:bg-[#EAE3D5] text-[#111B21] border border-[#D6CFC0] text-[12px] font-semibold inline-flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call / Chat</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenGoogleHub(person)}
                      className="h-[38px] px-3 rounded-full bg-[#111B21] hover:bg-[#24323B] text-white text-[12px] font-semibold inline-flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Profile Hub</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
