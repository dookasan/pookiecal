import React, { useState } from 'react';
import {
  Calendar,
  Phone,
  MessageSquare,
  Gift,
  Sparkles,
  Check,
  ArrowRight,
  ShieldCheck,
  Users,
  Mail,
  Image as ImageIcon,
  ShoppingBag,
  Clock,
  Lock
} from 'lucide-react';
import { BirthdayPerson, Relationship } from '../types/birthday';
import {
  calculateDaysUntilBirthday,
  calculateTurningAge,
  getZodiacSign,
  formatBirthDateShort
} from '../utils/birthdayUtils';
import { AppUser } from '../utils/googleAuth';

export type WorkspaceTab = 'wall' | 'events' | 'googleHub' | 'party' | 'calendar';

interface LandingPageProps {
  birthdays: BirthdayPerson[];
  googleUser: AppUser | null;
  onLaunchApp: (initialTab?: WorkspaceTab) => void;
  onOpenAuthModal: (mode: 'signin' | 'register') => void;
  onOpenAddBirthday: () => void;
  onOpenAddEvent: () => void;
  onOpenInviteModal: () => void;
  onOpenCardStudio: (person: BirthdayPerson) => void;
  onOpenCallModal: (person: BirthdayPerson) => void;
  onOpenGoogleHub: (person: BirthdayPerson) => void;
  onQuickAddBirthday: (person: BirthdayPerson) => void;
}

const PREVIEW_THEMES = [
  {
    id: 'coral',
    name: 'Warm Coral',
    bg: 'bg-[#FF4D8B]',
    text: 'text-white',
    sub: 'text-white/85',
    border: 'border-[#e03873]'
  },
  {
    id: 'matcha',
    name: 'Soft Matcha',
    bg: 'bg-[#A4D4C5]',
    text: 'text-[#111B21]',
    sub: 'text-[#111B21]/80',
    border: 'border-[#82bca9]'
  },
  {
    id: 'peach',
    name: 'Golden Peach',
    bg: 'bg-[#FFB084]',
    text: 'text-[#111B21]',
    sub: 'text-[#111B21]/80',
    border: 'border-[#e8986b]'
  },
  {
    id: 'obsidian',
    name: 'Midnight Ink',
    bg: 'bg-[#111B21]',
    text: 'text-[#FCFBF7]',
    sub: 'text-[#FCFBF7]/80',
    border: 'border-[#2a3942]'
  }
] as const;

export const LandingPage: React.FC<LandingPageProps> = ({
  birthdays,
  googleUser,
  onLaunchApp,
  onOpenAuthModal,
  onOpenAddBirthday,
  onOpenInviteModal,
  onOpenCardStudio,
  onOpenCallModal,
  onOpenGoogleHub,
  onQuickAddBirthday
}) => {
  // Interactive Countdown & Reminder Calculator State
  const [calcName, setCalcName] = useState('Aarav Mehta');
  const [calcDate, setCalcDate] = useState('1996-11-18');
  const [calcRelation, setCalcRelation] = useState<Relationship>('family');
  const [calcPhone, setCalcPhone] = useState('+1 (555) 234-5678');
  const [calcSavedNotice, setCalcSavedNotice] = useState(false);

  // Interactive Card Studio Theme Preview State
  const [activeThemeIdx, setActiveThemeIdx] = useState(0);

  // Interactive Festival Checklist Demo State
  const [demoPrepItems, setDemoPrepItems] = useState([
    { id: 'p1', label: 'Assorted Kaju Katli & Dry Fruit Box', category: 'To Carry', done: true },
    { id: 'p2', label: 'Handcrafted Brass Diya Set (2 pcs)', category: 'To Shop', done: false },
    { id: 'p3', label: 'Confirm evening family dinner timing on WhatsApp', category: 'To Do', done: true },
    { id: 'p4', label: 'Warm saffron & cardamom tea blend for grandparents', category: 'To Carry', done: false }
  ]);

  const featuredPerson = birthdays[0] || {
    id: 'demo-1',
    name: 'Maya Patel',
    birthDate: '1995-11-04',
    phone: '+15552345678',
    relationship: 'family' as Relationship,
    avatarColor: 'from-pink-500 to-rose-500',
    avatarEmoji: '🎂',
    reminders: {
      sameDay: true,
      oneDayBefore: true,
      threeDaysBefore: true,
      oneWeekBefore: true,
      time: '09:00'
    }
  };

  const calcDays = calculateDaysUntilBirthday(calcDate);
  const calcAge = calculateTurningAge(calcDate);
  const calcZodiac = getZodiacSign(calcDate);
  const calcFormattedDate = formatBirthDateShort(calcDate);

  const handleSaveCalculatorEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calcName.trim() || !calcDate) return;

    const newPerson: BirthdayPerson = {
      id: `quick-${Date.now()}`,
      name: calcName.trim(),
      birthDate: calcDate,
      phone: calcPhone.trim() || '+15550001234',
      relationship: calcRelation,
      avatarColor: 'from-pink-500 to-rose-500',
      avatarEmoji: calcRelation === 'family' ? '🏡' : calcRelation === 'partner' ? '💖' : '🎉',
      notes: `Added from PookieCal Countdown Calculator (${calcZodiac.symbol} ${calcZodiac.sign})`,
      favoriteThings: ['Artisan Coffee', 'Handwritten Notes', 'Family Dinner'],
      reminders: {
        sameDay: true,
        oneDayBefore: true,
        threeDaysBefore: true,
        oneWeekBefore: true,
        time: '09:00'
      }
    };

    onQuickAddBirthday(newPerson);
    setCalcSavedNotice(true);
    setTimeout(() => {
      setCalcSavedNotice(false);
      onLaunchApp('wall');
    }, 900);
  };

  const toggleDemoPrep = (id: string) => {
    setDemoPrepItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const activeTheme = PREVIEW_THEMES[activeThemeIdx];

  return (
    <div className="min-h-screen bg-[#FCFBF7] text-[#111B21] flex flex-col antialiased selection:bg-[#111B21] selection:text-[#FCFBF7]">
      {/* STRICT 3-ZONE TOP BAR CONTRACT */}
      <header className="sticky top-0 z-40 h-16 bg-[#FCFBF7]/95 backdrop-blur-xs border-b border-[#E6E0D3]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-full flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="text-[21px] font-bold tracking-tight text-[#111B21] whitespace-nowrap shrink-0"
          >
            PookieCal
          </a>

          {/* Zone 2: 5 concise single-line text navigation links */}
          <nav
            aria-label="Primary Marketing Navigation"
            className="hidden md:flex items-center gap-7 text-[14px] font-medium text-[#4A5560]"
          >
            <a
              href="#calculator"
              className="hover:text-[#111B21] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Countdown Tool
            </a>
            <a
              href="#features"
              className="hover:text-[#111B21] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Card Studio
            </a>
            <a
              href="#festivals"
              className="hover:text-[#111B21] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Festivals & Visits
            </a>
            <a
              href="#privacy-sync"
              className="hover:text-[#111B21] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Privacy & Sync
            </a>
            <button
              type="button"
              onClick={() => onLaunchApp('wall')}
              className="hover:text-[#111B21] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Workspace ({birthdays.length})
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => onLaunchApp('wall')}
              className="h-[42px] px-5 rounded-full bg-[#FF4D8B] hover:bg-[#e83c78] text-white text-[14px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {googleUser ? `Open Workspace · ${googleUser.displayName?.split(' ')[0]}` : 'Launch PookieCal'}
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* SECTION 1: WHATSAPP.COM-STYLE LARGE ROUNDED HERO CONTAINER */}
        <section className="max-w-[1280px] mx-auto px-4 sm:px-8 pt-6 sm:pt-10 pb-12">
          <div className="rounded-[32px] bg-[#F4EFE6] border border-[#E6E0D3] p-6 sm:p-10 lg:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              {/* Left 6 Columns: Proposition & Primary Action */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-[#525E66]">
                    <span>Birthdays</span>
                    <span aria-hidden="true">·</span>
                    <span>Cultural Festivals</span>
                    <span aria-hidden="true">·</span>
                    <span>Family Visits</span>
                    <span aria-hidden="true">·</span>
                    <span>Group Gift Pools</span>
                  </div>

                  <h1
                    className="font-bold text-[#111B21] tracking-tight leading-[1.06] max-w-xl"
                    style={{ fontSize: 'clamp(2.35rem, 4.2vw, 3.75rem)', textWrap: 'balance' }}
                  >
                    Celebrate the people who matter most, right on time.
                  </h1>

                  <p className="text-[16px] sm:text-[17px] text-[#374248] leading-[1.6] max-w-[60ch]">
                    PookieCal keeps your family birthdays, festival home visits, carry-sweets checklists, custom greeting cards, and shared gift pools organized in one warm, private workspace.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onLaunchApp('wall')}
                      className="h-[48px] px-7 rounded-full bg-[#FF4D8B] hover:bg-[#e83c78] text-white text-[15px] font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Launch PookieCal Free</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        googleUser ? onOpenAddBirthday() : onOpenAuthModal('register')
                      }
                      className="h-[48px] px-6 rounded-full bg-[#FCFBF7] hover:bg-[#EAE3D5] text-[#111B21] border border-[#D6CFC0] text-[15px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {googleUser ? '+ Add Birthday to Circle' : 'Create Free Account'}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#525E66]">
                    <span>Free for personal &amp; family circles</span>
                    <span aria-hidden="true">·</span>
                    <span>Works on Web &amp; Mobile</span>
                    <span aria-hidden="true">·</span>
                    <button
                      type="button"
                      onClick={() => onOpenAuthModal('signin')}
                      className="text-[#111B21] font-semibold underline underline-offset-4 cursor-pointer"
                    >
                      {googleUser ? `Signed in as ${googleUser.email || googleUser.displayName}` : 'Already registered? Sign in'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right 6 Columns: WhatsApp.com-Style Layered Conversation & Reminder Scene */}
              <div className="lg:col-span-6 flex flex-col justify-between rounded-[24px] bg-[#111B21] text-[#FCFBF7] p-6 sm:p-8 relative overflow-hidden border border-[#24323B]">
                {/* Top Header inside Live Visual Card */}
                <div className="flex items-center justify-between gap-4 pb-5 border-b border-white/10">
                  <div>
                    <div className="text-[12px] text-[#A4D4C5] font-medium">
                      Live Circle Notification Feed
                    </div>
                    <h2 className="text-[19px] font-semibold text-white mt-0.5">
                      Your Upcoming Celebration Stream
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => onLaunchApp('calendar')}
                    className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[12px] font-semibold text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    View Full Calendar →
                  </button>
                </div>

                {/* Floating Interactive Message Bubbles (WhatsApp.com signature motif) */}
                <div className="space-y-3.5 my-5">
                  {/* Bubble 1: Upcoming Birthday Alert */}
                  <div className="rounded-[20px] bg-[#FCFBF7] text-[#111B21] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[12px] text-[#525E66] tabular-nums">
                        <span className="font-semibold text-[#FF4D8B]">Reminder · 9:00 AM</span>
                        <span aria-hidden="true">·</span>
                        <span>Family Circle</span>
                      </div>
                      <p className="text-[15px] font-semibold text-[#111B21]">
                        {featuredPerson.name}’s Birthday is coming up ({formatBirthDateShort(featuredPerson.birthDate)})
                      </p>
                      <p className="text-[13px] text-[#4A5560]">
                        Likes: Artisan Coffee, Handwritten Notes · 1-day &amp; same-day alerts active
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onOpenCardStudio(featuredPerson)}
                        className="h-[36px] px-3.5 rounded-full bg-[#FF4D8B] text-white text-[12px] font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Send Card
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenCallModal(featuredPerson)}
                        className="h-[36px] px-3.5 rounded-full bg-[#111B21] text-white text-[12px] font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Call
                      </button>
                    </div>
                  </div>

                  {/* Bubble 2: Cultural Festival & Visit Prep Bubble */}
                  <div className="rounded-[20px] bg-[#1D2B34] border border-white/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[12px] text-[#A4D4C5] tabular-nums">
                        <span>Diwali Family Visit</span>
                        <span aria-hidden="true">·</span>
                        <span>3 of 4 prep items ready</span>
                      </div>
                      <p className="text-[14px] font-semibold text-white">
                        Carry: Assorted Kaju Katli Box &amp; Marigold Toran for Parents
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onLaunchApp('events')}
                      className="h-[36px] px-3.5 rounded-full bg-[#A4D4C5] text-[#111B21] text-[12px] font-semibold whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-center"
                    >
                      Open Checklist
                    </button>
                  </div>

                  {/* Bubble 3: Collaborative Group Gift Pool Bubble */}
                  <div className="rounded-[20px] bg-[#FCFBF7] text-[#111B21] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between text-[12px] text-[#525E66] tabular-nums">
                        <span className="font-semibold text-[#111B21]">Surprise Party Gift Pool</span>
                        <span className="font-mono font-semibold text-[#111B21]">$185 / $220 funded</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#E6E0D3] overflow-hidden">
                        <div className="h-full bg-[#FF4D8B] rounded-full" style={{ width: '84%' }} />
                      </div>
                      <p className="text-[12px] text-[#4A5560]">
                        4 friends chipped in for Espresso Machine · 6 RSVPs confirmed
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onLaunchApp('party')}
                      className="h-[36px] px-3.5 rounded-full bg-[#F4EFE6] border border-[#D6CFC0] text-[#111B21] text-[12px] font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Chip In →
                    </button>
                  </div>
                </div>

                {/* Bottom Quick-Jump Switcher */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[12px] text-[#B8C4CC]">
                  <span>Jump directly to any tool:</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onLaunchApp('wall')}
                      className="underline hover:text-white cursor-pointer"
                    >
                      Birthday Wall
                    </button>
                    <span aria-hidden="true">·</span>
                    <button
                      type="button"
                      onClick={() => onLaunchApp('events')}
                      className="underline hover:text-white cursor-pointer"
                    >
                      Festivals
                    </button>
                    <span aria-hidden="true">·</span>
                    <button
                      type="button"
                      onClick={() => onLaunchApp('googleHub')}
                      className="underline hover:text-white cursor-pointer"
                    >
                      Google Hub
                    </button>
                    <span aria-hidden="true">·</span>
                    <button
                      type="button"
                      onClick={() => onLaunchApp('party')}
                      className="underline hover:text-white cursor-pointer"
                    >
                      Party Pool
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FULL-WIDTH 4-COLUMN PROOF & CAPABILITY STRIP BELOW HERO SPLIT */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-[24px] bg-[#F4EFE6] border border-[#E6E0D3] p-6">
              <div className="text-[28px] font-bold text-[#111B21] tabular-nums tracking-tight">
                4-Stage Alerts
              </div>
              <p className="text-[14px] text-[#374248] mt-1">
                Automated reminders 7 days, 3 days, 1 day before, and at 9:00 AM on the day.
              </p>
            </div>

            <div className="rounded-[24px] bg-[#F4EFE6] border border-[#E6E0D3] p-6">
              <div className="text-[28px] font-bold text-[#111B21] tabular-nums tracking-tight">
                6 Card Themes
              </div>
              <p className="text-[14px] text-[#374248] mt-1">
                Instant personalized PNG greeting cards with 1-tap WhatsApp &amp; SMS sharing.
              </p>
            </div>

            <div className="rounded-[24px] bg-[#F4EFE6] border border-[#E6E0D3] p-6">
              <div className="text-[28px] font-bold text-[#111B21] tabular-nums tracking-tight">
                3-Part Prep Lists
              </div>
              <p className="text-[14px] text-[#374248] mt-1">
                Organized To-Carry, To-Shop, and To-Do checklists for every family festival visit.
              </p>
            </div>

            <div className="rounded-[24px] bg-[#F4EFE6] border border-[#E6E0D3] p-6">
              <div className="text-[28px] font-bold text-[#111B21] tabular-nums tracking-tight">
                100% Private
              </div>
              <p className="text-[14px] text-[#374248] mt-1">
                Isolated per-user workspaces with Email/Password or 1-click Google Sign-In.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: INTERACTIVE COUNTDOWN, ZODIAC & REMINDER CALCULATOR */}
        <section id="calculator" className="max-w-[1280px] mx-auto px-4 sm:px-8 py-12 sm:py-16">
          <div className="rounded-[32px] bg-[#F4EFE6] border border-[#E6E0D3] p-6 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left 6 Cols: Interactive Input Form */}
              <div className="lg:col-span-6 space-y-5">
                <div className="text-[13px] font-semibold text-[#FF4D8B]">
                  Interactive Live Preview Tool
                </div>
                <h2 className="text-[28px] sm:text-[36px] font-bold text-[#111B21] tracking-tight leading-[1.12]">
                  Test the Birthday Countdown &amp; Reminder Planner right now.
                </h2>
                <p className="text-[15px] text-[#374248] leading-relaxed">
                  Enter anyone’s name and birth date below to calculate their exact countdown days, milestone age, zodiac sign, and optimal gift prep schedule—then save them straight to your circle.
                </p>

                <form onSubmit={handleSaveCalculatorEntry} className="space-y-4 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label
                        htmlFor="calc-name"
                        className="block text-[13px] font-semibold text-[#111B21] mb-1.5"
                      >
                        Person’s Name
                      </label>
                      <input
                        id="calc-name"
                        type="text"
                        required
                        value={calcName}
                        onChange={(e) => setCalcName(e.target.value)}
                        placeholder="e.g., Mom, Aarav, Bestie"
                        className="w-full h-[44px] px-4 rounded-[12px] bg-[#FCFBF7] border border-[#D6CFC0] text-[#111B21] text-[14px] focus:outline-none focus:border-[#111B21]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="calc-date"
                        className="block text-[13px] font-semibold text-[#111B21] mb-1.5"
                      >
                        Birth Date
                      </label>
                      <input
                        id="calc-date"
                        type="date"
                        required
                        value={calcDate}
                        onChange={(e) => setCalcDate(e.target.value)}
                        className="w-full h-[44px] px-4 rounded-[12px] bg-[#FCFBF7] border border-[#D6CFC0] text-[#111B21] text-[14px] focus:outline-none focus:border-[#111B21]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label
                        htmlFor="calc-relation"
                        className="block text-[13px] font-semibold text-[#111B21] mb-1.5"
                      >
                        Relationship Circle
                      </label>
                      <select
                        id="calc-relation"
                        value={calcRelation}
                        onChange={(e) => setCalcRelation(e.target.value as Relationship)}
                        className="w-full h-[44px] px-4 rounded-[12px] bg-[#FCFBF7] border border-[#D6CFC0] text-[#111B21] text-[14px] focus:outline-none focus:border-[#111B21]"
                      >
                        <option value="family">Family</option>
                        <option value="friend">Close Friend</option>
                        <option value="partner">Partner</option>
                        <option value="colleague">Work / Colleague</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="calc-phone"
                        className="block text-[13px] font-semibold text-[#111B21] mb-1.5"
                      >
                        WhatsApp / Phone (Optional)
                      </label>
                      <input
                        id="calc-phone"
                        type="tel"
                        value={calcPhone}
                        onChange={(e) => setCalcPhone(e.target.value)}
                        placeholder="+1 (555) 234-5678"
                        className="w-full h-[44px] px-4 rounded-[12px] bg-[#FCFBF7] border border-[#D6CFC0] text-[#111B21] text-[14px] focus:outline-none focus:border-[#111B21]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="submit"
                      className="h-[46px] px-6 rounded-full bg-[#111B21] hover:bg-[#24323B] text-white text-[14px] font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {calcSavedNotice ? (
                        <>
                          <Check className="w-4 h-4 text-[#A4D4C5]" />
                          <span>Saved! Opening Circle...</span>
                        </>
                      ) : (
                        <>
                          <span>Save {calcName || 'Person'} to My Circle</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Right 6 Cols: Live Computed Countdown Output Card */}
              <div className="lg:col-span-6">
                <div className="rounded-[24px] bg-[#FCFBF7] border border-[#D6CFC0] p-6 sm:p-8 space-y-6">
                  <div className="flex items-start justify-between gap-4 border-b border-[#E6E0D3] pb-5">
                    <div>
                      <div className="text-[12px] text-[#525E66] font-medium">
                        Live PookieCal Schedule Output · {calcFormattedDate}
                      </div>
                      <h3 className="text-[24px] font-bold text-[#111B21] mt-0.5">
                        {calcName || 'Your Loved One'}
                      </h3>
                      <div className="flex items-center gap-2 text-[13px] text-[#4A5560] mt-1">
                        <span className="capitalize">{calcRelation}</span>
                        <span aria-hidden="true">·</span>
                        <span>Turning {calcAge}</span>
                        <span aria-hidden="true">·</span>
                        <span>Zodiac: {calcZodiac.symbol} {calcZodiac.sign}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[32px] font-bold text-[#FF4D8B] font-mono tabular-nums leading-none">
                        {calcDays === 0 ? 'TODAY' : `${calcDays}d`}
                      </div>
                      <div className="text-[12px] text-[#525E66] mt-1">
                        {calcDays === 0 ? 'Celebration Day!' : 'days remaining'}
                      </div>
                    </div>
                  </div>

                  {/* Automated 4-Stage Notification Timeline */}
                  <div className="space-y-2.5">
                    <div className="text-[12px] font-semibold text-[#111B21]">
                      Automated PookieCal Reminder Timeline:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[13px]">
                      <div className="p-3 rounded-[14px] bg-[#F4EFE6] flex items-center justify-between">
                        <span className="text-[#374248]">1 Week Before</span>
                        <span className="font-semibold text-[#111B21]">Order Gift / Plan Pool</span>
                      </div>
                      <div className="p-3 rounded-[14px] bg-[#F4EFE6] flex items-center justify-between">
                        <span className="text-[#374248]">3 Days Before</span>
                        <span className="font-semibold text-[#111B21]">Confirm Visit &amp; Cake</span>
                      </div>
                      <div className="p-3 rounded-[14px] bg-[#F4EFE6] flex items-center justify-between">
                        <span className="text-[#374248]">1 Day Before</span>
                        <span className="font-semibold text-[#111B21]">Design Greeting Card</span>
                      </div>
                      <div className="p-3 rounded-[14px] bg-[#A4D4C5]/40 flex items-center justify-between">
                        <span className="text-[#111B21] font-medium">9:00 AM Same Day</span>
                        <span className="font-semibold text-[#111B21]">1-Tap Call &amp; WhatsApp</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: ALTERNATING 50/50 SPLIT SECTIONS (WHATSAPP.COM RHYTHM) */}
        <section id="features" className="max-w-[1280px] mx-auto px-4 sm:px-8 py-12 space-y-20">
          {/* SPLIT 01: GREETING CARD STUDIO & 1-TAP DIRECT CALLING */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left 6 Cols: Interactive Card Studio Preview */}
            <div className="lg:col-span-6 rounded-[32px] bg-[#F4EFE6] border border-[#E6E0D3] p-6 sm:p-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[13px] font-semibold text-[#111B21]">
                  Interactive Card Theme Switcher
                </span>
                <div className="flex items-center gap-1.5 p-1 bg-[#FCFBF7] rounded-full border border-[#E6E0D3]">
                  {PREVIEW_THEMES.map((theme, idx) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setActiveThemeIdx(idx)}
                      className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        activeThemeIdx === idx
                          ? 'bg-[#111B21] text-white'
                          : 'text-[#525E66] hover:text-[#111B21]'
                      }`}
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Greeting Card Preview */}
              <div
                className={`rounded-[24px] p-7 sm:p-9 border transition-colors ${activeTheme.bg} ${activeTheme.text} ${activeTheme.border} space-y-4`}
              >
                <div className={`text-[12px] font-semibold ${activeTheme.sub}`}>
                  HAPPY BIRTHDAY WISH · {formatBirthDateShort(featuredPerson.birthDate)}
                </div>
                <h3 className="text-[28px] sm:text-[32px] font-bold tracking-tight leading-tight">
                  Wishing you the warmest year ahead, {featuredPerson.name}!
                </h3>
                <p className={`text-[15px] leading-relaxed ${activeTheme.sub}`}>
                  May this year bring endless laughter, unforgettable family dinners, and every adventure on your wishlist.
                </p>
                <div className="pt-3 flex items-center justify-between text-[13px] font-semibold">
                  <span>With love from your Circle</span>
                  <span>PookieCal Studio</span>
                </div>
              </div>

              {/* Action Bar inside Card Studio Preview */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenCardStudio(featuredPerson)}
                  className="h-[42px] px-5 rounded-full bg-[#111B21] text-white text-[13px] font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Customize &amp; Download PNG</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenCallModal(featuredPerson)}
                  className="h-[42px] px-5 rounded-full bg-[#FCFBF7] border border-[#D6CFC0] text-[#111B21] text-[13px] font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>1-Tap Direct Call / WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Right 6 Cols: Editorial Storytelling Copy */}
            <div className="lg:col-span-6 space-y-5">
              <div className="text-[14px] font-semibold text-[#FF4D8B]">
                01. Custom Greeting Studio &amp; 1-Tap Calling
              </div>
              <h2
                className="text-[32px] sm:text-[42px] font-bold text-[#111B21] tracking-tight leading-[1.1]"
                style={{ textWrap: 'balance' }}
              >
                Say more than a generic text message.
              </h2>
              <p className="text-[16px] text-[#374248] leading-[1.65] max-w-[58ch]">
                When a birthday arrives, PookieCal lets you craft a keepsake greeting card in seconds with 6 curated visual themes, export a crisp PNG image, share pre-filled wishes straight to WhatsApp, or launch a 1-tap phone or FaceTime call.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onOpenCardStudio(featuredPerson)}
                  className="h-[46px] px-6 rounded-full bg-[#FF4D8B] hover:bg-[#e83c78] text-white text-[14px] font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Open Greeting Card Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onLaunchApp('wall')}
                  className="h-[46px] px-5 rounded-full bg-[#F4EFE6] hover:bg-[#EAE3D5] text-[#111B21] text-[14px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Browse All Birthdays
                </button>
              </div>
            </div>
          </div>

          {/* SPLIT 02: CULTURAL FESTIVALS, FAMILY VISITS & CARRY-SWEETS CHECKLISTS */}
          <div id="festivals" className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left 6 Cols: Editorial Copy */}
            <div className="lg:col-span-6 space-y-5 order-2 lg:order-1">
              <div className="text-[14px] font-semibold text-[#111B21]">
                02. Cultural Festivals &amp; Family Visit Checklists
              </div>
              <h2
                className="text-[32px] sm:text-[42px] font-bold text-[#111B21] tracking-tight leading-[1.1]"
                style={{ textWrap: 'balance' }}
              >
                Never arrive empty-handed at a family festival visit.
              </h2>
              <p className="text-[16px] text-[#374248] leading-[1.65] max-w-[58ch]">
                From Diwali, Eid, Holi, and Raksha Bandhan to Thanksgiving and Christmas, PookieCal includes a built-in festival catalog with dedicated <strong>To-Carry</strong> (mithai, dry fruits, flowers), <strong>To-Shop</strong>, and <strong>To-Do</strong> checklists—plus 1-click Google Shopping &amp; Amazon gift search.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onLaunchApp('events')}
                  className="h-[46px] px-6 rounded-full bg-[#111B21] hover:bg-[#24323B] text-white text-[14px] font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Open Festivals &amp; Visit Planner</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right 6 Cols: Interactive Festival Prep Checklist Card */}
            <div className="lg:col-span-6 rounded-[32px] bg-[#F4EFE6] border border-[#E6E0D3] p-6 sm:p-8 space-y-5 order-1 lg:order-2">
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#E6E0D3]">
                <div>
                  <div className="text-[12px] text-[#525E66] font-medium">
                    Interactive Festival Checklist · Click any item to toggle
                  </div>
                  <h3 className="text-[20px] font-bold text-[#111B21] mt-0.5">
                    Diwali Home Visit — Sharma Family
                  </h3>
                </div>
                <span className="text-[13px] font-mono font-semibold text-[#111B21] tabular-nums">
                  {demoPrepItems.filter((i) => i.done).length}/{demoPrepItems.length} Done
                </span>
              </div>

              <div className="space-y-2.5">
                {demoPrepItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleDemoPrep(item.id)}
                    className={`w-full p-3.5 rounded-[16px] border text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                      item.done
                        ? 'bg-[#A4D4C5]/30 border-[#82bca9] text-[#111B21]'
                        : 'bg-[#FCFBF7] border-[#E6E0D3] text-[#111B21] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                          item.done
                            ? 'bg-[#111B21] text-white'
                            : 'border border-[#9AA3A9] bg-white'
                        }`}
                      >
                        {item.done && <Check className="w-3.5 h-3.5" />}
                      </span>
                      <span
                        className={`text-[14px] font-medium truncate ${
                          item.done ? 'line-through text-[#525E66]' : 'text-[#111B21]'
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    <span className="text-[12px] text-[#525E66] shrink-0">
                      {item.category}
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-[13px]">
                <span className="text-[#525E66]">
                  Includes 1-tap gift lookup on Google Shopping &amp; Amazon
                </span>
                <button
                  type="button"
                  onClick={() => onLaunchApp('events')}
                  className="font-semibold text-[#111B21] underline underline-offset-4 cursor-pointer"
                >
                  Plan Your Own Visit →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: FULL-WIDTH DEEP CHARCOAL CONTRAST SECTION (WHATSAPP "SPEAK FREELY / PRIVACY" STYLE) */}
        <section id="privacy-sync" className="w-full bg-[#111B21] text-[#FCFBF7] py-20 sm:py-24 my-12">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left 6 Cols: Privacy & Connected Workspace Copy */}
              <div className="lg:col-span-6 space-y-6">
                <div className="text-[13px] font-semibold text-[#A4D4C5] tracking-wide">
                  03. Private Circle Accounts &amp; Google Workspace Hub
                </div>
                <h2
                  className="text-[34px] sm:text-[44px] font-bold text-white tracking-tight leading-[1.08]"
                  style={{ textWrap: 'balance' }}
                >
                  Your family memories stay private to your circle.
                </h2>
                <p className="text-[16px] text-[#C8D1D6] leading-[1.65] tracking-[0.01em] max-w-[58ch]">
                  Register in seconds with Email &amp; Password or 1-click Google Sign-In. Every account receives an isolated personal calendar—and if you choose to open the Google Member Hub, you can view shared Google Photos memory reels, recent Gmail threads, and tailored gift ideas for each person in your circle.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-5 rounded-[20px] bg-[#1A2730] border border-white/10 space-y-1.5">
                    <div className="flex items-center gap-2 text-[#A4D4C5] font-semibold text-[14px]">
                      <Lock className="w-4 h-4" />
                      <span>Isolated User Workspaces</span>
                    </div>
                    <p className="text-[13px] text-[#B8C4CC] leading-relaxed">
                      Start with a clean slate or explore sample templates. Your contacts and notes are never sold or shared.
                    </p>
                  </div>

                  <div className="p-5 rounded-[20px] bg-[#1A2730] border border-white/10 space-y-1.5">
                    <div className="flex items-center gap-2 text-[#FF4D8B] font-semibold text-[14px]">
                      <ShieldCheck className="w-4 h-4" />
                      <span>No Restricted-Scope Lockouts</span>
                    </div>
                    <p className="text-[13px] text-[#B8C4CC] leading-relaxed">
                      Standard sign-in uses only basic profile &amp; email identity so anyone can join immediately.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => onLaunchApp('googleHub')}
                    className="h-[46px] px-6 rounded-full bg-[#A4D4C5] hover:bg-[#8ec7b5] text-[#111B21] text-[14px] font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Explore Google Member Hub</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenAuthModal('register')}
                    className="h-[46px] px-6 rounded-full bg-white/10 hover:bg-white/20 text-white text-[14px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {googleUser ? 'Switch or Manage Account' : 'Create Free Account'}
                  </button>
                </div>
              </div>

              {/* Right 6 Cols: Google Workspace Member Hub Interactive Card */}
              <div className="lg:col-span-6">
                <div className="rounded-[28px] bg-[#1A2730] border border-white/15 p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                      <div className="text-[12px] text-[#A4D4C5] font-medium">
                        Connected Member Relationship Hub
                      </div>
                      <h3 className="text-[22px] font-bold text-white mt-0.5">
                        {featuredPerson.name} · Unified Memory Feed
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenGoogleHub(featuredPerson)}
                      className="h-[38px] px-4 rounded-full bg-[#FF4D8B] text-white text-[12px] font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Open Live Hub →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13px]">
                    <div className="p-4 rounded-[16px] bg-[#111B21] border border-white/10 space-y-1">
                      <div className="text-[#A4D4C5] font-semibold flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        <span>Gmail Threads</span>
                      </div>
                      <p className="text-white font-semibold tabular-nums">3 Recent Emails</p>
                      <p className="text-[12px] text-[#9AA6B0]">Compose &amp; log birthday notes</p>
                    </div>

                    <div className="p-4 rounded-[16px] bg-[#111B21] border border-white/10 space-y-1">
                      <div className="text-[#FFB084] font-semibold flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Shared Photos</span>
                      </div>
                      <p className="text-white font-semibold tabular-nums">Memory Reel</p>
                      <p className="text-[12px] text-[#9AA6B0]">Auto-advancing photo slideshow</p>
                    </div>

                    <div className="p-4 rounded-[16px] bg-[#111B21] border border-white/10 space-y-1">
                      <div className="text-[#FF4D8B] font-semibold flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5" />
                        <span>Smart Gifts</span>
                      </div>
                      <p className="text-white font-semibold tabular-nums">Curated Ideas</p>
                      <p className="text-[12px] text-[#9AA6B0]">1-click add to Party Gift Pool</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-[16px] bg-[#111B21] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px]">
                    <span className="text-[#C8D1D6]">
                      Compliant with Google API Services User Data Policy.
                    </span>
                    <div className="flex items-center gap-3 shrink-0">
                      <a href="/privacy" className="text-[#A4D4C5] underline font-medium">
                        Privacy Policy
                      </a>
                      <span aria-hidden="true">·</span>
                      <a href="/terms" className="text-[#A4D4C5] underline font-medium">
                        Terms of Service
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: SPLIT 04 — COLLABORATIVE PARTY POOL & WHATSAPP CIRCLE INVITES */}
        <section className="max-w-[1280px] mx-auto px-4 sm:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left 6 Cols: Party Pool & Gift Contribution Visual */}
            <div className="lg:col-span-6 rounded-[32px] bg-[#F4EFE6] border border-[#E6E0D3] p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between border-b border-[#E6E0D3] pb-4">
                <div>
                  <div className="text-[12px] text-[#525E66] font-medium">
                    Collaborative Surprise Party &amp; Gift Pool
                  </div>
                  <h3 className="text-[20px] font-bold text-[#111B21] mt-0.5">
                    Maya’s Rooftop Birthday Pool
                  </h3>
                </div>
                <span className="text-[13px] font-mono font-semibold text-[#111B21] tabular-nums">
                  $310 / $350 Goal
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-[18px] bg-[#FCFBF7] border border-[#E6E0D3] space-y-2">
                  <div className="flex items-center justify-between text-[14px] font-semibold text-[#111B21] tabular-nums">
                    <span>Breville Barista Espresso Machine</span>
                    <span>$185 / $220</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#E6E0D3] overflow-hidden">
                    <div className="h-full bg-[#FF4D8B] rounded-full" style={{ width: '84%' }} />
                  </div>
                  <div className="text-[12px] text-[#525E66]">
                    Contributors: Rohan ($60) · Ananya ($50) · Vikram ($75)
                  </div>
                </div>

                <div className="p-4 rounded-[18px] bg-[#FCFBF7] border border-[#E6E0D3] space-y-2">
                  <div className="flex items-center justify-between text-[14px] font-semibold text-[#111B21] tabular-nums">
                    <span>Custom Tiered Pistachio &amp; Rose Cake</span>
                    <span>$125 / $130</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#E6E0D3] overflow-hidden">
                    <div className="h-full bg-[#111B21] rounded-full" style={{ width: '96%' }} />
                  </div>
                  <div className="text-[12px] text-[#525E66]">
                    Assigned Role: Priya Sharma (Brings Cake &amp; Candles)
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onLaunchApp('party')}
                  className="h-[42px] px-5 rounded-full bg-[#111B21] text-white text-[13px] font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Open Party Pool Planner →
                </button>
                <button
                  type="button"
                  onClick={onOpenInviteModal}
                  className="h-[42px] px-5 rounded-full bg-[#FCFBF7] border border-[#D6CFC0] text-[#111B21] text-[13px] font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Share WhatsApp Invite Link
                </button>
              </div>
            </div>

            {/* Right 6 Cols: Copy */}
            <div className="lg:col-span-6 space-y-5">
              <div className="text-[14px] font-semibold text-[#FF4D8B]">
                04. Group Gift Pools &amp; WhatsApp Circle Invites
              </div>
              <h2
                className="text-[32px] sm:text-[42px] font-bold text-[#111B21] tracking-tight leading-[1.1]"
                style={{ textWrap: 'balance' }}
              >
                Plan surprise parties and split group gifts without awkward spreadsheets.
              </h2>
              <p className="text-[16px] text-[#374248] leading-[1.65] max-w-[58ch]">
                Assign party roles, track guest RSVPs, and let friends chip into shared wishlist gifts with transparent contribution bars. Need missing family birthdays? Send a 1-tap WhatsApp or QR invite link so relatives can add their dates directly to your circle.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onLaunchApp('party')}
                  className="h-[46px] px-6 rounded-full bg-[#FF4D8B] hover:bg-[#e83c78] text-white text-[14px] font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Coordinate a Party Pool</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onOpenInviteModal}
                  className="h-[46px] px-6 rounded-full bg-[#F4EFE6] hover:bg-[#EAE3D5] text-[#111B21] text-[14px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Invite Family Circle
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: ATTRIBUTABLE PROOF & FAMILY STORIES */}
        <section className="max-w-[1280px] mx-auto px-4 sm:px-8 py-12">
          <div className="space-y-8">
            <div className="max-w-2xl space-y-2">
              <div className="text-[13px] font-semibold text-[#525E66]">
                Real Families &amp; Friend Circles
              </div>
              <h2 className="text-[28px] sm:text-[36px] font-bold text-[#111B21] tracking-tight">
                How circles use PookieCal every week.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-[24px] bg-[#F4EFE6] border border-[#E6E0D3] p-6 flex flex-col justify-between space-y-4">
                <p className="text-[15px] text-[#111B21] leading-relaxed">
                  “Before PookieCal, our extended family had birthdays scattered across three WhatsApp groups. Now 28 cousins and aunts are in one calendar, and we haven’t missed a single milestone call in 8 months.”
                </p>
                <div className="pt-3 border-t border-[#E6E0D3] text-[13px] text-[#4A5560]">
                  <strong className="text-[#111B21] font-semibold block">Neha Kulkarni</strong>
                  <span>Family Circle Organizer · Mumbai &amp; Seattle (28 members tracked)</span>
                </div>
              </div>

              <div className="rounded-[24px] bg-[#F4EFE6] border border-[#E6E0D3] p-6 flex flex-col justify-between space-y-4">
                <p className="text-[15px] text-[#111B21] leading-relaxed">
                  “The Diwali and Raksha Bandhan To-Carry checklists saved us during our last home visit. Having sweet boxes, gift hampers, and visit times checked off in one place made the whole weekend effortless.”
                </p>
                <div className="pt-3 border-t border-[#E6E0D3] text-[13px] text-[#4A5560]">
                  <strong className="text-[#111B21] font-semibold block">Rohan &amp; Kriti Verma</strong>
                  <span>Household Planners · Bengaluru (14 festival visits planned)</span>
                </div>
              </div>

              <div className="rounded-[24px] bg-[#F4EFE6] border border-[#E6E0D3] p-6 flex flex-col justify-between space-y-4">
                <p className="text-[15px] text-[#111B21] leading-relaxed">
                  “We used the Party Pool to fund a $250 espresso machine for our teammate’s 30th birthday in two afternoons—plus everyone signed and downloaded a custom greeting card from the Studio.”
                </p>
                <div className="pt-3 border-t border-[#E6E0D3] text-[13px] text-[#4A5560]">
                  <strong className="text-[#111B21] font-semibold block">Daniel Cho</strong>
                  <span>Product Design Lead · San Francisco (9 colleagues in pool)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: HIGH-CONVERTING PRE-FOOTER CALL TO ACTION */}
        <section className="max-w-[1280px] mx-auto px-4 sm:px-8 py-10">
          <div className="rounded-[32px] bg-[#111B21] text-[#FCFBF7] p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-2 max-w-xl">
              <h2
                className="text-[28px] sm:text-[38px] font-bold text-white tracking-tight leading-tight"
                style={{ textWrap: 'balance' }}
              >
                Ready to build your birthday &amp; festival circle?
              </h2>
              <p className="text-[15px] text-[#C8D1D6]">
                Launch the interactive workspace immediately or create your free personal account in under 15 seconds.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onLaunchApp('wall')}
                className="h-[48px] px-7 rounded-full bg-[#FF4D8B] hover:bg-[#e83c78] text-white text-[15px] font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Launch PookieCal App</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onOpenAuthModal('register')}
                className="h-[48px] px-6 rounded-full bg-white/10 hover:bg-white/20 text-white text-[15px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Create Free Account
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* QUIET, HIGH-TRUST EDITORIAL FOOTER */}
      <footer className="mt-12 bg-[#F4EFE6] border-t border-[#E6E0D3] text-[#374248] py-12">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-8 pb-10 text-[14px]">
          <div className="col-span-2 sm:col-span-1 space-y-2.5">
            <div className="text-[19px] font-bold text-[#111B21] tracking-tight">
              PookieCal
            </div>
            <p className="text-[13px] text-[#525E66] leading-relaxed">
              Interactive birthday, cultural festival, family visit &amp; group gift pool planner for your closest circle.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-[13px] font-semibold text-[#111B21]">Application Tools</p>
            <ul className="space-y-1.5 text-[13px] text-[#525E66]">
              <li>
                <button
                  type="button"
                  onClick={() => onLaunchApp('wall')}
                  className="hover:text-[#111B21] cursor-pointer"
                >
                  Birthday Wall &amp; Reminders
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onLaunchApp('events')}
                  className="hover:text-[#111B21] cursor-pointer"
                >
                  Festivals &amp; Family Visits
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onLaunchApp('calendar')}
                  className="hover:text-[#111B21] cursor-pointer"
                >
                  Year-Round Calendar
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-[13px] font-semibold text-[#111B21]">Circle Collaboration</p>
            <ul className="space-y-1.5 text-[13px] text-[#525E66]">
              <li>
                <button
                  type="button"
                  onClick={() => onLaunchApp('party')}
                  className="hover:text-[#111B21] cursor-pointer"
                >
                  Party &amp; Gift Pool
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onLaunchApp('googleHub')}
                  className="hover:text-[#111B21] cursor-pointer"
                >
                  Google Workspace Hub
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenInviteModal}
                  className="hover:text-[#111B21] cursor-pointer"
                >
                  WhatsApp Circle Invites
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-[13px] font-semibold text-[#111B21]">Account &amp; Legal</p>
            <ul className="space-y-1.5 text-[13px] text-[#525E66]">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenAuthModal('register')}
                  className="hover:text-[#111B21] cursor-pointer"
                >
                  Create Account / Sign In
                </button>
              </li>
              <li>
                <a href="/privacy" className="hover:text-[#111B21] underline-offset-4 hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-[#111B21] underline-offset-4 hover:underline">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 pt-6 border-t border-[#E6E0D3] flex flex-wrap items-center justify-between gap-4 text-[12px] text-[#525E66]">
          <span>© {new Date().getFullYear()} PookieCal (www.pookiecal.com). All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-[#111B21] font-medium underline">
              Privacy Policy
            </a>
            <span aria-hidden="true">·</span>
            <a href="/terms" className="hover:text-[#111B21] font-medium underline">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
