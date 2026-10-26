import React, { useState } from 'react';
import {
  Gift,
  Plus,
  Sparkles,
  Phone,
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';
import { BirthdayPerson, PartyPlan, GuestItem, WishlistItem } from '../types/birthday';
import { getWhatsAppShareUrl, getDirectCallUri } from '../utils/birthdayUtils';
import { sounds } from '../utils/audioEffects';

interface PartyPlannerViewProps {
  partyPlan: PartyPlan;
  birthdays: BirthdayPerson[];
  onUpdatePartyPlan: (updated: PartyPlan) => void;
  onOpenCallModal: (person: BirthdayPerson) => void;
}

const GIFT_CARD_VARIANTS = [
  { bgClass: 'feature-card-pink', isDark: true },
  { bgClass: 'feature-card-lavender', isDark: false },
  { bgClass: 'feature-card-peach', isDark: false },
  { bgClass: 'feature-card-ochre', isDark: false }
];

export const PartyPlannerView: React.FC<PartyPlannerViewProps> = ({
  partyPlan,
  birthdays,
  onUpdatePartyPlan
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'guests' | 'gifts' | 'checklist'>('overview');
  const [newChecklistText, setNewChecklistText] = useState('');
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');

  const [chipInModalItem, setChipInModalItem] = useState<WishlistItem | null>(null);
  const [contributorName, setContributorName] = useState('');
  const [contributionAmount, setContributionAmount] = useState('25');
  const [copiedInvite, setCopiedInvite] = useState(false);

  const birthdayPerson = birthdays.find((b) => b.id === partyPlan.birthdayPersonId) || birthdays[0];

  const totalGiftGoal = partyPlan.wishlist.reduce((acc, item) => acc + item.estimatedCost, 0);
  const totalRaised = partyPlan.wishlist.reduce((acc, item) => acc + item.contributedAmount, 0);
  const confirmedCount = partyPlan.guests.filter((g) => g.rsvp === 'confirmed').length;

  const handleToggleChecklist = (itemId: string) => {
    const updated = partyPlan.checklist.map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item
    );
    onUpdatePartyPlan({ ...partyPlan, checklist: updated });
  };

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    const newItem = {
      id: `c-${Date.now()}`,
      task: newChecklistText.trim(),
      category: 'planning' as const,
      done: false
    };
    onUpdatePartyPlan({
      ...partyPlan,
      checklist: [...partyPlan.checklist, newItem]
    });
    setNewChecklistText('');
  };

  const handleUpdateRsvp = (guestId: string, status: GuestItem['rsvp']) => {
    const updated = partyPlan.guests.map((g) =>
      g.id === guestId ? { ...g, rsvp: status } : g
    );
    onUpdatePartyPlan({ ...partyPlan, guests: updated });
  };

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;
    const newGuest: GuestItem = {
      id: `g-${Date.now()}`,
      name: newGuestName.trim(),
      phone: newGuestPhone.trim() || undefined,
      rsvp: 'invited'
    };
    onUpdatePartyPlan({
      ...partyPlan,
      guests: [...partyPlan.guests, newGuest]
    });
    setNewGuestName('');
    setNewGuestPhone('');
  };

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chipInModalItem || !contributorName.trim()) return;
    const amount = Number(contributionAmount) || 10;

    sounds.playCelebrationFanfare();

    const updatedWishlist = partyPlan.wishlist.map((item) => {
      if (item.id === chipInModalItem.id) {
        return {
          ...item,
          contributedAmount: item.contributedAmount + amount,
          contributors: [
            ...item.contributors,
            { name: contributorName.trim(), amount }
          ]
        };
      }
      return item;
    });

    onUpdatePartyPlan({
      ...partyPlan,
      wishlist: updatedWishlist
    });

    setChipInModalItem(null);
    setContributorName('');
  };

  const inviteText = `🎉 You are invited to ${birthdayPerson.name}'s Birthday Celebration! 🎂\n\n` +
    `✨ Theme: ${partyPlan.theme}\n` +
    `📅 Date: ${partyPlan.date} at ${partyPlan.time}\n` +
    `📍 Location: ${partyPlan.location}\n` +
    `${partyPlan.isSurprise ? '🤫 PLEASE NOTE: THIS IS A SURPRISE! Do not tell ' + birthdayPerson.name + '!\n' : ''}\n` +
    `Please RSVP so we can finalize the guest list and cake! 🍰`;

  const handleCopyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteText);
      setCopiedInvite(true);
      setTimeout(() => setCopiedInvite(false), 2500);
    } catch {
      // fallback
    }
  };

  const whatsappInviteUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(inviteText)}`;

  return (
    <div className="space-y-8">
      {/* Featured Party Card (`feature-card-teal`) */}
      <div className="feature-card-teal p-7 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            {partyPlan.isSurprise && (
              <span className="px-3 py-1 rounded-full bg-[#ff4d8b] text-white text-[12px] font-semibold uppercase tracking-[1px]">
                Surprise Party
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-white/15 text-white text-[13px] font-medium">
              {partyPlan.date} · {partyPlan.time}
            </span>
          </div>
          <h2 className="clay-display-sm text-[32px] text-white">
            {partyPlan.title}
          </h2>
          <p className="text-[14px] text-white/85">
            {partyPlan.location} · <strong>{confirmedCount}/{partyPlan.guests.length} RSVPs</strong> · <strong>${totalRaised}/${totalGiftGoal} gift pool funded</strong>
          </p>
        </div>

        {/* Button-on-color (White button over saturated teal card) */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href={whatsappInviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-[44px] px-5 bg-[#ffffff] text-[#0a0a0a] rounded-[12px] text-[14px] font-semibold flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Share on WhatsApp</span>
          </a>

          <button
            onClick={handleCopyInvite}
            className="h-[44px] px-5 bg-white/15 text-white rounded-[12px] text-[14px] font-semibold flex items-center gap-2 cursor-pointer"
          >
            {copiedInvite ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Invite</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Clay Category Pill Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'gifts', label: `Gift Pool ($${totalRaised})` },
          { id: 'guests', label: `Guests (${partyPlan.guests.length})` },
          { id: 'checklist', label: 'Checklist' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-full text-[14px] font-medium cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#f5f0e0] text-[#0a0a0a]'
                : 'text-[#6a6a6a]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="feature-card-cream p-7 space-y-4">
            <h3 className="text-[18px] font-semibold text-[#0a0a0a] flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span>Celebration Details</span>
            </h3>

            <div className="bg-[#fffaf0] border border-[#e5e5e5] rounded-[16px] p-5 space-y-3 text-[14px]">
              <div className="flex justify-between py-2 border-b border-[#e5e5e5]">
                <span className="text-[#6a6a6a]">Celebrating</span>
                <span className="font-semibold text-[#0a0a0a]">{birthdayPerson.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#e5e5e5]">
                <span className="text-[#6a6a6a]">Theme</span>
                <span className="font-semibold text-[#0a0a0a]">{partyPlan.theme}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#e5e5e5]">
                <span className="text-[#6a6a6a]">Venue</span>
                <span className="font-semibold text-[#0a0a0a] text-right">{partyPlan.location}</span>
              </div>
              {partyPlan.notes && (
                <p className="text-[13px] text-[#3a3a3a] pt-1">
                  {partyPlan.notes}
                </p>
              )}
            </div>
          </div>

          <div className="feature-card-peach p-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-semibold text-[#0a0a0a] flex items-center gap-2">
                <Gift className="w-5 h-5" />
                <span>Group Gift Pool</span>
              </h3>
              <button
                onClick={() => setActiveTab('gifts')}
                className="text-[14px] font-semibold text-[#0a0a0a] underline cursor-pointer"
              >
                Chip in →
              </button>
            </div>

            <div className="space-y-3">
              {partyPlan.wishlist.map((item) => {
                const pct = Math.min(100, Math.round((item.contributedAmount / item.estimatedCost) * 100));
                return (
                  <div key={item.id} className="p-4 bg-[#fffaf0] rounded-[16px] border border-[#e5e5e5] space-y-2">
                    <div className="flex justify-between text-[14px] font-semibold text-[#0a0a0a]">
                      <span>{item.title}</span>
                      <span>${item.contributedAmount} / ${item.estimatedCost}</span>
                    </div>
                    <div className="w-full h-2 bg-[#f5f0e0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0a0a0a] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Group Gifts */}
      {activeTab === 'gifts' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partyPlan.wishlist.map((item, idx) => {
            const pct = Math.min(100, Math.round((item.contributedAmount / item.estimatedCost) * 100));
            const isFullyFunded = item.contributedAmount >= item.estimatedCost;
            const variant = GIFT_CARD_VARIANTS[idx % GIFT_CARD_VARIANTS.length];

            return (
              <div
                key={item.id}
                className={`${variant.bgClass} p-6 sm:p-7 flex flex-col justify-between gap-5`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-[18px] leading-[1.3]">{item.title}</h4>
                    {isFullyFunded && (
                      <span className="px-2.5 py-1 bg-[#a4d4c5] text-[#0a0a0a] rounded-full text-[12px] font-semibold shrink-0">
                        Funded
                      </span>
                    )}
                  </div>

                  <div className="bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] rounded-[16px] p-4 space-y-3">
                    <div className="text-[20px] font-semibold">
                      ${item.contributedAmount}{' '}
                      <span className="text-[13px] font-normal text-[#6a6a6a]">
                        of ${item.estimatedCost}
                      </span>
                    </div>

                    <div className="w-full h-2 bg-[#f5f0e0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0a0a0a] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="pt-2 border-t border-[#e5e5e5] space-y-1">
                      {item.contributors.map((c, cIdx) => (
                        <div key={cIdx} className="flex justify-between text-[13px] text-[#3a3a3a]">
                          <span>{c.name}</span>
                          <span className="font-semibold text-[#0a0a0a]">${c.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setChipInModalItem(item)}
                  disabled={isFullyFunded}
                  className={`w-full h-[44px] px-4 rounded-[12px] text-[14px] font-semibold cursor-pointer ${
                    isFullyFunded
                      ? 'bg-white/40 text-[#6a6a6a] cursor-not-allowed'
                      : variant.isDark
                      ? 'bg-[#ffffff] text-[#0a0a0a]'
                      : 'bg-[#0a0a0a] text-[#ffffff]'
                  }`}
                >
                  {isFullyFunded ? 'Goal Reached' : 'Chip In'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Guests */}
      {activeTab === 'guests' && (
        <div className="feature-card-cream p-7 space-y-5">
          <form onSubmit={handleAddGuest} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Guest name..."
              value={newGuestName}
              onChange={(e) => setNewGuestName(e.target.value)}
              className="flex-1 h-[44px] px-4 text-[14px] bg-[#fffaf0] border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-[#0a0a0a]"
            />
            <input
              type="tel"
              placeholder="Phone (optional)..."
              value={newGuestPhone}
              onChange={(e) => setNewGuestPhone(e.target.value)}
              className="sm:w-56 h-[44px] px-4 text-[14px] bg-[#fffaf0] border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-[#0a0a0a]"
            />
            <button
              type="submit"
              className="h-[44px] px-5 bg-[#0a0a0a] text-white rounded-[12px] text-[14px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Guest</span>
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {partyPlan.guests.map((guest) => {
              const callUri = getDirectCallUri(guest.phone);
              const waUrl = getWhatsAppShareUrl(guest.phone, inviteText);

              return (
                <div
                  key={guest.id}
                  className="p-4 bg-[#fffaf0] rounded-[16px] border border-[#e5e5e5] flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-[15px] font-semibold text-[#0a0a0a]">{guest.name}</p>
                    {guest.role && <p className="text-[12px] text-[#6a6a6a]">{guest.role}</p>}
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={guest.rsvp}
                      onChange={(e) => handleUpdateRsvp(guest.id, e.target.value as GuestItem['rsvp'])}
                      className="text-[13px] font-medium rounded-[8px] px-2.5 py-1.5 bg-[#f5f0e0] text-[#0a0a0a] border border-[#e5e5e5]"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="invited">Invited</option>
                      <option value="maybe">Maybe</option>
                      <option value="declined">Declined</option>
                    </select>

                    {guest.phone && (
                      <>
                        <a
                          href={callUri}
                          className="w-8 h-8 rounded-full bg-[#f5f0e0] text-[#0a0a0a] flex items-center justify-center"
                          title={`Call ${guest.name}`}
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-[#f5f0e0] text-[#0a0a0a] flex items-center justify-center"
                          title={`WhatsApp ${guest.name}`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Checklist */}
      {activeTab === 'checklist' && (
        <div className="feature-card-cream p-7 space-y-5">
          <form onSubmit={handleAddChecklistItem} className="flex gap-3">
            <input
              type="text"
              placeholder="Add party task..."
              value={newChecklistText}
              onChange={(e) => setNewChecklistText(e.target.value)}
              className="flex-1 h-[44px] px-4 text-[14px] bg-[#fffaf0] border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-[#0a0a0a]"
            />
            <button
              type="submit"
              className="h-[44px] px-5 bg-[#0a0a0a] text-white rounded-[12px] text-[14px] font-semibold cursor-pointer"
            >
              Add Task
            </button>
          </form>

          <div className="bg-[#fffaf0] rounded-[16px] border border-[#e5e5e5] p-4 space-y-2">
            {partyPlan.checklist.map((item) => (
              <label
                key={item.id}
                className={`flex items-center justify-between p-2.5 rounded-[12px] cursor-pointer ${
                  item.done ? 'text-[#9a9a9a] line-through' : 'text-[#0a0a0a]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => handleToggleChecklist(item.id)}
                    className="w-4 h-4 rounded accent-[#0a0a0a]"
                  />
                  <span className="text-[14px] font-medium">{item.task}</span>
                </div>
                {item.assignedTo && (
                  <span className="text-[12px] px-2.5 py-0.5 bg-[#f5f0e0] text-[#3a3a3a] rounded-full">
                    {item.assignedTo}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Chip-In Modal */}
      {chipInModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[#fffaf0] border border-[#e5e5e5] rounded-[24px] max-w-md w-full p-7 space-y-5">
            <h3 className="text-[20px] font-semibold text-[#0a0a0a]">
              Chip In: {chipInModalItem.title}
            </h3>

            <form onSubmit={handleContribute} className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#0a0a0a] mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Uncle Bob"
                  value={contributorName}
                  onChange={(e) => setContributorName(e.target.value)}
                  className="w-full h-[44px] px-4 text-[14px] bg-[#fffaf0] border border-[#e5e5e5] rounded-[12px]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0a0a0a] mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  className="w-full h-[44px] px-4 text-[14px] bg-[#fffaf0] border border-[#e5e5e5] rounded-[12px]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setChipInModalItem(null)}
                  className="flex-1 h-[44px] bg-[#f5f0e0] text-[#0a0a0a] rounded-[12px] text-[14px] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-[44px] bg-[#0a0a0a] text-white rounded-[12px] text-[14px] font-semibold cursor-pointer"
                >
                  Confirm (${contributionAmount})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
