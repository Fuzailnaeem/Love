import { useEffect, useRef } from "react";

/**
 * Fullscreen fireworks burst. Renders nothing until `active` is true,
 * then runs a handful of particle bursts for a few seconds and stops
 * (keeps it a celebratory moment rather than a distracting loop).
 */
export default function Fireworks({ active }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const colors = ["#ff4d6d", "#ff9eb5", "#f5d98b", "#ffffff", "#ff758f"];
    let particles = [];

    const spawnBurst = () => {
      const cx = width * (0.25 + Math.random() * 0.5);
      const cy = height * (0.2 + Math.random() * 0.35);
      const count = 40;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 2 + Math.random() * 3;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 2 + Math.random() * 2,
        });
      }
    };

    // Stagger a few bursts
    const burstTimers = [0, 400, 900, 1500].map((delay) =>
      setTimeout(spawnBurst, delay)
    );

    let running = true;
    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03; // gravity
        p.alpha -= 0.012;
      });
      particles = particles.filter((p) => p.alpha > 0);
      particles.forEach((p) => {
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    // Stop drawing after the show is over
    const stopTimer = setTimeout(() => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ctx.clearRect(0, 0, width, height);
    }, 4500);

    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      burstTimers.forEach(clearTimeout);
      clearTimeout(stopTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 6,
        pointerEvents: "none",
      }}
    />
  );
}