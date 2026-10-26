import React, { useState, useEffect } from 'react';
import { Phone, ArrowRight } from 'lucide-react';
import { BirthdayPerson, CustomEvent } from '../types/birthday';
import { isBirthdayToday, calculateDaysUntilBirthday } from '../utils/birthdayUtils';
import { calculateDaysUntilDate } from '../utils/festivalUtils';
import { sounds } from '../utils/audioEffects';

interface NotificationBannerProps {
  birthdays: BirthdayPerson[];
  events?: CustomEvent[];
  onOpenCardStudio: (person: BirthdayPerson) => void;
  onOpenCallModal: (person: BirthdayPerson) => void;
  onViewEvents?: () => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  birthdays,
  events = [],
  onOpenCardStudio,
  onOpenCallModal,
  onViewEvents
}) => {
  const [permissionStatus, setPermissionStatus] = useState<string>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const todayBirthdays = birthdays.filter((b) => isBirthdayToday(b.birthDate));
  const tomorrowBirthdays = birthdays.filter((b) => calculateDaysUntilBirthday(b.birthDate) === 1);

  const upcomingVisits = events
    .filter((e) => e.type === 'visit' || e.type === 'festival')
    .map((e) => ({
      ...e,
      days: calculateDaysUntilDate(e.date),
      pendingCarry: e.prepItems.filter((p) => p.category === 'to-carry' && !p.done),
      pendingShop: e.prepItems.filter((p) => p.category === 'to-shop' && !p.done)
    }))
    .filter((e) => e.days >= 0 && e.days <= 10)
    .sort((a, b) => a.days - b.days);

  const nearestVisit = upcomingVisits[0];

  const handleEnableNotifications = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const result = await Notification.requestPermission();
        setPermissionStatus(result);
        if (result === 'granted') {
          sounds.playBirthdayChime();
          new Notification('PookieCal Reminders Active', {
            body: 'Reminders enabled for upcoming birthdays and visits.',
            icon: '/favicon.ico'
          });
        }
      } catch {
        // notification error
      }
    }
  };

  const hasUrgentAlert = todayBirthdays.length > 0 || tomorrowBirthdays.length > 0 || nearestVisit;

  if (!hasUrgentAlert && permissionStatus === 'granted') {
    return null;
  }

  return (
    <div className="bg-[#f5f0e0] rounded-[16px] px-5 py-3.5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3 text-[15px] text-[#1a1a1a] min-w-0">
        {todayBirthdays.length > 0 ? (
          <p className="truncate">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#ff4d8b] text-white text-[12px] font-semibold mr-2">
              TODAY
            </span>
            <strong className="font-semibold text-[#0a0a0a]">{todayBirthdays.map((b) => b.name).join(', ')}</strong>'s birthday
          </p>
        ) : tomorrowBirthdays.length > 0 ? (
          <p className="truncate">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#e8b94a] text-[#0a0a0a] text-[12px] font-semibold mr-2">
              TOMORROW
            </span>
            <strong className="font-semibold text-[#0a0a0a]">{tomorrowBirthdays.map((b) => b.name).join(', ')}</strong>'s birthday
          </p>
        ) : nearestVisit ? (
          <p className="truncate">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#a4d4c5] text-[#0a0a0a] text-[12px] font-semibold mr-2 tabular-nums">
              {nearestVisit.days === 0 ? 'TODAY' : `IN ${nearestVisit.days}D`}
            </span>
            <strong className="font-semibold text-[#0a0a0a]">{nearestVisit.title}</strong>
          </p>
        ) : (
          <p className="text-[#3a3a3a] truncate">
            Enable browser alerts for upcoming birthdays and visits.
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
        {todayBirthdays.length > 0 && (
          <>
            <button
              onClick={() => onOpenCardStudio(todayBirthdays[0])}
              className="h-[40px] px-4 bg-[#0a0a0a] text-white font-semibold rounded-[12px] text-[13px] whitespace-nowrap"
            >
              Send Wish
            </button>

            {todayBirthdays[0].phone && (
              <button
                onClick={() => onOpenCallModal(todayBirthdays[0])}
                className="h-[40px] px-4 bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] font-semibold rounded-[12px] text-[13px] flex items-center gap-1.5 whitespace-nowrap"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {todayBirthdays[0].name.split(' ')[0]}</span>
              </button>
            )}
          </>
        )}

        {nearestVisit && (
          <button
            onClick={onViewEvents}
            className="h-[40px] px-4 bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] font-semibold rounded-[12px] text-[13px] flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <span>Prep Checklist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        {permissionStatus !== 'granted' && (
          <button
            onClick={handleEnableNotifications}
            className="h-[40px] px-3 text-[#3a3a3a] font-medium text-[13px] underline whitespace-nowrap cursor-pointer"
          >
            Enable Alerts
          </button>
        )}
      </div>
    </div>
  );
};
