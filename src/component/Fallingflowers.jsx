import { useState } from 'react'

const FLOWER_EMOJIS = ['🌸', '🌺', '🌼', '🌷', '🌻']

/**
 * Fullscreen fixed background of slowly falling flowers on black.
 * Drop this once, near the top of your page, then put your real
 * content in a wrapper with position: relative / z-index: 1 above it.
 */
export default function FallingFlowers({ count = 30 }) {
  const [flowers] = useState(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 8,
      size: 16 + Math.random() * 20,
      emoji: FLOWER_EMOJIS[Math.floor(Math.random() * FLOWER_EMOJIS.length)],
      drift: (Math.random() - 0.5) * 120,
    }))
  }, [count])

  return (
    <div className="falling-flowers" aria-hidden="true">
      {flowers.map((f) => (
        <span
          key={f.id}
          className="flower"
          style={{
            left: `${f.left}%`,
            fontSize: `${f.size}px`,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
            ['--drift']: `${f.drift}px`,
          }}
        >
          {f.emoji}
        </span>
      ))}
      <style>{`
        .falling-flowers {
          position: fixed;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
          background: #000;
        }
        .flower {
          position: absolute;
          top: -10%;
          animation-name: ff-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          opacity: 0;
          filter: drop-shadow(0 0 6px rgba(255,255,255,0.15));
          will-change: transform, opacity;
        }
        @keyframes ff-fall {
          0%   { transform: translate(0, -10vh) rotate(0deg); opacity: 0; }
          8%   { opacity: 0.85; }
          92%  { opacity: 0.85; }
          100% { transform: translate(var(--drift), 110vh) rotate(360deg); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .flower { animation: none; display: none; }
        }
      `}</style>
    </div>
  )
}