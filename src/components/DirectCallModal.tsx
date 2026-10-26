import React from 'react';
import { Phone, MessageCircle, X, ExternalLink, Sparkles } from 'lucide-react';
import { BirthdayPerson } from '../types/birthday';
import { getDirectCallUri, getWhatsAppShareUrl } from '../utils/birthdayUtils';

interface DirectCallModalProps {
  person: BirthdayPerson;
  onClose: () => void;
  onOpenCardStudio: (person: BirthdayPerson) => void;
}

export const DirectCallModal: React.FC<DirectCallModalProps> = ({
  person,
  onClose,
  onOpenCardStudio
}) => {
  const cleanPhone = person.phone || '';
  const callUri = getDirectCallUri(cleanPhone);
  const whatsappUrl = getWhatsAppShareUrl(
    cleanPhone,
    `Hey ${person.name}! Wishing you a wonderful birthday! 🎂🎉`
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="call-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0a]/50 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-md bg-[#fffaf0] rounded-[24px] border border-[#e5e5e5] overflow-hidden text-[#0a0a0a]">
        {/* Header (`feature-card-peach` warm Clay card header) */}
        <div className="relative p-6 bg-[#ffb084] text-[#0a0a0a] text-center border-b border-[#e5e5e5]">
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#fffaf0] border border-[#e5e5e5] text-[#0a0a0a] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="mx-auto w-16 h-16 rounded-full bg-[#fffaf0] border border-[#e5e5e5] flex items-center justify-center text-3xl mb-3">
            {person.avatarEmoji || '🎂'}
          </div>

          <h2 id="call-dialog-title" className="clay-display-sm text-[24px] text-[#0a0a0a]">
            Connect with {person.name}
          </h2>
          <p className="text-[13px] text-[#3a3a3a] mt-0.5">
            Direct phone dialer & WhatsApp celebration link
          </p>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-4">
          <div className="p-4 bg-[#faf5e8] rounded-[16px] border border-[#e5e5e5] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-[#f5f0e0] text-[#0a0a0a] border border-[#e5e5e5] flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[1px] text-[#6a6a6a]">
                  Phone Number
                </p>
                <p className="text-[15px] font-semibold text-[#0a0a0a]">
                  {cleanPhone || 'No phone entered'}
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2.5 pt-1">
            {cleanPhone ? (
              <a
                href={callUri}
                className="w-full h-[44px] px-5 bg-[#0a0a0a] text-[#ffffff] font-semibold rounded-[12px] flex items-center justify-center gap-2 text-[14px]"
              >
                <Phone className="w-4 h-4" />
                <span>Call Directly ({cleanPhone})</span>
              </a>
            ) : (
              <div className="p-3 bg-[#f5f0e0] text-[#3a3a3a] text-[13px] rounded-[12px] text-center">
                Add a phone number for {person.name} to enable 1-tap calls.
              </div>
            )}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[44px] px-5 bg-[#a4d4c5] text-[#0a0a0a] font-semibold rounded-[12px] flex items-center justify-center gap-2 text-[14px]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Wish on WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => {
                onClose();
                onOpenCardStudio(person);
              }}
              className="w-full h-[44px] px-5 bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] font-semibold rounded-[12px] flex items-center justify-center gap-2 text-[14px] cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Open Wish & Candle Studio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
