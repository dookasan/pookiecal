import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildInviteMessage,
  getWhatsAppShareUrl,
  getSmsShareUrl,
  getEmailShareUrl,
  INITIAL_INVITES
} from '../src/utils/inviteUtils.js';

test('buildInviteMessage formats message with invitee name and referral prompt', () => {
  const message = buildInviteMessage({
    inviteeName: 'Aunt Priya',
    inviterName: 'Bhaskar',
    customMessage: 'Can not wait for our Diwali celebration!',
    includeReferralRequest: true,
    referralNote: 'Please connect cousin Rohan and Uncle Anand too!',
    inviteUrl: 'https://celebr-aite.app/?invite=PRIYA-101'
  });

  assert.ok(message.includes('Hi Aunt Priya!'), 'Contains greeting with invitee name');
  assert.ok(message.includes('Bhaskar has invited you'), 'Contains inviter name');
  assert.ok(message.includes('Can not wait for our Diwali celebration!'), 'Includes custom message');
  assert.ok(message.includes('https://celebr-aite.app/?invite=PRIYA-101'), 'Contains invite URL');
  assert.ok(message.includes('CIRCLE REFERRAL REQUEST'), 'Includes referral header');
  assert.ok(message.includes('connect and invite 2 or 3 of your own close friends and family members'), 'Includes viral request');
  assert.ok(message.includes('Please connect cousin Rohan and Uncle Anand too!'), 'Includes specific referral note');
});

test('buildInviteMessage respects toggle when referral prompt is disabled', () => {
  const message = buildInviteMessage({
    inviteeName: 'Marcus',
    inviterName: 'Bhaskar',
    includeReferralRequest: false,
    inviteUrl: 'https://celebr-aite.app/?invite=MARCUS-102'
  });

  assert.ok(message.includes('Hi Marcus!'));
  assert.ok(!message.includes('CIRCLE REFERRAL REQUEST'), 'Should not include referral request when false');
});

test('getWhatsAppShareUrl encodes phone and text cleanly', () => {
  const url = getWhatsAppShareUrl('+1 (555) 123-4567', 'Hi there! Check this out.');
  assert.ok(url.startsWith('https://api.whatsapp.com/send?phone=15551234567&text='), 'Encodes phone digits and prepends WhatsApp API');
  assert.ok(url.includes('Hi%20there'), 'Properly URI encodes message content');
});

test('INITIAL_INVITES includes downstream referrals demonstrating the viral loop', () => {
  assert.ok(INITIAL_INVITES.length >= 3, 'At least 3 initial invites');
  const activeChain = INITIAL_INVITES.find(i => i.status === 'chain_active');
  assert.ok(activeChain, 'At least one active referral chain exists');
  assert.ok(activeChain.downstreamReferrals.length > 0, 'Downstream referrals present');
  assert.ok(activeChain.downstreamReferrals[0].name, 'Downstream referral has name');
});
