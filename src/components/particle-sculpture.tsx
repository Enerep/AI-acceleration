"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";

type Point = { x: number; y: number; z: number; u: number; v: number };

// A real-time projected torus. No video, image download, or WebGL dependency.
export default function ParticleSculpture({
  enabled,
  speed,
}: {
  enabled: boolean;
  speed: MotionValue<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;
    let width = 1;
    let height = 1;
    let frame = 0;
    let time = 0.55;
    let previousTime = 0;
    let visible = true;
    let pointerX = 0;
    let pointerY = 0;
    let actualX = 0;
    let actualY = 0;
    const columns = 116;
    const rows = 28;
    const points: Point[] = [];
    for (let a = 0; a < columns; a++) {
      for (let b = 0; b < rows; b++) {
        const u = (a / columns) * Math.PI * 2;
        const v = (b / rows) * Math.PI * 2;
        const radius = 1.32 + 0.53 * Math.cos(v);
        points.push({
          x: radius * Math.cos(u),
          y: radius * Math.sin(u),
          z: 0.53 * Math.sin(v),
          u,
          v,
        });
      }
    }

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!enabled) draw(0);
    };

    const draw = (timestamp: number) => {
      const elapsed = previousTime
        ? Math.min(timestamp - previousTime, 50)
        : 16;
      previousTime = timestamp;
      if (enabled && visible && !document.hidden)
        time += elapsed * 0.00016 * speed.get();
      if (visible) {
        context.clearRect(0, 0, width, height);
        actualX += (pointerX - actualX) * 0.035;
        actualY += (pointerY - actualY) * 0.035;
        const ax = 0.95 + Math.sin(time * 0.65) * 0.25 + actualY * 0.15;
        const ay = time * 0.55 + actualX * 0.15;
        const az = -0.44 + Math.sin(time * 0.4) * 0.18;
        const cx = Math.cos(ax),
          sx = Math.sin(ax);
        const cy = Math.cos(ay),
          sy = Math.sin(ay);
        const cz = Math.cos(az),
          sz = Math.sin(az);
        const scale = Math.min(width, height) * 0.257;
        const projected = points.map((p) => {
          const twist = Math.sin(p.u * 3 + time) * 0.045;
          const y = p.y * cx - (p.z + twist) * sx;
          const z = p.y * sx + (p.z + twist) * cx;
          const x = p.x * cy + z * sy;
          const depth = -p.x * sy + z * cy;
          const px = x * cz - y * sz;
          const py = x * sz + y * cz;
          const perspective = 4.7 / (4.7 - depth);
          return {
            x: width / 2 + px * scale * perspective,
            y: height / 2 + py * scale * perspective,
            depth,
            u: p.u,
            v: p.v,
            perspective,
          };
        });

        context.lineWidth = 0.55;
        for (let i = 0; i < projected.length; i++) {
          const p = projected[i];
          const accent = Math.sin(p.u * 2 + time * 0.9) > 0.81;
          const opacity = 0.2 + ((p.depth + 1.8) / 3.6) * 0.66;
          context.fillStyle = accent
            ? `rgba(245,74,26,${opacity})`
            : `rgba(25,29,25,${opacity})`;
          const radius = (accent ? 1.22 : 0.83) * p.perspective;
          context.beginPath();
          context.arc(p.x, p.y, radius, 0, Math.PI * 2);
          context.fill();
          if ((i % rows) % 4 === 0) {
            const next = projected[(i + rows) % projected.length];
            context.strokeStyle = accent
              ? `rgba(245,74,26,${opacity * 0.28})`
              : `rgba(25,29,25,${opacity * 0.22})`;
            context.beginPath();
            context.moveTo(p.x, p.y);
            context.lineTo(next.x, next.y);
            context.stroke();
          }
        }

        // Orbit traces provide a second, slower visual rhythm.
        context.save();
        context.translate(width / 2, height / 2);
        context.rotate(-0.4);
        context.strokeStyle = "rgba(54,58,49,0.12)";
        context.lineWidth = 0.8;
        context.setLineDash([3, 7]);
        context.beginPath();
        context.ellipse(0, 0, scale * 2.06, scale * 1.46, 0, 0, Math.PI * 2);
        context.stroke();
        context.restore();
      }
      if (enabled) frame = requestAnimationFrame(draw);
    };

    const move = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
      pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;
    };
    const leave = () => {
      pointerX = 0;
      pointerY = 0;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !enabled) draw(0);
    });
    intersection.observe(canvas);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    resize();
    if (enabled) frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
    };
  }, [enabled, speed]);

  return (
    <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />
  );
}
