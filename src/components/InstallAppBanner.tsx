import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Download, X, Share2, Check } from 'lucide-react';

export const InstallAppBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [installedSuccess, setInstalledSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed as PWA on home screen)
    const isApp =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isApp);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Listen for Chrome/Android install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isApp) {
        setShowBanner(true);
      }
    };

    // Listen for custom trigger from Header button or anywhere else
    const handleCustomTrigger = () => {
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('trigger-install-prompt', handleCustomTrigger);

    // Auto-show for mobile devices if not installed
    const isMobile = /android|iphone|ipad|ipod|mobile/.test(userAgent);
    if (isMobile && !isApp) {
      const dismissed = sessionStorage.getItem('nunes_app_install_dismissed');
      if (!dismissed) {
        // Show after a gentle 1.5s delay
        const timer = setTimeout(() => setShowBanner(true), 1500);
        return () => clearTimeout(timer);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('trigger-install-prompt', handleCustomTrigger);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setInstalledSuccess(true);
          setTimeout(() => setShowBanner(false), 2500);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('PWA install error:', err);
      }
    } else {
      // Manual fallback instructions
      alert('To install the phone app:\n1. Tap your browser menu (3 dots or Share button)\n2. Select "Add to Home screen" or "Install App"');
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('nunes_app_install_dismissed', 'true');
  };

  if (isStandalone && !showBanner) return null;
  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-md z-50 p-3 sm:p-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl shadow-2xl border border-indigo-500/40 backdrop-blur-md flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center shrink-0 shadow-xs">
            <Smartphone className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm font-bold tracking-tight text-white">
                Nunes 10-Day Sales App
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500 text-white font-extrabold uppercase">
                Phone Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug truncate">
              {installedSuccess ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> App installed successfully!
                </span>
              ) : isIOS ? (
                <span>
                  Tap <b>Share <Share2 className="w-3 h-3 inline mx-0.5" /></b> &rarr; <b>"Add to Home Screen"</b>
                </span>
              ) : (
                'Add to phone home screen for 1-tap quick access'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {!installedSuccess && (
            <button
              type="button"
              onClick={handleInstallClick}
              className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-black rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDismiss}
            title="Dismiss"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
