import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  ShoppingBag,
  Package,
  Bell
} from 'lucide-react';
import { BirthdayPerson, CustomEvent, EventType, PrepItem } from '../types/birthday';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (event: CustomEvent) => void;
  contacts: BirthdayPerson[];
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onAddEvent,
  contacts
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('visit');
  const [date, setDate] = useState(
    () => new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [time, setTime] = useState('11:00 AM');
  const [selectedPersonId, setSelectedPersonId] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const [carryItemsText, setCarryItemsText] = useState(
    'Carry fresh sweets from bakery 🍬\nBring gift hamper 🎁'
  );
  const [shopItemsText, setShopItemsText] = useState(
    'Order specialty sweets box online\nBuy bouquet of flowers'
  );

  const [sameDay, setSameDay] = useState(true);
  const [oneDayBefore, setOneDayBefore] = useState(true);
  const [threeDaysBefore, setThreeDaysBefore] = useState(false);
  const [twoHoursBefore, setTwoHoursBefore] = useState(true);

  if (!isOpen) return null;

  const selectedPerson = contacts.find((c) => c.id === selectedPersonId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    const prepItems: PrepItem[] = [];

    carryItemsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((line, idx) => {
        prepItems.push({
          id: `prep-carry-${Date.now()}-${idx}`,
          text: line,
          category: 'to-carry',
          done: false
        });
      });

    shopItemsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((line, idx) => {
        prepItems.push({
          id: `prep-shop-${Date.now()}-${idx}`,
          text: line,
          category: 'to-shop',
          done: false,
          webShopQuery: line
        });
      });

    let emoji = '📅';
    const color = 'feature-card-peach';
    if (type === 'visit') emoji = '🏡';
    else if (type === 'festival') emoji = '🪔';
    else if (type === 'anniversary') emoji = '💍';
    else if (type === 'party') emoji = '🎉';

    const newEvent: CustomEvent = {
      id: `ev-${Date.now()}`,
      title: title.trim(),
      type,
      date,
      time: time.trim() || undefined,
      personId: selectedPerson?.id,
      personName: selectedPerson?.name,
      personPhone: selectedPerson?.phone,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
      prepItems,
      reminders: {
        sameDay,
        oneDayBefore,
        threeDaysBefore,
        twoHoursBefore
      },
      isAddedToReminder: true,
      emoji,
      color
    };

    onAddEvent(newEvent);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-event-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#0a0a0a]/50 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-xl bg-[#fffaf0] rounded-[24px] border border-[#e5e5e5] overflow-hidden my-auto max-h-[92vh] flex flex-col text-[#0a0a0a]">
        {/* Header (`#faf5e8`) */}
        <div className="px-6 py-4 bg-[#faf5e8] border-b border-[#e5e5e5] flex items-center justify-between shrink-0">
          <div>
            <h2 id="add-event-title" className="clay-display-sm text-[22px] text-[#0a0a0a]">
              Plan Visit or Festival
            </h2>
            <p className="text-[13px] text-[#6a6a6a]">
              Schedule family visits with to-carry sweets & web shopping checklists
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-9 h-9 rounded-full bg-[#fffaf0] border border-[#e5e5e5] text-[#0a0a0a] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-[1px] text-[#3a3a3a] mb-2">
              Event Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'visit', label: 'Visit 🏡', desc: 'Parents & friends' },
                { id: 'festival', label: 'Festival 🪔', desc: 'Cultural holidays' },
                { id: 'anniversary', label: 'Anniversary 💍', desc: 'Milestones' },
                { id: 'party', label: 'Party 🎉', desc: 'Gatherings' }
              ].map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setType(cat.id as EventType)}
                  className={`p-3 rounded-[12px] border text-left cursor-pointer ${
                    type === cat.id
                      ? 'border-[#0a0a0a] bg-[#f5f0e0]'
                      : 'border-[#e5e5e5] bg-[#fffaf0]'
                  }`}
                >
                  <p className="text-[13px] font-semibold text-[#0a0a0a]">{cat.label}</p>
                  <p className="text-[11px] text-[#6a6a6a] mt-0.5">{cat.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#3a3a3a] mb-1">
              Event / Visit Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Visit Mom & Parents, Coffee meetup with Liam"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-[44px] px-4 text-[14px] bg-[#fffaf0] border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-[#0a0a0a]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#3a3a3a] mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>Visiting or Meeting (Connected Person)</span>
            </label>
            <select
              value={selectedPersonId}
              onChange={(e) => setSelectedPersonId(e.target.value)}
              className="w-full h-[44px] px-4 text-[14px] bg-[#fffaf0] border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-[#0a0a0a]"
            >
              <option value="">None / General Event</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.avatarEmoji || '👤'} {c.name} ({c.phone || c.email || 'Contact'})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#3a3a3a] mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Date *</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-[44px] px-4 text-[14px] bg-[#fffaf0] border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#3a3a3a] mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Time</span>
              </label>
              <input
                type="text"
                placeholder="10:30 AM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-[44px] px-4 text-[14px] bg-[#fffaf0] border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#3a3a3a] mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Location</span>
              </label>
              <input
                type="text"
                placeholder="Home, Cafe..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-[44px] px-4 text-[14px] bg-[#fffaf0] border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>
          </div>

          <div className="p-4 bg-[#faf5e8] rounded-[16px] border border-[#e5e5e5] space-y-2">
            <label className="block text-[13px] font-semibold text-[#0a0a0a] flex items-center gap-1.5">
              <Package className="w-4 h-4" />
              <span>Things to Carry Before Visiting (One per line)</span>
            </label>
            <textarea
              rows={2}
              value={carryItemsText}
              onChange={(e) => setCarryItemsText(e.target.value)}
              className="w-full p-3 text-[13px] bg-[#fffaf0] border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-[#0a0a0a]"
            />
          </div>

          <div className="p-4 bg-[#f5f0e0] rounded-[16px] border border-[#e5e5e5] space-y-2">
            <label className="block text-[13px] font-semibold text-[#0a0a0a] flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4" />
              <span>Items to Shop Online (One per line)</span>
            </label>
            <textarea
              rows={2}
              value={shopItemsText}
              onChange={(e) => setShopItemsText(e.target.value)}
              className="w-full p-3 text-[13px] bg-[#fffaf0] border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-[#0a0a0a]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#3a3a3a] mb-1">
              Personal Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Topics to catch up on..."
              className="w-full p-3 text-[13px] bg-[#fffaf0] border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-[#0a0a0a] resize-none"
            />
          </div>

          <div className="p-4 bg-[#faf5e8] rounded-[16px] border border-[#e5e5e5] text-[13px] space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-[#0a0a0a]">
              <Bell className="w-4 h-4" />
              <span>Reminder Schedule</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[#3a3a3a]">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sameDay}
                  onChange={(e) => setSameDay(e.target.checked)}
                  className="accent-[#0a0a0a]"
                />
                <span>Day of visit</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoHoursBefore}
                  onChange={(e) => setTwoHoursBefore(e.target.checked)}
                  className="accent-[#0a0a0a]"
                />
                <span>2 hours before</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={oneDayBefore}
                  onChange={(e) => setOneDayBefore(e.target.checked)}
                  className="accent-[#0a0a0a]"
                />
                <span>1 day before</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={threeDaysBefore}
                  onChange={(e) => setThreeDaysBefore(e.target.checked)}
                  className="accent-[#0a0a0a]"
                />
                <span>3 days before</span>
              </label>
            </div>
          </div>

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
              Save Event & Reminders
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
