"use client";

import { useEffect, useRef } from "react";

export const HeroInteractiveCanvas = () => {
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

    // Mouse pointer state
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
      radius: 260,
    };

    // Configuration for the flowing financial contour streamlines
    const lineConfigs = [
      {
        baseYRatio: 0.22,
        amplitude: 38,
        wavelength: 0.0018,
        speed: 0.0008,
        phase: 0,
        color: "rgba(0, 104, 95, 0.18)",
        width: 1.5,
        dashed: false,
      },
      {
        baseYRatio: 0.35,
        amplitude: 48,
        wavelength: 0.0014,
        speed: 0.0006,
        phase: 1.8,
        color: "rgba(16, 185, 129, 0.22)",
        width: 1.8,
        dashed: false,
      },
      {
        baseYRatio: 0.48,
        amplitude: 42,
        wavelength: 0.0022,
        speed: 0.0011,
        phase: 3.2,
        color: "rgba(0, 104, 95, 0.14)",
        width: 1.2,
        dashed: true,
        dashPattern: [6, 8],
      },
      {
        baseYRatio: 0.62,
        amplitude: 56,
        wavelength: 0.0016,
        speed: 0.0007,
        phase: 4.5,
        color: "rgba(45, 212, 191, 0.24)",
        width: 2.0,
        dashed: false,
      },
      {
        baseYRatio: 0.76,
        amplitude: 44,
        wavelength: 0.002,
        speed: 0.0009,
        phase: 2.4,
        color: "rgba(5, 150, 105, 0.16)",
        width: 1.4,
        dashed: false,
      },
      {
        baseYRatio: 0.88,
        amplitude: 36,
        wavelength: 0.0024,
        speed: 0.0012,
        phase: 5.6,
        color: "rgba(0, 104, 95, 0.12)",
        width: 1.2,
        dashed: true,
        dashPattern: [4, 6],
      },
    ];

    // Traveling transaction energy pulses
    const pulses = [
      { lineIndex: 1, progress: 0.1, speed: 0.0015, size: 4, haloColor: "rgba(16, 185, 129, 0.3)" },
      { lineIndex: 1, progress: 0.65, speed: 0.0018, size: 3.5, haloColor: "rgba(0, 240, 160, 0.3)" },
      { lineIndex: 3, progress: 0.3, speed: 0.0022, size: 4.5, haloColor: "rgba(45, 212, 191, 0.35)" },
      { lineIndex: 3, progress: 0.85, speed: 0.0014, size: 3.5, haloColor: "rgba(16, 185, 129, 0.28)" },
      { lineIndex: 4, progress: 0.45, speed: 0.0016, size: 3.8, haloColor: "rgba(0, 104, 95, 0.25)" },
    ];

    // Resize handler with caching
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

    // Pointer move listener
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

    const onTouchMove = (e) => {
      if (pointerPending || e.touches.length === 0) return;
      pointerPending = true;
      requestAnimationFrame(() => {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        mouse.targetX = touch.clientX - rect.left;
        mouse.targetY = touch.clientY - rect.top;
        mouse.active = true;
        pointerPending = false;
      });
    };

    if (parent) {
      parent.addEventListener("pointermove", onPointerMove, { passive: true });
      parent.addEventListener("pointerleave", onPointerLeave, { passive: true });
      parent.addEventListener("touchmove", onTouchMove, { passive: true });
      parent.addEventListener("touchend", onPointerLeave, { passive: true });
    }

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Render loop (Optimized stepX = 32 and Zero-Allocation Pulses)
    const render = (timestamp) => {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Smooth pointer interpolation
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.14;
        mouse.y += (mouse.targetY - mouse.y) * 0.14;
      } else if (mouse.x > -500) {
        mouse.x += (-1000 - mouse.x) * 0.1;
        mouse.y += (-1000 - mouse.y) * 0.1;
      }

      const time = prefersReducedMotion ? 0 : timestamp;

      // Clear frame
      ctx.clearRect(0, 0, width, height);

      const calculatedLines = [];
      const stepX = 32; // Optimized resolution (65% less math, identical visual curve)

      // Draw each contour streamline
      for (let c = 0; c < lineConfigs.length; c++) {
        const config = lineConfigs[c];
        const baseY = height * config.baseYRatio;
        const points = [];

        ctx.beginPath();
        if (config.dashed && config.dashPattern) {
          ctx.setLineDash(config.dashPattern);
        } else {
          ctx.setLineDash([]);
        }

        for (let x = -20; x <= width + 30; x += stepX) {
          const wave1 =
            Math.sin(x * config.wavelength + time * config.speed + config.phase) *
            config.amplitude;
          const wave2 =
            Math.cos(x * (config.wavelength * 1.6) - time * (config.speed * 0.8) + config.phase) *
            (config.amplitude * 0.3);

          let y = baseY + wave1 + wave2;

          // Pointer deflection
          if (mouse.x > -500) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const distSq = dx * dx + dy * dy;
            const radSq = mouse.radius * mouse.radius;

            if (distSq < radSq) {
              const factor = 1 - Math.sqrt(distSq) / mouse.radius;
              const deflection = Math.sin(factor * Math.PI) * 40;
              y += dy > 0 ? deflection : -deflection;
            }
          }

          points.push(x, y);
        }

        calculatedLines.push(points);

        // Render Bezier curve through points
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

      // Draw traveling energy pulses (Zero Allocation: Fast 2-pass drawing)
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
              // Outer halo (no gradient allocation)
              ctx.beginPath();
              ctx.arc(px, py, pulse.size * 2.2, 0, Math.PI * 2);
              ctx.fillStyle = pulse.haloColor;
              ctx.fill();

              // Inner crisp bead
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

    // IntersectionObserver to auto-pause when scrolled off screen
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

    // Initial start
    animationFrameId = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (parent) {
        parent.removeEventListener("pointermove", onPointerMove);
        parent.removeEventListener("pointerleave", onPointerLeave);
        parent.removeEventListener("touchmove", onTouchMove);
        parent.removeEventListener("touchend", onPointerLeave);
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
