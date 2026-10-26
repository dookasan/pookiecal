import React, { useState, useEffect } from 'react';
import {
  Search,
  LogOut,
  AlertTriangle,
  X,
  ExternalLink,
  UserPlus,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { BirthdayPerson, PartyPlan, CustomEvent, InviteRecord } from './types/birthday';
import {
  INITIAL_BIRTHDAYS,
  INITIAL_PARTY_PLAN
} from './utils/defaultData';
import { INITIAL_CUSTOM_EVENTS } from './utils/festivalData';
import { INITIAL_INVITES } from './utils/inviteUtils';
import {
  sortBirthdaysByProximity,
  calculateDaysUntilBirthday
} from './utils/birthdayUtils';
import { BirthdayCard } from './components/BirthdayCard';
import { CardStudioModal } from './components/CardStudioModal';
import { DirectCallModal } from './components/DirectCallModal';
import { PartyPlannerView } from './components/PartyPlannerView';
import { CalendarView } from './components/CalendarView';
import { AddBirthdayModal } from './components/AddBirthdayModal';
import { NotificationBanner } from './components/NotificationBanner';
import { GoogleMemberHubModal } from './components/GoogleMemberHubModal';
import { FestivalsAndEventsView } from './components/FestivalsAndEventsView';
import { AddEventModal } from './components/AddEventModal';
import { InviteModal } from './components/InviteModal';
import { AuthModal } from './components/AuthModal';
import { ClayLogoMark, ClayHeroScene, ClayFooterMountains } from './components/ClayIllustrations';
import { initAuth, googleSignOut, AppUser, getActiveLocalSession } from './utils/googleAuth';

const HUB_CARD_VARIANTS = [
  'feature-card-lavender',
  'feature-card-peach',
  'feature-card-ochre',
  'feature-card-cream',
  'feature-card-pink',
  'feature-card-teal'
];

function getStorageKey(baseKey: string, uid?: string | null) {
  return uid ? `${baseKey}_${uid}` : baseKey;
}

function loadUserBirthdays(uid?: string | null): BirthdayPerson[] {
  try {
    const saved = localStorage.getItem(getStorageKey('celebr_aite_birthdays', uid));
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((p: BirthdayPerson) => {
        const initial = INITIAL_BIRTHDAYS.find((i) => i.id === p.id);
        if (initial && (!p.googleProfile || !p.googleConnected)) {
          return {
            ...p,
            googleConnected: initial.googleConnected ?? true,
            googleProfile: initial.googleProfile
          };
        }
        return p;
      });
    }
  } catch {
    // fallback
  }
  return INITIAL_BIRTHDAYS;
}

function loadUserPartyPlan(uid?: string | null): PartyPlan {
  try {
    const saved = localStorage.getItem(getStorageKey('celebr_aite_party_plan', uid));
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  return INITIAL_PARTY_PLAN;
}

function loadUserEvents(uid?: string | null): CustomEvent[] {
  try {
    const saved = localStorage.getItem(getStorageKey('celebr_aite_events', uid));
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  return INITIAL_CUSTOM_EVENTS;
}

function loadUserInvites(uid?: string | null): InviteRecord[] {
  try {
    const saved = localStorage.getItem(getStorageKey('celebr_aite_invites', uid));
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  return INITIAL_INVITES;
}

export default function App() {
  // User Auth State
  const [googleUser, setGoogleUser] = useState<AppUser | null>(() => getActiveLocalSession());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'register'>('register');
  const [authError, setAuthError] = useState<{
    code?: string;
    title: string;
    message: string;
    actionUrl?: string;
    actionLabel?: string;
  } | null>(null);

  // Per-User Persistence
  const [birthdays, setBirthdays] = useState<BirthdayPerson[]>(() =>
    loadUserBirthdays(getActiveLocalSession()?.uid)
  );
  const [partyPlan, setPartyPlan] = useState<PartyPlan>(() =>
    loadUserPartyPlan(getActiveLocalSession()?.uid)
  );
  const [events, setEvents] = useState<CustomEvent[]>(() =>
    loadUserEvents(getActiveLocalSession()?.uid)
  );
  const [invites, setInvites] = useState<InviteRecord[]>(() =>
    loadUserInvites(getActiveLocalSession()?.uid)
  );

  useEffect(() => {
    initAuth(
      (user) => {
        setGoogleUser(user);
        setBirthdays(loadUserBirthdays(user.uid));
        setPartyPlan(loadUserPartyPlan(user.uid));
        setEvents(loadUserEvents(user.uid));
        setInvites(loadUserInvites(user.uid));
      },
      () => {
        setGoogleUser(null);
      }
    );
  }, []);

  const handleOpenAuthModal = (mode: 'signin' | 'register' = 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: AppUser, isNewRegistration?: boolean, startEmpty?: boolean) => {
    setGoogleUser(user);
    setAuthError(null);
    if (isNewRegistration && startEmpty) {
      setBirthdays([]);
      setEvents([]);
      try {
        localStorage.setItem(getStorageKey('celebr_aite_birthdays', user.uid), JSON.stringify([]));
        localStorage.setItem(getStorageKey('celebr_aite_events', user.uid), JSON.stringify([]));
      } catch {
        // ignore
      }
    } else {
      setBirthdays(loadUserBirthdays(user.uid));
      setPartyPlan(loadUserPartyPlan(user.uid));
      setEvents(loadUserEvents(user.uid));
      setInvites(loadUserInvites(user.uid));
    }
  };

  const handleClearSampleData = () => {
    setBirthdays([]);
    setEvents([]);
  };

  const handleRestoreSampleData = () => {
    setBirthdays(INITIAL_BIRTHDAYS);
    setEvents(INITIAL_CUSTOM_EVENTS);
  };

  const handleGoogleSignOut = async () => {
    await googleSignOut();
    setGoogleUser(null);
    setBirthdays(loadUserBirthdays(null));
    setPartyPlan(loadUserPartyPlan(null));
    setEvents(loadUserEvents(null));
    setInvites(loadUserInvites(null));
  };

  useEffect(() => {
    try {
      localStorage.setItem(
        getStorageKey('celebr_aite_birthdays', googleUser?.uid),
        JSON.stringify(birthdays)
      );
    } catch {
      // ignore
    }
  }, [birthdays, googleUser?.uid]);

  useEffect(() => {
    try {
      localStorage.setItem(
        getStorageKey('celebr_aite_party_plan', googleUser?.uid),
        JSON.stringify(partyPlan)
      );
    } catch {
      // ignore
    }
  }, [partyPlan, googleUser?.uid]);

  useEffect(() => {
    try {
      localStorage.setItem(
        getStorageKey('celebr_aite_events', googleUser?.uid),
        JSON.stringify(events)
      );
    } catch {
      // ignore
    }
  }, [events, googleUser?.uid]);

  const handleAddEvent = (newEvent: CustomEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
  };

  const handleUpdateEvent = (updated: CustomEvent) => {
    setEvents((prev) => {
      const exists = prev.some((e) => e.id === updated.id);
      if (exists) {
        return prev.map((e) => (e.id === updated.id ? updated : e));
      }
      return [updated, ...prev];
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  useEffect(() => {
    try {
      localStorage.setItem(
        getStorageKey('celebr_aite_invites', googleUser?.uid),
        JSON.stringify(invites)
      );
    } catch {
      // ignore
    }
  }, [invites, googleUser?.uid]);

  const handleAddInvite = (newInvite: InviteRecord) => {
    setInvites((prev) => [newInvite, ...prev]);
  };

  const handleUpdateInvite = (updated: InviteRecord) => {
    setInvites((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  // Check URL query parameters for incoming invitee (?invite=... or ?by=...)
  const [inviteeBanner, setInviteeBanner] = useState<{ code: string; inviter: string } | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const inviteCode = params.get('invite');
      const inviter = params.get('by');
      if (inviteCode || inviter) {
        setInviteeBanner({
          code: inviteCode || 'FAMILY-CIRCLE',
          inviter: inviter || 'Your Family Member'
        });
      }
    } catch {
      // ignore
    }
  }, []);

  // UI state
  const [activeTab, setActiveTab] = useState<'wall' | 'events' | 'googleHub' | 'party' | 'calendar'>('wall');
  const [relationshipFilter, setRelationshipFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedForCard, setSelectedForCard] = useState<BirthdayPerson | null>(null);
  const [selectedForCall, setSelectedForCall] = useState<BirthdayPerson | null>(null);
  const [selectedForGoogleHub, setSelectedForGoogleHub] = useState<BirthdayPerson | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Sorting & Filtering
  const sortedBirthdays = sortBirthdaysByProximity(birthdays);

  const filteredBirthdays = sortedBirthdays.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (person.notes && person.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (person.favoriteThings && person.favoriteThings.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesRel =
      relationshipFilter === 'all' || person.relationship === relationshipFilter;

    return matchesSearch && matchesRel;
  });

  const upcomingThisWeek = birthdays.filter((b) => {
    const days = calculateDaysUntilBirthday(b.birthDate);
    return days >= 0 && days <= 7;
  });

  const nextPerson = sortedBirthdays[0];
  const nextPersonDays = nextPerson ? calculateDaysUntilBirthday(nextPerson.birthDate) : 1;

  const handleAddPerson = (newPerson: BirthdayPerson) => {
    setBirthdays((prev) => [newPerson, ...prev]);
  };

  const handleOpenCardStudio = (person: BirthdayPerson) => {
    setSelectedForCard(person);
  };

  const handleOpenCallModal = (person: BirthdayPerson) => {
    setSelectedForCall(person);
  };

  const handleOpenGoogleHub = (person: BirthdayPerson) => {
    setSelectedForGoogleHub(person);
  };

  return (
    <div className="min-h-screen bg-[#fffaf0] text-[#0a0a0a] flex flex-col antialiased selection:bg-[#0a0a0a] selection:text-[#ffffff]">
      {/* Clay Top Navigation (`top-nav` — 64px tall, #fffaf0 background) */}
      <header className="sticky top-0 z-40 h-16 bg-[#fffaf0]/95 backdrop-blur-xs border-b border-[#e5e5e5]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-full flex items-center justify-between gap-6">
          {/* Left: Clay Logo + PookieCal Wordmark */}
          <button
            onClick={() => setActiveTab('wall')}
            className="flex items-center gap-2.5 text-[#0a0a0a] cursor-pointer shrink-0"
          >
            <ClayLogoMark />
            <span className="text-[20px] font-medium tracking-[-0.5px]">PookieCal</span>
          </button>

          {/* Center: Horizontal Navigation Menu (`{typography.nav-link}` Inter 14px / 500) */}
          <nav aria-label="Main Navigation" className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
            {[
              { id: 'wall', label: 'Birthdays' },
              { id: 'events', label: 'Festivals & Visits' },
              { id: 'googleHub', label: 'Google Hub' },
              { id: 'party', label: 'Party Pool' },
              { id: 'calendar', label: 'Calendar' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#f5f0e0] text-[#0a0a0a]'
                    : 'text-[#6a6a6a]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right: "Sign in / Register" + "+ Add Birthday" (`button-primary`) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {googleUser ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f5f0e0] text-[13px] font-medium text-[#0a0a0a]">
                <span className="w-2 h-2 rounded-full bg-[#2e9e6b]"></span>
                <span className="truncate max-w-[110px] font-semibold">
                  {googleUser.displayName || googleUser.email || 'Member'}
                </span>
                <button
                  onClick={handleGoogleSignOut}
                  title="Sign out"
                  className="text-[#6a6a6a] hover:text-[#0a0a0a] cursor-pointer ml-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenAuthModal('signin')}
                  className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#0a0a0a] px-3 py-2 rounded-full hover:bg-[#f5f0e0] transition-colors cursor-pointer"
                >
                  <span>Sign in</span>
                </button>
                <button
                  onClick={() => handleOpenAuthModal('register')}
                  className="hidden sm:inline-flex items-center gap-1.5 h-[40px] px-4 rounded-full bg-[#f5f0e0] hover:bg-[#eae3ce] text-[#0a0a0a] text-[13px] font-semibold transition-colors cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>
            )}

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="h-[44px] px-4 sm:px-5 bg-[#0a0a0a] text-[#ffffff] text-[13px] sm:text-[14px] font-semibold rounded-[12px] whitespace-nowrap shrink-0 cursor-pointer"
            >
              + Add Birthday
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container (max-w-[1280px]) */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Auth Error Banner with Action Link */}
        {authError && (
          <div className="mb-6 p-4 sm:p-5 rounded-[16px] bg-[#fff0f3] border border-[#ff4d8b]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-2 rounded-full bg-[#ff4d8b]/15 text-[#ff4d8b] shrink-0 mt-0.5 sm:mt-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[15px] font-semibold text-[#0a0a0a]">
                  {authError.title}
                </h4>
                <p className="text-[13px] text-[#4a4a4a] mt-0.5 leading-relaxed">
                  {authError.message}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {authError.actionUrl && (
                <a
                  href={authError.actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 h-[38px] px-4 bg-[#0a0a0a] text-white text-[13px] font-semibold rounded-[10px] hover:bg-[#222] transition-colors"
                >
                  <span>{authError.actionLabel || 'Fix in Console'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={() => setAuthError(null)}
                className="h-[38px] px-2.5 text-[#6a6a6a] hover:text-[#0a0a0a] cursor-pointer"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        {/* Invitee Welcome Banner */}
        {inviteeBanner && (
          <div className="mb-6 px-5 py-4 rounded-[16px] bg-[#f5f0e0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-[14px] text-[#1a1a1a]">
              Invited by <strong className="font-semibold text-[#0a0a0a]">{inviteeBanner.inviter}</strong> — join the shared circle to sync birthdays and visits.
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="h-[40px] px-4 bg-[#0a0a0a] text-white font-semibold text-[13px] rounded-[12px] whitespace-nowrap cursor-pointer"
              >
                Accept Invite
              </button>
              <button
                onClick={() => setInviteeBanner(null)}
                className="p-1.5 text-[#6a6a6a] text-xs cursor-pointer"
                aria-label="Dismiss invite banner"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* View 1: Birthday Wall with Clay Hero Band & 6-Color Saturated Feature Cards */}
        {activeTab === 'wall' && (
          <div className="space-y-12">
            {/* Clay Hero Band (`hero-band` — 7/5 grid: Display Headline left, 3D Claymation Illustration right) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f5f0e0] text-[#0a0a0a] text-[12px] font-semibold uppercase tracking-[1.5px]">
                  <span>BIRTHDAYS · FESTIVALS · VISITS</span>
                </div>

                <h1 className="clay-display-lg text-[40px] sm:text-[56px] text-[#0a0a0a]">
                  Celebrate your circle with warmth, never miss a moment.
                </h1>

                <p className="text-[16px] text-[#3a3a3a] leading-[1.55] max-w-xl">
                  Track family birthdays, cultural festivals, carry-sweets checklists, and group gift pools in one playful workspace.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="h-[44px] px-5 bg-[#0a0a0a] text-[#ffffff] text-[14px] font-semibold rounded-[12px] cursor-pointer"
                  >
                    + Add Birthday
                  </button>
                  <button
                    onClick={() => setIsAddEventModalOpen(true)}
                    className="h-[44px] px-5 bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] text-[14px] font-semibold rounded-[12px] cursor-pointer"
                  >
                    + Plan Visit / Event
                  </button>
                  <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="h-[44px] px-5 bg-[#f5f0e0] text-[#0a0a0a] text-[14px] font-semibold rounded-[12px] cursor-pointer"
                  >
                    Invite Circle ({invites.length})
                  </button>
                </div>
              </div>

              {/* Right 5-col: `hero-illustration-card` with 3D Claymation Scene */}
              <div className="lg:col-span-5">
                <ClayHeroScene
                  totalBirthdays={birthdays.length}
                  upcomingCount={upcomingThisWeek.length}
                  eventsCount={events.length}
                  nextPersonName={nextPerson?.name}
                  nextPersonDays={nextPersonDays}
                />
              </div>
            </section>

            {/* Notification Alert Bar */}
            <NotificationBanner
              birthdays={birthdays}
              events={events}
              onOpenCardStudio={handleOpenCardStudio}
              onOpenCallModal={handleOpenCallModal}
              onViewEvents={() => setActiveTab('events')}
            />

            {/* Filter & Search Bar (`text-input` + `category-tab`) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-[#6a6a6a] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search people, notes, or likes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-[44px] pl-10 pr-4 text-[15px] bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] focus:border-[#0a0a0a] rounded-[12px] focus:outline-none"
                  />
                </div>

                {/* Pill Category Tabs (`category-tab` / `category-tab-active`) */}
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'family', label: 'Family' },
                    { id: 'friend', label: 'Friends' },
                    { id: 'partner', label: 'Partner' },
                    { id: 'colleague', label: 'Work' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setRelationshipFilter(item.id)}
                      className={`px-4 py-2 text-[14px] font-medium rounded-full whitespace-nowrap shrink-0 cursor-pointer ${
                        relationshipFilter === item.id
                          ? 'bg-[#f5f0e0] text-[#0a0a0a]'
                          : 'text-[#6a6a6a]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {birthdays.length > 0 ? (
                  <button
                    onClick={handleClearSampleData}
                    title="Clear sample contacts to start with an empty workspace"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#f5f0e0] hover:bg-[#eae3ce] text-[#3a3a3a] text-[12px] font-semibold cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Start Fresh (Clear All)</span>
                  </button>
                ) : (
                  <button
                    onClick={handleRestoreSampleData}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#f5f0e0] hover:bg-[#eae3ce] text-[#0a0a0a] text-[12px] font-semibold cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Load Sample Circle</span>
                  </button>
                )}
              </div>
            </div>

            {/* 3-Up Saturated Feature Card Grid (`pink -> teal -> lavender -> peach -> ochre -> cream`) */}
            {filteredBirthdays.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBirthdays.map((person, index) => (
                  <BirthdayCard
                    key={person.id}
                    person={person}
                    colorIndex={index}
                    onOpenCallModal={handleOpenCallModal}
                    onOpenCardStudio={handleOpenCardStudio}
                    onOpenGoogleHub={handleOpenGoogleHub}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-[#f5f0e0] rounded-[24px] p-12 text-center max-w-md mx-auto space-y-3">
                <h4 className="font-semibold text-[#0a0a0a] text-[18px]">
                  {birthdays.length === 0 ? 'Your circle is ready!' : 'No matches found'}
                </h4>
                <p className="text-[14px] text-[#3a3a3a]">
                  {birthdays.length === 0
                    ? 'Add your first family member or friend birthday to start celebrating.'
                    : `No people match "${searchQuery}".`}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                  {birthdays.length === 0 ? (
                    <>
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="h-[44px] px-5 bg-[#0a0a0a] text-white text-[14px] font-semibold rounded-[12px] cursor-pointer"
                      >
                        + Add First Birthday
                      </button>
                      <button
                        onClick={handleRestoreSampleData}
                        className="h-[44px] px-4 bg-[#fffaf0] border border-[#e5e5e5] text-[#0a0a0a] text-[13px] font-semibold rounded-[12px] cursor-pointer"
                      >
                        Load Sample Circle
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setRelationshipFilter('all');
                      }}
                      className="h-[44px] px-5 bg-[#0a0a0a] text-white text-[14px] font-semibold rounded-[12px] cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* View 2: Google Member Hub */}
        {activeTab === 'googleHub' && (
          <div className="space-y-10">
            {/* Clay Editorial Header + Summary Band */}
            <div className="bg-[#faf5e8] border border-[#e5e5e5] rounded-[24px] p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#f5f0e0] border border-[#e5e5e5] text-[12px] font-semibold uppercase tracking-[1.5px] text-[#0a0a0a]">
                    CONNECTED WORKSPACE
                  </span>
                  <h2 className="clay-display-md text-[32px] sm:text-[40px] text-[#0a0a0a]">
                    Google Workspace Hub
                  </h2>
                  <p className="text-[15px] text-[#3a3a3a] max-w-2xl">
                    Synced Gmail threads, Google Chat conversations, shared Google Photos albums, and YouTube channels for everyone in your circle.
                  </p>
                </div>

                {!googleUser ? (
                  <button
                    onClick={() => handleOpenAuthModal('signin')}
                    className="h-[44px] px-5 bg-[#0a0a0a] text-white text-[14px] font-semibold rounded-[12px] shrink-0 whitespace-nowrap cursor-pointer"
                  >
                    Sign In / Connect Account
                  </button>
                ) : (
                  <span className="px-4 py-2 rounded-full bg-[#a4d4c5] text-[#0a0a0a] text-[13px] font-semibold shrink-0">
                    Signed In · {googleUser.email || googleUser.displayName}
                  </span>
                )}
              </div>

              {/* 4-Up Clay Overview Pills */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="bg-[#fffaf0] border border-[#e5e5e5] rounded-[16px] p-4">
                  <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[#6a6a6a]">
                    MEMBERS LINKED
                  </span>
                  <p className="clay-display-sm text-[26px] text-[#0a0a0a] mt-0.5">
                    {birthdays.length} Profiles
                  </p>
                </div>
                <div className="bg-[#fffaf0] border border-[#e5e5e5] rounded-[16px] p-4">
                  <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[#6a6a6a]">
                    GMAIL THREADS
                  </span>
                  <p className="clay-display-sm text-[26px] text-[#0a0a0a] mt-0.5">
                    {birthdays.reduce((acc, b) => acc + (b.googleProfile?.recentEmails.length || 0), 0)} Emails
                  </p>
                </div>
                <div className="bg-[#fffaf0] border border-[#e5e5e5] rounded-[16px] p-4">
                  <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[#6a6a6a]">
                    GOOGLE CHATS
                  </span>
                  <p className="clay-display-sm text-[26px] text-[#0a0a0a] mt-0.5">
                    {birthdays.reduce((acc, b) => acc + (b.googleProfile?.chatConversations.length || 0), 0)} Messages
                  </p>
                </div>
                <div className="bg-[#fffaf0] border border-[#e5e5e5] rounded-[16px] p-4">
                  <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[#6a6a6a]">
                    SHARED PHOTOS
                  </span>
                  <p className="clay-display-sm text-[26px] text-[#0a0a0a] mt-0.5">
                    {birthdays.reduce((acc, b) => acc + (b.googleProfile?.sharedPhotos.length || 0), 0)} Memories
                  </p>
                </div>
              </div>
            </div>

            {/* 6-Color Saturated Feature Cards with Embedded Product Mockup Fragments */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {birthdays.map((person, idx) => {
                const prof = person.googleProfile;
                const cardClass = HUB_CARD_VARIANTS[idx % HUB_CARD_VARIANTS.length];
                const isDark = cardClass === 'feature-card-pink' || cardClass === 'feature-card-teal';
                const latestEmail = prof?.recentEmails?.[0];
                const latestChat = prof?.chatConversations?.[prof.chatConversations.length - 1];

                return (
                  <div
                    key={person.id}
                    className={`${cardClass} p-6 sm:p-7 flex flex-col justify-between gap-5`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-full bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] flex items-center justify-center text-xl shrink-0">
                          {person.avatarEmoji || '👤'}
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-semibold text-[18px] truncate">{person.name}</h4>
                          <p className={`text-[13px] truncate ${isDark ? 'text-white/80' : 'text-[#3a3a3a]'}`}>
                            {prof?.googleEmail || person.email || 'Google Account Linked'}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase shrink-0 ${
                          isDark
                            ? 'bg-white/20 text-white'
                            : 'bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5]'
                        }`}
                      >
                        {person.relationship}
                      </span>
                    </div>

                    {/* Embedded Product Mockup Card (`product-mockup-card` — #fffaf0 surface inside saturated card) */}
                    <div className="bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] rounded-[16px] p-4 space-y-3">
                      <div className="flex items-center justify-between text-[12px] font-semibold text-[#3a3a3a] pb-2 border-b border-[#e5e5e5] tabular-nums">
                        <span>{prof?.recentEmails?.length || 0} Gmail</span>
                        <span>·</span>
                        <span>{prof?.chatConversations?.length || 0} Chat</span>
                        <span>·</span>
                        <span>{prof?.sharedPhotos?.length || 0} Photos</span>
                      </div>

                      {latestEmail && (
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-semibold uppercase tracking-[1px] text-[#6a6a6a]">
                            Latest Gmail
                          </p>
                          <p className="text-[13px] font-semibold text-[#0a0a0a] truncate">
                            {latestEmail.subject}
                          </p>
                        </div>
                      )}

                      {latestChat && (
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-semibold uppercase tracking-[1px] text-[#6a6a6a]">
                            Google Chat
                          </p>
                          <p className="text-[12px] text-[#3a3a3a] truncate">
                            "{latestChat.text}"
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleOpenGoogleHub(person)}
                      className={`w-full h-[44px] rounded-[12px] font-semibold text-[14px] cursor-pointer ${
                        isDark ? 'bg-[#ffffff] text-[#0a0a0a]' : 'bg-[#0a0a0a] text-[#ffffff]'
                      }`}
                    >
                      Open Member Hub →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* View 3: Festivals, Visits & Preparation Checklists */}
        {activeTab === 'events' && (
          <FestivalsAndEventsView
            events={events}
            contacts={birthdays}
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            onAddEventClick={() => setIsAddEventModalOpen(true)}
            onOpenCallModal={handleOpenCallModal}
          />
        )}

        {/* View 4: Collaborative Party Planner */}
        {activeTab === 'party' && (
          <PartyPlannerView
            partyPlan={partyPlan}
            birthdays={birthdays}
            onUpdatePartyPlan={setPartyPlan}
            onOpenCallModal={handleOpenCallModal}
          />
        )}

        {/* View 5: Calendar */}
        {activeTab === 'calendar' && (
          <CalendarView
            birthdays={birthdays}
            events={events}
            onOpenCardStudio={handleOpenCardStudio}
            onOpenCallModal={handleOpenCallModal}
            onSelectEvent={() => setActiveTab('events')}
          />
        )}

        {/* Pre-Footer Illustrated CTA Band (`cta-band-illustrated`) */}
        <section className="mt-20 bg-[#faf5e8] border border-[#e5e5e5] rounded-[24px] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="clay-display-md text-[28px] sm:text-[36px] text-[#0a0a0a]">
              Bring your whole family & friend circle together.
            </h2>
            <p className="text-[15px] text-[#3a3a3a]">
              Share your invite link on WhatsApp so everyone can add birthdays, plan festival visits, and chip into group gifts.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="h-[44px] px-6 bg-[#0a0a0a] text-[#ffffff] text-[14px] font-semibold rounded-[12px] cursor-pointer"
            >
              Invite Circle
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="h-[44px] px-6 bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] text-[14px] font-semibold rounded-[12px] cursor-pointer"
            >
              + Add Birthday
            </button>
          </div>
        </section>
      </main>

      {/* Cream-Tinted Footer (`footer` — #faf5e8 background, NEVER dark, with 3D Clay Mountain Horizon) */}
      <footer className="mt-16 bg-[#faf5e8] border-t border-[#e5e5e5] text-[#3a3a3a] pt-14">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-8 pb-8 text-[14px]">
          <div className="col-span-2 sm:col-span-1 space-y-2">
            <div className="flex items-center gap-2 text-[#0a0a0a]">
              <ClayLogoMark />
              <span className="text-[18px] font-medium tracking-[-0.5px]">PookieCal</span>
            </div>
            <p className="text-[13px] text-[#6a6a6a]">
              Warm birthday, festival & family visit planner.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-[12px] font-semibold uppercase tracking-[1.5px] text-[#0a0a0a]">Workspace</p>
            <ul className="space-y-1.5 text-[14px] text-[#6a6a6a]">
              <li><button onClick={() => setActiveTab('wall')} className="hover:text-[#0a0a0a] cursor-pointer">Birthdays</button></li>
              <li><button onClick={() => setActiveTab('events')} className="hover:text-[#0a0a0a] cursor-pointer">Festivals & Visits</button></li>
              <li><button onClick={() => setActiveTab('calendar')} className="hover:text-[#0a0a0a] cursor-pointer">Calendar</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-[12px] font-semibold uppercase tracking-[1.5px] text-[#0a0a0a]">Collaborate</p>
            <ul className="space-y-1.5 text-[14px] text-[#6a6a6a]">
              <li><button onClick={() => setActiveTab('party')} className="hover:text-[#0a0a0a] cursor-pointer">Party Pool</button></li>
              <li><button onClick={() => setActiveTab('googleHub')} className="hover:text-[#0a0a0a] cursor-pointer">Google Hub</button></li>
              <li><button onClick={() => setIsInviteModalOpen(true)} className="hover:text-[#0a0a0a] cursor-pointer">Invite Circle</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-[12px] font-semibold uppercase tracking-[1.5px] text-[#0a0a0a]">Quick Actions</p>
            <ul className="space-y-1.5 text-[14px] text-[#6a6a6a]">
              <li><button onClick={() => setIsAddModalOpen(true)} className="hover:text-[#0a0a0a] cursor-pointer">+ Add Birthday</button></li>
              <li><button onClick={() => setIsAddEventModalOpen(true)} className="hover:text-[#0a0a0a] cursor-pointer">+ Plan Visit</button></li>
            </ul>
          </div>
        </div>

        {/* Clay's Signature Horizon 3D Mountain Illustration */}
        <ClayFooterMountains />
      </footer>

      {/* Modals */}
      {selectedForCard && (
        <CardStudioModal
          key={selectedForCard.id}
          person={selectedForCard}
          onClose={() => setSelectedForCard(null)}
          onOpenCallModal={handleOpenCallModal}
        />
      )}

      {selectedForCall && (
        <DirectCallModal
          key={selectedForCall.id}
          person={selectedForCall}
          onClose={() => setSelectedForCall(null)}
          onOpenCardStudio={handleOpenCardStudio}
        />
      )}

      {selectedForGoogleHub && (
        <GoogleMemberHubModal
          key={selectedForGoogleHub.id}
          person={selectedForGoogleHub}
          allContacts={birthdays}
          onSelectPerson={(m) => setSelectedForGoogleHub(m)}
          onClose={() => setSelectedForGoogleHub(null)}
          onUpdatePerson={(updated) => {
            setBirthdays((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
            setSelectedForGoogleHub(updated);
          }}
          onOpenCardStudio={(m) => {
            setSelectedForGoogleHub(null);
            setSelectedForCard(m);
          }}
          onAddGiftToPartyPool={(giftTitle, estimatedPrice, personName) => {
            setPartyPlan((prev) => ({
              ...prev,
              wishlist: [
                {
                  id: `wish-${Date.now()}`,
                  title: `${giftTitle} (for ${personName})`,
                  price: estimatedPrice,
                  claimedBy: ''
                },
                ...prev.wishlist
              ]
            }));
          }}
          googleUser={googleUser}
          onConnectGoogleAccount={() => handleOpenAuthModal('signin')}
        />
      )}

      <AddBirthdayModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPerson={handleAddPerson}
      />

      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        onAddEvent={handleAddEvent}
        contacts={birthdays}
      />

      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        invites={invites}
        onAddInvite={handleAddInvite}
        onUpdateInvite={handleUpdateInvite}
        onAddBirthdayPerson={handleAddPerson}
        senderName={googleUser?.displayName || 'Your Circle'}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
