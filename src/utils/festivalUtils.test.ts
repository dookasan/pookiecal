import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDaysUntilDate,
  getWebShoppingUrl,
  createEventFromFestival,
  getPendingPrepCounts,
  getSortedUpcomingEvents
} from './festivalUtils';
import { FESTIVALS_CATALOG } from './festivalData';
import { CustomEvent } from '../types/birthday';

test('calculateDaysUntilDate correctly calculates days diff', () => {
  const refDate = new Date(2026, 9, 22); // Oct 22, 2026
  // Halloween Oct 31, 2026 -> 9 days
  assert.equal(calculateDaysUntilDate('2026-10-31', refDate), 9);
  // Same day
  assert.equal(calculateDaysUntilDate('2026-10-22', refDate), 0);
  // Past day
  assert.equal(calculateDaysUntilDate('2026-10-20', refDate), -2);
});

test('getWebShoppingUrl generates valid Google Shopping search URL', () => {
  const url = getWebShoppingUrl('buy Kaju Katli sweets online');
  assert.ok(url.startsWith('https://www.google.com/search?q='));
  assert.ok(url.includes('tbm=shop'));
  assert.ok(url.includes('Kaju%20Katli'));
});

test('createEventFromFestival maps festival catalog into tracked event with carry & shop items', () => {
  const diwali = FESTIVALS_CATALOG.find((f) => f.id === 'fest-diwali')!;
  assert.ok(diwali);

  const event = createEventFromFestival(diwali);
  assert.equal(event.type, 'festival');
  assert.equal(event.date, diwali.date);
  assert.equal(event.isAddedToReminder, true);
  assert.ok(event.prepItems.length > 0);
  const carryItem = event.prepItems.find((p) => p.category === 'to-carry');
  assert.ok(carryItem);
});

test('getPendingPrepCounts counts remaining carry and shop items', () => {
  const event: CustomEvent = {
    id: 'e-1',
    title: 'Visit Relative',
    type: 'visit',
    date: '2026-11-01',
    isAddedToReminder: true,
    reminders: { sameDay: true, oneDayBefore: true, threeDaysBefore: false, twoHoursBefore: true },
    prepItems: [
      { id: '1', text: 'Carry sweets', category: 'to-carry', done: false },
      { id: '2', text: 'Bring flowers', category: 'to-carry', done: true },
      { id: '3', text: 'Shop tea online', category: 'to-shop', done: false },
      { id: '4', text: 'Todo task', category: 'todo', done: false }
    ]
  };

  const counts = getPendingPrepCounts(event);
  assert.equal(counts.pendingCarry, 1);
  assert.equal(counts.pendingShop, 1);
  assert.equal(counts.totalPending, 2);
});

test('getSortedUpcomingEvents sorts events by chronological proximity', () => {
  const refDate = new Date(2026, 9, 22);
  const events: CustomEvent[] = [
    {
      id: 'e-far',
      title: 'Christmas',
      type: 'festival',
      date: '2026-12-25',
      isAddedToReminder: true,
      reminders: { sameDay: true, oneDayBefore: true, threeDaysBefore: false, twoHoursBefore: false },
      prepItems: []
    },
    {
      id: 'e-near',
      title: 'Halloween',
      type: 'festival',
      date: '2026-10-31',
      isAddedToReminder: true,
      reminders: { sameDay: true, oneDayBefore: true, threeDaysBefore: false, twoHoursBefore: false },
      prepItems: []
    }
  ];

  const sorted = getSortedUpcomingEvents(events, refDate);
  assert.equal(sorted[0].id, 'e-near');
  assert.equal(sorted[1].id, 'e-far');
});
