"use client";

import { useEffect, useRef } from "react";

export const AuthInteractiveCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId = null;
    let isVisible = true;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
      radius: 200,
    };

    const lineConfigs = [
      {
        baseYRatio: 0.22,
        amplitude: 28,
        wavelength: 0.002,
        speed: 0.0008,
        phase: 0.4,
        color: "rgba(0, 240, 160, 0.2)",
        width: 1.5,
      },
      {
        baseYRatio: 0.45,
        amplitude: 36,
        wavelength: 0.0016,
        speed: 0.0006,
        phase: 2.0,
        color: "rgba(45, 212, 191, 0.22)",
        width: 1.8,
      },
      {
        baseYRatio: 0.68,
        amplitude: 32,
        wavelength: 0.0022,
        speed: 0.001,
        phase: 3.5,
        color: "rgba(16, 185, 129, 0.16)",
        width: 1.4,
      },
      {
        baseYRatio: 0.86,
        amplitude: 26,
        wavelength: 0.0024,
        speed: 0.0007,
        phase: 1.2,
        color: "rgba(0, 240, 160, 0.16)",
        width: 1.2,
      },
    ];

    const pulses = [
      { lineIndex: 0, progress: 0.2, speed: 0.0016, size: 3.5, haloColor: "rgba(0, 240, 160, 0.35)" },
      { lineIndex: 1, progress: 0.65, speed: 0.002, size: 4, haloColor: "rgba(45, 212, 191, 0.4)" },
      { lineIndex: 2, progress: 0.35, speed: 0.0014, size: 3.5, haloColor: "rgba(16, 185, 129, 0.35)" },
    ];

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    const parent = canvas.parentElement;
    let pointerPending = false;

    const onPointerMove = (e) => {
      if (pointerPending) return;
      pointerPending = true;
      requestAnimationFrame(() => {
        const rect = canvas.getBoundingClientRect();
        mouse.targetX = e.clientX - rect.left;
        mouse.targetY = e.clientY - rect.top;
        mouse.active = true;
        pointerPending = false;
      });
    };

    const onPointerLeave = () => {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    if (parent) {
      parent.addEventListener("pointermove", onPointerMove, { passive: true });
      parent.addEventListener("pointerleave", onPointerLeave, { passive: true });
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const render = (timestamp) => {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.14;
        mouse.y += (mouse.targetY - mouse.y) * 0.14;
      } else if (mouse.x > -500) {
        mouse.x += (-1000 - mouse.x) * 0.1;
        mouse.y += (-1000 - mouse.y) * 0.1;
      }

      const time = prefersReducedMotion ? 0 : timestamp;
      ctx.clearRect(0, 0, width, height);

      const calculatedLines = [];
      const stepX = 30;

      for (let c = 0; c < lineConfigs.length; c++) {
        const config = lineConfigs[c];
        const baseY = height * config.baseYRatio;
        const points = [];

        ctx.beginPath();
        ctx.setLineDash([]);

        for (let x = -20; x <= width + 30; x += stepX) {
          const wave1 =
            Math.sin(x * config.wavelength + time * config.speed + config.phase) *
            config.amplitude;
          const wave2 =
            Math.cos(x * (config.wavelength * 1.6) - time * (config.speed * 0.8) + config.phase) *
            (config.amplitude * 0.25);

          let y = baseY + wave1 + wave2;

          if (mouse.x > -500) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const distSq = dx * dx + dy * dy;
            const radSq = mouse.radius * mouse.radius;

            if (distSq < radSq) {
              const factor = 1 - Math.sqrt(distSq) / mouse.radius;
              const deflection = Math.sin(factor * Math.PI) * 32;
              y += dy > 0 ? deflection : -deflection;
            }
          }

          points.push(x, y);
        }

        calculatedLines.push(points);

        const len = points.length;
        if (len >= 4) {
          ctx.moveTo(points[0], points[1]);
          for (let i = 2; i < len - 2; i += 2) {
            const xc = (points[i] + points[i + 2]) * 0.5;
            const yc = (points[i + 1] + points[i + 3]) * 0.5;
            ctx.quadraticCurveTo(points[i], points[i + 1], xc, yc);
          }
          ctx.quadraticCurveTo(
            points[len - 4],
            points[len - 3],
            points[len - 2],
            points[len - 1]
          );
        }

        ctx.strokeStyle = config.color;
        ctx.lineWidth = config.width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      }

      if (!prefersReducedMotion) {
        for (let p = 0; p < pulses.length; p++) {
          const pulse = pulses[p];
          pulse.progress += pulse.speed;
          if (pulse.progress > 1) pulse.progress = 0;

          const linePoints = calculatedLines[pulse.lineIndex];
          if (linePoints && linePoints.length >= 4) {
            const numPts = linePoints.length / 2;
            const targetIdx = Math.floor(pulse.progress * (numPts - 1)) * 2;
            const px = linePoints[targetIdx];
            const py = linePoints[targetIdx + 1];

            if (px !== undefined && py !== undefined) {
              ctx.beginPath();
              ctx.arc(px, py, pulse.size * 2, 0, Math.PI * 2);
              ctx.fillStyle = pulse.haloColor;
              ctx.fill();

              ctx.beginPath();
              ctx.arc(px, py, pulse.size * 0.75, 0, Math.PI * 2);
              ctx.fillStyle = "#ffffff";
              ctx.fill();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameId) {
          animationFrameId = requestAnimationFrame(render);
        } else if (!isVisible && animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(canvas);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (parent) {
        parent.removeEventListener("pointermove", onPointerMove);
        parent.removeEventListener("pointerleave", onPointerLeave);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ display: "block", willChange: "transform" }}
      aria-hidden="true"
    />
  );
};
