import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDaysUntilBirthday,
  isBirthdayToday,
  calculateUpcomingAge,
  isMilestoneAge,
  getZodiacSign,
  sanitizePhoneNumber,
  getDirectCallUri,
  getWhatsAppShareUrl,
  sortBirthdaysByProximity
} from './birthdayUtils';
import { generateSmartGiftSuggestions } from './suggestionUtils';
import { BirthdayPerson } from '../types/birthday';

test('isBirthdayToday accurately detects same month and day', () => {
  const refDate = new Date(2026, 9, 22); // Month is 0-indexed: 9 = October 22
  assert.equal(isBirthdayToday('1995-10-22', refDate), true);
  assert.equal(isBirthdayToday('1995-10-23', refDate), false);
  assert.equal(isBirthdayToday('2000-01-15', refDate), false);
});

test('calculateDaysUntilBirthday handles today, upcoming this year, and next year', () => {
  const refDate = new Date(2026, 9, 22); // Oct 22, 2026

  // Today
  assert.equal(calculateDaysUntilBirthday('1990-10-22', refDate), 0);

  // Tomorrow (Oct 23)
  assert.equal(calculateDaysUntilBirthday('1992-10-23', refDate), 1);

  // Birthday that already passed earlier this year (e.g. Oct 20) -> should be next year
  const daysPassed = calculateDaysUntilBirthday('1990-10-20', refDate);
  assert.ok(daysPassed > 300, 'Past birthday should roll over to next year');
});

test('calculateUpcomingAge correctly computes age turning', () => {
  const refDate = new Date(2026, 9, 22); // Oct 22, 2026
  
  // Born Oct 22, 1996 -> turning 30 today
  assert.equal(calculateUpcomingAge('1996-10-22', refDate), 30);

  // Born Dec 1, 2000 -> turning 26 later this year
  assert.equal(calculateUpcomingAge('2000-12-01', refDate), 26);

  // Born Jan 1, 2000 -> turned 26 earlier this year, next bday turning 27
  assert.equal(calculateUpcomingAge('2000-01-01', refDate), 27);
});

test('isMilestoneAge detects 1, 16, 18, 21, and multiples of 10', () => {
  assert.equal(isMilestoneAge(18), true);
  assert.equal(isMilestoneAge(21), true);
  assert.equal(isMilestoneAge(30), true);
  assert.equal(isMilestoneAge(50), true);
  assert.equal(isMilestoneAge(25), false);
  assert.equal(isMilestoneAge(33), false);
});

test('getZodiacSign accurately computes astrological sign', () => {
  assert.equal(getZodiacSign('1990-10-22').sign, 'Libra');
  assert.equal(getZodiacSign('1990-10-24').sign, 'Scorpio');
  assert.equal(getZodiacSign('1995-07-04').sign, 'Cancer');
});

test('sanitizePhoneNumber and getDirectCallUri format correct tel link', () => {
  assert.equal(sanitizePhoneNumber('+1 (555) 234-5678'), '+15552345678');
  assert.equal(getDirectCallUri('+1 (555) 234-5678'), 'tel:+15552345678');
});

test('getWhatsAppShareUrl creates valid WhatsApp link with phone and encoded text', () => {
  const url = getWhatsAppShareUrl('+15551234567', 'Happy Birthday Alex! 🎂');
  assert.ok(url.startsWith('https://api.whatsapp.com/send?phone=15551234567'));
  assert.ok(url.includes('Happy%20Birthday%20Alex!'));
});

test('sortBirthdaysByProximity sorts today first followed by closest upcoming', () => {
  const refDate = new Date(2026, 9, 22); // Oct 22
  const sample: BirthdayPerson[] = [
    {
      id: '1',
      name: 'Charlie',
      birthDate: '1990-12-25', // Dec 25 (~64 days)
      phone: '+1234567',
      relationship: 'friend',
      avatarColor: 'blue',
      avatarEmoji: '🎉',
      reminders: { sameDay: true, oneDayBefore: true, threeDaysBefore: false, oneWeekBefore: false, time: '09:00' }
    },
    {
      id: '2',
      name: 'Alice',
      birthDate: '1994-10-22', // Today (0 days)
      phone: '+1234567',
      relationship: 'family',
      avatarColor: 'rose',
      avatarEmoji: '🎂',
      reminders: { sameDay: true, oneDayBefore: true, threeDaysBefore: false, oneWeekBefore: false, time: '09:00' }
    },
    {
      id: '3',
      name: 'Bob',
      birthDate: '1998-10-25', // Oct 25 (3 days)
      phone: '+1234567',
      relationship: 'partner',
      avatarColor: 'amber',
      avatarEmoji: '🎁',
      reminders: { sameDay: true, oneDayBefore: true, threeDaysBefore: false, oneWeekBefore: false, time: '09:00' }
    }
  ];

  const sorted = sortBirthdaysByProximity(sample, refDate);
  assert.equal(sorted[0].name, 'Alice'); // Today
  assert.equal(sorted[1].name, 'Bob'); // 3 days
  assert.equal(sorted[2].name, 'Charlie'); // Dec
});

test('generateSmartGiftSuggestions produces contextual gift ideas from profile', () => {
  const musicPerson: BirthdayPerson = {
    id: 'test-1',
    name: 'Musician Friend',
    birthDate: '1995-05-10',
    phone: '+1234567890',
    relationship: 'friend',
    avatarColor: 'bg-indigo-500',
    avatarEmoji: '🎸',
    favoriteThings: ['Acoustic Guitar', 'Vinyl'],
    reminders: { sameDay: true, oneDayBefore: true, threeDaysBefore: false, oneWeekBefore: false, time: '09:00' }
  };

  const suggestions = generateSmartGiftSuggestions(musicPerson);
  assert.ok(suggestions.length >= 2, 'Should generate at least 2 suggestions');
  const hasMusicCategory = suggestions.some((s) => s.category === 'music');
  assert.equal(hasMusicCategory, true, 'Should include music-related gifts');
});
