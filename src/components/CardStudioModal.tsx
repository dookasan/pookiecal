import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Share2,
  Phone,
  Flame,
  Volume2,
  RotateCcw,
  Wand2
} from 'lucide-react';
import { BirthdayPerson, CardTheme } from '../types/birthday';
import {
  calculateTurningAge,
  generatePersonalizedWishes,
  getWhatsAppShareUrl
} from '../utils/birthdayUtils';
import { sounds } from '../utils/audioEffects';

interface CardStudioModalProps {
  person: BirthdayPerson;
  onClose: () => void;
  onOpenCallModal: (person: BirthdayPerson) => void;
}

const CARD_THEMES: Record<
  CardTheme,
  {
    name: string;
    cardClass: string;
    isDark: boolean;
    badge: string;
  }
> = {
  aurora: {
    name: 'Vibrant Tangerine',
    cardClass: 'feature-card-pink',
    isDark: true,
    badge: 'bg-white/20 text-white'
  },
  sunset: {
    name: 'Warm Peach',
    cardClass: 'feature-card-peach',
    isDark: false,
    badge: 'bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5]'
  },
  midnight: {
    name: 'Deep Teal',
    cardClass: 'feature-card-teal',
    isDark: true,
    badge: 'bg-white/20 text-white'
  },
  botanical: {
    name: 'Soft Lavender',
    cardClass: 'feature-card-lavender',
    isDark: false,
    badge: 'bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5]'
  },
  confetti: {
    name: 'Mustard Ochre',
    cardClass: 'feature-card-ochre',
    isDark: false,
    badge: 'bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5]'
  }
};

export const CardStudioModal: React.FC<CardStudioModalProps> = ({
  person,
  onClose,
  onOpenCallModal
}) => {
  const turningAge = calculateTurningAge(person.birthDate);
  const presetWishes = generatePersonalizedWishes(person);

  const [selectedTheme, setSelectedTheme] = useState<CardTheme>(
    person.customCardTheme || 'aurora'
  );
  const [message, setMessage] = useState<string>(presetWishes[0]);
  const [senderName, setSenderName] = useState<string>('With Love');
  const [candlesLit, setCandlesLit] = useState<boolean[]>([true, true, true, true, true]);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const allBlownOut = candlesLit.every((c) => !c);
  const theme = CARD_THEMES[selectedTheme];

  const handleToggleCandle = (idx: number) => {
    setCandlesLit((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      if (!next[idx]) {
        sounds.playBlowCandle();
      }
      return next;
    });
  };

  const handleBlowAllCandles = () => {
    sounds.playBlowCandle();
    setCandlesLit([false, false, false, false, false]);
    setTimeout(() => {
      sounds.playBirthdayChime();
    }, 300);
  };

  const handleRelightCandles = () => {
    setCandlesLit([true, true, true, true, true]);
  };

  const handlePlayMelody = () => {
    setIsPlayingAudio(true);
    sounds.playBirthdayChime();
    setTimeout(() => setIsPlayingAudio(false), 2600);
  };

  const handleCopyWish = async () => {
    try {
      await navigator.clipboard.writeText(`${message}\n\n— ${senderName}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const whatsappShareUrl = getWhatsAppShareUrl(
    person.phone || '',
    `🎂 *Happy ${turningAge}th Birthday, ${person.name}!* 🎉\n\n${message}\n\n— ${senderName}`
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="studio-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0a0a0a]/50 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-[#fffaf0] rounded-[24px] border border-[#e5e5e5] overflow-hidden my-auto max-h-[92vh] flex flex-col text-[#0a0a0a]">
        {/* Top Bar (`#faf5e8` soft cream) */}
        <div className="px-6 py-4 bg-[#faf5e8] border-b border-[#e5e5e5] flex items-center justify-between shrink-0">
          <div>
            <h2 id="studio-modal-title" className="clay-display-sm text-[22px] text-[#0a0a0a]">
              Birthday Wish & Candle Studio
            </h2>
            <p className="text-[13px] text-[#6a6a6a]">
              Interactive greeting card for {person.name}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close card studio"
            className="w-10 h-10 rounded-full bg-[#fffaf0] border border-[#e5e5e5] text-[#0a0a0a] flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Live Interactive Clay Card Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div
              className={`relative rounded-[24px] p-6 sm:p-8 min-h-[380px] flex flex-col justify-between transition-all ${theme.cardClass}`}
            >
              {/* Top Card Badges */}
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold ${theme.badge}`}
                >
                  <span>{person.avatarEmoji || '🎂'}</span>
                  <span>Turning {turningAge}</span>
                </span>

                <button
                  onClick={handlePlayMelody}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer ${theme.badge}`}
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                  <span>{isPlayingAudio ? 'Playing Chime...' : 'Play Melody'}</span>
                </button>
              </div>

              {/* Center Greeting & Embedded Product Mockup Cake */}
              <div className="my-5 text-center space-y-4">
                <div className="space-y-1">
                  <p
                    className={`text-[11px] uppercase tracking-[1.5px] font-semibold ${
                      theme.isDark ? 'text-white/80' : 'text-[#3a3a3a]'
                    }`}
                  >
                    Happy Birthday
                  </p>
                  <h3 className="clay-display-md text-[36px] sm:text-[42px]">{person.name}!</h3>
                </div>

                {/* Embedded Product Mockup Card for Interactive Cake & Wish */}
                <div className="bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] rounded-[16px] p-5 space-y-4 max-w-md mx-auto">
                  <div className="flex flex-col items-center">
                    <div className="flex items-end justify-center gap-3 mb-1">
                      {candlesLit.map((isLit, i) => (
                        <button
                          key={i}
                          onClick={() => handleToggleCandle(i)}
                          title={isLit ? 'Click to blow out candle!' : 'Click to relight candle'}
                          className="group flex flex-col items-center cursor-pointer focus:outline-none"
                        >
                          <div className="h-6 flex items-center justify-center">
                            {isLit ? (
                              <Flame className="w-5 h-5 text-[#ff6b5a] fill-[#e8b94a] animate-pulse" />
                            ) : (
                              <span className="text-[11px] text-[#6a6a6a] font-mono">~</span>
                            )}
                          </div>
                          <div className="w-2.5 h-8 rounded-t-sm bg-[#ff5722] border border-[#0a0a0a]/10" />
                        </button>
                      ))}
                    </div>

                    <div className="w-36 h-8 bg-[#ffb084] rounded-t-[12px] border border-[#0a0a0a]/15" />
                    <div className="w-44 h-9 bg-[#f5f0e0] rounded-b-[12px] border border-[#e5e5e5] flex items-center justify-center">
                      <span className="text-[11px] font-semibold uppercase tracking-[1px] text-[#0a0a0a]">
                        {allBlownOut ? '🎉 Wish Made! 🎉' : 'Tap Candles to Blow Out'}
                      </span>
                    </div>
                  </div>

                  <p className="text-[14px] leading-relaxed text-[#0a0a0a] italic">
                    "{message}"
                  </p>
                  <p className="text-[12px] font-semibold text-[#6a6a6a]">— {senderName}</p>
                </div>
              </div>

              {/* Candle Controls Bar */}
              <div className="flex items-center justify-center gap-2">
                {!allBlownOut ? (
                  <button
                    onClick={handleBlowAllCandles}
                    className={`h-[40px] px-4 rounded-[12px] text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                      theme.isDark ? 'bg-[#ffffff] text-[#0a0a0a]' : 'bg-[#0a0a0a] text-[#ffffff]'
                    }`}
                  >
                    <Flame className="w-4 h-4" />
                    <span>Blow Out All Candles</span>
                  </button>
                ) : (
                  <button
                    onClick={handleRelightCandles}
                    className={`h-[40px] px-4 rounded-[12px] text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                      theme.isDark ? 'bg-[#ffffff] text-[#0a0a0a]' : 'bg-[#0a0a0a] text-[#ffffff]'
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Relight Candles</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Customization Controls & Direct Share (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              {/* Theme Picker */}
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-[1.2px] text-[#3a3a3a] mb-2">
                  1. Clay Card Surface
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(CARD_THEMES) as CardTheme[]).map((tKey) => (
                    <button
                      key={tKey}
                      type="button"
                      onClick={() => setSelectedTheme(tKey)}
                      className={`px-3 py-2 rounded-[12px] text-[12px] font-semibold border transition-all text-left cursor-pointer ${
                        selectedTheme === tKey
                          ? 'border-[#0a0a0a] bg-[#f5f0e0] text-[#0a0a0a]'
                          : 'border-[#e5e5e5] bg-[#fffaf0] text-[#6a6a6a]'
                      }`}
                    >
                      {CARD_THEMES[tKey].name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Smart Wish Generator */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[12px] font-semibold uppercase tracking-[1.2px] text-[#3a3a3a]">
                    2. Personalized Birthday Wish
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const nextIdx =
                        (presetWishes.indexOf(message) + 1) % presetWishes.length;
                      setMessage(presetWishes[nextIdx]);
                    }}
                    className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#0a0a0a] underline cursor-pointer"
                  >
                    <Wand2 className="w-3 h-3" />
                    <span>Cycle Suggestion</span>
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3.5 text-[14px] bg-[#fffaf0] border border-[#e5e5e5] rounded-[12px] text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]"
                  placeholder="Write your heartfelt birthday message..."
                />
              </div>

              {/* Sign-off Input */}
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-[1.2px] text-[#3a3a3a] mb-1.5">
                  3. Your Sign-Off
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full h-[44px] px-4 text-[14px] bg-[#fffaf0] border border-[#e5e5e5] rounded-[12px] text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]"
                />
              </div>
            </div>

            {/* Share & Call Action Buttons */}
            <div className="pt-4 border-t border-[#e5e5e5] space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleCopyWish}
                  className="h-[44px] px-4 bg-[#f5f0e0] text-[#0a0a0a] border border-[#e5e5e5] font-semibold rounded-[12px] text-[13px] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Wish</span>
                    </>
                  )}
                </button>

                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-[44px] px-4 bg-[#a4d4c5] text-[#0a0a0a] font-semibold rounded-[12px] text-[13px] flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Send WhatsApp</span>
                </a>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenCallModal(person);
                }}
                className="w-full h-[44px] px-5 bg-[#0a0a0a] text-[#ffffff] font-semibold rounded-[12px] text-[14px] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call {person.name} Directly</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
