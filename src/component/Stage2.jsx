import React, { useEffect, useRef, useState } from "react";

export default function Stage2({ onComplete }) {
  const [progress, setProgress] = useState(1);
  const completeTimeoutRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          completeTimeoutRef.current = setTimeout(() => {
            onComplete && onComplete();
          }, 1000);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => {
      clearInterval(timer);
      if (completeTimeoutRef.current) {
        clearTimeout(completeTimeoutRef.current);
      }
    };
  }, [onComplete]);

  return (
    <div className="stage2-container">
      <div className="loading-text">
        <span className="loading-line">Loading My Love</span>
        <span className="loading-line">Of My Heart ❤️</span>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <h2 className="percentage">{progress}%</h2>

      {progress === 100 && <p className="complete-text">Complete ❤️</p>}

      <style>{`
        .stage2-container {
          width: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #fff;
          text-align: center;
        }

        .loading-text {
          display: flex;
          flex-direction: column;
          margin: 0 0 30px 0;
          max-width: 100%;
        }

        .loading-line {
          display: block;
          font-size: clamp(1.3rem, 5vw, 2rem);
          line-height: 1.5;
          color: #ff7aa2;
          font-weight: 700;
        }

        .progress-bar {
          width: 100%;
          height: 14px;
          background: rgba(255,255,255,0.15);
          border-radius: 50px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.2);
          box-sizing: border-box;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff4d6d, #ff758f, #ff9eb5);
          transition: width 0.05s linear;
        }

        .percentage {
          margin-top: 20px;
          font-size: clamp(1.8rem, 8vw, 2.5rem);
          font-weight: bold;
        }

        .complete-text {
          margin-top: 10px;
          color: #ff9eb5;
          font-size: 1.2rem;
          animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}