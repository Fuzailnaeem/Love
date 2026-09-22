import { useState } from "react";
import Fireworks from "./Fireworks.jsx";

export default function Stage5({ onComplete }) {
  const [opened, setOpened] = useState(false);

  const handleOpen = () => {
    if (!opened) setOpened(true);
  };

  return (
    <div className="stage5-container">
      <Fireworks active={opened} />

      <div
        className={`envelope ${opened ? "opened" : ""}`}
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        aria-label={opened ? "Envelope opened" : "Tap to open envelope"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleOpen();
        }}
      >
        <div className="envelope-back" />

        <div className="letter">
          <div className="letter-content">
            <p className="letter-heading">My Dearest ❤️</p>
            <p className="letter-body">
              Every line of code in this little surprise was written
              thinking of you. Thank you for being my favorite person
              to build things for.
            </p>
            {opened && (
              <button
                className="continue-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onComplete && onComplete();
                }}
              >
                Continue
              </button>
            )}
          </div>
        </div>

        <div className="envelope-pocket" />
        <div className="envelope-flap" />
        <div className="envelope-seal">❤</div>
      </div>

      {!opened && <p className="hint">Tap the envelope to open ✉️</p>}

      <style>{`
        .stage5-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 18px;
        }

        .envelope {
          position: relative;
          width: min(280px, 78vw);
          aspect-ratio: 3 / 2;
          cursor: pointer;
          perspective: 1000px;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        .envelope:active .envelope-back {
          transform: scale(0.98);
        }

        .envelope-back {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #ff9eb5, #ff4d6d);
          border-radius: 10px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
          transition: transform 0.15s ease;
        }

        .letter {
          position: absolute;
          left: 6%;
          right: 6%;
          top: 4%;
          min-height: 92%;
          background: #fffaf5;
          border-radius: 8px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
          transform: translateY(4%);
          transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 2;
        }

        .envelope.opened .letter {
          transform: translateY(-62%);
        }

        .letter-content {
          padding: 18px 16px 20px;
          text-align: center;
        }

        .letter-heading {
          font-size: clamp(1rem, 4.5vw, 1.2rem);
          font-weight: 700;
          color: #ff4d6d;
          margin-bottom: 10px;
        }

        .letter-body {
          font-size: clamp(0.82rem, 3.8vw, 0.95rem);
          line-height: 1.6;
          color: #444;
        }

        .continue-btn {
          margin-top: 16px;
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 10px;
          background: #ff4d6d;
          color: #fff;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          opacity: 0;
          animation: fade-up 0.5s ease 0.4s forwards;
        }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .envelope-pocket {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 58%;
          background: linear-gradient(135deg, #ff4d6d, #ff758f);
          clip-path: polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%);
          border-radius: 0 0 10px 10px;
          z-index: 3;
        }

        .envelope-flap {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 55%;
          background: linear-gradient(135deg, #ffb3c6, #ff9eb5);
          clip-path: polygon(0 0, 100% 0, 50% 100%);
          transform-origin: top center;
          transform-style: preserve-3d;
          transition: transform 0.7s ease;
          z-index: 4;
        }

        .envelope.opened .envelope-flap {
          transform: rotateX(180deg);
          z-index: 1;
        }

        .envelope-seal {
          position: absolute;
          top: 36%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #ff4d6d;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 17px;
          z-index: 5;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .envelope.opened .envelope-seal {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0);
        }

        .hint {
          color: rgba(255, 255, 255, 0.75);
          font-size: 0.9rem;
          animation: pulse 1.6s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .letter, .envelope-flap, .envelope-seal, .continue-btn, .hint {
            animation: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}