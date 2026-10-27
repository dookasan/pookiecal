import React, { useState, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MessageSquare,
  ExternalLink,
  Plus,
  Upload,
  X,
  Check,
  Image as ImageIcon
} from 'lucide-react';
import { BirthdayPerson, GooglePhotoItem } from '../types/birthday';
import {
  getCircleMemoriesOfTheDay,
  buildFallbackMemorySvgDataUrl
} from '../utils/memoriesUtils';
import { getWhatsAppShareUrl } from '../utils/birthdayUtils';

interface MemoriesOfTheDayCardProps {
  contacts: BirthdayPerson[];
  onOpenGoogleHub: (person: BirthdayPerson, initialTab?: 'all' | 'gmail' | 'chat' | 'photos' | 'youtube' | 'suggestions') => void;
  onOpenCardStudio: (person: BirthdayPerson) => void;
  onAddPhotoMemory?: (personId: string, newPhoto: GooglePhotoItem) => void;
}

export const MemoriesOfTheDayCard: React.FC<MemoriesOfTheDayCardProps> = ({
  contacts,
  onOpenGoogleHub,
  onOpenCardStudio,
  onAddPhotoMemory
}) => {
  const memories = getCircleMemoriesOfTheDay(contacts);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAddingMemory, setIsAddingMemory] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<string>(contacts[0]?.id || '');
  const [captionInput, setCaptionInput] = useState('');
  const [albumInput, setAlbumInput] = useState('Memories of the Day');
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [savedToast, setSavedToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (memories.length === 0) return null;

  const safeIndex = activeIndex % memories.length;
  const activeMemory = memories[safeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + memories.length) % memories.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % memories.length);
  };

  const whatsappShareHref = getWhatsAppShareUrl(
    activeMemory.personPhone || '',
    `Hey ${activeMemory.personName}! Just saw our PookieCal Memory of the Day: "${activeMemory.caption}" (${activeMemory.date} · ${activeMemory.album}). Thought of you today!`
  );

  const handleSaveNewMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddPhotoMemory) return;
    const targetPerson = contacts.find((c) => c.id === selectedPersonId) || contacts[0];
    if (!targetPerson) return;

    const finalCaption = captionInput.trim() || `Special moment with ${targetPerson.name}`;
    const finalAlbum = albumInput.trim() || 'Memories of the Day';
    const finalUrl =
      photoUrlInput.trim() ||
      buildFallbackMemorySvgDataUrl(targetPerson.name, finalCaption, finalAlbum, memories.length);

    const newPhoto: GooglePhotoItem = {
      id: `mem-day-${Date.now()}`,
      url: finalUrl,
      caption: finalCaption,
      date: 'Captured Today',
      album: finalAlbum
    };

    onAddPhotoMemory(targetPerson.id, newPhoto);
    setSavedToast(true);
    setCaptionInput('');
    setPhotoUrlInput('');
    setTimeout(() => {
      setSavedToast(false);
      setIsAddingMemory(false);
      setActiveIndex(0);
    }, 900);
  };

  const handleLocalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onAddPhotoMemory) return;
    const targetPerson = contacts.find((c) => c.id === selectedPersonId) || activeMemory.personRef;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const newPhoto: GooglePhotoItem = {
        id: `mem-upload-${Date.now()}`,
        url: dataUrl,
        caption: captionInput.trim() || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        date: 'Captured Today',
        album: albumInput.trim() || 'Memories of the Day'
      };
      onAddPhotoMemory(targetPerson.id, newPhoto);
      setIsAddingMemory(false);
      setActiveIndex(0);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section
      aria-label="Memories of the Day Highlight"
      className="rounded-[28px] bg-[#F4EFE6] border border-[#E6E0D3] p-5 sm:p-7 lg:p-8"
    >
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E6E0D3]">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-semibold text-[#FF4D8B]">
            <span>Google Photos · Memories of the Day</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#525E66] tabular-nums">
              {safeIndex + 1} of {memories.length} Circle Highlights
            </span>
          </div>
          <h2 className="text-[24px] sm:text-[28px] font-bold text-[#111B21] tracking-tight mt-0.5">
            Relive your favorite moments with your circle
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onAddPhotoMemory && (
            <button
              type="button"
              onClick={() => {
                setSelectedPersonId(activeMemory.personId);
                setIsAddingMemory(!isAddingMemory);
              }}
              className="h-[40px] px-4 rounded-full bg-[#FCFBF7] hover:bg-[#EAE3D5] text-[#111B21] border border-[#D6CFC0] text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Today’s Memory</span>
            </button>
          )}

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous memory of the day"
              className="w-10 h-10 rounded-full bg-[#FCFBF7] hover:bg-[#EAE3D5] border border-[#D6CFC0] text-[#111B21] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next memory of the day"
              className="w-10 h-10 rounded-full bg-[#FCFBF7] hover:bg-[#EAE3D5] border border-[#D6CFC0] text-[#111B21] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Optional Add Memory Drawer */}
      {isAddingMemory && (
        <form
          onSubmit={handleSaveNewMemory}
          className="mt-5 p-5 rounded-[20px] bg-[#FCFBF7] border border-[#D6CFC0] space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-bold text-[#111B21]">
              Add a New Photo Memory to Google Hub &amp; Dashboard
            </span>
            <button
              type="button"
              onClick={() => setIsAddingMemory(false)}
              aria-label="Close add memory form"
              className="text-[#525E66] hover:text-[#111B21] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label
                htmlFor="memory-person-select"
                className="block text-[12px] font-semibold text-[#374248] mb-1"
              >
                Circle Member
              </label>
              <select
                id="memory-person-select"
                value={selectedPersonId}
                onChange={(e) => setSelectedPersonId(e.target.value)}
                className="w-full h-[42px] px-3.5 rounded-[12px] bg-white border border-[#D6CFC0] text-[13px] text-[#111B21] focus:outline-none focus:border-[#111B21]"
              >
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.relationship})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="memory-caption-input"
                className="block text-[12px] font-semibold text-[#374248] mb-1"
              >
                Memory Caption
              </label>
              <input
                id="memory-caption-input"
                type="text"
                required
                value={captionInput}
                onChange={(e) => setCaptionInput(e.target.value)}
                placeholder="e.g., Sunset dinner in Goa"
                className="w-full h-[42px] px-3.5 rounded-[12px] bg-white border border-[#D6CFC0] text-[13px] text-[#111B21] focus:outline-none focus:border-[#111B21]"
              />
            </div>

            <div>
              <label
                htmlFor="memory-album-input"
                className="block text-[12px] font-semibold text-[#374248] mb-1"
              >
                Google Photos Album
              </label>
              <input
                id="memory-album-input"
                type="text"
                value={albumInput}
                onChange={(e) => setAlbumInput(e.target.value)}
                placeholder="Memories of the Day"
                className="w-full h-[42px] px-3.5 rounded-[12px] bg-white border border-[#D6CFC0] text-[13px] text-[#111B21] focus:outline-none focus:border-[#111B21]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLocalFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-[40px] px-4 rounded-full bg-[#F4EFE6] hover:bg-[#EAE3D5] text-[#111B21] text-[13px] font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photo from Device</span>
              </button>
              <input
                type="url"
                value={photoUrlInput}
                onChange={(e) => setPhotoUrlInput(e.target.value)}
                placeholder="Or paste image URL (optional)"
                className="h-[40px] px-3.5 rounded-[12px] bg-white border border-[#D6CFC0] text-[13px] text-[#111B21] flex-1 min-w-[200px] focus:outline-none focus:border-[#111B21]"
              />
            </div>

            <button
              type="submit"
              className="h-[40px] px-5 rounded-full bg-[#111B21] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {savedToast ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#A4D4C5]" />
                  <span>Memory Added!</span>
                </>
              ) : (
                <span>Save Memory Highlight</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Main 2-Column Highlight Split */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 7 Columns: Featured Photo Card with Measured Contrast Scrim */}
        <div
          onClick={() => onOpenGoogleHub(activeMemory.personRef, 'photos')}
          className="lg:col-span-7 relative rounded-[24px] overflow-hidden bg-[#111B21] border border-[#D6CFC0] min-h-[300px] sm:min-h-[340px] flex flex-col justify-end cursor-pointer group"
        >
          <img
            src={activeMemory.photoUrl}
            alt={activeMemory.caption}
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = buildFallbackMemorySvgDataUrl(
                activeMemory.personName,
                activeMemory.caption,
                activeMemory.album,
                safeIndex
              );
            }}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Measured Contrast Scrim (WCAG AA compliant over any photo luminance) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15" />

          {/* Top Nostalgia Header Overlay */}
          <div className="relative z-10 p-5 sm:p-6 mb-auto flex items-center justify-between gap-3">
            <span className="text-[12px] font-semibold text-white/95 bg-black/50 backdrop-blur-xs px-3.5 py-1.5 rounded-full">
              {activeMemory.timeAgoBadge}
            </span>
            <span className="text-[12px] font-medium text-white/90 bg-black/50 backdrop-blur-xs px-3 py-1 rounded-full tabular-nums">
              {activeMemory.date}
            </span>
          </div>

          {/* Bottom Caption & Album Overlay */}
          <div className="relative z-10 p-5 sm:p-6 space-y-1.5 text-white">
            <div className="flex items-center gap-2 text-[12px] text-[#A4D4C5] font-medium">
              <span>{activeMemory.album}</span>
              <span aria-hidden="true">·</span>
              <span>With {activeMemory.personName}</span>
            </div>
            <h3 className="text-[22px] sm:text-[26px] font-bold leading-snug tracking-tight">
              “{activeMemory.caption}”
            </h3>
          </div>
        </div>

        {/* Right 5 Columns: Member Context, Quick Actions & Circle Thumbnail Selector */}
        <div className="lg:col-span-5 rounded-[24px] bg-[#FCFBF7] border border-[#E6E0D3] p-5 sm:p-6 flex flex-col justify-between gap-5">
          <div className="space-y-4">
            {/* Member Header */}
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#E6E0D3]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-full bg-[#F4EFE6] border border-[#D6CFC0] flex items-center justify-center text-2xl shrink-0">
                  {activeMemory.personEmoji}
                </div>
                <div className="min-w-0">
                  <h4 className="text-[18px] font-bold text-[#111B21] truncate">
                    {activeMemory.personName}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525E66] tabular-nums">
                    <span className="capitalize">{activeMemory.relationship}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {activeMemory.daysUntilBirthday === 0
                        ? 'Birthday Today!'
                        : `Birthday in ${activeMemory.daysUntilBirthday}d (${activeMemory.birthDateFormatted})`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail Strip of Today's Circle Memories */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[12px] text-[#525E66]">
                <span className="font-semibold text-[#111B21]">Today’s Circle Memory Reel</span>
                <span className="tabular-nums">Click any photo to view</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {memories.slice(0, 8).map((mem, idx) => {
                  const isSelected = idx === safeIndex;
                  return (
                    <button
                      key={mem.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      title={`${mem.personName}: ${mem.caption}`}
                      className={`relative aspect-4/3 rounded-[12px] overflow-hidden border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#FF4D8B] scale-[1.02]'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={mem.photoUrl}
                        alt={mem.caption}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          target.src = buildFallbackMemorySvgDataUrl(
                            mem.personName,
                            mem.caption,
                            mem.album,
                            idx
                          );
                        }}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons for the Active Memory */}
          <div className="space-y-2.5 pt-2 border-t border-[#E6E0D3]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onOpenGoogleHub(activeMemory.personRef, 'photos')}
                className="h-[42px] px-4 rounded-full bg-[#111B21] hover:bg-[#24323B] text-white text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Open in Google Hub</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenCardStudio(activeMemory.personRef)}
                className="h-[42px] px-4 rounded-full bg-[#FF4D8B] hover:bg-[#e83c78] text-white text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Send Memory Wish</span>
              </button>
            </div>

            <a
              href={whatsappShareHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[40px] px-4 rounded-full bg-[#F4EFE6] hover:bg-[#EAE3D5] text-[#111B21] text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Reminisce with {activeMemory.personName.split(' ')[0]} on WhatsApp</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
