import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Package
} from 'lucide-react';
import { BirthdayPerson, CustomEvent } from '../types/birthday';

interface CalendarViewProps {
  birthdays: BirthdayPerson[];
  events?: CustomEvent[];
  onOpenCardStudio: (person: BirthdayPerson) => void;
  onOpenCallModal: (person: BirthdayPerson) => void;
  onSelectEvent?: (event: CustomEvent) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  birthdays,
  events = [],
  onOpenCardStudio,
  onSelectEvent
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // Default Oct 2026
  const [filterType, setFilterType] = useState<'all' | 'birthdays' | 'festivals' | 'visits'>('all');

  const monthIndex = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, monthIndex - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, monthIndex + 1, 1));
  };

  const monthBirthdays = birthdays.filter((b) => {
    const [, m] = b.birthDate.split('-').map(Number);
    return m === monthIndex + 1;
  });

  const monthEvents = events.filter((e) => {
    if (!e.date) return false;
    const [ey, em] = e.date.split('-').map(Number);
    return ey === year && em === monthIndex + 1;
  });

  return (
    <div className="bg-[#f5f0e0] rounded-[24px] p-6 sm:p-8 space-y-6">
      {/* Month Navigator & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="clay-display-sm text-[32px] text-[#0a0a0a]">
            {monthNames[monthIndex]} {year}
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-[#3a3a3a] mt-1">
            <span className="px-3 py-1 rounded-full bg-[#ff5722] text-white">
              🎂 {monthBirthdays.length} birthday{monthBirthdays.length === 1 ? '' : 's'}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#e8b94a] text-[#0a0a0a]">
              🪔 {monthEvents.filter((e) => e.type === 'festival').length} festival{monthEvents.filter((e) => e.type === 'festival').length === 1 ? '' : 's'}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#a4d4c5] text-[#0a0a0a]">
              🏡 {monthEvents.filter((e) => e.type === 'visit').length} visit{monthEvents.filter((e) => e.type === 'visit').length === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-[#fffaf0] p-1 rounded-full border border-[#e5e5e5]">
            {[
              { id: 'all', label: 'All' },
              { id: 'birthdays', label: 'Birthdays' },
              { id: 'festivals', label: 'Festivals' },
              { id: 'visits', label: 'Visits' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setFilterType(t.id as typeof filterType)}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium cursor-pointer ${
                  filterType === t.id
                    ? 'bg-[#0a0a0a] text-white'
                    : 'text-[#6a6a6a]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevMonth}
              aria-label="Previous month"
              className="w-10 h-10 rounded-[12px] bg-[#fffaf0] border border-[#e5e5e5] text-[#0a0a0a] flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date(2026, 9, 1))}
              className="h-10 px-4 text-[13px] font-semibold text-[#0a0a0a] bg-[#fffaf0] border border-[#e5e5e5] rounded-[12px] cursor-pointer"
            >
              Oct 2026
            </button>
            <button
              onClick={handleNextMonth}
              aria-label="Next month"
              className="w-10 h-10 rounded-[12px] bg-[#fffaf0] border border-[#e5e5e5] text-[#0a0a0a] flex items-center justify-center cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid inside Product-Mockup-Card */}
      <div className="bg-[#fffaf0] border border-[#e5e5e5] rounded-[16px] p-4 sm:p-6">
        <div className="grid grid-cols-7 gap-2 mb-3 text-center text-[12px] font-semibold uppercase tracking-[1.5px] text-[#6a6a6a]">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[88px] sm:min-h-[108px] rounded-[12px] bg-[#faf5e8] p-1.5" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;

            const dayBirthdays = monthBirthdays.filter((b) => {
              const [, , d] = b.birthDate.split('-').map(Number);
              return d === dayNum;
            });

            const dayEvents = monthEvents.filter((e) => {
              const [, , ed] = e.date.split('-').map(Number);
              return ed === dayNum;
            });

            const showBirthdays = filterType === 'all' || filterType === 'birthdays';
            const showFestivals = filterType === 'all' || filterType === 'festivals';
            const showVisits = filterType === 'all' || filterType === 'visits';

            const filteredDayEvents = dayEvents.filter((e) => {
              if (e.type === 'festival') return showFestivals;
              if (e.type === 'visit') return showVisits;
              return filterType === 'all';
            });

            const totalItemsCount = (showBirthdays ? dayBirthdays.length : 0) + filteredDayEvents.length;
            const isTodayDay = monthIndex === 9 && dayNum === 23 && year === 2026;

            return (
              <div
                key={`day-${dayNum}`}
                className={`min-h-[88px] sm:min-h-[108px] rounded-[12px] p-2 border flex flex-col justify-between ${
                  isTodayDay
                    ? 'bg-[#ffb084]/30 border-[#0a0a0a]'
                    : totalItemsCount > 0
                    ? 'bg-[#f5f0e0] border-[#e5e5e5]'
                    : 'bg-[#fffaf0] border-[#e5e5e5]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[13px] font-semibold ${
                      isTodayDay
                        ? 'w-6 h-6 rounded-full bg-[#0a0a0a] text-white flex items-center justify-center'
                        : 'text-[#0a0a0a]'
                    }`}
                  >
                    {dayNum}
                  </span>
                </div>

                <div className="space-y-1 my-1 overflow-y-auto max-h-[80px]">
                  {showBirthdays &&
                    dayBirthdays.map((person) => (
                      <button
                        key={person.id}
                        onClick={() => onOpenCardStudio(person)}
                        title={`Wish ${person.name}`}
                        className="w-full text-left px-2 py-1 rounded-[8px] bg-[#ff5722] text-white flex items-center gap-1 truncate cursor-pointer"
                      >
                        <span className="text-xs">{person.avatarEmoji || '🎂'}</span>
                        <span className="text-[11px] font-semibold truncate">
                          {person.name}
                        </span>
                      </button>
                    ))}

                  {filteredDayEvents.map((ev) => {
                    const carryItems = ev.prepItems.filter((p) => p.category === 'to-carry' && !p.done);
                    const isFestival = ev.type === 'festival';

                    return (
                      <button
                        type="button"
                        key={ev.id}
                        onClick={() => onSelectEvent?.(ev)}
                        className={`w-full text-left px-2 py-1 rounded-[8px] flex flex-col gap-0.5 cursor-pointer truncate ${
                          isFestival
                            ? 'bg-[#e8b94a] text-[#0a0a0a]'
                            : 'bg-[#a4d4c5] text-[#0a0a0a]'
                        }`}
                      >
                        <div className="flex items-center gap-1 truncate w-full">
                          <span className="text-xs shrink-0">{ev.emoji || (isFestival ? '🪔' : '🏡')}</span>
                          <span className="text-[11px] font-semibold truncate">
                            {ev.title}
                          </span>
                        </div>
                        {carryItems.length > 0 && (
                          <div className="flex items-center gap-1 text-[10px] opacity-80 pl-3">
                            <Package className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">Carry {carryItems.length}</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
