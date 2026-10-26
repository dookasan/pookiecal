import React, { useState } from 'react';
import {
  X,
  Send,
  UserPlus,
  Share2,
  Users,
  Sparkles,
  Check,
  Copy,
  MessageCircle,
  Mail,
  Smartphone,
  HeartHandshake
} from 'lucide-react';
import { InviteRecord, Relationship, DownstreamMember, BirthdayPerson } from '../types/birthday';
import {
  buildInviteMessage,
  getWhatsAppShareUrl,
  getSmsShareUrl,
  getEmailShareUrl,
  SAMPLE_SIMULATED_RELATIVES
} from '../utils/inviteUtils';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  invites: InviteRecord[];
  onAddInvite: (invite: InviteRecord) => void;
  onUpdateInvite: (invite: InviteRecord) => void;
  onAddBirthdayPerson?: (person: BirthdayPerson) => void;
  senderName?: string;
}

export function InviteModal({
  isOpen,
  onClose,
  invites,
  onAddInvite,
  onUpdateInvite,
  onAddBirthdayPerson,
  senderName = 'Bhaskar'
}: InviteModalProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'tracker'>('create');

  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<Relationship>('family');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [channel, setChannel] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');
  const [customNote, setCustomNote] = useState('');
  const [includeReferral, setIncludeReferral] = useState(true);
  const [referralNote, setReferralNote] = useState(
    'Please invite your close family & friends so everyone is connected!'
  );
  const [copied, setCopied] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentInviteCode = `${
    name
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 8) || 'MEMBER'
  }-${Math.floor(100 + Math.random() * 900)}`;
  const currentInviteUrl = `https://pookiecal.app/?invite=${currentInviteCode}&by=${encodeURIComponent(
    senderName
  )}`;

  const generatedMessage = buildInviteMessage({
    inviteeName: name.trim() || 'Friend',
    inviterName: senderName,
    customMessage: customNote,
    includeReferralRequest: includeReferral,
    referralNote: referralNote,
    inviteUrl: currentInviteUrl
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentInviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSendInvite = (destination: 'whatsapp' | 'sms' | 'email') => {
    if (!name.trim()) return;

    const newInvite: InviteRecord = {
      id: `inv-${Date.now()}`,
      inviteeName: name.trim(),
      relationship,
      contactMethod: channel,
      contactValue: channel === 'whatsapp' || channel === 'sms' ? phone.trim() : email.trim(),
      customMessage: customNote.trim(),
      includeReferralRequest: includeReferral,
      referralNote: referralNote.trim(),
      referralGoal: 3,
      status: 'sent',
      sentAt: new Date().toISOString(),
      inviteCode: currentInviteCode,
      inviteUrl: currentInviteUrl,
      downstreamReferrals: []
    };

    onAddInvite(newInvite);

    if (destination === 'whatsapp') {
      const url = getWhatsAppShareUrl(phone.trim(), generatedMessage);
      window.open(url, '_blank');
    } else if (destination === 'sms') {
      const url = getSmsShareUrl(phone.trim(), generatedMessage);
      window.location.href = url;
    } else if (destination === 'email') {
      const url = getEmailShareUrl(
        email.trim(),
        `${senderName} invited you to PookieCal!`,
        generatedMessage
      );
      window.location.href = url;
    }

    setFeedbackToast(`Invite created for ${name.trim()}!`);
    setTimeout(() => setFeedbackToast(null), 3500);

    setName('');
    setPhone('');
    setEmail('');
    setCustomNote('');
    setActiveTab('tracker');
  };

  const handleSimulateReferral = (invite: InviteRecord) => {
    const randomPick1 =
      SAMPLE_SIMULATED_RELATIVES[Math.floor(Math.random() * SAMPLE_SIMULATED_RELATIVES.length)];
    const randomPick2 =
      SAMPLE_SIMULATED_RELATIVES[
        (Math.floor(Math.random() * SAMPLE_SIMULATED_RELATIVES.length) + 1) %
          SAMPLE_SIMULATED_RELATIVES.length
      ];

    const newMembers: DownstreamMember[] = [
      {
        id: `down-${Date.now()}-1`,
        name: randomPick1.name,
        relationship: `${randomPick1.rel} (via ${invite.inviteeName})`,
        avatarEmoji: randomPick1.emoji,
        phone: '+1 (555) 890-1122',
        status: 'joined',
        addedAt: new Date().toISOString()
      },
      {
        id: `down-${Date.now()}-2`,
        name: randomPick2.name,
        relationship: `${randomPick2.rel} (via ${invite.inviteeName})`,
        avatarEmoji: randomPick2.emoji,
        phone: '+1 (555) 890-3344',
        status: 'joined',
        addedAt: new Date().toISOString()
      }
    ];

    const updated: InviteRecord = {
      ...invite,
      status: 'chain_active',
      downstreamReferrals: [...invite.downstreamReferrals, ...newMembers]
    };

    onUpdateInvite(updated);

    if (onAddBirthdayPerson) {
      onAddBirthdayPerson({
        id: `b-ref-${Date.now()}`,
        name: randomPick1.name,
        birthDate: '1998-11-15',
        phone: '+1 (555) 890-1122',
        relationship: 'family',
        avatarColor: 'bg-[#a4d4c5]',
        avatarEmoji: randomPick1.emoji,
        notes: `Referred & connected by ${invite.inviteeName}`,
        favoriteThings: ['Celebrations', 'Sweets'],
        reminders: {
          sameDay: true,
          oneDayBefore: true,
          threeDaysBefore: false,
          oneWeekBefore: false,
          time: '09:00'
        },
        customCardTheme: 'aurora',
        googleConnected: false
      });
    }

    setFeedbackToast(
      `${invite.inviteeName} connected ${randomPick1.name} & ${randomPick2.name} to the circle!`
    );
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const totalDownstream = invites.reduce((acc, curr) => acc + curr.downstreamReferrals.length, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0a0a0a]/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#fffaf0] w-full max-w-4xl rounded-[24px] border border-[#e5e5e5] overflow-hidden flex flex-col max-h-[92vh] text-[#0a0a0a]">
        {/* Header (`#faf5e8` soft cream) */}
        <div className="px-6 py-5 bg-[#faf5e8] border-b border-[#e5e5e5] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#b8a4ed] text-[#0a0a0a] border border-[#e5e5e5] flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="clay-display-sm text-[24px] text-[#0a0a0a]">
                Invite Family & Friends Circle
              </h2>
              <p className="text-[13px] text-[#6a6a6a]">
                Share an invite link on WhatsApp, SMS, or Email
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#fffaf0] border border-[#e5e5e5] text-[#0a0a0a] flex items-center justify-center cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center gap-2 border-b border-[#e5e5e5] bg-[#fffaf0] px-6 py-3">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-full text-[14px] font-medium flex items-center gap-2 cursor-pointer ${
              activeTab === 'create'
                ? 'bg-[#f5f0e0] text-[#0a0a0a] font-semibold'
                : 'text-[#6a6a6a]'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Send Invite</span>
          </button>

          <button
            onClick={() => setActiveTab('tracker')}
            className={`px-4 py-2 rounded-full text-[14px] font-medium flex items-center gap-2 cursor-pointer ${
              activeTab === 'tracker'
                ? 'bg-[#f5f0e0] text-[#0a0a0a] font-semibold'
                : 'text-[#6a6a6a]'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Circle Tracker ({invites.length + totalDownstream})</span>
          </button>
        </div>

        {feedbackToast && (
          <div className="bg-[#a4d4c5] text-[#0a0a0a] px-6 py-2.5 text-[13px] font-semibold flex items-center justify-between border-b border-[#e5e5e5]">
            <span>{feedbackToast}</span>
            <button onClick={() => setFeedbackToast(null)} className="cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'create' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <label className="block text-[12px] font-semibold uppercase tracking-[1px] text-[#3a3a3a] mb-1.5">
                    Invitee Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Uncle Vikram, Priya Sharma"
                    className="w-full h-[44px] px-4 rounded-[12px] bg-[#fffaf0] border border-[#e5e5e5] text-[14px] focus:outline-none focus:border-[#0a0a0a]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-semibold uppercase tracking-[1px] text-[#3a3a3a] mb-1.5">
                      Relationship
                    </label>
                    <select
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value as Relationship)}
                      className="w-full h-[44px] px-4 rounded-[12px] bg-[#fffaf0] border border-[#e5e5e5] text-[14px]"
                    >
                      <option value="family">Family</option>
                      <option value="friend">Friend</option>
                      <option value="partner">Partner</option>
                      <option value="colleague">Colleague</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold uppercase tracking-[1px] text-[#3a3a3a] mb-1.5">
                      Primary Channel
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['whatsapp', 'sms', 'email'] as const).map((ch) => (
                        <button
                          type="button"
                          key={ch}
                          onClick={() => setChannel(ch)}
                          className={`h-[44px] px-2 text-[12px] font-semibold rounded-[12px] border capitalize cursor-pointer ${
                            channel === ch
                              ? 'bg-[#0a0a0a] text-[#ffffff] border-[#0a0a0a]'
                              : 'bg-[#fffaf0] border-[#e5e5e5] text-[#3a3a3a]'
                          }`}
                        >
                          {ch}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {(channel === 'whatsapp' || channel === 'sms') && (
                  <div>
                    <label className="block text-[12px] font-semibold uppercase tracking-[1px] text-[#3a3a3a] mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="w-full h-[44px] px-4 rounded-[12px] bg-[#fffaf0] border border-[#e5e5e5] text-[14px]"
                    />
                  </div>
                )}

                {channel === 'email' && (
                  <div>
                    <label className="block text-[12px] font-semibold uppercase tracking-[1px] text-[#3a3a3a] mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="invitee@example.com"
                      className="w-full h-[44px] px-4 rounded-[12px] bg-[#fffaf0] border border-[#e5e5e5] text-[14px]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[12px] font-semibold uppercase tracking-[1px] text-[#3a3a3a] mb-1.5">
                    Personal Greeting (Optional)
                  </label>
                  <input
                    type="text"
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="e.g. Excited for our upcoming family dinner!"
                    className="w-full h-[44px] px-4 rounded-[12px] bg-[#fffaf0] border border-[#e5e5e5] text-[14px]"
                  />
                </div>

                <div className="p-4 rounded-[16px] bg-[#faf5e8] border border-[#e5e5e5] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-[#0a0a0a] flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Ask Invitee to Connect Their Circle</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={includeReferral}
                      onChange={(e) => setIncludeReferral(e.target.checked)}
                      className="accent-[#0a0a0a]"
                    />
                  </div>
                  {includeReferral && (
                    <input
                      type="text"
                      value={referralNote}
                      onChange={(e) => setReferralNote(e.target.value)}
                      className="w-full h-[40px] px-3 rounded-[10px] bg-[#fffaf0] border border-[#e5e5e5] text-[13px]"
                    />
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                <div className="feature-card-lavender p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[#0a0a0a]">
                      Invitation Preview
                    </span>
                    <button
                      onClick={handleCopyMessage}
                      className="text-[12px] font-semibold text-[#0a0a0a] inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy Text'}</span>
                    </button>
                  </div>

                  <div className="bg-[#fffaf0] text-[#0a0a0a] p-4 rounded-[16px] border border-[#e5e5e5] text-[12px] whitespace-pre-wrap leading-relaxed max-h-[240px] overflow-y-auto">
                    {generatedMessage}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={() => handleSendInvite('whatsapp')}
                    disabled={!name.trim()}
                    className="w-full h-[44px] px-5 bg-[#0a0a0a] disabled:opacity-40 text-[#ffffff] font-semibold text-[14px] rounded-[12px] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send via WhatsApp</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleSendInvite(channel === 'email' ? 'email' : 'sms')}
                      disabled={!name.trim()}
                      className="h-[44px] px-4 bg-[#f5f0e0] disabled:opacity-40 text-[#0a0a0a] border border-[#e5e5e5] font-semibold text-[13px] rounded-[12px] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {channel === 'email' ? <Mail className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                      <span>Send {channel === 'email' ? 'Email' : 'SMS'}</span>
                    </button>

                    <button
                      onClick={handleCopyLink}
                      className="h-[44px] px-4 bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] font-semibold text-[13px] rounded-[12px] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Copy Link</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tracker' && (
            <div className="space-y-4">
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  className="bg-[#faf5e8] rounded-[20px] border border-[#e5e5e5] p-5 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-[16px] text-[#0a0a0a]">
                          {invite.inviteeName}
                        </h4>
                        <span className="text-[11px] font-semibold bg-[#f5f0e0] text-[#3a3a3a] px-2.5 py-0.5 rounded-full capitalize">
                          {invite.relationship}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#6a6a6a] mt-0.5">
                        Sent via {invite.contactMethod.toUpperCase()}
                      </p>
                    </div>

                    <button
                      onClick={() => handleSimulateReferral(invite)}
                      className="h-[38px] px-4 bg-[#0a0a0a] text-[#ffffff] text-[12px] font-semibold rounded-[12px] inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Simulate Invitee Referral</span>
                    </button>
                  </div>

                  {invite.downstreamReferrals.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#e5e5e5]">
                      {invite.downstreamReferrals.map((down) => (
                        <div
                          key={down.id}
                          className="bg-[#fffaf0] rounded-[12px] p-3 border border-[#e5e5e5] flex items-center justify-between text-[13px]"
                        >
                          <div className="flex items-center gap-2">
                            <span>{down.avatarEmoji || '🎉'}</span>
                            <div>
                              <div className="font-semibold text-[#0a0a0a]">{down.name}</div>
                              <div className="text-[11px] text-[#6a6a6a]">{down.relationship}</div>
                            </div>
                          </div>
                          <span className="text-[11px] font-semibold bg-[#a4d4c5] text-[#0a0a0a] px-2.5 py-0.5 rounded-full">
                            Connected
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
