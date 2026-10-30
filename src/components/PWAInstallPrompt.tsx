import React, { useState, useEffect } from 'react';
import { Download, X, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if already installed in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) return;

    // Check if user dismissed recently
    const dismissedUntil = localStorage.getItem('dlab_pwa_dismissed_until');
    if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Dismiss for 7 days
    localStorage.setItem('dlab_pwa_dismissed_until', String(Date.now() + 7 * 24 * 60 * 60 * 1000));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-sm bg-[#1E1C1A] border border-[#D4AF37]/60 rounded-[0.25rem] shadow-2xl p-4 text-[#e7e1de] animate-in fade-in slide-in-from-bottom-4 duration-300 backdrop-blur-md">
      <div className="flex items-start justify-between gap-3">
        <div className="p-2 bg-[#D4AF37]/10 rounded border border-[#D4AF37]/30 text-[#D4AF37] shrink-0">
          <Sparkles className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="flex-1 text-left">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Install DLAB App
          </h4>
          <p className="text-[11px] text-[#cdc5bd] mt-1 leading-snug">
            Add to home screen for instant offline catalog access, nocturnal sillage journal, and faster ordering.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-[#969088] hover:text-white p-1 rounded transition-colors"
          aria-label="Dismiss install banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2 pt-2 border-t border-[#2c2a27]">
        <button
          onClick={handleInstallClick}
          className="flex-1 bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D] px-3 py-1.5 rounded-[0.125rem] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install Now</span>
        </button>
        <button
          onClick={handleDismiss}
          className="px-3 py-1.5 text-xs text-[#969088] hover:text-white uppercase tracking-wider"
        >
          Later
        </button>
      </div>
    </div>
  );
};
