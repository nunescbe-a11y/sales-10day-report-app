import React, { useRef, useState, useEffect } from 'react';

interface MagnetProps {
  children: React.ReactNode;
  strength?: number; // Divisor for mouse offset, e.g. 3.5
  padding?: number; // Activation distance around element edge
  className?: string;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  strength = 3.5,
  padding = 60,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distToLeft = rect.left - padding;
      const distToRight = rect.right + padding;
      const distToTop = rect.top - padding;
      const distToBottom = rect.bottom + padding;

      const isInside =
        e.clientX >= distToLeft &&
        e.clientX <= distToRight &&
        e.clientY >= distToTop &&
        e.clientY <= distToBottom;

      if (isInside) {
        setIsHovered(true);
        const offsetX = (e.clientX - centerX) / strength;
        const offsetY = (e.clientY - centerY) / strength;
        setPosition({ x: offsetX, y: offsetY });
      } else {
        setIsHovered(false);
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [strength, padding]);

  return (
    <div
      ref={ref}
      className={`inline-block ${className}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isHovered
          ? 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
          : 'transform 0.6s ease-in-out',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};
