import React, { useState, useEffect } from 'react';
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
  getFallbackPortraitDataUrl
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

  const handleSuggestGift = async () => {
    setIsLoadingGift(true);
    setGiftError(null);
    try {
      const suggestion = await fetchPersonalizedGiftSuggestion(person);
      setGiftSuggestion(suggestion);
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
    <div
      className={`${variant.bgClass} p-6 sm:p-7 flex flex-col justify-between transition-transform`}
    >
      <div>
        {/* Top Row: Realistic Portrait Avatar, Name & Pill Countdown Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative w-13 h-13 rounded-full overflow-hidden bg-[#111B21] shrink-0 border-2 border-[#fffaf0] shadow-xs">
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

            <div className="min-w-0">
              <h3 className="text-[18px] font-semibold leading-[1.4] truncate">
                {person.name}
              </h3>

              <div className={`flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[13px] font-medium mt-0.5 ${subTextColor}`}>
                <span>{formatRelationship(person.relationship)}</span>
                <span aria-hidden="true">·</span>
                <span>{zodiac.sign}</span>
                {age > 0 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      Turns {age}{isMilestone ? ' ✨' : ''}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Date Pill */}
          <span className={`px-3 py-1 rounded-full text-[13px] font-semibold tabular-nums shrink-0 ${variant.badgeBg}`}>
            {formattedDate}
          </span>
        </div>

        {/* Live Visual Countdown Timer Widget */}
        <div className="mt-4 bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] rounded-[16px] p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[1px] text-[#525E66]">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FF5722]" />
              <span>{isToday ? 'Birthday Celebration' : 'Time Until Next Birthday'}</span>
            </span>
            <span className="tabular-nums text-[#0a0a0a]">
              {isToday ? 'Today! 🎂' : isSoon ? 'Coming Up Soon!' : `${exactCountdown.yearProgressPercent}% of year`}
            </span>
          </div>

          {isToday ? (
            <div className="py-2 px-3 rounded-[12px] bg-[#FF5722] text-white text-center font-bold text-[14px] tracking-wide">
              🎉 Happy Birthday Today! Send a Wish Now 🎉
            </div>
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
                  <div className="font-mono text-[18px] sm:text-[20px] font-bold text-[#FF5722] leading-tight tabular-nums">
                    {String(exactCountdown.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.8px] text-[#6a6a6a]">
                    Sec
                  </div>
                </div>
              </div>

              {/* Visual Progress Bar toward upcoming birthday */}
              <div className="w-full h-1.5 rounded-full bg-[#eae3ce] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#FF5722] transition-all duration-500"
                  style={{ width: `${exactCountdown.yearProgressPercent}%` }}
                />
              </div>
            </>
          )}
        </div>

        {/* Embedded Product UI Fragment (`product-mockup-card`) */}
        <div className="mt-3 bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] rounded-[16px] p-4 space-y-2.5">
          {person.notes ? (
            <p className="text-[14px] text-[#3a3a3a] line-clamp-2 leading-[1.45]">
              {person.notes}
            </p>
          ) : (
            <p className="text-[14px] text-[#6a6a6a]">
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
            <button
              type="button"
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
            </button>
          </div>

          {/* Gemini Personalized Gift Suggestion Result or Error */}
          {giftError && (
            <div className="mt-2 p-3 rounded-[12px] bg-[#fff3ee] border border-[#ff5722]/30 text-[12px] text-[#0a0a0a] space-y-1">
              <p className="font-semibold text-[#FF5722]">Gift Suggestion Notice</p>
              <p className="text-[#3a3a3a] leading-snug">{giftError}</p>
            </div>
          )}

          {giftSuggestion && !giftError && (
            <div className="mt-2 p-3.5 rounded-[14px] bg-[#f5f0e0] border border-[#e5e5e5] space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.8px] text-[#FF5722]">
                    <Sparkles className="w-3 h-3" />
                    <span>Matched to {giftSuggestion.matchedInterest}</span>
                  </div>
                  <h4 className="text-[14px] font-bold text-[#0a0a0a] leading-snug">
                    {giftSuggestion.title}
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#fffaf0] border border-[#e5e5e5] text-[11px] font-mono font-semibold text-[#0a0a0a] shrink-0">
                  {giftSuggestion.priceRange}
                </span>
              </div>

              <p className="text-[12px] text-[#3a3a3a] leading-relaxed">
                {giftSuggestion.reason}
              </p>

              <div className="flex items-center justify-between gap-2 pt-1">
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
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Row */}
      <div className="mt-5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {person.phone ? (
            <a
              href={callUri}
              aria-label={`Call ${person.name} directly`}
              title={`Call ${person.phone}`}
              className="w-10 h-10 rounded-full bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] flex items-center justify-center"
            >
              <Phone className="w-4 h-4" />
            </a>
          ) : (
            <button
              onClick={() => onOpenCallModal(person)}
              aria-label={`Call ${person.name}`}
              title="Call"
              className="w-10 h-10 rounded-full bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] flex items-center justify-center"
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
            className="w-10 h-10 rounded-full bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] flex items-center justify-center"
          >
            <MessageCircle className="w-4 h-4" />
          </a>

          <a
            href={googleCalLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Add ${person.name}'s birthday to Google Calendar`}
            title="Google Calendar"
            className="w-10 h-10 rounded-full bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] flex items-center justify-center"
          >
            <Calendar className="w-4 h-4" />
          </a>

          {onOpenGoogleHub && (
            <button
              onClick={() => onOpenGoogleHub(person)}
              className="h-10 px-3 rounded-full bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] text-[13px] font-medium whitespace-nowrap cursor-pointer"
            >
              Hub
            </button>
          )}
        </div>

        {/* Button-on-color (white on pink/teal) or Button-primary (#0a0a0a on light cards) */}
        <button
          onClick={() => onOpenCardStudio(person)}
          className={`h-[44px] px-5 rounded-[12px] text-[14px] font-semibold leading-none whitespace-nowrap cursor-pointer ${
            variant.isDarkSurface
              ? 'bg-[#ffffff] text-[#0a0a0a]'
              : 'bg-[#0a0a0a] text-[#ffffff]'
          }`}
        >
          {isToday ? 'Send Wish' : 'Wish Studio'}
        </button>
      </div>
    </div>
  );
};
