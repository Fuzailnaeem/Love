import { useEffect, useRef, useState } from "react";

export default function Stage3({ onComplete }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // Browser blocked autoplay — needs a user tap. This is normal.
        setIsPlaying(false);
        setAutoplayBlocked(true);
      });
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setAutoplayBlocked(false);
        })
        .catch(() => setAudioError(true));
    }
  };

  return (
    <div className="stage3-container">
      <p className="bismillah">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>

      {/*
        IMPORTANT: archive.org direct links often fail via CORS or get
        redirected/removed. For reliability, put your own file at
        public/audio/bismillah.mp3 and use src="/audio/bismillah.mp3"
      */}
      <audio
        ref={audioRef}
        src="/audio/bismillah.mp3"
        onError={() => setAudioError(true)}
      />

      <button className="audio-btn" onClick={togglePlay}>
        {isPlaying ? "⏸ Pause" : "▶ Play"}
      </button>

      {autoplayBlocked && !audioError && (
        <p className="audio-note">Tap Play — browser blocks auto-sound.</p>
      )}

      {audioError && (
        <p className="audio-note">
          Add your audio file at <code>public/audio/bismillah.mp3</code>.
        </p>
      )}

      <button className="next-btn" onClick={() => onComplete && onComplete()}>
        Next
      </button>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');

        .stage3-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #fff;
          text-align: center;
          gap: 20px;
        }

        .bismillah {
          font-family: 'Amiri', serif;
          font-size: clamp(1.8rem, 6vw, 2.8rem);
          color: #f5d98b;
          line-height: 1.8;
          direction: rtl;
          text-shadow: 0 0 18px rgba(245, 217, 139, 0.35);
          opacity: 0;
          animation: bismillah-in 1.4s ease forwards;
        }

        @keyframes bismillah-in {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bismillah {
            animation: none;
            opacity: 1;
          }
        }

        .audio-btn {
          padding: 10px 24px;
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 50px;
          background: rgba(255,255,255,0.08);
          color: #fff;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s ease;
        }

        .audio-btn:hover {
          background: rgba(255,255,255,0.16);
        }

        .audio-note {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
        }

        .audio-note code {
          color: #ff9eb5;
        }

        .next-btn {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 12px;
          background: #ff4d6d;
          color: #fff;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}