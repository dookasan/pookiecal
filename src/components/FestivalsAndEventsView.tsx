import React, { useState } from 'react';
import {
  Sparkles,
  Package,
  ShoppingBag,
  Plus,
  Check,
  Phone,
  MessageCircle,
  ExternalLink,
  Search,
  Bell,
  Trash2
} from 'lucide-react';
import { CustomEvent, FestivalCatalogItem, PrepItem, BirthdayPerson } from '../types/birthday';
import { FESTIVALS_CATALOG } from '../utils/festivalData';
import {
  calculateDaysUntilDate,
  getWebShoppingUrl,
  createEventFromFestival,
  getPendingPrepCounts,
  getSortedUpcomingEvents
} from '../utils/festivalUtils';
import { getDirectCallUri, getWhatsAppShareUrl } from '../utils/birthdayUtils';
import { sounds } from '../utils/audioEffects';

interface FestivalsAndEventsViewProps {
  events: CustomEvent[];
  contacts: BirthdayPerson[];
  onAddEvent?: (newEvent: CustomEvent) => void;
  onUpdateEvent: (updated: CustomEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onAddEventClick: () => void;
  onOpenCallModal?: (person: BirthdayPerson) => void;
}

const CLAY_VARIANTS = [
  { bgClass: 'feature-card-peach', isDark: false },
  { bgClass: 'feature-card-teal', isDark: true },
  { bgClass: 'feature-card-lavender', isDark: false },
  { bgClass: 'feature-card-pink', isDark: true },
  { bgClass: 'feature-card-ochre', isDark: false },
  { bgClass: 'feature-card-cream', isDark: false }
];

export const FestivalsAndEventsView: React.FC<FestivalsAndEventsViewProps> = ({
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onAddEventClick
}) => {
  const [activeTab, setActiveTab] = useState<'myEvents' | 'catalog'>('myEvents');
  const [festivalCategoryFilter, setFestivalCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [newCarryTextMap, setNewCarryTextMap] = useState<Record<string, string>>({});
  const [newShopTextMap, setNewShopTextMap] = useState<Record<string, string>>({});

  const sortedEvents = getSortedUpcomingEvents(events);

  const isFestivalAdded = (festId: string) => {
    const fest = FESTIVALS_CATALOG.find((f) => f.id === festId);
    if (!fest) return false;
    return events.some(
      (e) => e.id.includes(festId) || e.title.toLowerCase().includes(fest.name.split(' ')[0].toLowerCase())
    );
  };

  const handleAddFestivalToReminders = (fest: FestivalCatalogItem) => {
    const newEvt = createEventFromFestival(fest);
    if (onAddEvent) {
      onAddEvent(newEvt);
    } else {
      onUpdateEvent(newEvt);
    }
    sounds.playCelebrationFanfare();
    setActiveTab('myEvents');
  };

  const handleTogglePrepItem = (event: CustomEvent, itemId: string) => {
    const updatedItems = event.prepItems.map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item
    );
    onUpdateEvent({
      ...event,
      prepItems: updatedItems
    });
  };

  const handleAddCarryItem = (e: React.FormEvent, event: CustomEvent) => {
    e.preventDefault();
    const text = (newCarryTextMap[event.id] || '').trim();
    if (!text) return;

    const newItem: PrepItem = {
      id: `carry-${Date.now()}`,
      text,
      category: 'to-carry',
      done: false
    };

    onUpdateEvent({
      ...event,
      prepItems: [...event.prepItems, newItem]
    });

    setNewCarryTextMap((prev) => ({ ...prev, [event.id]: '' }));
  };

  const handleAddShopItem = (e: React.FormEvent, event: CustomEvent) => {
    e.preventDefault();
    const text = (newShopTextMap[event.id] || '').trim();
    if (!text) return;

    const newItem: PrepItem = {
      id: `shop-${Date.now()}`,
      text,
      category: 'to-shop',
      done: false,
      webShopQuery: text
    };

    onUpdateEvent({
      ...event,
      prepItems: [...event.prepItems, newItem]
    });

    setNewShopTextMap((prev) => ({ ...prev, [event.id]: '' }));
  };

  const filteredFestivals = FESTIVALS_CATALOG.filter((fest) => {
    const matchesCat = festivalCategoryFilter === 'all' || fest.category === festivalCategoryFilter;
    const matchesSearch =
      fest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fest.traditions.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Clay Sub-Nav Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('myEvents')}
            className={`px-4 py-2 rounded-full text-[14px] font-medium flex items-center gap-2 cursor-pointer ${
              activeTab === 'myEvents'
                ? 'bg-[#f5f0e0] text-[#0a0a0a]'
                : 'text-[#6a6a6a]'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>My Visits & Reminders ({events.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-full text-[14px] font-medium flex items-center gap-2 cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-[#f5f0e0] text-[#0a0a0a]'
                : 'text-[#6a6a6a]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Festivals Catalog ({FESTIVALS_CATALOG.length})</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {activeTab === 'catalog' && (
            <>
              <div className="relative">
                <Search className="w-4 h-4 text-[#6a6a6a] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search festivals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-[44px] pl-10 pr-4 text-[14px] bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] focus:border-[#0a0a0a] rounded-[12px] focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-1">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'cultural', label: 'Cultural' },
                  { id: 'global', label: 'Global' },
                  { id: 'seasonal', label: 'Seasonal' }
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setFestivalCategoryFilter(c.id)}
                    className={`px-3.5 py-2 text-[13px] rounded-full font-medium cursor-pointer ${
                      festivalCategoryFilter === c.id
                        ? 'bg-[#f5f0e0] text-[#0a0a0a]'
                        : 'text-[#6a6a6a]'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </>
          )}

          <button
            onClick={onAddEventClick}
            className="h-[44px] px-5 bg-[#0a0a0a] text-[#ffffff] rounded-[12px] text-[14px] font-semibold flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Plan Visit</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MY REMINDERS & VISITS */}
      {activeTab === 'myEvents' && (
        <div>
          {sortedEvents.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sortedEvents.map((event, idx) => {
                const daysLeft = calculateDaysUntilDate(event.date);
                const prepCounts = getPendingPrepCounts(event);
                const isToday = daysLeft === 0;
                const variant = CLAY_VARIANTS[idx % CLAY_VARIANTS.length];

                const carryItems = event.prepItems.filter((p) => p.category === 'to-carry');
                const shopItems = event.prepItems.filter((p) => p.category === 'to-shop');

                const callUri = event.personPhone ? getDirectCallUri(event.personPhone) : '';
                const whatsappUrl = event.personPhone
                  ? getWhatsAppShareUrl(event.personPhone, `Hey ${event.personName || ''}! Looking forward to our visit / celebration for ${event.title}!`)
                  : '';

                return (
                  <div
                    key={event.id}
                    className={`${variant.bgClass} p-6 sm:p-8 flex flex-col justify-between gap-5`}
                  >
                    {/* Header */}
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3.5">
                          <div className="w-12 h-12 rounded-full bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] flex items-center justify-center text-2xl shrink-0">
                            {event.emoji || '📅'}
                          </div>

                          <div>
                            <h3 className="text-[18px] font-semibold leading-[1.35]">
                              {event.title}
                            </h3>
                            <p className={`text-[13px] mt-0.5 ${variant.isDark ? 'text-white/80' : 'text-[#3a3a3a]'}`}>
                              <span className="capitalize">{event.type}</span>
                              {' · '}
                              <span>{event.date}{event.time ? `, ${event.time}` : ''}</span>
                              {event.location ? ` · ${event.location}` : ''}
                            </p>
                          </div>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-[13px] font-medium tabular-nums shrink-0 ${
                          variant.isDark ? 'bg-white/20 text-white' : 'bg-[#fffaf0] text-[#0a0a0a]'
                        }`}>
                          {isToday ? 'Today!' : daysLeft === 1 ? 'Tomorrow' : `${daysLeft}d`}
                        </span>
                      </div>

                      {event.personName && (
                        <div className="mt-3 flex items-center justify-between text-[13px]">
                          <span className={variant.isDark ? 'text-white/90' : 'text-[#1a1a1a]'}>
                            Visiting <strong>{event.personName}</strong>
                          </span>

                          {event.personPhone && (
                            <div className="flex items-center gap-1.5">
                              <a
                                href={callUri}
                                title={`Call ${event.personName}`}
                                className="w-8 h-8 rounded-full bg-[#fffaf0] text-[#0a0a0a] flex items-center justify-center"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`WhatsApp ${event.personName}`}
                                className="w-8 h-8 rounded-full bg-[#fffaf0] text-[#0a0a0a] flex items-center justify-center"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Embedded Product Mockup Card (`product-mockup-card`) for Checklists */}
                    <div className="bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] rounded-[16px] p-5 space-y-4 flex-1">
                      {event.notes && (
                        <p className="text-[13px] text-[#3a3a3a]">
                          {event.notes}
                        </p>
                      )}

                      {/* 1. To Carry */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-[13px] text-[#0a0a0a] flex items-center gap-1.5">
                          <Package className="w-4 h-4 text-[#6a6a6a]" />
                          <span>To Carry ({carryItems.filter((i) => i.done).length}/{carryItems.length})</span>
                        </h4>

                        {carryItems.length > 0 && (
                          <div className="space-y-1">
                            {carryItems.map((item) => (
                              <label
                                key={item.id}
                                className={`flex items-start gap-2.5 text-[13px] py-1 cursor-pointer ${
                                  item.done ? 'text-[#9a9a9a] line-through' : 'text-[#1a1a1a]'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={item.done}
                                  onChange={() => handleTogglePrepItem(event, item.id)}
                                  className="mt-0.5 rounded accent-[#0a0a0a] cursor-pointer"
                                />
                                <span className="flex-1">{item.text}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        <form
                          onSubmit={(e) => handleAddCarryItem(e, event)}
                          className="flex gap-2 pt-1"
                        >
                          <input
                            type="text"
                            placeholder="Add item to carry..."
                            value={newCarryTextMap[event.id] || ''}
                            onChange={(e) =>
                              setNewCarryTextMap((prev) => ({ ...prev, [event.id]: e.target.value }))
                            }
                            className="flex-1 h-9 px-3 text-[13px] bg-[#faf5e8] border border-[#e5e5e5] rounded-[8px] focus:outline-none focus:border-[#0a0a0a]"
                          />
                          <button
                            type="submit"
                            className="h-9 px-3.5 bg-[#0a0a0a] text-white text-[12px] font-semibold rounded-[8px] shrink-0 cursor-pointer"
                          >
                            Add
                          </button>
                        </form>
                      </div>

                      {/* 2. Shop Online */}
                      <div className="pt-3 border-t border-[#e5e5e5] space-y-2">
                        <h4 className="font-semibold text-[13px] text-[#0a0a0a] flex items-center gap-1.5">
                          <ShoppingBag className="w-4 h-4 text-[#6a6a6a]" />
                          <span>Shop Online ({shopItems.filter((i) => i.done).length}/{shopItems.length})</span>
                        </h4>

                        {shopItems.length > 0 && (
                          <div className="space-y-1.5">
                            {shopItems.map((item) => (
                              <div
                                key={item.id}
                                className={`flex items-center justify-between gap-2 py-1 text-[13px] ${
                                  item.done ? 'opacity-50 line-through' : ''
                                }`}
                              >
                                <label className="flex items-center gap-2 cursor-pointer flex-1 truncate text-[#1a1a1a]">
                                  <input
                                    type="checkbox"
                                    checked={item.done}
                                    onChange={() => handleTogglePrepItem(event, item.id)}
                                    className="rounded accent-[#0a0a0a]"
                                  />
                                  <span className="truncate">{item.text}</span>
                                </label>

                                {item.webShopQuery && (
                                  <a
                                    href={getWebShoppingUrl(item.webShopQuery)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 px-2.5 py-1 bg-[#f5f0e0] text-[#0a0a0a] rounded-full text-[11px] font-semibold shrink-0"
                                  >
                                    <span>Buy</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        <form
                          onSubmit={(e) => handleAddShopItem(e, event)}
                          className="flex gap-2 pt-1"
                        >
                          <input
                            type="text"
                            placeholder="Add item to shop online..."
                            value={newShopTextMap[event.id] || ''}
                            onChange={(e) =>
                              setNewShopTextMap((prev) => ({ ...prev, [event.id]: e.target.value }))
                            }
                            className="flex-1 h-9 px-3 text-[13px] bg-[#faf5e8] border border-[#e5e5e5] rounded-[8px] focus:outline-none focus:border-[#0a0a0a]"
                          />
                          <button
                            type="submit"
                            className="h-9 px-3.5 bg-[#0a0a0a] text-white text-[12px] font-semibold rounded-[8px] shrink-0 cursor-pointer"
                          >
                            Add
                          </button>
                        </form>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-[13px]">
                      <span className={variant.isDark ? 'text-white/85' : 'text-[#3a3a3a]'}>
                        {prepCounts.totalPending === 0
                          ? 'All items ready'
                          : `${prepCounts.totalPending} pending items`}
                      </span>

                      <button
                        onClick={() => onDeleteEvent(event.id)}
                        className={`p-1.5 rounded-full cursor-pointer ${
                          variant.isDark ? 'text-white/70 hover:text-white' : 'text-[#6a6a6a] hover:text-[#0a0a0a]'
                        }`}
                        title="Delete reminder"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#f5f0e0] rounded-[24px] p-12 text-center max-w-md mx-auto space-y-4">
              <h4 className="font-semibold text-[#0a0a0a] text-[18px]">No visits or reminders planned</h4>
              <p className="text-[14px] text-[#3a3a3a]">
                Add a festival from the catalog or plan a family visit.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="h-[44px] px-5 bg-[#0a0a0a] text-white text-[14px] font-semibold rounded-[12px] cursor-pointer"
                >
                  Browse Festivals
                </button>
                <button
                  onClick={onAddEventClick}
                  className="h-[44px] px-5 bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] text-[14px] font-semibold rounded-[12px] cursor-pointer"
                >
                  Plan Visit
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FESTIVALS AHEAD CATALOG */}
      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFestivals.map((fest, idx) => {
            const daysLeft = calculateDaysUntilDate(fest.date);
            const alreadyAdded = isFestivalAdded(fest.id);
            const variant = CLAY_VARIANTS[idx % CLAY_VARIANTS.length];
            const whatsappGreetUrl = getWhatsAppShareUrl(
              '',
              `${fest.defaultWishes[0]}\n\n✨ Shared via PookieCal`
            );

            return (
              <div
                key={fest.id}
                className={`${variant.bgClass} p-6 sm:p-7 flex flex-col justify-between gap-5`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] flex items-center justify-center text-2xl">
                        {fest.emoji}
                      </div>
                      <div>
                        <h4 className="font-semibold text-[18px] leading-[1.3]">{fest.name}</h4>
                        <p className={`text-[13px] mt-0.5 ${variant.isDark ? 'text-white/80' : 'text-[#3a3a3a]'}`}>
                          {fest.date} · <span className="capitalize">{fest.category}</span>
                        </p>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-[13px] font-medium tabular-nums shrink-0 ${
                      variant.isDark ? 'bg-white/20 text-white' : 'bg-[#fffaf0] text-[#0a0a0a]'
                    }`}>
                      {daysLeft === 0 ? 'Today' : daysLeft === 1 ? 'Tomorrow' : `${daysLeft}d`}
                    </span>
                  </div>

                  {/* Embedded Product Mockup Card */}
                  <div className="bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] rounded-[16px] p-4 space-y-2 text-[13px]">
                    <p className="text-[#3a3a3a] line-clamp-2">{fest.description}</p>
                    <p className="text-[#1a1a1a] truncate pt-1 border-t border-[#e5e5e5]">
                      <span className="font-semibold">Carry:</span>{' '}
                      {fest.suggestedCarryItems.slice(0, 2).join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <a
                    href={whatsappGreetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-[44px] px-4 rounded-[12px] bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] flex items-center gap-1.5 text-[13px] font-semibold"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    onClick={() => handleAddFestivalToReminders(fest)}
                    disabled={alreadyAdded}
                    className={`h-[44px] px-4 rounded-[12px] text-[13px] font-semibold flex items-center gap-1.5 cursor-pointer ${
                      alreadyAdded
                        ? 'bg-[#a4d4c5] text-[#0a0a0a] cursor-default'
                        : variant.isDark
                        ? 'bg-[#ffffff] text-[#0a0a0a]'
                        : 'bg-[#0a0a0a] text-[#ffffff]'
                    }`}
                  >
                    {alreadyAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add Reminder</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
