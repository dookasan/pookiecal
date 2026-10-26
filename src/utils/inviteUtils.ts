import { InviteRecord, Relationship, DownstreamMember } from '../types/birthday';

export function buildInviteMessage({
  inviteeName,
  inviterName = 'Bhaskar',
  customMessage = '',
  includeReferralRequest = true,
  referralNote = '',
  inviteUrl = 'https://pookiecal.app/?ref=invite'
}: {
  inviteeName: string;
  inviterName?: string;
  customMessage?: string;
  includeReferralRequest?: boolean;
  referralNote?: string;
  inviteUrl?: string;
}): string {
  const greeting = inviteeName ? `Hi ${inviteeName}!` : 'Hello!';
  
  let msg = `${greeting} 🎉 ${inviterName} has invited you to our PookieCal Family & Friends Circle!\n\n`;
  msg += `We're keeping all our birthdays, upcoming festival visits, gift wishlists, and shared memories in one unified hub so we never miss celebrating each other.\n\n`;
  
  if (customMessage.trim()) {
    msg += `"${customMessage.trim()}"\n\n`;
  }

  msg += `👉 Open your invite & join our circle here:\n${inviteUrl}\n\n`;

  if (includeReferralRequest) {
    msg += `🤝 CIRCLE REFERRAL REQUEST:\n`;
    msg += `Once you join, please connect and invite 2 or 3 of your own close friends and family members into the circle!`;
    if (referralNote.trim()) {
      msg += ` (${referralNote.trim()})`;
    }
    msg += ` This way our whole family & friendship network stays seamlessly connected for celebrations and visits. 🎁✨`;
  }

  return msg;
}

export function getWhatsAppShareUrl(phone: string | undefined, message: string): string {
  const cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : '';
  const encodedText = encodeURIComponent(message);
  if (cleanPhone) {
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
  }
  return `https://api.whatsapp.com/send?text=${encodedText}`;
}

export function getSmsShareUrl(phone: string | undefined, message: string): string {
  const cleanPhone = phone ? phone.replace(/[^0-9+]/g, '') : '';
  return `sms:${cleanPhone}?body=${encodeURIComponent(message)}`;
}

export function getEmailShareUrl(email: string | undefined, subject: string, body: string): string {
  return `mailto:${email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const INITIAL_INVITES: InviteRecord[] = [
  {
    id: 'inv-1',
    inviteeName: 'Uncle Vikram Patel',
    relationship: 'family',
    contactMethod: 'whatsapp',
    contactValue: '+1 (555) 782-9012',
    customMessage: 'Looking forward to seeing the whole family at the Diwali get-together!',
    includeReferralRequest: true,
    referralNote: 'Please connect Aunt Sunita and cousin Kavya so their visits and gifts are aligned!',
    referralGoal: 3,
    status: 'chain_active',
    sentAt: '2026-10-18T10:30:00.000Z',
    inviteCode: 'VIKRAM-PATEL-88',
    inviteUrl: 'https://pookiecal.app/?invite=VIKRAM-PATEL-88&by=Uncle%20Vikram',
    downstreamReferrals: [
      {
        id: 'down-1',
        name: 'Aunt Sunita Patel',
        relationship: 'Aunt / Spouse',
        avatarEmoji: '🌸',
        phone: '+1 (555) 782-9013',
        status: 'joined',
        addedAt: '2026-10-19T14:20:00.000Z'
      },
      {
        id: 'down-2',
        name: 'Kavya Patel',
        relationship: 'Cousin / Niece',
        avatarEmoji: '🎨',
        phone: '+1 (555) 782-9014',
        status: 'joined',
        addedAt: '2026-10-20T09:15:00.000Z'
      }
    ]
  },
  {
    id: 'inv-2',
    inviteeName: 'Elena Rostova',
    relationship: 'friend',
    contactMethod: 'whatsapp',
    contactValue: '+1 (555) 234-8901',
    customMessage: 'Joining our birthday & festival coordination group!',
    includeReferralRequest: true,
    referralNote: 'Bring in Marcus and our design crew!',
    referralGoal: 3,
    status: 'chain_active',
    sentAt: '2026-10-20T16:00:00.000Z',
    inviteCode: 'ELENA-ROST-42',
    inviteUrl: 'https://pookiecal.app/?invite=ELENA-ROST-42&by=Elena',
    downstreamReferrals: [
      {
        id: 'down-3',
        name: 'Marcus Vance',
        relationship: 'Colleague / Friend',
        avatarEmoji: '⚡',
        phone: '+1 (555) 432-1199',
        status: 'joined',
        addedAt: '2026-10-21T11:45:00.000Z'
      }
    ]
  },
  {
    id: 'inv-3',
    inviteeName: 'David Miller',
    relationship: 'friend',
    contactMethod: 'sms',
    contactValue: '+1 (555) 901-2345',
    customMessage: 'Hey Dave! Adding you to the circle for our upcoming birthday parties and group gifts.',
    includeReferralRequest: true,
    referralNote: 'Invite your brother Sam as well!',
    referralGoal: 2,
    status: 'sent',
    sentAt: '2026-10-21T18:00:00.000Z',
    inviteCode: 'DAVE-MILLER-19',
    inviteUrl: 'https://pookiecal.app/?invite=DAVE-MILLER-19&by=David',
    downstreamReferrals: []
  }
];

export const SAMPLE_SIMULATED_RELATIVES = [
  { name: 'Arjun Sharma', rel: 'Brother', emoji: '🌟' },
  { name: 'Neha Gupta', rel: 'Cousin', emoji: '🌺' },
  { name: 'Grandma Meera', rel: 'Grandmother', emoji: '👵' },
  { name: 'Sam Miller', rel: 'Sibling', emoji: '🚀' },
  { name: 'Ananya Rao', rel: 'Best Friend', emoji: '🎉' },
  { name: 'Carlos Mendez', rel: 'Brother-in-Law', emoji: '🎸' }
];
