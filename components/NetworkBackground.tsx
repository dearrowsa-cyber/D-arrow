"use client";

import { useEffect, useRef, useState } from "react";

export default function NetworkBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.clientWidth || window.innerWidth;
    let height = canvas.clientHeight || window.innerHeight;
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    function resize() {
      const c = ref.current;
      if (!c) return;
      width = c.clientWidth || window.innerWidth;
      height = c.clientHeight || window.innerHeight;
      c.width = Math.max(1, Math.floor(width * dpr));
      c.height = Math.max(1, Math.floor(height * dpr));
      c.style.width = width + "px";
      c.style.height = height + "px";
      const localCtx = c.getContext("2d");
      if (localCtx) localCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();

    type Point = { x: number; y: number; vx: number; vy: number };
    const points: Point[] = [];

    // Reduced particle count for faster initial paint
    const POINT_COUNT = Math.min(70, Math.max(30, Math.floor((width * height) / 30000)));
    for (let i = 0; i < POINT_COUNT; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
      });
    }

    const maxPossible = Math.sqrt(width * width + height * height);
    let raf = 0;
    let frameCount = 0;

    // drifting rectangles for extra depth
    type Rect = { x: number; y: number; w: number; h: number; vx: number; vy: number; a: number };
    const rects: Rect[] = [];
    const RECT_COUNT = Math.min(10, Math.max(3, Math.floor(POINT_COUNT / 12)));
    for (let i = 0; i < RECT_COUNT; i++) {
      rects.push({
        x: Math.random() * width,
        y: Math.random() * height,
        w: 8 + Math.random() * 40,
        h: 6 + Math.random() * 20,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        a: Math.random() * Math.PI,
      });
    }

    let lastTime = performance.now();
    let throttleFrame = 0;

    function step(time?: number) {
      const c = ref.current;
      if (!c) return;
      const context = c.getContext("2d");
      if (!context) return;

      // Throttle animation in first 3 seconds: skip every other frame
      throttleFrame++;
      if (throttleFrame < 3000 && throttleFrame % 2 === 0) {
        raf = requestAnimationFrame(step);
        return;
      }

      // slight translucent fill for motion trails (gives a professional motion blur look)
      context.fillStyle = "rgba(6,8,12,0.14)";
      context.fillRect(0, 0, width, height);

      // Update points with flow + attractors + bounce
      for (const p of points) {
        // flow field (sin/cos based on position and time)
        const flowX = Math.sin((p.y / height) * Math.PI * 2 + (time || 0) * 0.0006) * 0.25;
        const flowY = Math.cos((p.x / width) * Math.PI * 2 + (time || 0) * 0.0007) * 0.25;
        p.vx += flowX * 0.03;
        p.vy += flowY * 0.03;

        // friction
        p.vx *= 0.995;
        p.vy *= 0.995;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
      }

      // Simplified neighbor connections - only every 2nd point to reduce calculations
      const NEIGHBORS = 4;
      for (let i = 0; i < points.length; i += 2) {
        const a = points[i];
        const dists: { idx: number; d: number }[] = [];
        for (let j = 0; j < points.length; j++) {
          if (i === j) continue;
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          dists.push({ idx: j, d: dx * dx + dy * dy });
        }
        dists.sort((p, q) => p.d - q.d);
        for (let k = 0; k < Math.min(NEIGHBORS, dists.length); k++) {
          const b = points[dists[k].idx];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const alpha = Math.max(0.06, 1 - dist / (maxPossible * 0.6));
          context.beginPath();
          context.strokeStyle = `rgba(120,120,120,${(alpha * 0.5).toFixed(3)})`;
          context.lineWidth = Math.max(0.2, 0.5 - dist / (maxPossible * 1.5));
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }

      // Draw drifting rectangles
      for (const r of rects) {
        r.x += r.vx * 0.6;
        r.y += r.vy * 0.6;
        r.a += 0.001;
        if (r.x < -100) r.x = width + 100;
        if (r.x > width + 100) r.x = -100;
        if (r.y < -100) r.y = height + 100;
        if (r.y > height + 100) r.y = -100;

        context.save();
        context.translate(r.x, r.y);
        context.rotate(r.a);
        context.fillStyle = "rgba(40,100,120,0.08)";
        context.fillRect(-r.w / 2, -r.h / 2, r.w, r.h);
        context.restore();
      }

      // Draw points on top
      for (const p of points) {
        context.beginPath();
        context.fillStyle = "rgba(37, 38, 39, 0.98)";
        context.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        context.fill();
      }

      raf = requestAnimationFrame(step);
    }

    // Defer animation start to after page is interactive
    const startAnimation = () => {
      setIsAnimating(true);
      raf = requestAnimationFrame(step);
    };

    // Use requestIdleCallback if available, otherwise defer with setTimeout
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(startAnimation, { timeout: 2000 });
    } else {
      setTimeout(startAnimation, 1500);
    }

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        mixBlendMode: "screen",
        opacity: 0.95,
      }}
    />
  );
}
