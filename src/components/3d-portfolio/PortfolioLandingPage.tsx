import React, { useState } from 'react';
import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { ServicesSection } from './ServicesSection';
import { ProjectsSection } from './ProjectsSection';
import { CloudflareLogin } from '../CloudflareLogin';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck } from 'lucide-react';

interface PortfolioLandingPageProps {
  onDirectLogin?: () => void;
}

export const PortfolioLandingPage: React.FC<PortfolioLandingPageProps> = ({ onDirectLogin }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleContactClick = () => {
    if (onDirectLogin) {
      onDirectLogin();
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <div
      className="relative w-full min-h-screen bg-[#0C0C0C] text-[#D7E2EA] font-['Kanit',sans-serif]"
      style={{ overflowX: 'clip' }}
    >
      {/* Discrete floating pill to launch Sales Suite / Cloudflare Terminal directly */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleContactClick}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1A1A1A]/90 hover:bg-[#252525] border border-white/10 text-sm font-semibold text-[#D7E2EA] shadow-xl backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-orange-400" />
          <span>Sales Hub Access</span>
        </button>
      </div>

      {/* 1. Hero Section */}
      <HeroSection onContactClick={handleContactClick} />

      {/* 2. About Section */}
      <AboutSection onContactClick={handleContactClick} />

      {/* 3. Services Section */}
      <ServicesSection />

      {/* 4. Projects Section */}
      <ProjectsSection />

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-[420px]"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="absolute -top-10 right-0 p-1.5 px-3 rounded-full bg-white/10 hover:bg-white/20 text-[#D7E2EA] transition cursor-pointer flex items-center gap-1 text-xs"
              >
                <X className="w-3.5 h-3.5" />
                <span>Close</span>
              </button>

              <CloudflareLogin
                isEmbedded={true}
                onSuccess={() => {
                  setIsLoginModalOpen(false);
                  onDirectLogin?.();
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
