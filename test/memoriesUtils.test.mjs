import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getCircleMemoriesOfTheDay,
  getMemberMemoriesOfTheDay,
  buildFallbackMemorySvgDataUrl
} from '../src/utils/memoriesUtils.ts';
import { INITIAL_BIRTHDAYS } from '../src/utils/defaultData.ts';

test('getCircleMemoriesOfTheDay returns curated memories across contacts', () => {
  const memories = getCircleMemoriesOfTheDay(INITIAL_BIRTHDAYS);
  assert.ok(memories.length >= INITIAL_BIRTHDAYS.length, 'Should include at least one memory per contact');
  assert.equal(memories[0].timeAgoBadge, 'Spotlight Memory of the Day · 1 Year Ago');
  assert.ok(memories[0].personName.length > 0);
  assert.ok(memories[0].photoUrl.length > 0);
});

test('getMemberMemoriesOfTheDay returns photos for a contact with sharedPhotos', () => {
  const sarah = INITIAL_BIRTHDAYS[0];
  const memberMems = getMemberMemoriesOfTheDay(sarah);
  assert.equal(memberMems.length, sarah.googleProfile.sharedPhotos.length);
  assert.equal(memberMems[0].personId, sarah.id);
});

test('buildFallbackMemorySvgDataUrl generates a valid data:image/svg+xml URI', () => {
  const uri = buildFallbackMemorySvgDataUrl('Aarav Mehta', 'Diwali Rooftop Dinner', 'Family Album', 1);
  assert.ok(uri.startsWith('data:image/svg+xml;utf8,'));
});
