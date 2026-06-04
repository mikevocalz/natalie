"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function VisionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="vision" className="py-20 sm:py-24 border-b border-[rgba(180,200,222,0.12)]">
      <div ref={ref} className="mx-auto max-w-[1080px] px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
        >
          {/* Kicker */}
          <div className="flex items-center gap-2.5 mb-3.5">
            <span className="w-6 h-px bg-[#3da5ff]" />
            <span className="font-mono text-[11px] tracking-[0.32em] uppercase text-[#3da5ff]">
              01 — The vision
            </span>
          </div>

          {/* Title */}
          <h2 className="font-mono font-bold tracking-[-0.01em] text-[clamp(26px,4.5vw,42px)] leading-[1.12] text-[#eef2f7] mb-6">
            A study buddy who never gets tired or busy
          </h2>

          {/* Lead */}
          <p className="text-[clamp(17px,2.4vw,21px)] text-[#cfe2f5] font-light max-w-[62ch] leading-relaxed">
            It&apos;s 8 PM. Maya (8) is crying over fractions. Jordan (12) has a science project due tomorrow. Alex (15) is stuck on algebra. Sam (17) is cramming for the SAT. Mom is at work, Dad forgot how to do math, and tutors cost a fortune. What if every kid had a patient, encouraging study buddy — right there in their room, ready to help?
          </p>
        </motion.div>
      </div>
    </section>
  );
}
