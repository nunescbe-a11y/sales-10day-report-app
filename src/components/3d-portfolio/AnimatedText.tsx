import React, { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

const Character: React.FC<{
  char: string;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  range: [number, number];
}> = ({ char, progress, range }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);

  if (char === ' ') {
    return <span className="inline-block whitespace-pre">&nbsp;</span>;
  }

  return (
    <span className="relative inline-block">
      <span className="opacity-0 select-none">{char}</span>
      <motion.span style={{ opacity }} className="absolute inset-0">
        {char}
      </motion.span>
    </span>
  );
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = '' }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const totalChars = text.length;
  let runningIndex = 0;
  const words = text.split(' ');

  return (
    <p
      ref={containerRef}
      className={className}
      style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
    >
      {words.map((word, wordIdx) => {
        const wordChars = word.split('');
        const wordStartIndex = runningIndex;
        runningIndex += wordChars.length + 1; // +1 for the space

        return (
          <React.Fragment key={wordIdx}>
            <span className="inline-block whitespace-nowrap">
              {wordChars.map((char, charIdx) => {
                const globalIdx = wordStartIndex + charIdx;
                const start = globalIdx / totalChars;
                const end = Math.min(1, (globalIdx + 1) / totalChars);
                return (
                  <Character
                    key={charIdx}
                    char={char}
                    progress={scrollYProgress}
                    range={[start, end]}
                  />
                );
              })}
            </span>
            {wordIdx < words.length - 1 && <span> </span>}
          </React.Fragment>
        );
      })}
    </p>
  );
};
