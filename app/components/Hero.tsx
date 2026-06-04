"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  pulse: number;
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const y = useTransform(scrollY, [0, 400], [0, 100]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    
    // Initialize particles
    const particles: Particle[] = [];
    const particleCount = 80;
    
    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.2,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    resize();
    window.addEventListener("resize", resize);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const draw = () => {
      time += 0.016;
      ctx.fillStyle = "rgba(8, 9, 15, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width * 0.7;
      const centerY = canvas.height * 0.4;
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.22;

      // Draw connection lines between nearby particles
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(61, 165, 255, ${0.1 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      // Update and draw particles
      particles.forEach((p, i) => {
        // Orbital movement around center
        const angle = time * 0.2 + (i / particleCount) * Math.PI * 2;
        const radiusVariation = Math.sin(time * 1.5 + i * 0.1) * 30;
        const targetX = centerX + Math.cos(angle) * (baseRadius + radiusVariation);
        const targetY = centerY + Math.sin(angle) * (baseRadius + radiusVariation) * 0.5;
        
        // Mouse interaction - particles avoid mouse
        const mouseDx = p.x - mousePos.x;
        const mouseDy = p.y - mousePos.y;
        const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
        if (mouseDist < 150) {
          p.vx += (mouseDx / mouseDist) * 0.5;
          p.vy += (mouseDy / mouseDist) * 0.5;
        }
        
        // Smooth follow to orbital position
        p.x += (targetX - p.x) * 0.02 + p.vx;
        p.y += (targetY - p.y) * 0.02 + p.vy;
        
        // Damping
        p.vx *= 0.95;
        p.vy *= 0.95;
        
        // Pulse effect
        const pulseSize = p.size + Math.sin(time * 2 + p.pulse) * 0.5;
        const alpha = p.alpha + Math.sin(time * 1.5 + i * 0.1) * 0.2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, pulseSize), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(61, 165, 255, ${Math.max(0.1, alpha)})`;
        ctx.fill();
      });

      // Draw core glow
      const coreGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, baseRadius * 0.4
      );
      coreGradient.addColorStop(0, "rgba(61, 165, 255, 0.4)");
      coreGradient.addColorStop(0.5, "rgba(61, 165, 255, 0.1)");
      coreGradient.addColorStop(1, "transparent");

      ctx.fillStyle = coreGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw outer rings
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(
          centerX, 
          centerY, 
          baseRadius * (1 + i * 0.3) + Math.sin(time + i) * 10,
          baseRadius * (0.5 + i * 0.15) + Math.sin(time + i) * 5,
          0, 
          0, 
          Math.PI * 2
        );
        ctx.strokeStyle = `rgba(61, 165, 255, ${0.05 - i * 0.01})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [mousePos]);

  return (
    <header ref={containerRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Animated Orb Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.95 }}
      />

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-linear-to-b from-[#08090f] via-transparent to-[#08090f] opacity-50" />
      <div className="absolute inset-0 bg-linear-to-r from-[#08090f] via-transparent to-transparent w-1/2" />

      {/* Content with scroll parallax */}
      <motion.div style={{ opacity, y }} className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 w-full pt-24 sm:pt-28">
        <div className="max-w-3xl">
          {/* Tag with badge */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(61,165,255,0.1)] border border-[rgba(61,165,255,0.2)]">
              <span className="w-2 h-2 rounded-full bg-[#3da5ff] animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#3da5ff]">
                For Kids 8-18
              </span>
            </span>
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#6c7e90]">
              Grades 3-12 · Homework Help
            </span>
          </motion.div>

          {/* Main Headline with character animation */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-mono font-bold tracking-[0.02em] text-[clamp(36px,8vw,88px)] leading-[1.05] text-[#eef2f7]"
          >
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="block"
            >
              Math got you stuck?
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.8 }}
              className="block bg-linear-to-r from-[#3da5ff] via-[#9ec9ef] to-[#5af0c0] bg-clip-text text-transparent"
            >
              Natalie helps!
            </motion.span>
          </motion.h1>

          {/* Subheadline with highlight */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-6 text-[clamp(16px,2.5vw,22px)] font-light text-[#a2b2c2] max-w-[32ch] leading-relaxed"
          >
            From multiplication (3rd grade) to SAT prep (12th grade), Natalie is your study buddy.{" "}
            <span className="text-[#eef2f7] font-medium">Show her your worksheet</span>, and she{" "}
            <span className="text-[#eef2f7] font-medium">walks you through it</span> — patient, encouraging, and never just giving answers.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <motion.a
              href="#vision"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-[linear-gradient(135deg,#3da5ff,#2a7fcc)] text-white font-mono text-xs tracking-[0.12em] uppercase font-semibold shadow-lg shadow-[rgba(61,165,255,0.25)] hover:shadow-[rgba(61,165,255,0.4)] transition-all"
            >
              Explore Concept
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </motion.a>
            <motion.a
              href="#concept"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[rgba(12,22,40,0.6)] border border-[rgba(180,200,222,0.15)] text-[#a2b2c2] font-mono text-xs tracking-[0.12em] uppercase hover:text-[#eef2f7] hover:border-[rgba(61,165,255,0.3)] transition-all"
            >
              View Architecture
            </motion.a>
          </motion.div>

          {/* Meta stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-12 pt-8 border-t border-[rgba(180,200,222,0.1)]"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { label: "For Ages", value: "8 to 18" },
                { label: "Grades", value: "3rd - 12th" },
                { label: "Students", value: "20 Interviewed" },
                { label: "Focus", value: "Homework Help" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + i * 0.08, duration: 0.4 }}
                  className="group cursor-default"
                >
                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#6c7e90] mb-1 group-hover:text-[#3da5ff] transition-colors">
                    {item.label}
                  </div>
                  <div className="text-sm text-[#eef2f7] font-medium">
                    {item.value}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Corner decorations */}
      <div className="absolute top-20 right-8 w-32 h-32 border border-[rgba(61,165,255,0.1)] rounded-2xl hidden lg:block" />
      <div className="absolute bottom-32 right-16 w-24 h-24 border border-[rgba(61,165,255,0.05)] rounded-xl hidden lg:block" />

      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none mix-blend-overlay opacity-[0.03]"
        style={{
          background: "repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 3px)",
        }}
      />
    </header>
  );
}
