import React, { useState } from 'react';
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
  Clock
} from 'lucide-react';
import { BirthdayPerson, InviteRecord, Relationship } from '../types/birthday';
import {
  calculateDaysUntilBirthday,
  calculateTurningAge,
  getZodiacSign,
  formatBirthDateShort,
  getWhatsAppShareUrl
} from '../utils/birthdayUtils';
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
 * Custom SVG emblems matching the "3 steps to birthday mastery!" visual language:
 * 1. Teal Circle (#147D84) with Link Chain + Long Diagonal Shadow
 * 2. Golden Yellow Circle (#F3C62F) with Smartphone & Message Bubble + Long Diagonal Shadow
 * 3. Deep Slate Circle (#3E5A68) with 3-Candle Birthday Cake + Long Diagonal Shadow
 */
export const MasteryStepLinkIcon: React.FC = () => (
  <svg viewBox="0 0 160 160" className="w-28 h-28 sm:w-32 sm:h-32 mx-auto block" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <clipPath id="step1Clip">
        <circle cx="80" cy="80" r="74" />
      </clipPath>
    </defs>
    <g clipPath="url(#step1Clip)">
      <circle cx="80" cy="80" r="74" fill="#147D84" />
      {/* Long diagonal shadow */}
      <path d="M52 108 L108 52 L165 109 L165 165 L109 165 Z" fill="#0D585D" />
      {/* Interlocking Link Chain Icon */}
      <g transform="rotate(-45 80 80)">
        <rect x="44" y="64" width="44" height="32" rx="16" stroke="#FFFFFF" strokeWidth="10" />
        <rect x="72" y="64" width="44" height="32" rx="16" stroke="#FFFFFF" strokeWidth="10" />
      </g>
    </g>
  </svg>
);

export const MasteryStepPhoneIcon: React.FC = () => (
  <svg viewBox="0 0 160 160" className="w-28 h-28 sm:w-32 sm:h-32 mx-auto block" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <clipPath id="step2Clip">
        <circle cx="80" cy="80" r="74" />
      </clipPath>
    </defs>
    <g clipPath="url(#step2Clip)">
      <circle cx="80" cy="80" r="74" fill="#F3C62F" />
      {/* Long diagonal shadow */}
      <path d="M56 122 L106 44 L165 103 L165 165 L99 165 Z" fill="#D5AB1E" />
      {/* Smartphone Body */}
      <rect x="50" y="36" width="48" height="88" rx="8" fill="#FFFFFF" />
      <rect x="56" y="45" width="36" height="62" rx="3" fill="#F3C62F" />
      <circle cx="74" cy="116" r="4" fill="#F3C62F" />
      {/* Speech Bubble Overlapping Phone */}
      <path
        d="M72 64 C72 52 84 44 98 44 C112 44 124 52 124 64 C124 76 112 84 98 84 C93 84 89 83 85 81 L73 87 L76 76 C73 72 72 68 72 64 Z"
        fill="#FFFFFF"
        stroke="#F3C62F"
        strokeWidth="4"
      />
      <rect x="84" y="58" width="26" height="4.5" rx="2.25" fill="#F3C62F" />
      <rect x="84" y="67" width="20" height="4.5" rx="2.25" fill="#F3C62F" />
    </g>
  </svg>
);

export const MasteryStepCakeIcon: React.FC = () => (
  <svg viewBox="0 0 160 160" className="w-28 h-28 sm:w-32 sm:h-32 mx-auto block" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <clipPath id="step3Clip">
        <circle cx="80" cy="80" r="74" />
      </clipPath>
    </defs>
    <g clipPath="url(#step3Clip)">
      <circle cx="80" cy="80" r="74" fill="#3E5A68" />
      {/* Long diagonal shadow */}
      <path d="M46 116 L104 48 L165 109 L165 165 L95 165 Z" fill="#2C424D" />
      {/* 3 Candles */}
      <rect x="59" y="54" width="6" height="22" rx="2" fill="#FFFFFF" />
      <path d="M62 42 C65 46 66 50 62 52 C58 50 59 46 62 42 Z" fill="#FFFFFF" />
      <rect x="77" y="54" width="6" height="22" rx="2" fill="#FFFFFF" />
      <path d="M80 42 C83 46 84 50 80 52 C76 50 77 46 80 42 Z" fill="#FFFFFF" />
      <rect x="95" y="54" width="6" height="22" rx="2" fill="#FFFFFF" />
      <path d="M98 42 C101 46 102 50 98 52 C94 50 95 46 98 42 Z" fill="#FFFFFF" />
      {/* Cake Top & Base */}
      <rect x="44" y="76" width="72" height="40" rx="6" fill="#FFFFFF" />
      {/* Frosting Wave */}
      <path
        d="M44 92 Q53 85 62 92 T80 92 T98 92 T116 92"
        stroke="#3E5A68"
        strokeWidth="4.5"
        fill="none"
      />
      {/* Cake Dots */}
      <circle cx="56" cy="105" r="3" fill="#3E5A68" />
      <circle cx="72" cy="105" r="3" fill="#3E5A68" />
      <circle cx="88" cy="105" r="3" fill="#3E5A68" />
      <circle cx="104" cy="105" r="3" fill="#3E5A68" />
    </g>
  </svg>
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
      phone: invite.contactValue && !invite.contactValue.includes('@') ? invite.contactValue : '+1 (555) 778-9900',
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
      {/* MODULE 1: "3 STEPS TO BIRTHDAY MASTERY!" — RECEIVE BIRTHDAYS HERO MODULE */}
      <section className="rounded-[32px] bg-[#FCFBF7] border border-[#E6E0D3] p-6 sm:p-10 lg:p-12 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-[13px] font-semibold text-[#FF5722]">
            Effortless Birthday Collection · Personal Invite Link
          </div>
          <h1
            className="text-[32px] sm:text-[44px] font-bold text-[#111B21] tracking-tight leading-[1.1]"
            style={{ textWrap: 'balance' }}
          >
            3 steps to birthday mastery!
          </h1>
          <p className="text-[15px] sm:text-[16px] text-[#4A5560] leading-relaxed">
            Stop chasing relatives and friends across group chats. Share your personal PookieCal link once and receive everyone’s exact birth date, email, and gift preferences automatically.
          </p>
        </div>

        {/* 3-Column Visual Steps (Modeled directly on user's reference design) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 pt-2">
          {/* Step 1 */}
          <div className="text-center space-y-4 px-2">
            <MasteryStepLinkIcon />
            <div className="space-y-2">
              <h2 className="text-[22px] font-bold text-[#1D2B34]">
                We give you a link
              </h2>
              <p className="text-[14px] sm:text-[15px] text-[#4A5560] leading-relaxed max-w-[32ch] mx-auto">
                It’s customized with your name so everyone will recognize it’s from you.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="text-center space-y-4 px-2">
            <MasteryStepPhoneIcon />
            <div className="space-y-2">
              <h2 className="text-[22px] font-bold text-[#1D2B34]">
                Send your link to family and friends
              </h2>
              <p className="text-[14px] sm:text-[15px] text-[#4A5560] leading-relaxed max-w-[34ch] mx-auto">
                We import your contacts’ emails to save you time. Or you can enter them on your own. It’s up to you!
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="text-center space-y-4 px-2">
            <MasteryStepCakeIcon />
            <div className="space-y-2">
              <h2 className="text-[22px] font-bold text-[#1D2B34]">
                You get the birthday
              </h2>
              <p className="text-[14px] sm:text-[15px] text-[#4A5560] leading-relaxed max-w-[32ch] mx-auto">
                They enter their name, email, and birth date in our short form and you’re all set!
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Personal Collector Link Bar */}
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
              Want to see what your friends &amp; family see when they open your link?
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowCollectorForm(!showCollectorForm);
                  setShowBatchEmailDrawer(false);
                }}
                className="px-4 py-2 rounded-full bg-[#147D84] hover:bg-[#0f6369] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
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
              className="mt-4 p-6 rounded-[20px] bg-[#FCFBF7] border-2 border-[#147D84] space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E6E0D3] pb-3">
                <div>
                  <span className="text-[12px] font-semibold text-[#147D84]">
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

      {/* MODULE 2: CONNECTED FRIENDS & FAMILY PROFILES DIRECTORY */}
      <section className="space-y-6">
        {/* Directory Header & Summary Metrics */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E6E0D3] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-[#147D84] tabular-nums">
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

        {/* Pending Invites View (or shown when 'pending' filter is active) */}
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
                      className="h-[36px] px-3.5 rounded-full bg-[#147D84] hover:bg-[#0f6369] text-white text-[12px] font-semibold cursor-pointer whitespace-nowrap"
                    >
                      Simulate Birthday Received
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connected Profiles Grid */}
        {activeFilter !== 'pending' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((person) => {
              const daysUntil = calculateDaysUntilBirthday(person.birthDate);
              const turningAge = calculateTurningAge(person.birthDate);
              const zodiac = getZodiacSign(person.birthDate);
              const shortDate = formatBirthDateShort(person.birthDate);
              const emailAddr =
                person.email ||
                person.googleProfile?.googleEmail ||
                `${person.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`;

              return (
                <div
                  key={person.id}
                  className="rounded-[24px] bg-[#F4EFE6] border border-[#E6E0D3] p-6 flex flex-col justify-between gap-5"
                >
                  <div className="space-y-4">
                    {/* Top Profile Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-13 h-13 rounded-full bg-[#FCFBF7] border border-[#D6CFC0] flex items-center justify-center text-2xl shrink-0">
                          {person.avatarEmoji || '🎂'}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-[18px] font-bold text-[#111B21] truncate">
                            {person.name}
                          </h3>
                          <div className="flex items-center gap-1.5 text-[12px] text-[#525E66]">
                            <span className="capitalize font-medium text-[#111B21]">
                              {person.relationship}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>
                              {person.googleConnected ? 'Connected Profile' : 'Circle Member'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[18px] font-bold font-mono text-[#FF5722] tabular-nums">
                          {daysUntil === 0 ? 'TODAY!' : `${daysUntil}d`}
                        </div>
                        <div className="text-[11px] text-[#525E66] tabular-nums">{shortDate}</div>
                      </div>
                    </div>

                    {/* Birthday & Contact Metadata */}
                    <div className="p-4 rounded-[16px] bg-[#FCFBF7] border border-[#E6E0D3] space-y-2 text-[13px]">
                      <div className="flex items-center justify-between text-[#374248] tabular-nums">
                        <span>Birthday: <strong className="text-[#111B21]">{shortDate}</strong></span>
                        <span>Turning {turningAge} · {zodiac.symbol} {zodiac.sign}</span>
                      </div>

                      <div className="pt-2 border-t border-[#E6E0D3] space-y-1 text-[12px] text-[#525E66]">
                        <div className="truncate">Email: {emailAddr}</div>
                        <div className="truncate tabular-nums">Phone: {person.phone}</div>
                      </div>

                      {person.favoriteThings && person.favoriteThings.length > 0 && (
                        <div className="pt-2 border-t border-[#E6E0D3] text-[12px] text-[#374248]">
                          <span className="font-semibold text-[#111B21]">Likes: </span>
                          <span>{person.favoriteThings.join(' · ')}</span>
                        </div>
                      )}
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
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
