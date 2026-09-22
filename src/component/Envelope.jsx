import { useState } from "react";

/**
 * Envelope Component
 * ------------------
 * A standalone envelope that opens to reveal a message.
 * Once opened, it shows the text and a "Continue" button.
 *
 * Props:
 *  - onContinue: Function called when the user clicks "Continue".
 *  - sealColor: (optional) Color of the wax seal. Defaults to deep red.
 */
export default function Envelope({ onContinue, sealColor = "#c0392b" }) {
  const [opened, setOpened] = useState(false);

  return (
    <div style={styles.stage}>
      {/* Background stars for ambiance */}
      <div style={styles.sky}>
        {STARS.map((s, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: "#fff",
              opacity: s.opacity,
            }}
          />
        ))}
      </div>

      <div style={styles.envelopeWrap}>
        <div style={styles.envelope}>
          {/* Envelope Pockets */}
          <div style={styles.pocketLeft} />
          <div style={styles.pocketRight} />
          <div style={styles.pocketBottom} />

          {/* The Flap (animates open) */}
          <div
            style={{
              ...styles.flap,
              transform: opened ? "rotateX(180deg)" : "rotateX(0deg)",
              zIndex: opened ? 1 : 5,
            }}
          />

          {/* The Letter (slides up when opened) */}
          <div
            style={{
              ...styles.letter,
              transform: opened ? "translateY(-80px)" : "translateY(0)",
              opacity: opened ? 1 : 0,
              zIndex: opened ? 4 : 2,
            }}
          >
            <p style={styles.message}>
              Hye our journey start from 2022 til I need until my breath finish
            </p>
            <button style={styles.continueBtn} onClick={onContinue}>
              Continue
            </button>
          </div>

          {/* The Seal (clickable) */}
          {!opened && (
            <button
              aria-label="Open envelope"
              onClick={() => setOpened(true)}
              style={styles.seal}
            >
              <span style={{ ...styles.sealDot, background: sealColor }} />
            </button>
          )}
        </div>

        {!opened && <p style={styles.hint}>Tap the seal to read</p>}
      </div>
    </div>
  );
}

// Generate random stars for the background
const STARS = Array.from({ length: 50 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() < 0.15 ? 2.5 : 1.2,
  opacity: 0.3 + Math.random() * 0.7,
}));

const styles = {
  stage: {
    position: "relative",
    width: "100%",
    minHeight: "100vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    background: "radial-gradient(ellipse at 50% 20%, #1c2541 0%, #0b1021 60%, #070a16 100%)",
  },
  sky: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
  },
  envelopeWrap: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
    padding: "20px",
    width: "100%",
    maxWidth: "400px",
  },
  envelope: {
    position: "relative",
    width: "min(320px, 90vw)",
    height: "calc(min(320px, 90vw) / 1.523)", // Maintains aspect ratio
    perspective: "1000px", // Required for 3D flap rotation
  },
  pocketLeft: {
    position: "absolute",
    inset: 0,
    background: "#f3e6d0",
    clipPath: "polygon(0 0, 50% 55%, 0 100%)",
    borderRadius: 10,
    zIndex: 2,
  },
  pocketRight: {
    position: "absolute",
    inset: 0,
    background: "#eaddc4",
    clipPath: "polygon(100% 0, 50% 55%, 100% 100%)",
    borderRadius: 10,
    zIndex: 2,
  },
  pocketBottom: {
    position: "absolute",
    inset: 0,
    background: "#ede0c8",
    clipPath: "polygon(0 100%, 50% 45%, 100% 100%)",
    borderRadius: 10,
    zIndex: 3,
  },
  flap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "58%",
    background: "linear-gradient(160deg, #fbf1de, #e9d9b8)",
    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
    transformOrigin: "top center",
    transition: "transform 0.7s cubic-bezier(0.6, -0.1, 0.3, 1.2)",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    borderRadius: "10px 10px 0 0",
  },
  letter: {
    position: "absolute",
    top: "10%",
    left: "5%",
    right: "5%",
    bottom: "10%",
    background: "#fffdf7",
    borderRadius: 8,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    transition: "transform 0.8s ease, opacity 0.5s ease",
    pointerEvents: "none", // Prevents clicking when hidden
  },
  message: {
    fontSize: "clamp(14px, 4vw, 18px)",
    lineHeight: 1.5,
    color: "#2c3e50",
    margin: "0 0 20px 0",
    fontWeight: "500",
    fontStyle: "italic",
  },
  continueBtn: {
    padding: "10px 24px",
    fontSize: "clamp(13px, 3.5vw, 15px)",
    fontWeight: "bold",
    color: "#fff",
    background: "#c0392b",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(192, 57, 43, 0.3)",
    transition: "transform 0.2s, boxShadow 0.2s",
    pointerEvents: "auto", // Re-enable clicks for the button
  },
  seal: {
    position: "absolute",
    left: "50%",
    top: "48%",
    transform: "translate(-50%, -50%)",
    width: "clamp(40px, 14vw, 46px)",
    height: "clamp(40px, 14vw, 46px)",
    borderRadius: "50%",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 6,
    background: "transparent",
    transition: "transform 0.2s",
  },
  sealDot: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    boxShadow: "0 3px 8px rgba(0,0,0,0.4), inset 0 -3px 6px rgba(0,0,0,0.25)",
  },
  hint: {
    color: "#cbd5f5",
    fontSize: "clamp(12px, 3.5vw, 14px)",
    letterSpacing: "0.05em",
    opacity: 0.8,
    textAlign: "center",
    margin: 0,
  },
};