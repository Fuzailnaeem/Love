import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import image1 from "./assets/image 1.jpeg";
import image2 from "./assets/image 2.jpeg";

const COLORS = ["#e0b354", "#f3e6c4", "#c0392b", "#8e2a1f", "#fff7e6", "#d98c3f"];
const GRAVITY = 0.02;

/* ---------- Hook: Detect mobile ---------- */
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

/* ---------- Fireworks ---------- */
function launchFireworks(canvas, count = 6) {
  const ctx = canvas.getContext("2d");
  let w = canvas.clientWidth;
  let h = canvas.clientHeight;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);

  let particles = [];

  function spawnBurst() {
    const cx = w * (0.2 + Math.random() * 0.6);
    const cy = h * (0.12 + Math.random() * 0.3);
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const n = 24 + Math.floor(Math.random() * 12);
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i) / n + Math.random() * 0.2;
      const speed = 1.4 + Math.random() * 2.2;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.012 + Math.random() * 0.01,
        color,
        size: 1.4 + Math.random() * 1.4,
      });
    }
  }

  const timers = [];
  for (let i = 0; i < count; i++) {
    timers.push(setTimeout(spawnBurst, i * 380));
  }

  let raf;
  let stopped = false;

  function tick() {
    if (stopped) return;
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      p.vy += GRAVITY;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
    });
    particles = particles.filter((p) => p.life > 0);
    particles.forEach((p) => {
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(tick);
  }
  tick();

  return () => {
    stopped = true;
    timers.forEach(clearTimeout);
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    ctx.clearRect(0, 0, w, h);
  };
}

/* ---------- Decorative ---------- */
function CrescentStar({ size = 22, style }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} style={style} aria-hidden="true">
      <path d="M24 6a14 14 0 1 0 0 28 11 11 0 1 1 0-28z" fill="#e0b354" opacity="0.85" />
      <path d="M32 10l1.4 3.2L36.6 15l-3.2 1.4L32 19.6l-1.4-3.2L27.4 15l3.2-1.4z" fill="#e0b354" opacity="0.85" />
    </svg>
  );
}

function GeometricPattern() {
  return (
    <svg width="100%" height="100%" style={styles.patternSvg} aria-hidden="true">
      <defs>
        <pattern id="starPattern" width="60" height="60" patternUnits="userSpaceOnUse">
          <g stroke="#e0b354" strokeWidth="0.6" fill="none" opacity="0.35">
            <path d="M30 4 L36 24 L56 30 L36 36 L30 56 L24 36 L4 30 L24 24 Z" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#starPattern)" />
    </svg>
  );
}

/* ---------- Step ---------- */
function Step({ children, onNext, nextLabel = "Continue", isLast = false, isMobile }) {
  return (
    <div style={{ ...styles.step, gap: isMobile ? 20 : 32 }}>
      <div style={{ ...styles.stepText, fontSize: isMobile ? 16 : "clamp(17px, 4.5vw, 26px)" }}>
        {children}
      </div>
      {!isLast && (
        <button style={styles.nextBtn} onClick={onNext} type="button">
          {nextLabel}
        </button>
      )}
    </div>
  );
}

/* ---------- Bismillah ---------- */
function BismillahStep() {
  return (
    <div style={styles.bismillahWrap}>
      <CrescentStar size={26} style={{ marginBottom: 4 }} />
      <div style={styles.bismillahArabic}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
      <div style={styles.bismillahDivider} />
      <p style={styles.bismillahUrdu}>Har achi shuruat Uske naam se hoti hai</p>
      <p style={styles.ayahText}>
        "And among His signs is this, that He created for you mates from among
        yourselves, that you may dwell in tranquillity with them, and He has put
        love and mercy between your hearts."
      </p>
      <p style={styles.ayahRef}>— Surah Ar-Rum 30:21</p>
    </div>
  );
}

/* ---------- Character Card ---------- */
const TRAITS = ["Sabr", "Haya", "Noor", "Simplicity"];
const INTERESTS = ["📚 Novels", "🕌 Deen", "🤲 Dua", "🌸 Sadagi"];

function CharacterCardStep({ isMobile }) {
  return (
    <div style={styles.characterWrap}>
      <p style={styles.characterKicker}>— Character Sketch —</p>
      <div style={{ ...styles.characterCard, padding: isMobile ? "18px 16px" : "clamp(16px, 4vw, 32px)" }}>
        <h2 style={styles.characterName}>Muqadas Habib</h2>
        <div style={styles.characterDivider} />
        <p style={styles.characterLabel}>Traits</p>
        <div style={styles.chipRow}>
          {TRAITS.map((t) => (
            <span key={t} style={styles.chip}>{t}</span>
          ))}
        </div>
        <p style={styles.characterLabel}>Loves</p>
        <div style={styles.chipRow}>
          {INTERESTS.map((t) => (
            <span key={t} style={styles.chipAlt}>{t}</span>
          ))}
        </div>
        <p style={styles.characterAbility}>
          <em>Special Ability:</em> Makes ordinary moments feel like a dua answered.
        </p>
      </div>
      <p style={styles.characterCaption}>Aur is kahani ki heroine — sirf tum ho.</p>
    </div>
  );
}

/* ---------- From This To This ---------- */
function FromThisToThisStep({ isMobile }) {
  return (
    <div style={styles.transformWrap}>
      <div style={styles.transformRow}>
        <div style={styles.imageCol}>
          <img
            src={image1}
            alt="Before"
            style={{ ...styles.transformImg, maxWidth: isMobile ? 110 : 180 }}
            loading="lazy"
          />
        </div>
        <div style={{ ...styles.arrowCol, width: isMobile ? 28 : "clamp(30px, 8vw, 44px)" }} aria-hidden="true">
          <svg viewBox="0 0 60 24" width="100%" height="20" style={styles.arrowSvg}>
            <line x1="2" y1="12" x2="46" y2="12" stroke="#c0392b" strokeWidth="2.5" strokeLinecap="round" />
            <polyline points="40,4 52,12 40,20" fill="none" stroke="#c0392b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={styles.imageCol}>
          <img
            src={image2}
            alt="After"
            style={{ ...styles.transformImg, maxWidth: isMobile ? 110 : 180 }}
            loading="lazy"
          />
        </div>
      </div>
      <p style={styles.transformCaption}>We move from this to this</p>
    </div>
  );
}

/* ---------- Friends Corner ---------- */
const FRIEND_NOTES = [
  { name: "Neha", note: `"Tum dono ki dosti mein ek sukoon hai — jaise dua qubool ho gayi ho."` },
  { name: "Dua", note: "May Allah always keep your hearts this soft and this close. Ameen." },
  { name: "Maheen", note: `"Maine tumhe dekha hai — ye sirf kahani nahi, ek niyamat hai."` },
];

function FriendsCornerStep() {
  return (
    <div style={styles.friendsWrap}>
      <p style={styles.friendsIntro}>And the people who walked beside us — they saw it too.</p>
      <div style={styles.friendsList}>
        {FRIEND_NOTES.map(({ name, note }) => (
          <p key={name} style={styles.friendNote}>
            <span style={styles.friendName}>{name}:</span> {note}
          </p>
        ))}
      </div>
    </div>
  );
}

/* ---------- Tasbeeh / Deen ---------- */
const QUALITIES = [
  "Sabr", "Haya", "Imaan", "Sadaqi", "Noor", "Sukoon",
  "Rehmat", "Ikhlaas", "Karam", "Fitrat", "Taharat", "Rahm",
];
const TASBEEH_RADIUS = 130;
const TASBEEH_INTERVAL_MS = 420;

function DeenStep({ isMobile }) {
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setLit((n) => {
        if (n >= QUALITIES.length - 1) {
          clearInterval(id);
          return QUALITIES.length;
        }
        return n + 1;
      });
    }, TASBEEH_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const beads = useMemo(
    () =>
      QUALITIES.map((q, i) => {
        const angle = (Math.PI * 2 * i) / QUALITIES.length - Math.PI / 2;
        return {
          q,
          x: Math.cos(angle) * TASBEEH_RADIUS,
          y: Math.sin(angle) * TASBEEH_RADIUS,
        };
      }),
    []
  );

  return (
    <div style={styles.deenWrap}>
      <p style={styles.deenIntro}>
        Tumhare Deen ne tumhe woh Noor diya hai, jo lafzon mein bayan na ho.
      </p>
      <div style={{ ...styles.tasbeehHolder, width: isMobile ? "85vw" : "min(320px, 85vw)" }}>
        <svg viewBox="-180 -180 360 360" width="100%" height="auto" style={styles.tasbeehSvg} aria-hidden="true">
          {beads.map(({ q, x, y }, i) => {
            const active = i < lit;
            return (
              <g key={q}>
                <circle
                  cx={x}
                  cy={y}
                  r={active ? 9 : 6}
                  fill={active ? "#c0392b" : "#e6d8bd"}
                  stroke={active ? "#8e2a1f" : "#c9b894"}
                  strokeWidth="1.5"
                  style={{
                    transition: "all 0.45s ease",
                    filter: active ? "drop-shadow(0 0 6px rgba(192,57,43,0.6))" : "none",
                  }}
                />
                {active && (
                  <text x={x} y={y - 16} textAnchor="middle" fontSize="9" fill="#8e2a1f" fontFamily="Georgia, serif" fontStyle="italic">
                    {q}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <p style={styles.deenDua}>
        Ya Allah, agar Muqadas meri taqdeer hai — toh ise haseen bana de.
      </p>
    </div>
  );
}

/* ---------- Istikhara ---------- */
function IstikharaStep() {
  return (
    <div style={styles.istikharaWrap}>
      <CrescentStar size={24} style={{ marginBottom: 2 }} />
      <p style={styles.istikharaKicker}>Before I asked you, I asked Allah first</p>
      <p style={styles.istikharaLine}>
        Maine sirf apne dil se faisla nahi kiya. Maine sajde mein sar rakh
        kar poocha — ke agar Muqadas mere liye khair hai, toh Tu meri raah
        aasaan kar de, aur agar nahi, toh mujhe kisi aur khair ki taraf
        mod de.
      </p>
      <div style={styles.istikharaHadithBox}>
        <p style={styles.istikharaHadithArabic}>خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ</p>
        <p style={styles.istikharaHadithText}>
          "The best among you are those who are best to their families."
        </p>
        <p style={styles.istikharaHadithRef}>— Prophet Muhammad ﷺ (Tirmidhi)</p>
      </div>
      <p style={styles.istikharaLine}>
        Aur jab dil ko sukoon mila — tab samajh aaya, ke ye sirf mohabbat
        nahi, ye ek dua ka jawab hai.
      </p>
    </div>
  );
}

/* ---------- Sadagi ---------- */
function SadagiStep({ isMobile }) {
  return (
    <div style={styles.sadagiWrap}>
      <svg
        viewBox="0 0 400 200"
        width="100%"
        height="auto"
        style={{ ...styles.calligraphySvg, width: isMobile ? "80vw" : "min(300px, 85vw)" }}
        aria-label="Muqadas in Urdu"
      >
        <defs>
          <linearGradient id="inkGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8e2a1f" />
            <stop offset="100%" stopColor="#c0392b" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#inkGrad)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M40 120 C 50 80, 80 70, 95 90 C 105 105, 100 120, 90 125 C 100 130, 120 125, 130 110" />
          <path d="M40 120 L 40 138" />
          <circle cx="44" cy="150" r="3.2" fill="#8e2a1f" stroke="none" />
          <path d="M150 140 C 155 100, 175 85, 195 95 C 210 105, 205 125, 190 130 L 205 150" />
          <circle cx="160" cy="150" r="3.2" fill="#8e2a1f" stroke="none" />
          <path d="M240 120 C 250 90, 275 85, 295 100 C 305 110, 300 125, 285 128" />
          <circle cx="250" cy="150" r="3.2" fill="#8e2a1f" stroke="none" />
          <path d="M320 130 C 330 110, 350 110, 355 125 C 360 115, 375 115, 380 130" />
          <circle cx="330" cy="150" r="3.2" fill="#8e2a1f" stroke="none" />
        </g>
      </svg>
      <p style={styles.sadagiLine}>Kuch log mehngi cheezon se khoobsurat lagte hain,</p>
      <p style={styles.sadagiLine}>
        aur kuch — jaise tum — sadagi mein hi ek duniya basaa dete hain.
      </p>
    </div>
  );
}

/* ---------- Proposal ---------- */
function ProposalStep({ onAccepted, isMobile }) {
  const [response, setResponse] = useState(null);
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 });
  const clickCountRef = useRef(0);

  const runAway = useCallback(() => {
    clickCountRef.current += 1;
    const rangeX = Math.min(window.innerWidth * 0.35, 140);
    const rangeY = Math.min(window.innerHeight * 0.18, 80);
    setBtnOffset({
      x: (Math.random() - 0.5) * rangeX,
      y: (Math.random() - 0.5) * rangeY,
    });
  }, []);

  if (response === "yes") {
    return (
      <div style={styles.proposalWrap}>
        <p style={styles.yesBigArabic}>الْحَمْدُ لِلَّهِ</p>
        <p style={styles.yesLine}>Alhamdulillah. Ab ye kitaab hum dono milkar likhenge.</p>
        <p style={styles.yesSub}>Muqadas, tumhara "Haan" meri zindagi ka sab se haseen lafz hai.</p>
        <p style={styles.yesDua}>
          بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
        </p>
        <p style={styles.yesFooterLine}>
          May Allah bless you, bless me, and unite us in goodness. Ameen.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.proposalWrap}>
      <div style={styles.ringGlow} aria-hidden="true">
        <div style={styles.ringOuter} />
        <div style={styles.ringInner} />
      </div>
      <p style={styles.proposalArabic}>
        وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا
      </p>
      <p style={styles.proposalLine}>Muqadas, kya tum meri zindagi ka hissa banogi?</p>

      {response === "thinking" && (
        <p style={styles.thinkingMsg}>
          Sochne ka waqt toh mila, par dil ne toh pehle hi "Haan" keh diya tha…
        </p>
      )}

      <div style={styles.proposalBtns}>
        <button
          type="button"
          style={styles.yesBtn}
          onClick={() => {
            setResponse("yes");
            onAccepted?.();
          }}
        >
          Haan 💍
        </button>
        <button
          type="button"
          style={{
            ...styles.thinkBtn,
            transform: `translate(${btnOffset.x}px, ${btnOffset.y}px)`,
          }}
          onMouseEnter={() => {
            if (clickCountRef.current >= 1) runAway();
          }}
          onTouchStart={() => {
            if (clickCountRef.current >= 1) runAway();
          }}
          onClick={() => {
            setResponse("thinking");
            runAway();
          }}
        >
          Sochne Do
        </button>
      </div>
    </div>
  );
}

/* ---------- Stars ---------- */
const STARS = Array.from({ length: 60 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() < 0.15 ? 2.5 : 1.2,
  opacity: 0.3 + Math.random() * 0.7,
}));

function StarField() {
  const stars = useMemo(
    () =>
      STARS.map((s, i) => (
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
      )),
    []
  );
  return <div style={styles.sky}>{stars}</div>;
}

/* ---------- Root ---------- */
export default function EnvelopeReveal({ children, sealColor = "#c0392b" }) {
  const isMobile = useIsMobile();

  const [opened, setOpened] = useState(false);
  const [showPage, setShowPage] = useState(false);
  const [envelopeGone, setEnvelopeGone] = useState(false);
  const [step, setStep] = useState(0);
  const [accepted, setAccepted] = useState(false);

  const canvasRef = useRef(null);
  const cleanupRef = useRef(null);
  const pageRef = useRef(null);
  const openTimersRef = useRef([]);

  const handleAccepted = useCallback(() => {
    setAccepted(true);
    if (canvasRef.current) {
      cleanupRef.current?.();
      cleanupRef.current = launchFireworks(canvasRef.current, 20);
    }
  }, []);

  const storySteps = useMemo(
    () => [
      { key: "start", text: "Hey… our journey started in 2022 — quietly, the way the best duas get written.", next: "Continue" },
      { key: "bismillah", next: "Continue", render: (isM) => <BismillahStep isMobile={isM} /> },
      { key: "character", next: "Continue", render: (isM) => <CharacterCardStep isMobile={isM} /> },
      { key: "transform", next: "Continue", render: (isM) => <FromThisToThisStep isMobile={isM} /> },
      { key: "friends", next: "Continue", render: () => <FriendsCornerStep /> },
      { key: "deen", next: "Continue", render: (isM) => <DeenStep isMobile={isM} /> },
      { key: "istikhara", next: "Continue", render: () => <IstikharaStep /> },
      { key: "sadagi", next: "Continue", render: (isM) => <SadagiStep isMobile={isM} /> },
      { key: "forever", text: "And I hope it never ends… until Jannah, insha'Allah.", next: "Ek Aakhri Baat…" },
      { key: "proposal", next: null, isLast: true, render: (isM) => <ProposalStep onAccepted={handleAccepted} isMobile={isM} /> },
    ],
    [handleAccepted]
  );

  const handleOpen = useCallback(() => {
    if (opened) return;
    setOpened(true);
    if (canvasRef.current) {
      cleanupRef.current?.();
      cleanupRef.current = launchFireworks(canvasRef.current, 6);
    }
    const t1 = setTimeout(() => setEnvelopeGone(true), 650);
    const t2 = setTimeout(() => setShowPage(true), 900);
    openTimersRef.current.push(t1, t2);
  }, [opened]);

  const handleNext = useCallback(() => {
    setStep((s) => Math.min(s + 1, storySteps.length - 1));
    requestAnimationFrame(() => {
      pageRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, [storySteps.length]);

  useEffect(() => {
    const openTimers = openTimersRef.current;
    return () => {
      cleanupRef.current?.();
      openTimers.forEach(clearTimeout);
    };
  }, []);

  const current = storySteps[step];
  const isLast = current.isLast || step === storySteps.length - 1;

  return (
    <div style={{ ...styles.stage, ...(isMobile ? styles.stageMobile : {}) }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pageTurn {
          0%   { opacity: 0; transform: perspective(1200px) rotateY(10deg); }
          100% { opacity: 1; transform: perspective(1200px) rotateY(0deg); }
        }
        @keyframes bismillahGlow {
          0%, 100% { text-shadow: 0 0 0 rgba(192,57,43,0); opacity: 0.92; }
          50%      { text-shadow: 0 0 22px rgba(192,57,43,0.35), 0 0 44px rgba(224,179,84,0.25); opacity: 1; }
        }
        @keyframes arrowSlide {
          0%   { transform: translateX(-6px); opacity: 0.7; }
          50%  { transform: translateX(6px);  opacity: 1;   }
          100% { transform: translateX(-6px); opacity: 0.7; }
        }
        @keyframes ringPulse {
          0%, 100% { transform: scale(1);    opacity: 0.85; }
          50%      { transform: scale(1.08); opacity: 1;    }
        }
        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          overflow-x: hidden;
        }
      `}</style>

      <div style={styles.skyFixed}>
        <StarField />
        <GeometricPattern />
      </div>

      <canvas ref={canvasRef} style={styles.canvas} />

      {!envelopeGone && (
        <div
          style={{
            ...styles.envelopeWrap,
            opacity: envelopeGone ? 0 : 1,
            transform: opened ? "translate(-50%, -40px) scale(0.9)" : "translate(-50%, 0) scale(1)",
          }}
        >
          <div style={styles.envelope}>
            <div style={styles.pocketLeft} />
            <div style={styles.pocketRight} />
            <div style={styles.pocketBottom} />
            <div
              style={{
                ...styles.flap,
                transform: opened ? "rotateX(180deg)" : "rotateX(0deg)",
                zIndex: opened ? 1 : 5,
              }}
            />
            {!opened && (
              <button aria-label="Open envelope" onClick={handleOpen} style={styles.seal} type="button">
                <span style={{ ...styles.sealDot, background: sealColor }} />
              </button>
            )}
          </div>
          {!opened && (
            <p style={styles.hint}>
              For the girl who reads novels and lives Deen — open your story, Muqadas.
            </p>
          )}
        </div>
      )}

      {showPage && (
        <div
          key={step}
          ref={pageRef}
          style={{
            ...styles.page,
            ...(isMobile ? styles.pageMobile : {}),
            animation: "pageTurn 0.7s ease both",
          }}
        >
          {children ? (
            children
          ) : (
            <Step
              onNext={handleNext}
              nextLabel={current.next || "Continue"}
              isLast={isLast}
              isMobile={isMobile}
            >
              {current.render ? current.render(isMobile) : current.text}
            </Step>
          )}
        </div>
      )}

      {accepted && (
        <p style={styles.acceptedFooter}>
          🤲 Allahumma barik lahuma wa barik alaihima wajma bainahuma fi khair
        </p>
      )}
    </div>
  );
}

/* ---------- Styles ---------- */
const styles = {
  stage: {
    position: "relative",
    width: "100%",
    minHeight: "100dvh",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    WebkitTapHighlightColor: "transparent",
    padding: "12px 0",
    boxSizing: "border-box",
  },
 stageMobile: {
  alignItems: "center",        // <-- center hi rakho
  justifyContent: "center",
  padding: "8px 0 24px",
  minHeight: "100dvh",
},

  skyFixed: {
    position: "fixed",
    inset: 0,
    background: "radial-gradient(ellipse at 50% 20%, #1c2541 0%, #0b1021 60%, #070a16 100%)",
    zIndex: -2,
  },
  sky: { position: "absolute", inset: 0 },
  patternSvg: { position: "absolute", inset: 0, pointerEvents: "none" },
  canvas: { position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: -1, pointerEvents: "none" },

  /* ENVELOPE */
  envelopeWrap: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, 0)",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 18,
    width: "100%",
    maxWidth: 380,
    padding: "0 16px",
    boxSizing: "border-box",
    transition: "opacity 0.6s ease, transform 0.6s ease",
  },
  envelope: { position: "relative", width: "min(320px, 85vw)", height: "calc(min(320px, 85vw) / 1.523)" },
  pocketLeft: { position: "absolute", inset: 0, background: "#f3e6d0", clipPath: "polygon(0 0, 50% 55%, 0 100%)", borderRadius: 10 },
  pocketRight: { position: "absolute", inset: 0, background: "#eaddc4", clipPath: "polygon(100% 0, 50% 55%, 100% 100%)", borderRadius: 10 },
  pocketBottom: { position: "absolute", inset: 0, background: "#ede0c8", clipPath: "polygon(0 100%, 50% 45%, 100% 100%)", borderRadius: 10 },
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
  },
  seal: {
    position: "absolute",
    left: "50%",
    top: "48%",
    transform: "translate(-50%, -50%)",
    width: "clamp(44px, 14vw, 48px)",
    height: "clamp(44px, 14vw, 48px)",
    borderRadius: "50%",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 6,
    background: "transparent",
    padding: 0,
    WebkitTapHighlightColor: "transparent",
  },
  sealDot: { width: "100%", height: "100%", borderRadius: "50%", boxShadow: "0 3px 8px rgba(0,0,0,0.4), inset 0 -3px 6px rgba(0,0,0,0.25)" },
  hint: { color: "#cbd5f5", fontSize: "clamp(12px, 3.5vw, 13px)", letterSpacing: "0.02em", opacity: 0.85, textAlign: "center", padding: "0 8px", margin: 0, lineHeight: 1.6 },

  /* BISMILLAH */
  bismillahWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%", textAlign: "center" },
  bismillahArabic: {
    fontFamily: "'Scheherazade New', 'Amiri', 'Noto Naskh Arabic', serif",
    fontSize: "clamp(22px, 5.5vw, 42px)",
    lineHeight: 1.9,
    color: "#1f2b46",
    direction: "rtl",
    animation: "bismillahGlow 3.5s ease-in-out infinite",
  },
  bismillahDivider: { width: 80, height: 1, background: "linear-gradient(90deg, transparent, #c0392b, transparent)", opacity: 0.6 },
  bismillahUrdu: { fontSize: "clamp(13px, 3.8vw, 19px)", fontStyle: "italic", color: "#4a4a4a", margin: 0, animation: "fadeIn 1.2s ease both" },
  ayahText: { fontSize: "clamp(12px, 3.2vw, 15px)", fontStyle: "italic", color: "#5a5a5a", lineHeight: 1.7, maxWidth: 500, margin: 0, animation: "fadeIn 1.6s ease both" },
  ayahRef: { fontSize: "clamp(11px, 3vw, 13px)", color: "#8e2a1f", letterSpacing: "0.08em", margin: 0, fontWeight: 600 },

  /* CHARACTER */
  characterWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 20, width: "100%", textAlign: "center" },
  characterKicker: { fontSize: "clamp(10px, 3vw, 14px)", color: "#8e2a1f", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0, fontWeight: 600 },
  characterCard: {
    width: "100%",
    maxWidth: 480,
    background: "#fbf6ec",
    borderRadius: 16,
    padding: "clamp(16px, 4vw, 32px)",
    border: "1px solid #e6d8bd",
    boxShadow: "0 10px 30px rgba(142,42,31,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    boxSizing: "border-box",
  },
  characterName: { fontFamily: "'Cormorant Garamond', 'Iowan Old Style', Georgia, serif", fontSize: "clamp(20px, 5.5vw, 32px)", color: "#8e2a1f", margin: 0, letterSpacing: "0.02em", fontWeight: 600 },
  characterDivider: { width: 60, height: 1, background: "#c0392b", opacity: 0.5, margin: "0 auto" },
  characterLabel: { fontSize: "clamp(10px, 2.8vw, 12px)", color: "#8e2a1f", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0, fontWeight: 600, textAlign: "left" },
  chipRow: { display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "flex-start" },
  chip: { padding: "5px 12px", fontSize: "clamp(10px, 2.8vw, 13px)", background: "#c0392b", color: "#fffdf7", borderRadius: 999, fontStyle: "italic", letterSpacing: "0.02em" },
  chipAlt: { padding: "5px 12px", fontSize: "clamp(10px, 2.8vw, 13px)", background: "transparent", color: "#8e2a1f", border: "1px solid #c0392b", borderRadius: 999, fontStyle: "italic", letterSpacing: "0.02em" },
  characterAbility: { fontSize: "clamp(11px, 3vw, 15px)", color: "#4a4a4a", lineHeight: 1.6, margin: "8px 0 0", textAlign: "left", fontStyle: "italic" },
  characterCaption: { fontSize: "clamp(13px, 3.8vw, 18px)", color: "#8e2a1f", fontStyle: "italic", margin: 0, animation: "fadeIn 1.2s ease both" },

  /* TRANSFORM */
  transformWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: "100%" },
  transformRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(4px, 2vw, 16px)", width: "100%", flexWrap: "nowrap" },
  imageCol: { flex: "1 1 0", minWidth: 0, display: "flex", justifyContent: "center" },
  transformImg: { width: "100%", maxWidth: 180, aspectRatio: "1 / 1", objectFit: "cover", borderRadius: 14, boxShadow: "0 12px 28px rgba(0,0,0,0.22)", border: "3px solid #fffdf7", background: "#eaddc4", display: "block" },
  arrowCol: { flex: "0 0 auto", width: "clamp(30px, 8vw, 44px)", display: "flex", alignItems: "center", justifyContent: "center" },
  arrowSvg: { animation: "arrowSlide 1.8s ease-in-out infinite", width: "100%", height: "auto" },
  transformCaption: { fontSize: "clamp(13px, 3.8vw, 19px)", fontStyle: "italic", color: "#2b2b2b", textAlign: "center", margin: 0, animation: "fadeIn 1.2s ease both" },

  /* FRIENDS */
  friendsWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 22, width: "100%", textAlign: "center" },
  friendsIntro: { fontSize: "clamp(14px, 4vw, 20px)", fontStyle: "italic", color: "#2b2b2b", lineHeight: 1.6, margin: 0, maxWidth: 500, animation: "fadeIn 0.8s ease both" },
  friendsList: { display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 500 },
  friendNote: { fontSize: "clamp(11px, 3.4vw, 15px)", lineHeight: 1.6, color: "#4a4a4a", fontStyle: "italic", margin: 0, padding: "10px 14px", background: "#fbf6ec", borderRadius: 12, borderLeft: "3px solid #c0392b", textAlign: "left", animation: "fadeIn 1s ease both" },
  friendName: { fontStyle: "normal", fontWeight: 600, color: "#c0392b" },

  /* DEEN */
  deenWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%", textAlign: "center" },
  deenIntro: { fontSize: "clamp(13px, 3.8vw, 19px)", fontStyle: "italic", color: "#2b2b2b", lineHeight: 1.6, margin: 0, maxWidth: 500, animation: "fadeIn 0.8s ease both" },
  tasbeehHolder: { display: "flex", justifyContent: "center", alignItems: "center", width: "min(320px, 85vw)", margin: "4px auto" },
  tasbeehSvg: { overflow: "visible", width: "100%", height: "auto", display: "block" },
  deenDua: { fontSize: "clamp(12px, 3.5vw, 15px)", fontStyle: "italic", color: "#8e2a1f", margin: 0, maxWidth: 480, lineHeight: 1.6, animation: "fadeIn 1.4s ease both" },

  /* ISTIKHARA */
  istikharaWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%", textAlign: "center" },
  istikharaKicker: { fontSize: "clamp(11px, 3.4vw, 15px)", color: "#8e2a1f", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0, fontWeight: 600 },
  istikharaLine: { fontSize: "clamp(12px, 3.6vw, 17px)", fontStyle: "italic", color: "#2b2b2b", lineHeight: 1.75, margin: 0, maxWidth: 520, animation: "fadeIn 1s ease both" },
  istikharaHadithBox: {
    width: "100%",
    maxWidth: 460,
    background: "#fbf6ec",
    border: "1px solid #e6d8bd",
    borderRadius: 14,
    padding: "16px 18px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    boxSizing: "border-box",
  },
  istikharaHadithArabic: {
    fontFamily: "'Scheherazade New', 'Amiri', 'Noto Naskh Arabic', serif",
    fontSize: "clamp(15px, 4.5vw, 24px)",
    color: "#8e2a1f",
    direction: "rtl",
    margin: 0,
    lineHeight: 1.7,
  },
  istikharaHadithText: { fontSize: "clamp(11px, 3.2vw, 14px)", fontStyle: "italic", color: "#4a4a4a", margin: 0, lineHeight: 1.6 },
  istikharaHadithRef: { fontSize: "clamp(10px, 2.8vw, 12px)", color: "#8e2a1f", letterSpacing: "0.04em", margin: 0, fontWeight: 600 },

  /* SADAGI */
  sadagiWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%", textAlign: "center" },
  calligraphySvg: { width: "min(300px, 85vw)", maxWidth: 340, marginBottom: 6, display: "block" },
  sadagiLine: { fontSize: "clamp(13px, 3.8vw, 19px)", fontStyle: "italic", color: "#2b2b2b", lineHeight: 1.7, margin: 0, maxWidth: 520, animation: "fadeIn 1.2s ease both" },

  /* PROPOSAL */
  proposalWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 18, width: "100%", textAlign: "center" },
  ringGlow: { position: "relative", width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 },
  ringOuter: { position: "absolute", inset: 0, borderRadius: "50%", border: "2px dashed rgba(224,179,84,0.55)", animation: "ringRotate 22s linear infinite" },
  ringInner: { width: 42, height: 42, borderRadius: "50%", border: "3px solid #c0392b", boxShadow: "0 0 18px rgba(224,179,84,0.55), inset 0 0 12px rgba(192,57,43,0.35)", animation: "ringPulse 2.4s ease-in-out infinite" },
  proposalArabic: { fontFamily: "'Scheherazade New', 'Amiri', 'Noto Naskh Arabic', serif", fontSize: "clamp(12px, 3.6vw, 18px)", color: "#8e2a1f", direction: "rtl", lineHeight: 1.9, margin: 0, maxWidth: 500, animation: "bismillahGlow 4s ease-in-out infinite" },
  proposalLine: { fontSize: "clamp(15px, 4.4vw, 23px)", fontStyle: "italic", color: "#2b2b2b", lineHeight: 1.6, margin: 0, maxWidth: 520, animation: "fadeIn 1s ease both" },
  thinkingMsg: { fontSize: "clamp(11px, 3.4vw, 15px)", fontStyle: "italic", color: "#8e2a1f", margin: 0, maxWidth: 440, lineHeight: 1.6, animation: "fadeIn 0.6s ease both" },
  proposalBtns: { display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap", justifyContent: "center", alignItems: "center", width: "100%" },
  yesBtn: {
    padding: "14px clamp(24px, 8vw, 44px)",
    fontSize: "clamp(13px, 3.8vw, 17px)",
    fontFamily: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    color: "#fffdf7",
    background: "linear-gradient(135deg, #c0392b, #8e2a1f)",
    border: "none",
    borderRadius: 999,
    cursor: "pointer",
    letterSpacing: "0.05em",
    boxShadow: "0 6px 20px rgba(192,57,43,0.5)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    WebkitTapHighlightColor: "transparent",
    minHeight: 48,
  },
  thinkBtn: {
    padding: "14px clamp(20px, 6vw, 32px)",
    fontSize: "clamp(12px, 3.4vw, 15px)",
    fontFamily: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    color: "#8e2a1f",
    background: "transparent",
    border: "1.5px solid #c0392b",
    borderRadius: 999,
    cursor: "pointer",
    letterSpacing: "0.05em",
    transition: "transform 0.35s cubic-bezier(0.3, -0.4, 0.4, 1.4)",
    WebkitTapHighlightColor: "transparent",
    minHeight: 48,
  },
  yesBigArabic: { fontFamily: "'Scheherazade New', 'Amiri', 'Noto Naskh Arabic', serif", fontSize: "clamp(24px, 7vw, 42px)", color: "#8e2a1f", margin: 0, animation: "bismillahGlow 2.5s ease-in-out infinite" },
  yesLine: { fontSize: "clamp(14px, 4vw, 21px)", fontStyle: "italic", color: "#2b2b2b", margin: 0, maxWidth: 500, lineHeight: 1.6 },
  yesSub: { fontSize: "clamp(11px, 3.5vw, 15px)", fontStyle: "italic", color: "#8e2a1f", margin: 0, maxWidth: 480, lineHeight: 1.6 },
  yesDua: { fontFamily: "'Scheherazade New', 'Amiri', serif", fontSize: "clamp(12px, 3.6vw, 18px)", color: "#8e2a1f", direction: "rtl", lineHeight: 1.9, margin: "6px 0 0", maxWidth: 500 },
  yesFooterLine: { fontSize: "clamp(10px, 3vw, 13px)", fontStyle: "italic", color: "#6b6b6b", margin: "4px 0 0", maxWidth: 460, lineHeight: 1.6 },
  acceptedFooter: {
    position: "fixed",
    bottom: 12,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#e8dcc2",
    fontSize: "clamp(10px, 2.8vw, 12px)",
    letterSpacing: "0.05em",
    fontStyle: "italic",
    zIndex: 5,
    padding: "0 16px",
    animation: "fadeIn 2s ease both",
    margin: 0,
    lineHeight: 1.5,
  },

  /* PAGE */
  page: {
    position: "relative",
    zIndex: 3,
    width: "min(760px, 92vw)",
    maxHeight: "90dvh",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
    boxSizing: "border-box",
    background: "#fffdf7",
    borderRadius: 18,
    padding: "clamp(24px, 6vw, 56px) clamp(16px, 5vw, 40px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
    transformStyle: "preserve-3d",
  },
  // Mobile page — full width, no maxHeight restriction
  pageMobile: {
    width: "calc(100vw - 20px)",
    maxWidth: "100%",
    maxHeight: "none",
    margin: "0 10px",
    padding: "20px 14px 28px",
    borderRadius: 14,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },

  /* STEP */
  step: { display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(20px, 5vw, 36px)", width: "100%", animation: "fadeIn 0.5s ease" },
  stepText: { fontSize: "clamp(15px, 4.5vw, 26px)", lineHeight: 1.6, color: "#2b2b2b", textAlign: "center", fontStyle: "italic", letterSpacing: "0.01em", maxWidth: 560, width: "100%" },
  nextBtn: {
    padding: "14px clamp(24px, 8vw, 42px)",
    fontSize: "clamp(12px, 3.5vw, 16px)",
    fontFamily: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    color: "#fffdf7",
    background: "linear-gradient(135deg, #c0392b, #8e2a1f)",
    border: "none",
    borderRadius: 999,
    cursor: "pointer",
    letterSpacing: "0.05em",
    boxShadow: "0 6px 16px rgba(192,57,43,0.35)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    WebkitTapHighlightColor: "transparent",
    minHeight: 48,
  },
};