import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type BoyEmotion = 'idle' | 'typing' | 'sad' | 'kiss';

interface AnimatedBoyAvatarProps {
  emotion: BoyEmotion;
  size?: number; // pixel diameter
}

export const AnimatedBoyAvatar: React.FC<AnimatedBoyAvatarProps> = ({
  emotion,
  size = 140,
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center select-none"
    >
      {/* 3D Perspective Glow & Shadow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-amber-200/40 via-orange-100/30 to-amber-400/20 blur-xl scale-95" />

      {/* Main 3D Animated Boy Container */}
      <motion.div
        animate={
          emotion === 'sad'
            ? { x: [-8, 8, -6, 6, -3, 3, 0], rotate: [-4, 4, -3, 3, 0] }
            : emotion === 'kiss'
            ? { y: [-6, 2, -10, 0], scale: [1, 1.08, 1.04, 1] }
            : emotion === 'typing'
            ? { y: [0, 3, 0], rotateX: [0, 8, 4] }
            : { y: [0, -3, 0] }
        }
        transition={
          emotion === 'sad'
            ? { duration: 0.6, repeat: 1 }
            : emotion === 'kiss'
            ? { duration: 0.8, repeat: Infinity, repeatDelay: 1 }
            : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
        }
        className="relative z-10 w-full h-full flex items-center justify-center"
        style={{ perspective: 600 }}
      >
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base Head Gradient */}
          <defs>
            <radialGradient id="skinGrad" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffdfc9" />
              <stop offset="85%" stopColor="#f5be9b" />
              <stop offset="100%" stopColor="#e2a17b" />
            </radialGradient>
            <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#452311" />
              <stop offset="70%" stopColor="#2c1407" />
              <stop offset="100%" stopColor="#1a0a03" />
            </linearGradient>
            <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#000000" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Ears with 3D shading */}
          <circle cx="34" cy="85" r="14" fill="#f5be9b" />
          <circle cx="35" cy="85" r="8" fill="#e8aa82" />
          <circle cx="126" cy="85" r="14" fill="#f5be9b" />
          <circle cx="125" cy="85" r="8" fill="#e8aa82" />

          {/* Face Base */}
          <ellipse
            cx="80"
            cy="88"
            rx="48"
            ry="46"
            fill="url(#skinGrad)"
            filter="url(#shadowFilter)"
          />

          {/* Stylish Boy Hair (Back & Sides) */}
          <path
            d="M36 78 C32 45, 60 22, 80 22 C105 22, 128 45, 124 78 C118 42, 106 32, 80 32 C54 32, 42 42, 36 78 Z"
            fill="url(#hairGrad)"
          />

          {/* Cool Boy Cap / Front Tuft */}
          <path
            d="M38 66 C48 38, 112 38, 122 66 C105 52, 55 52, 38 66 Z"
            fill="url(#hairGrad)"
          />
          {/* Front anime hair bangs */}
          <path
            d="M54 54 C62 65, 70 70, 75 58 C80 72, 92 68, 102 56 C95 62, 88 64, 82 56 Z"
            fill="url(#hairGrad)"
          />

          {/* Blushing Cheeks */}
          <ellipse
            cx="52"
            cy="98"
            rx="8"
            ry="5"
            fill={emotion === 'kiss' ? '#f43f5e' : '#f87171'}
            opacity={emotion === 'kiss' ? 0.7 : 0.45}
          />
          <ellipse
            cx="108"
            cy="98"
            rx="8"
            ry="5"
            fill={emotion === 'kiss' ? '#f43f5e' : '#f87171'}
            opacity={emotion === 'kiss' ? 0.7 : 0.45}
          />

          {/* Eyebrows */}
          {emotion === 'sad' ? (
            /* Sad Drooping Eyebrows */
            <g stroke="#3a1c0d" strokeWidth="3" strokeLinecap="round">
              <path d="M50 72 Q60 76 68 81" />
              <path d="M110 72 Q100 76 92 81" />
            </g>
          ) : emotion === 'kiss' ? (
            /* Happy Raised Eyebrows */
            <g stroke="#3a1c0d" strokeWidth="3" strokeLinecap="round">
              <path d="M50 71 Q60 66 68 71" />
              <path d="M110 71 Q100 66 92 71" />
            </g>
          ) : (
            /* Normal Confident Eyebrows */
            <g stroke="#3a1c0d" strokeWidth="3" strokeLinecap="round">
              <path d="M52 73 Q60 69 68 73" />
              <path d="M108 73 Q100 69 92 73" />
            </g>
          )}

          {/* Eyes Logic based on Emotion */}
          {emotion === 'sad' ? (
            /* Crying / Teary Closed Eyes */
            <g stroke="#33180a" strokeWidth="3.5" strokeLinecap="round">
              <path d="M52 87 Q60 92 68 87" />
              <path d="M92 87 Q100 92 108 87" />
              {/* Falling Big Teardrops */}
              <motion.path
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: [0, 15, 25], opacity: [0, 1, 0] }}
                transition={{ duration: 0.9, repeat: Infinity }}
                d="M53 91 C50 96, 56 102, 53 105 C50 102, 56 96, 53 91 Z"
                fill="#38bdf8"
              />
              <motion.path
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: [0, 15, 25], opacity: [0, 1, 0] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: 0.2 }}
                d="M107 91 C104 96, 110 102, 107 105 C104 102, 110 96, 107 91 Z"
                fill="#38bdf8"
              />
            </g>
          ) : emotion === 'kiss' ? (
            /* Happy Closed Cheerful Eyes */
            <g stroke="#33180a" strokeWidth="3.5" strokeLinecap="round">
              <path d="M52 86 Q60 81 68 86" />
              <path d="M92 86 Q100 81 108 86" />
              {/* Star sparkles in corners */}
              <circle cx="48" cy="81" r="2" fill="#fbbf24" />
              <circle cx="112" cy="81" r="2" fill="#fbbf24" />
            </g>
          ) : emotion === 'typing' ? (
            /* Looking Down Intently at Input */
            <g>
              <ellipse cx="60" cy="88" rx="7.5" ry="8" fill="#ffffff" />
              <ellipse cx="100" cy="88" rx="7.5" ry="8" fill="#ffffff" />
              {/* Pupils looking down */}
              <circle cx="60" cy="91" r="4.5" fill="#1e293b" />
              <circle cx="61.5" cy="89.5" r="1.5" fill="#ffffff" />
              <circle cx="100" cy="91" r="4.5" fill="#1e293b" />
              <circle cx="101.5" cy="89.5" r="1.5" fill="#ffffff" />
            </g>
          ) : (
            /* Idle Cute Anime Eyes with Glint */
            <g>
              <ellipse cx="60" cy="86" rx="7.5" ry="8.5" fill="#ffffff" />
              <ellipse cx="100" cy="86" rx="7.5" ry="8.5" fill="#ffffff" />
              <circle cx="60" cy="86" r="5" fill="#1e293b" />
              <circle cx="61.5" cy="84" r="1.8" fill="#ffffff" />
              <circle cx="100" cy="86" r="5" fill="#1e293b" />
              <circle cx="101.5" cy="84" r="1.8" fill="#ffffff" />
            </g>
          )}

          {/* Cute Nose */}
          <path d="M78 95 Q80 97 82 95" stroke="#d9825b" strokeWidth="2.5" strokeLinecap="round" />

          {/* Mouth Logic based on Emotion */}
          {emotion === 'sad' ? (
            /* Sad Drooping Quivering Mouth */
            <path
              d="M71 114 Q80 106 89 114"
              stroke="#6b2118"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          ) : emotion === 'kiss' ? (
            /* Kissing Puckered Cute Lips (3 shape) */
            <g transform="translate(73, 102)">
              <ellipse cx="7" cy="5" rx="5" ry="4" fill="#e11d48" />
              <circle cx="9" cy="5" r="2.5" fill="#fb7185" />
            </g>
          ) : emotion === 'typing' ? (
            /* Focused Small Mouth */
            <ellipse cx="80" cy="108" rx="4" ry="2" fill="#881337" opacity="0.8" />
          ) : (
            /* Cheerful Open Smile */
            <path
              d="M72 104 Q80 114 88 104 Z"
              fill="#be123c"
              stroke="#881337"
              strokeWidth="1.5"
            />
          )}
        </svg>

        {/* Kissing Floating Hearts Animation */}
        <AnimatePresence>
          {emotion === 'kiss' && (
            <div className="absolute inset-0 pointer-events-none overflow-visible">
              {/* Heart 1 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.3, x: 20, y: 10 }}
                animate={{ opacity: [0, 1, 0.8, 0], scale: [0.5, 1.3, 1.5], x: [20, 45, 60], y: [10, -25, -55] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.1 }}
                className="absolute text-xl"
              >
                💖
              </motion.div>
              {/* Heart 2 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.3, x: 10, y: 10 }}
                animate={{ opacity: [0, 1, 0.8, 0], scale: [0.4, 1.2, 1.4], x: [10, 25, 35], y: [10, -35, -65] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                className="absolute text-lg"
              >
                💋
              </motion.div>
              {/* Heart 3 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.3, x: 15, y: 15 }}
                animate={{ opacity: [0, 1, 0.8, 0], scale: [0.3, 1.1, 1.3], x: [15, -15, -30], y: [15, -20, -50] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }}
                className="absolute text-base"
              >
                💕
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Sad Crying Rain drops */}
        <AnimatePresence>
          {emotion === 'sad' && (
            <div className="absolute -top-4 right-0 pointer-events-none">
              <motion.span
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: [0, 1, 0], y: [0, 10] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-sm"
              >
                💧
              </motion.span>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
