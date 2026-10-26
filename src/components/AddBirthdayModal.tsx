import React, { useState } from 'react';
import { X, Calendar, Phone, Bell, Gift } from 'lucide-react';
import { BirthdayPerson, Relationship } from '../types/birthday';

interface AddBirthdayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPerson: (person: BirthdayPerson) => void;
}

const EMOJI_OPTIONS = ['🎂', '🎉', '✨', '🎸', '🌸', '🚀', '👑', '🎁', '🍕', '🥂', '🦁', '⭐'];

export const AddBirthdayModal: React.FC<AddBirthdayModalProps> = ({
  isOpen,
  onClose,
  onAddPerson
}) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState<Relationship>('friend');
  const [avatarEmoji, setAvatarEmoji] = useState('🎂');
  const [notes, setNotes] = useState('');
  const [favoriteThingsStr, setFavoriteThingsStr] = useState('');

  const [sameDay, setSameDay] = useState(true);
  const [oneDayBefore, setOneDayBefore] = useState(true);
  const [threeDaysBefore, setThreeDaysBefore] = useState(false);
  const [oneWeekBefore, setOneWeekBefore] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !birthDate) return;

    const favorites = favoriteThingsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newPerson: BirthdayPerson = {
      id: `b-${Date.now()}`,
      name: name.trim(),
      birthDate,
      phone: phone.trim(),
      relationship,
      avatarColor: 'bg-[#ffb084]',
      avatarEmoji,
      notes: notes.trim(),
      favoriteThings: favorites,
      reminders: {
        sameDay,
        oneDayBefore,
        threeDaysBefore,
        oneWeekBefore,
        time: '09:00'
      },
      customCardTheme: 'aurora'
    };

    onAddPerson(newPerson);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-bday-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0a]/50 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-[#fffaf0] rounded-[24px] border border-[#e5e5e5] overflow-hidden my-auto max-h-[90vh] flex flex-col text-[#0a0a0a]">
        {/* Header (`#faf5e8` soft cream) */}
        <div className="px-6 py-4 border-b border-[#e5e5e5] flex items-center justify-between bg-[#faf5e8]">
          <div>
            <h2 id="add-bday-title" className="clay-display-sm text-[22px] text-[#0a0a0a]">
              Add Birthday
            </h2>
            <p className="text-[13px] text-[#6a6a6a]">
              Save a birthday to your circle with reminders & 1-tap calling
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close form"
            className="w-9 h-9 rounded-full bg-[#fffaf0] border border-[#e5e5e5] text-[#0a0a0a] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Avatar Emoji Picker */}
          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-[1px] text-[#3a3a3a] mb-2">
              Choose Avatar
            </label>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#ffb084] border border-[#e5e5e5] flex items-center justify-center text-2xl shrink-0">
                {avatarEmoji}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    type="button"
                    key={emoji}
                    onClick={() => setAvatarEmoji(emoji)}
                    className={`w-8 h-8 text-sm rounded-[8px] flex items-center justify-center border cursor-pointer ${
                      avatarEmoji === emoji
                        ? 'border-[#0a0a0a] bg-[#f5f0e0]'
                        : 'border-[#e5e5e5] bg-[#fffaf0]'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Name & Relationship */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#3a3a3a] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya Lin"
                className="w-full h-[44px] px-4 text-[14px] bg-[#fffaf0] border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#3a3a3a] mb-1">
                Relationship
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value as Relationship)}
                className="w-full h-[44px] px-4 text-[14px] bg-[#fffaf0] border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-[#0a0a0a]"
              >
                <option value="family">Family</option>
                <option value="friend">Best Friend</option>
                <option value="partner">Partner / Spouse</option>
                <option value="colleague">Colleague / Work</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Birth Date & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#3a3a3a] mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Date of Birth *</span>
              </label>
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full h-[44px] px-4 text-[14px] bg-[#fffaf0] border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#3a3a3a] mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                <span>Phone (Calls & WhatsApp)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full h-[44px] px-4 text-[14px] bg-[#fffaf0] border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>
          </div>

          {/* Favorites & Gift Wishlist */}
          <div>
            <label className="block text-[12px] font-semibold text-[#3a3a3a] mb-1 flex items-center gap-1">
              <Gift className="w-3.5 h-3.5" />
              <span>Favorites & Gift Ideas (comma separated)</span>
            </label>
            <input
              type="text"
              value={favoriteThingsStr}
              onChange={(e) => setFavoriteThingsStr(e.target.value)}
              placeholder="e.g. Scented candles, Sci-fi books, Matcha"
              className="w-full h-[44px] px-4 text-[14px] bg-[#fffaf0] border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-[#0a0a0a]"
            />
          </div>

          {/* Personal Notes */}
          <div>
            <label className="block text-[12px] font-semibold text-[#3a3a3a] mb-1">
              Personal Note
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Loves carrot cake and morning calls"
              className="w-full p-3.5 text-[14px] bg-[#fffaf0] border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-[#0a0a0a] resize-none"
            />
          </div>

          {/* Reminder Preferences */}
          <div className="p-4 bg-[#faf5e8] rounded-[16px] border border-[#e5e5e5] space-y-2">
            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#0a0a0a]">
              <Bell className="w-4 h-4" />
              <span>Reminder Notifications</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[13px] text-[#3a3a3a]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sameDay}
                  onChange={(e) => setSameDay(e.target.checked)}
                  className="accent-[#0a0a0a]"
                />
                <span>On the Day (9:00 AM)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={oneDayBefore}
                  onChange={(e) => setOneDayBefore(e.target.checked)}
                  className="accent-[#0a0a0a]"
                />
                <span>1 Day Before</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={threeDaysBefore}
                  onChange={(e) => setThreeDaysBefore(e.target.checked)}
                  className="accent-[#0a0a0a]"
                />
                <span>3 Days Before</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={oneWeekBefore}
                  onChange={(e) => setOneWeekBefore(e.target.checked)}
                  className="accent-[#0a0a0a]"
                />
                <span>1 Week Before</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#e5e5e5]">
            <button
              type="button"
              onClick={onClose}
              className="h-[44px] px-5 bg-[#fffaf0] border border-[#e5e5e5] text-[#0a0a0a] text-[14px] font-semibold rounded-[12px] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-[44px] px-5 bg-[#0a0a0a] text-[#ffffff] text-[14px] font-semibold rounded-[12px] cursor-pointer"
            >
              Save Birthday
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
