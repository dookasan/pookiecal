import { CustomEvent, FestivalCatalogItem, PrepItem } from '../types/birthday';

/**
 * Calculates days remaining until a specific target date (YYYY-MM-DD),
 * relative to reference date.
 */
export function calculateDaysUntilDate(dateStr: string, fromDate: Date = new Date()): number {
  if (!dateStr) return 0;
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return 0;

  const today = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const target = new Date(year, month - 1, day);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Generates direct Google Shopping search link for to-shop items
 */
export function getWebShoppingUrl(query: string): string {
  const clean = encodeURIComponent(query);
  return `https://www.google.com/search?q=${clean}&tbm=shop`;
}

/**
 * Converts a festival catalog entry into a tracked CustomEvent in the user's reminders
 */
export function createEventFromFestival(festival: FestivalCatalogItem): CustomEvent {
  const prepItems: PrepItem[] = [
    ...festival.suggestedCarryItems.map((item, idx) => ({
      id: `prep-carry-${Date.now()}-${idx}`,
      text: item,
      category: 'to-carry' as const,
      done: false
    })),
    ...festival.suggestedShopItems.map((item, idx) => ({
      id: `prep-shop-${Date.now()}-${idx}`,
      text: item,
      category: 'to-shop' as const,
      done: false,
      webShopQuery: item
    }))
  ];

  return {
    id: `ev-fest-${Date.now()}`,
    title: `${festival.name} Celebration ${festival.emoji}`,
    type: 'festival',
    date: festival.date,
    time: '10:00 AM',
    festivalId: festival.id,
    notes: `${festival.description}\n\nKey traditions: ${festival.traditions.join(', ')}`,
    reminders: {
      sameDay: true,
      oneDayBefore: true,
      threeDaysBefore: true,
      twoHoursBefore: false
    },
    isAddedToReminder: true,
    emoji: festival.emoji,
    prepItems
  };
}

/**
 * Filters and sorts upcoming events (chronological order)
 */
export function getSortedUpcomingEvents(events: CustomEvent[], fromDate: Date = new Date()): CustomEvent[] {
  return [...events].sort((a, b) => {
    const daysA = calculateDaysUntilDate(a.date, fromDate);
    const daysB = calculateDaysUntilDate(b.date, fromDate);
    return daysA - daysB;
  });
}

/**
 * Counts total pending to-carry and to-shop items for an event
 */
export function getPendingPrepCounts(event: CustomEvent): { pendingCarry: number; pendingShop: number; totalPending: number } {
  let pendingCarry = 0;
  let pendingShop = 0;

  (event.prepItems || []).forEach((item) => {
    if (!item.done) {
      if (item.category === 'to-carry') pendingCarry++;
      else if (item.category === 'to-shop') pendingShop++;
    }
  });

  return {
    pendingCarry,
    pendingShop,
    totalPending: pendingCarry + pendingShop
  };
}
