import { BirthdayPerson, Relationship } from '../types/birthday';

/**
 * Calculates days remaining until the next birthday given a YYYY-MM-DD birthdate,
 * based on reference date (defaults to today).
 */
export function calculateDaysUntilBirthday(birthDateStr: string, fromDate: Date = new Date()): number {
  if (!birthDateStr) return 0;
  const [bYear, bMonth, bDay] = birthDateStr.split('-').map(Number);
  if (!bMonth || !bDay) return 0;

  const currentYear = fromDate.getFullYear();
  const today = new Date(currentYear, fromDate.getMonth(), fromDate.getDate());
  
  // Try this year's birthday
  let nextBday = new Date(currentYear, bMonth - 1, bDay);
  
  // If birthday was earlier this year (yesterday or earlier), next one is next year
  if (nextBday < today) {
    nextBday = new Date(currentYear + 1, bMonth - 1, bDay);
  }

  const diffTime = nextBday.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Checks if the birthday is today.
 */
export function isBirthdayToday(birthDateStr: string, fromDate: Date = new Date()): boolean {
  if (!birthDateStr) return false;
  const [, bMonth, bDay] = birthDateStr.split('-').map(Number);
  return fromDate.getMonth() + 1 === bMonth && fromDate.getDate() === bDay;
}

/**
 * Calculates turning age on the upcoming birthday.
 */
export function calculateUpcomingAge(birthDateStr: string, fromDate: Date = new Date()): number {
  if (!birthDateStr) return 0;
  const [bYear, bMonth, bDay] = birthDateStr.split('-').map(Number);
  if (!bYear) return 0;

  const currentYear = fromDate.getFullYear();
  const today = new Date(currentYear, fromDate.getMonth(), fromDate.getDate());
  const thisYearBday = new Date(currentYear, bMonth - 1, bDay);

  let targetYear = currentYear;
  if (thisYearBday < today) {
    targetYear = currentYear + 1;
  }
  return Math.max(0, targetYear - bYear);
}

/**
 * Identifies if an age is a milestone birthday.
 */
export function isMilestoneAge(age: number): boolean {
  if (age === 1 || age === 16 || age === 18 || age === 21) return true;
  return age > 0 && age % 10 === 0;
}

/**
 * Returns zodiac sign based on month (1-12) and day (1-31).
 */
export function getZodiacSign(birthDateStr: string): { sign: string; symbol: string } {
  if (!birthDateStr) return { sign: 'Unknown', symbol: '✨' };
  const [, month, day] = birthDateStr.split('-').map(Number);
  if (!month || !day) return { sign: 'Unknown', symbol: '✨' };

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { sign: 'Aries', symbol: '♈' };
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { sign: 'Taurus', symbol: '♉' };
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { sign: 'Gemini', symbol: '♊' };
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { sign: 'Cancer', symbol: '♋' };
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { sign: 'Leo', symbol: '♌' };
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { sign: 'Virgo', symbol: '♍' };
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { sign: 'Libra', symbol: '♎' };
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { sign: 'Scorpio', symbol: '♏' };
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { sign: 'Sagittarius', symbol: '♐' };
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { sign: 'Capricorn', symbol: '♑' };
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { sign: 'Aquarius', symbol: '♒' };
  return { sign: 'Pisces', symbol: '♓' };
}

/**
 * Cleans phone number to international/clean format for tel: and whatsapp:
 */
export function sanitizePhoneNumber(phone: string): string {
  if (!phone) return '';
  return phone.replace(/[^0-9+]/g, '');
}

/**
 * Generates direct tel: URI
 */
export function getDirectCallUri(phone: string): string {
  const clean = sanitizePhoneNumber(phone);
  return `tel:${clean}`;
}

/**
 * Generates WhatsApp click-to-chat URL
 */
export function getWhatsAppShareUrl(phone: string, message: string): string {
  const clean = sanitizePhoneNumber(phone).replace(/^\+/, '');
  const encoded = encodeURIComponent(message);
  if (clean) {
    return `https://api.whatsapp.com/send?phone=${clean}&text=${encoded}`;
  }
  return `https://api.whatsapp.com/send?text=${encoded}`;
}

/**
 * Generates Social Media direct share URLs
 */
export function getSocialShareUrls(message: string, url = window?.location?.href || 'https://pookiecal.app') {
  const encodedMsg = encodeURIComponent(message);
  const encodedUrl = encodeURIComponent(url);

  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedMsg}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMsg}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodeURIComponent("Happy Birthday! 🎂")}&body=${encodedMsg}`,
  };
}

/**
 * Generates a formatted Google Calendar Add-Event link
 */
export function getGoogleCalendarLink(person: BirthdayPerson, targetYear?: number): string {
  const [bYear, bMonth, bDay] = person.birthDate.split('-').map(Number);
  const year = targetYear || new Date().getFullYear();
  const mStr = String(bMonth).padStart(2, '0');
  const dStr = String(bDay).padStart(2, '0');
  
  const startDateStr = `${year}${mStr}${dStr}`;
  // Next day for all-day event
  const nextDate = new Date(year, bMonth - 1, bDay + 1);
  const endYear = nextDate.getFullYear();
  const endMonth = String(nextDate.getMonth() + 1).padStart(2, '0');
  const endDay = String(nextDate.getDate()).padStart(2, '0');
  const endDateStr = `${endYear}${endMonth}${endDay}`;

  const title = encodeURIComponent(`🎂 ${person.name}'s Birthday!`);
  const details = encodeURIComponent(`Celebration for ${person.name}. Don't forget to call or send wishes! Phone: ${person.phone || 'N/A'}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateStr}/${endDateStr}&details=${details}&recur=RRULE:FREQ=YEARLY`;
}

/**
 * Sorts birthday list:
 * 1. Today's birthdays first
 * 2. Next closest birthdays (ascending days)
 */
export function sortBirthdaysByProximity(people: BirthdayPerson[], fromDate: Date = new Date()): BirthdayPerson[] {
  return [...people].sort((a, b) => {
    const daysA = calculateDaysUntilBirthday(a.birthDate, fromDate);
    const daysB = calculateDaysUntilBirthday(b.birthDate, fromDate);
    return daysA - daysB;
  });
}

/**
 * Relationship label formatter
 */
export function formatRelationship(rel: Relationship): string {
  switch (rel) {
    case 'family': return 'Family';
    case 'friend': return 'Best Friend';
    case 'partner': return 'Partner / Spouse';
    case 'colleague': return 'Colleague / Work';
    case 'other': return 'Friend';
    default: return 'Friend';
  }
}

export const calculateTurningAge = calculateUpcomingAge;

export function formatBirthDateShort(birthDateStr: string): string {
  if (!birthDateStr) return '';
  const [, month, day] = birthDateStr.split('-').map(Number);
  if (!month || !day) return birthDateStr;
  const d = new Date(2000, month - 1, day);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function generatePersonalizedWishes(person: BirthdayPerson): string[] {
  const fav = person.favoriteThings?.[0] || 'wonderful moments';
  return [
    `Wishing you the happiest of birthdays, ${person.name}! May your year ahead be filled with ${fav}, joy, and unforgettable memories!`,
    `Happy Birthday, ${person.name}! Here's to another amazing chapter ahead surrounded by everyone who loves you.`,
    `Cheers to you, ${person.name}! Hope your special day brings plenty of laughter, celebration, and ${fav}!`
  ];
}

