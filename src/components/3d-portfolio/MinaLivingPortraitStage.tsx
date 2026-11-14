import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  Dices, 
  Layers, 
  ArrowLeft, 
  Sparkles, 
  Search, 
  X, 
  Activity,
  CheckCircle2
} from 'lucide-react';
import { LivingPortrait } from './LivingPortrait';
import { MINA_100_ACTIONS, MINA_CATEGORIES } from '../../data/mina100Actions';

interface MinaLivingPortraitStageProps {
  onBackToWorkspace?: () => void;
  initialActionId?: string;
}

// Category accent colors for badges & pills
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Core Emotions': { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30' },
  'Eye Gestures & Gazes': { bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  'Cheek & Mouth Play': { bg: 'bg-pink-500/15', text: 'text-pink-400', border: 'border-pink-500/30' },
  'Thinking & Curiosity': { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
  'Playful & Flirty': { bg: 'bg-fuchsia-500/15', text: 'text-fuchsia-400', border: 'border-fuchsia-500/30' },
  'Dramatic & Expressive': { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' },
  'Sleepy & Cozy': { bg: 'bg-sky-500/15', text: 'text-sky-400', border: 'border-sky-500/30' },
  'Silly & Cartoonish': { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  'Celebrations & Cheering': { bg: 'bg-amber-400/20', text: 'text-amber-300', border: 'border-amber-400/40' },
  'Physical Rebound & Grand Finale': { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-400/40' },
};

export const MinaLivingPortraitStage: React.FC<MinaLivingPortraitStageProps> = ({
  onBackToWorkspace,
  initialActionId = 'act_01',
}) => {
  // Current action index in MINA_100_ACTIONS (0-based)
  const [currentIndex, setCurrentIndex] = useState(() => {
    const found = MINA_100_ACTIONS.findIndex((a) => a.id === initialActionId);
    return found !== -1 ? found : 0;
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const currentAction = MINA_100_ACTIONS[currentIndex];

  // Trigger playing the current action choreography
  const playCurrentAction = useCallback(() => {
    if (typeof (window as any).playMinaActionKeyframes !== 'function') {
      console.warn('Mina WebGL engine not yet attached');
      return;
    }

    setIsPlaying(true);
    (window as any).playMinaActionKeyframes(currentAction.keyframes, () => {
      setIsPlaying(false);
    });
  }, [currentAction]);

  // Handle Action Navigation
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % MINA_100_ACTIONS.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + MINA_100_ACTIONS.length) % MINA_100_ACTIONS.length);
  }, []);

  const handleRandom = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * MINA_100_ACTIONS.length);
    setCurrentIndex(randomIndex);
  }, []);

  const selectActionByIndex = (idx: number) => {
    setCurrentIndex(idx);
    setIsDrawerOpen(false);
  };

  // Auto-play when action changes via next/prev/random or drawer
  useEffect(() => {
    // slight delay to let state settle
    const t = setTimeout(() => {
      playCurrentAction();
    }, 60);
    return () => clearTimeout(t);
  }, [currentIndex, playCurrentAction]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        playCurrentAction();
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleRandom();
      } else if (e.key.toLowerCase() === 'd' || e.key === 'Escape') {
        if (isDrawerOpen) setIsDrawerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, playCurrentAction, handleRandom, isDrawerOpen]);

  // Filtered actions for the category drawer
  const filteredActions = useMemo(() => {
    return MINA_100_ACTIONS.filter((act) => {
      const matchesCategory =
        selectedCategoryFilter === 'all' || act.category === selectedCategoryFilter;
      const matchesSearch =
        searchQuery.trim() === '' ||
        act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(act.num).includes(searchQuery.trim()) ||
        act.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategoryFilter, searchQuery]);

  const catStyle = CATEGORY_COLORS[currentAction.category] || {
    bg: 'bg-zinc-800',
    text: 'text-zinc-200',
    border: 'border-zinc-700',
  };

  return (
    <div className="relative h-screen w-screen bg-[#0C0C0C] text-[#D7E2EA] font-['Kanit'] overflow-hidden flex flex-col select-none">
      {/* Background Soft Blurred Ambient Radial Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-[#B600A8]/20 via-[#7621B0]/20 to-[#BE4C00]/10 blur-3xl opacity-80" />
        <div className="absolute top-1/4 left-1/3 w-[350px] h-[350px] rounded-full bg-[#B600A8]/15 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-[#7621B0]/15 blur-3xl" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-20 w-full px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-white/5 bg-[#0C0C0C]/80 backdrop-blur-md">
        {/* Left: Back button & Title */}
        <div className="flex items-center gap-3">
          {onBackToWorkspace && (
            <button
              onClick={onBackToWorkspace}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Workspace</span>
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h1 className="hero-heading text-lg sm:text-xl font-bold tracking-wider leading-none uppercase">
                Mina • Living Portrait
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#B600A8]/20 text-pink-300 border border-[#B600A8]/40">
                <Sparkles className="w-3 h-3 text-pink-400" />
                100 Interactive Actions
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block mt-0.5">
              WebGL 72×72 Dynamic Elastic Mesh Physics • Organic Gaze & Blinking
            </p>
          </div>
        </div>

        {/* Right: Drawer Toggle & Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Action Library</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-white/10 font-mono">
              100
            </span>
          </button>

          <button
            onClick={handleRandom}
            title="Pick a Random Action (Key: R)"
            className="p-2 rounded-xl bg-gradient-to-r from-pink-600/30 to-purple-600/30 hover:from-pink-600/50 hover:to-purple-600/50 border border-pink-500/30 text-pink-300 hover:text-white transition cursor-pointer flex items-center gap-1 text-xs font-semibold"
          >
            <Dices className="w-4 h-4 text-pink-400" />
            <span className="hidden sm:inline">Random</span>
          </button>
        </div>
      </header>

      {/* Main Center Stage: Pure Interactive Living Portrait */}
      <main className="relative z-10 flex-1 min-h-0 w-full flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        <div className="relative w-full max-w-lg h-full max-h-[62vh] flex items-center justify-center">
          <LivingPortrait mode="stage" />
        </div>
      </main>

      {/* Bottom Floating Controller Bar */}
      <footer className="relative z-20 w-full px-3 sm:px-6 pb-4 sm:pb-6 pt-2 shrink-0">
        <div className="max-w-4xl mx-auto rounded-2xl sm:rounded-3xl bg-[#121216]/90 backdrop-blur-xl border border-white/10 p-3 sm:p-4 shadow-2xl shadow-black/80 flex flex-col gap-2.5">
          {/* Main Action Information & Direct Play Controls */}
          <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
            {/* Left: Previous Button */}
            <button
              onClick={handlePrev}
              title="Previous Action (Left Arrow)"
              className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-slate-200 hover:text-white transition cursor-pointer shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Center: Action Badge, Title, Category Pill & Description */}
            <div className="flex-1 min-w-[220px] text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                {/* Monospace Action Counter Badge */}
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-pink-400 font-mono text-xs font-bold border border-white/5">
                  Action # [{String(currentAction.num).padStart(3, '0')} / 100]
                </span>

                {/* Category Pill */}
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                >
                  {currentAction.category}
                </span>

                {isPlaying && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-pink-400 font-medium animate-pulse">
                    <Activity className="w-3 h-3 animate-spin" />
                    Choreography Playing...
                  </span>
                )}
              </div>

              {/* Action Title */}
              <h2 className="text-base sm:text-lg font-bold text-white mt-1 tracking-wide leading-tight">
                {currentAction.title}
              </h2>

              {/* Action Description */}
              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                {currentAction.description}
              </p>
            </div>

            {/* Center-Right: Big Interactive Pulsing Play Button */}
            <button
              onClick={playCurrentAction}
              disabled={isPlaying}
              title="Play Action Choreography (Spacebar)"
              className={`px-4 sm:px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg cursor-pointer shrink-0 ${
                isPlaying
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-pink-500/30 scale-95 ring-2 ring-pink-400/50'
                  : 'bg-gradient-to-r from-pink-500 hover:from-pink-600 to-purple-600 hover:to-purple-700 text-white shadow-pink-600/25 hover:shadow-pink-600/40 active:scale-95'
              }`}
            >
              <Play className={`w-4 h-4 fill-white ${isPlaying ? 'animate-bounce' : ''}`} />
              <span>{isPlaying ? 'Playing...' : 'Play Action'}</span>
            </button>

            {/* Right: Next Button */}
            <button
              onClick={handleNext}
              title="Next Action (Right Arrow)"
              className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-slate-200 hover:text-white transition cursor-pointer shrink-0"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Category Scrub Strip */}
          <div className="flex items-center justify-between gap-1 pt-1 border-t border-white/5 text-[10px] text-slate-400 overflow-x-auto no-scrollbar">
            <span className="hidden md:inline font-mono text-slate-500 shrink-0">
              Categories:
            </span>
            <div className="flex items-center gap-1 overflow-x-auto py-0.5">
              {MINA_CATEGORIES.map((cat, i) => {
                const isCurrentCat = currentAction.category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      const firstInCat = MINA_100_ACTIONS.findIndex((a) => a.category === cat);
                      if (firstInCat !== -1) setCurrentIndex(firstInCat);
                    }}
                    className={`px-2 py-0.5 rounded-md text-[10px] whitespace-nowrap transition cursor-pointer ${
                      isCurrentCat
                        ? 'bg-pink-500/25 text-pink-300 font-bold border border-pink-500/40'
                        : 'bg-white/5 hover:bg-white/10 text-slate-400'
                    }`}
                  >
                    {i + 1}. {cat.split(' ')[0]}
                  </button>
                );
              })}
            </div>
            <div className="hidden sm:flex items-center gap-2 text-slate-500 font-mono text-[10px] shrink-0">
              <span>Keys: ← / → / Space / R</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Action Library Drawer / Modal */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end"
            onClick={() => setIsDrawerOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="w-full max-w-md sm:max-w-lg h-full bg-[#121216] border-l border-white/10 flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-pink-400" />
                    <span>Catalog of 100 Actions</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    10 Categories • Multi-step choreographic keyframes
                  </p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Search & Category Filter */}
              <div className="p-3 sm:p-4 border-b border-white/10 flex flex-col gap-2.5 bg-black/30">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by action name, number, or keyword..."
                    className="w-full bg-[#18181F] border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/60"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Category Pill Filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar text-xs">
                  <button
                    onClick={() => setSelectedCategoryFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      selectedCategoryFilter === 'all'
                        ? 'bg-pink-600 text-white shadow-sm shadow-pink-600/30'
                        : 'bg-white/5 hover:bg-white/10 text-slate-400'
                    }`}
                  >
                    All (100)
                  </button>
                  {MINA_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                        selectedCategoryFilter === cat
                          ? 'bg-pink-600 text-white shadow-sm shadow-pink-600/30'
                          : 'bg-white/5 hover:bg-white/10 text-slate-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action List Grid */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col gap-2">
                {filteredActions.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    No actions found matching "{searchQuery}".
                  </div>
                ) : (
                  filteredActions.map((action) => {
                    const isSelected = action.id === currentAction.id;
                    const cStyle = CATEGORY_COLORS[action.category] || {
                      bg: 'bg-zinc-800',
                      text: 'text-zinc-200',
                      border: 'border-zinc-700',
                    };

                    return (
                      <button
                        key={action.id}
                        onClick={() => {
                          const idx = MINA_100_ACTIONS.findIndex((a) => a.id === action.id);
                          if (idx !== -1) selectActionByIndex(idx);
                        }}
                        className={`w-full text-left p-3 rounded-xl border transition flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-pink-950/40 to-purple-950/40 border-pink-500/60 shadow-md shadow-pink-900/30'
                            : 'bg-[#18181F]/70 hover:bg-[#1f1f28] border-white/5 hover:border-white/15'
                        }`}
                      >
                        {/* Number Badge */}
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                            isSelected
                              ? 'bg-pink-500 text-white shadow-sm shadow-pink-500/50'
                              : 'bg-white/5 text-slate-400'
                          }`}
                        >
                          {String(action.num).padStart(3, '0')}
                        </div>

                        {/* Title & Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs sm:text-sm truncate">
                              {action.title}
                            </span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${cStyle.bg} ${cStyle.text} ${cStyle.border}`}
                            >
                              {action.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {action.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-mono">
                            <span>Keyframes: {action.keyframes.length}</span>
                            <span>•</span>
                            <span>ID: {action.id}</span>
                          </div>
                        </div>

                        {/* Play Indicator */}
                        <div className="shrink-0 self-center">
                          {isSelected ? (
                            <span className="w-7 h-7 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center border border-pink-500/40">
                              <CheckCircle2 className="w-4 h-4" />
                            </span>
                          ) : (
                            <span className="w-7 h-7 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center">
                              <Play className="w-3.5 h-3.5 fill-current" />
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer Status */}
              <div className="p-3 border-t border-white/10 bg-black/40 text-center text-[11px] text-slate-400 flex items-center justify-between">
                <span>Showing {filteredActions.length} of 100 actions</span>
                <span className="font-mono text-pink-400">WebGL 72×72 Head Physics</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
