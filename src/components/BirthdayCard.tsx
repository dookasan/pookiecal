import React from 'react';
import { Phone, MessageCircle, Calendar } from 'lucide-react';
import { BirthdayPerson } from '../types/birthday';
import {
  calculateDaysUntilBirthday,
  isBirthdayToday,
  calculateUpcomingAge,
  isMilestoneAge,
  getZodiacSign,
  getDirectCallUri,
  getWhatsAppShareUrl,
  getGoogleCalendarLink,
  formatRelationship
} from '../utils/birthdayUtils';

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
  const daysLeft = calculateDaysUntilBirthday(person.birthDate);
  const isToday = isBirthdayToday(person.birthDate);
  const age = calculateUpcomingAge(person.birthDate);
  const isMilestone = isMilestoneAge(age);
  const zodiac = getZodiacSign(person.birthDate);

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

  return (
    <div
      className={`${variant.bgClass} p-6 sm:p-7 flex flex-col justify-between transition-transform`}
    >
      <div>
        {/* Top Row: Avatar, Name & Pill Countdown Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-full bg-[#fffaf0] text-[#0a0a0a] flex items-center justify-center text-xl shrink-0 border border-[#e5e5e5]">
              {person.avatarEmoji || '🎂'}
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

          {/* Badge Pill */}
          <span className={`px-3 py-1 rounded-full text-[13px] font-medium tabular-nums shrink-0 ${variant.badgeBg}`}>
            {isToday ? 'Today!' : daysLeft === 1 ? 'Tomorrow' : `${daysLeft}d · ${formattedDate}`}
          </span>
        </div>

        {/* Embedded Product UI Fragment (`product-mockup-card`) */}
        <div className="mt-5 bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] rounded-[16px] p-4 space-y-2">
          {person.notes ? (
            <p className="text-[14px] text-[#3a3a3a] line-clamp-2 leading-[1.45]">
              {person.notes}
            </p>
          ) : (
            <p className="text-[14px] text-[#6a6a6a]">
              Birthday reminder scheduled for {formattedDate}.
            </p>
          )}

          {person.favoriteThings && person.favoriteThings.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {person.favoriteThings.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full bg-[#f5f0e0] text-[#0a0a0a] text-[12px] font-medium"
                >
                  {item}
                </span>
              ))}
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
              className="h-10 px-3 rounded-full bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] text-[13px] font-medium whitespace-nowrap"
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
