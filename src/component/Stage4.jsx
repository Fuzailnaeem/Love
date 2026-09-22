
export default function Stage4({ onComplete }) {
  return (
    <div className="stage4-container">
      <p className="greeting">Hey Muqaddas ❤️</p>

      <p className="message">
        You know your UPComming husband is a coder — so this is one of my little
        coding projects, made just to make you smile.
      </p>

      <button className="next-btn" onClick={() => onComplete && onComplete()}>
        Continue
      </button>

      <style>{`
        .stage4-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #fff;
          text-align: center;
          gap: 18px;
        }

        .greeting {
          font-size: clamp(1.6rem, 6vw, 2.2rem);
          font-weight: 700;
          color: #ff9eb5;
          opacity: 0;
          animation: stage4-in 0.8s ease forwards;
        }

        .message {
          font-size: clamp(1rem, 4vw, 1.2rem);
          line-height: 1.7;
          color: rgba(255,255,255,0.9);
          max-width: 340px;
          opacity: 0;
          animation: stage4-in 0.8s ease 0.4s forwards;
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
          opacity: 0;
          animation: stage4-in 0.8s ease 0.9s forwards;
        }

        @keyframes stage4-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .greeting, .message, .next-btn {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}