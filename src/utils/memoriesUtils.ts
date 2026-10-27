import { BirthdayPerson, GooglePhotoItem } from '../types/birthday';
import { calculateDaysUntilBirthday, formatBirthDateShort } from './birthdayUtils';

export interface MemoryOfTheDayItem {
  id: string;
  personId: string;
  personName: string;
  personEmoji: string;
  personPhone: string;
  relationship: string;
  photoUrl: string;
  caption: string;
  date: string;
  album: string;
  timeAgoBadge: string;
  daysUntilBirthday: number;
  birthDateFormatted: string;
  personRef: BirthdayPerson;
}

const TIME_AGO_BADGES = [
  'On This Day · 1 Year Ago',
  'Memory of the Day · Shared Album',
  '2 Years Ago · Circle Highlight',
  'Throwback · Favorite Moment',
  'Last Celebration · Pinned Memory'
];

export function buildFallbackMemorySvgDataUrl(
  personName: string,
  caption: string,
  album = 'Shared Circle Memories',
  paletteIndex = 0
): string {
  const palettes = [
    { bg: '#111B21', card: '#1D2B34', accent: '#FF4D8B', secondary: '#A4D4C5', text: '#FCFBF7' },
    { bg: '#22182E', card: '#312342', accent: '#FFB084', secondary: '#B8A4ED', text: '#FCFBF7' },
    { bg: '#162925', card: '#213D37', accent: '#A4D4C5', secondary: '#E8B94A', text: '#FCFBF7' }
  ];
  const p = palettes[paletteIndex % palettes.length];
  const safeName = (personName || 'Circle Member').replace(/[<>&"']/g, '');
  const safeCaption = (caption || 'Cherished Celebration Memory').slice(0, 56).replace(/[<>&"']/g, '');
  const safeAlbum = (album || 'Shared Album').slice(0, 32).replace(/[<>&"']/g, '');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${p.bg}" />
        <stop offset="100%" stop-color="${p.card}" />
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#bgGrad)" />
    <circle cx="680" cy="110" r="140" fill="${p.accent}" fill-opacity="0.18" />
    <circle cx="130" cy="410" r="170" fill="${p.secondary}" fill-opacity="0.16" />
    <rect x="56" y="52" width="688" height="396" rx="28" fill="${p.card}" stroke="${p.secondary}" stroke-opacity="0.28" stroke-width="2" />
    <rect x="92" y="88" width="190" height="34" rx="17" fill="${p.accent}" />
    <text x="187" y="110" font-family="Plus Jakarta Sans, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">${safeAlbum}</text>
    <text x="92" y="215" font-family="Plus Jakarta Sans, sans-serif" font-size="34" font-weight="700" fill="${p.text}">${safeName}</text>
    <text x="92" y="265" font-family="Plus Jakarta Sans, sans-serif" font-size="21" font-weight="500" fill="${p.secondary}">${safeCaption}</text>
    <text x="92" y="395" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="600" fill="${p.text}" fill-opacity="0.7">PookieCal · Google Photos Memory of the Day</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function computeTimeAgoBadge(dateStr: string, index: number): string {
  if (!dateStr) return TIME_AGO_BADGES[index % TIME_AGO_BADGES.length];
  const lower = dateStr.toLowerCase();
  if (lower.includes('today') || lower.includes('just now')) {
    return 'Captured Today · Fresh Memory';
  }
  if (lower.includes('2025')) {
    return 'On This Day · 1 Year Ago';
  }
  if (lower.includes('2024')) {
    return 'On This Day · 2 Years Ago';
  }
  return TIME_AGO_BADGES[index % TIME_AGO_BADGES.length];
}

export function getMemberMemoriesOfTheDay(person: BirthdayPerson): MemoryOfTheDayItem[] {
  const daysUntil = calculateDaysUntilBirthday(person.birthDate);
  const birthDateFormatted = formatBirthDateShort(person.birthDate);
  const photos: GooglePhotoItem[] = person.googleProfile?.sharedPhotos || [];

  if (photos.length === 0) {
    return [
      {
        id: `mem-fallback-${person.id}`,
        personId: person.id,
        personName: person.name,
        personEmoji: person.avatarEmoji || '🎂',
        personPhone: person.phone || '',
        relationship: person.relationship,
        photoUrl: buildFallbackMemorySvgDataUrl(
          person.name,
          `Upcoming celebration on ${birthDateFormatted}`,
          'Circle Highlights',
          0
        ),
        caption: `Celebration moments with ${person.name}`,
        date: birthDateFormatted,
        album: 'Circle Highlights',
        timeAgoBadge: 'Memory of the Day · Circle Highlight',
        daysUntilBirthday: daysUntil,
        birthDateFormatted,
        personRef: person
      }
    ];
  }

  return photos.map((photo, idx) => ({
    id: `${person.id}-${photo.id}`,
    personId: person.id,
    personName: person.name,
    personEmoji: person.avatarEmoji || '🎂',
    personPhone: person.phone || '',
    relationship: person.relationship,
    photoUrl:
      photo.url ||
      buildFallbackMemorySvgDataUrl(person.name, photo.caption, photo.album, idx),
    caption: photo.caption || `Memory with ${person.name}`,
    date: photo.date || birthDateFormatted,
    album: photo.album || 'Shared Google Photos',
    timeAgoBadge: computeTimeAgoBadge(photo.date, idx),
    daysUntilBirthday: daysUntil,
    birthDateFormatted,
    personRef: person
  }));
}

export function getCircleMemoriesOfTheDay(contacts: BirthdayPerson[]): MemoryOfTheDayItem[] {
  if (!contacts || contacts.length === 0) return [];

  // Sort contacts by upcoming birthday proximity so the most relevant memories lead
  const sortedContacts = [...contacts].sort(
    (a, b) => calculateDaysUntilBirthday(a.birthDate) - calculateDaysUntilBirthday(b.birthDate)
  );

  const memories: MemoryOfTheDayItem[] = [];

  // First pass: take the primary featured photo from each contact so everyone in the circle gets represented
  sortedContacts.forEach((person, personIdx) => {
    const memberMemories = getMemberMemoriesOfTheDay(person);
    if (memberMemories.length > 0) {
      const topMemory = memberMemories[0];
      memories.push({
        ...topMemory,
        timeAgoBadge:
          personIdx === 0
            ? 'Spotlight Memory of the Day · 1 Year Ago'
            : computeTimeAgoBadge(topMemory.date, personIdx)
      });
    }
  });

  // Second pass: append remaining photos from contacts for a rich reel
  sortedContacts.forEach((person) => {
    const memberMemories = getMemberMemoriesOfTheDay(person);
    memberMemories.slice(1).forEach((extra) => {
      memories.push(extra);
    });
  });

  return memories;
}
