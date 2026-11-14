import React from 'react';
import { motion } from 'framer-motion';
import { ContactButton } from './ContactButton';
import { LivingPortrait } from './LivingPortrait';

interface HeroSectionProps {
  onContactClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onContactClick }) => {
  return (
    <section className="relative h-screen w-full flex flex-col justify-between overflow-x-clip bg-[#0C0C0C] select-none">
      {/* 1. Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8 z-30"
      >
        {['About', 'Price', 'Projects', 'Login'].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            onClick={(e) => {
              if (item === 'Login' && onContactClick) {
                e.preventDefault();
                onContactClick();
              }
            }}
            className={`font-semibold uppercase tracking-wider text-lg sm:text-xl md:text-2xl lg:text-[1.75rem] transition-all duration-200 cursor-pointer ${
              item === 'Login'
                ? 'text-pink-400 font-bold hover:text-pink-300'
                : 'text-[#D7E2EA] hover:opacity-70'
            }`}
          >
            {item}
          </a>
        ))}
      </motion.nav>

      {/* 2. Hero Portrait (Living Portrait Centered both ways - Clean, no text obstruction) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
        className="contents"
      >
        <LivingPortrait />
      </motion.div>

      {/* 3. Bottom Bar */}
      <div className="w-full flex justify-end items-end pb-7 sm:pb-8 md:pb-10 px-6 md:px-10 z-30">
        {/* Right Login Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <ContactButton onClick={onContactClick} label="Login" />
        </motion.div>
      </div>
    </section>
  );
};
