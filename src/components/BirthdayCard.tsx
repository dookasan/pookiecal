import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  Gift,
  Sparkles,
  Loader2,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { BirthdayPerson } from '../types/birthday';
import {
  calculateDaysUntilBirthday,
  calculateExactTimeUntilBirthday,
  isBirthdayToday,
  calculateUpcomingAge,
  isMilestoneAge,
  getZodiacSign,
  getDirectCallUri,
  getWhatsAppShareUrl,
  getGoogleCalendarLink,
  formatRelationship,
  getPersonRealisticPortrait,
  getFallbackPortraitDataUrl,
  getCelebrationBannerImage,
  getGiftCategoryImage
} from '../utils/birthdayUtils';
import {
  fetchPersonalizedGiftSuggestion,
  PersonalizedGiftSuggestion
} from '../utils/giftSuggestionClient';

interface BirthdayCardProps {
  person: BirthdayPerson;
  colorIndex?: number;
  onOpenCallModal: (person: BirthdayPerson) => void;
  onOpenCardStudio: (person: BirthdayPerson) => void;
  onOpenGoogleHub?: (person: BirthdayPerson) => void;
  onEditPerson?: (person: BirthdayPerson) => void;
}

const CLAY_CARD_VARIANTS = [
  {
    bgClass: 'feature-card-pink',
    isDarkSurface: true,
    badgeBg: 'bg-white/20 text-white'
  },
  {
    bgClass: 'feature-card-teal',
    isDarkSurface: true,
    badgeBg: 'bg-white/15 text-white'
  },
  {
    bgClass: 'feature-card-lavender',
    isDarkSurface: false,
    badgeBg: 'bg-[#fffaf0]/80 text-[#0a0a0a]'
  },
  {
    bgClass: 'feature-card-peach',
    isDarkSurface: false,
    badgeBg: 'bg-[#fffaf0]/80 text-[#0a0a0a]'
  },
  {
    bgClass: 'feature-card-ochre',
    isDarkSurface: false,
    badgeBg: 'bg-[#fffaf0]/80 text-[#0a0a0a]'
  },
  {
    bgClass: 'feature-card-cream',
    isDarkSurface: false,
    badgeBg: 'bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5]'
  }
];

export const BirthdayCard: React.FC<BirthdayCardProps> = ({
  person,
  colorIndex = 0,
  onOpenCallModal,
  onOpenCardStudio,
  onOpenGoogleHub
}) => {
  const [now, setNow] = useState<Date>(() => new Date());
  const [giftSuggestion, setGiftSuggestion] = useState<PersonalizedGiftSuggestion | null>(null);
  const [isLoadingGift, setIsLoadingGift] = useState(false);
  const [giftError, setGiftError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const triggerMiniConfetti = () => {
    try {
      confetti({
        particleCount: 28,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#FF5722', '#A4D4C5', '#FFB084', '#111B21']
      });
    } catch {
      // ignore in headless environments
    }
  };

  const handleSuggestGift = async () => {
    setIsLoadingGift(true);
    setGiftError(null);
    try {
      const suggestion = await fetchPersonalizedGiftSuggestion(person);
      setGiftSuggestion(suggestion);
      triggerMiniConfetti();
    } catch (err: unknown) {
      setGiftError(
        err instanceof Error ? err.message : 'Unable to generate gift suggestion right now.'
      );
    } finally {
      setIsLoadingGift(false);
    }
  };

  const daysLeft = calculateDaysUntilBirthday(person.birthDate, now);
  const exactCountdown = calculateExactTimeUntilBirthday(person.birthDate, now);
  const isToday = isBirthdayToday(person.birthDate, now);
  const age = calculateUpcomingAge(person.birthDate, now);
  const isMilestone = isMilestoneAge(age);
  const zodiac = getZodiacSign(person.birthDate);
  const portraitUrl = getPersonRealisticPortrait(person, colorIndex);
  const bannerImageUrl = getCelebrationBannerImage(person, colorIndex);

  const [, monthStr, dayStr] = person.birthDate.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedDate = `${monthNames[Number(monthStr) - 1]} ${Number(dayStr)}`;

  const callUri = getDirectCallUri(person.phone);
  const whatsappUrl = getWhatsAppShareUrl(
    person.phone,
    `Happy Birthday ${person.name}! Wishing you all the love and happiness today! 🎂🎉`
  );
  const googleCalLink = getGoogleCalendarLink(person);

  const variant = CLAY_CARD_VARIANTS[colorIndex % CLAY_CARD_VARIANTS.length];
  const subTextColor = variant.isDarkSurface ? 'text-white/85' : 'text-[#3a3a3a]';
  const isSoon = !isToday && daysLeft <= 7;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (colorIndex % 6) * 0.06, ease: 'easeOut' }}
      whileHover={{ y: -5 }}
      className={`${variant.bgClass} p-5 sm:p-6 flex flex-col justify-between group overflow-hidden`}
    >
      <div>
        {/* Animated Scenic Celebration Banner + Overlapping Realistic Portrait */}
        <div className="relative h-28 sm:h-32 rounded-[18px] overflow-hidden border border-black/10 bg-[#111B21]">
          <img
            src={bannerImageUrl}
            alt={`${person.name} celebration backdrop`}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111B21]/80 via-[#111B21]/20 to-transparent" />

          {/* Floating Animated Zodiac & Milestone Pill */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#111B21]/80 backdrop-blur-xs text-[#FCFBF7] text-[11px] font-semibold inline-flex items-center gap-1 border border-white/15"
          >
            <span>{zodiac.symbol}</span>
            <span>{zodiac.sign}</span>
            {isMilestone && <span className="text-[#FFB084]">· Milestone {age}</span>}
          </motion.div>

          {/* Top-Right Date Badge */}
          <span className="absolute top-2.5 right-2.5 px-3 py-1 rounded-full bg-[#FCFBF7]/95 text-[#111B21] text-[12px] font-bold tabular-nums shadow-xs">
            {formattedDate}
          </span>

          {/* Bottom-Left Overlapping Portrait + Name inside Banner */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#111B21] shrink-0 border-2 border-[#FCFBF7] shadow-sm">
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
                <h3 className="text-[17px] font-bold leading-tight truncate drop-shadow-xs">
                  {person.name}
                </h3>
                <div className="flex items-center gap-1.5 text-[12px] text-white/85 font-medium">
                  <span>{formatRelationship(person.relationship)}</span>
                  {age > 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">Turns {age}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Animated Visual Countdown Timer Widget */}
        <div className="mt-3.5 bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] rounded-[16px] p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[1px] text-[#525E66]">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FF5722] animate-pulse" />
              <span>{isToday ? 'Birthday Celebration' : 'Time Until Next Birthday'}</span>
            </span>
            <span className="tabular-nums text-[#0a0a0a]">
              {isToday ? 'Today! 🎂' : isSoon ? 'Coming Up Soon!' : `${exactCountdown.yearProgressPercent}% of year`}
            </span>
          </div>

          {isToday ? (
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="py-2 px-3 rounded-[12px] bg-[#FF5722] text-white text-center font-bold text-[14px] tracking-wide"
            >
              🎉 Happy Birthday Today! Send a Wish Now 🎉
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-[#f5f0e0] border border-[#e5e5e5] rounded-[10px] py-1.5 px-1">
                  <div className="font-mono text-[18px] sm:text-[20px] font-bold text-[#0a0a0a] leading-tight tabular-nums">
                    {String(exactCountdown.days).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.8px] text-[#6a6a6a]">
                    Days
                  </div>
                </div>

                <div className="bg-[#f5f0e0] border border-[#e5e5e5] rounded-[10px] py-1.5 px-1">
                  <div className="font-mono text-[18px] sm:text-[20px] font-bold text-[#0a0a0a] leading-tight tabular-nums">
                    {String(exactCountdown.hours).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.8px] text-[#6a6a6a]">
                    Hrs
                  </div>
                </div>

                <div className="bg-[#f5f0e0] border border-[#e5e5e5] rounded-[10px] py-1.5 px-1">
                  <div className="font-mono text-[18px] sm:text-[20px] font-bold text-[#0a0a0a] leading-tight tabular-nums">
                    {String(exactCountdown.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.8px] text-[#6a6a6a]">
                    Min
                  </div>
                </div>

                <div className="bg-[#f5f0e0] border border-[#e5e5e5] rounded-[10px] py-1.5 px-1">
                  <motion.div
                    key={exactCountdown.seconds}
                    initial={{ scale: 0.9, opacity: 0.75 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="font-mono text-[18px] sm:text-[20px] font-bold text-[#FF5722] leading-tight tabular-nums"
                  >
                    {String(exactCountdown.seconds).padStart(2, '0')}
                  </motion.div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.8px] text-[#6a6a6a]">
                    Sec
                  </div>
                </div>
              </div>

              {/* Visual Progress Bar toward upcoming birthday */}
              <div className="w-full h-1.5 rounded-full bg-[#eae3ce] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${exactCountdown.yearProgressPercent}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="h-full rounded-full bg-[#FF5722]"
                />
              </div>
            </>
          )}
        </div>

        {/* Embedded Product UI Fragment (`product-mockup-card`) */}
        <div className="mt-3 bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] rounded-[16px] p-4 space-y-2.5">
          {person.notes ? (
            <p className="text-[13px] text-[#3a3a3a] line-clamp-2 leading-[1.45]">
              {person.notes}
            </p>
          ) : (
            <p className="text-[13px] text-[#6a6a6a]">
              Birthday reminder scheduled for {formattedDate}.
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            {person.favoriteThings && person.favoriteThings.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5">
                {person.favoriteThings.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full bg-[#f5f0e0] text-[#0a0a0a] text-[12px] font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-[12px] text-[#6a6a6a]">No favorite things listed yet</span>
            )}

            {/* Suggest Gift Button */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={handleSuggestGift}
              disabled={isLoadingGift}
              className="h-[32px] px-3 rounded-full bg-[#FF5722] hover:bg-[#E64A19] disabled:opacity-60 text-white text-[12px] font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              {isLoadingGift ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Suggesting...</span>
                </>
              ) : (
                <>
                  <Gift className="w-3.5 h-3.5" />
                  <span>Suggest Gift</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Animated Gemini Personalized Gift Suggestion Result (with Curated Gift Image) */}
          <AnimatePresence mode="wait">
            {giftError && (
              <motion.div
                key="gift-error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 p-3 rounded-[12px] bg-[#fff3ee] border border-[#ff5722]/30 text-[12px] text-[#0a0a0a] space-y-1 overflow-hidden"
              >
                <p className="font-semibold text-[#FF5722]">Gift Suggestion Notice</p>
                <p className="text-[#3a3a3a] leading-snug">{giftError}</p>
              </motion.div>
            )}

            {giftSuggestion && !giftError && (
              <motion.div
                key={giftSuggestion.title}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28 }}
                className="mt-2 p-3 rounded-[14px] bg-[#f5f0e0] border border-[#e5e5e5] space-y-2.5 overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={getGiftCategoryImage(
                      `${giftSuggestion.title} ${giftSuggestion.matchedInterest}`
                    )}
                    alt={giftSuggestion.title}
                    className="w-14 h-14 rounded-[10px] object-cover border border-[#D6CFC0] shrink-0"
                  />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.8px] text-[#FF5722] truncate">
                        <Sparkles className="w-3 h-3 shrink-0" />
                        <span>Matched to {giftSuggestion.matchedInterest}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#fffaf0] border border-[#e5e5e5] text-[10px] font-mono font-semibold text-[#0a0a0a] shrink-0">
                        {giftSuggestion.priceRange}
                      </span>
                    </div>
                    <h4 className="text-[14px] font-bold text-[#0a0a0a] leading-snug truncate">
                      {giftSuggestion.title}
                    </h4>
                  </div>
                </div>

                <p className="text-[12px] text-[#3a3a3a] leading-relaxed">
                  {giftSuggestion.reason}
                </p>

                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={handleSuggestGift}
                    disabled={isLoadingGift}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3a3a3a] hover:text-[#0a0a0a] cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoadingGift ? 'animate-spin' : ''}`} />
                    <span>Another idea</span>
                  </button>

                  <a
                    href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(
                      giftSuggestion.searchQuery || giftSuggestion.title
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#FF5722] hover:underline"
                  >
                    <span>Shop Gift</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Action Row */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {person.phone ? (
            <a
              href={callUri}
              aria-label={`Call ${person.name} directly`}
              title={`Call ${person.phone}`}
              className="w-10 h-10 rounded-full bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Phone className="w-4 h-4" />
            </a>
          ) : (
            <button
              onClick={() => onOpenCallModal(person)}
              aria-label={`Call ${person.name}`}
              title="Call"
              className="w-10 h-10 rounded-full bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Phone className="w-4 h-4" />
            </button>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Send birthday greeting on WhatsApp to ${person.name}`}
            title="WhatsApp"
            className="w-10 h-10 rounded-full bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] flex items-center justify-center hover:scale-105 transition-transform"
          >
            <MessageCircle className="w-4 h-4" />
          </a>

          <a
            href={googleCalLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Add ${person.name}'s birthday to Google Calendar`}
            title="Google Calendar"
            className="w-10 h-10 rounded-full bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] flex items-center justify-center hover:scale-105 transition-transform"
          >
            <Calendar className="w-4 h-4" />
          </a>

          {onOpenGoogleHub && (
            <button
              onClick={() => onOpenGoogleHub(person)}
              className="h-10 px-3 rounded-full bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] text-[13px] font-medium whitespace-nowrap cursor-pointer hover:scale-105 transition-transform"
            >
              Hub
            </button>
          )}
        </div>

        {/* Button-on-color (white on pink/teal) or Button-primary (#0a0a0a on light cards) */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            triggerMiniConfetti();
            onOpenCardStudio(person);
          }}
          className={`h-[44px] px-5 rounded-[12px] text-[14px] font-semibold leading-none whitespace-nowrap cursor-pointer ${
            variant.isDarkSurface
              ? 'bg-[#ffffff] text-[#0a0a0a]'
              : 'bg-[#0a0a0a] text-[#ffffff]'
          }`}
        >
          {isToday ? 'Send Wish' : 'Wish Studio'}
        </motion.button>
      </div>
    </motion.div>
  );
};
