"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function ResearchSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="research" className="py-20 sm:py-24 border-b border-[rgba(180,200,222,0.12)]">
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
              03 — The research
            </span>
          </div>

          {/* Title */}
          <h2 className="font-mono font-bold tracking-[-0.01em] text-[clamp(26px,4.5vw,42px)] leading-[1.12] text-[#eef2f7] mb-6">
            20 students. Ages 8 to 18. One shared struggle.
          </h2>

          {/* Lead */}
          <p className="text-[clamp(17px,2.4vw,21px)] text-[#cfe2f5] font-light max-w-[62ch] leading-relaxed mb-8">
            We interviewed 20 students from 3rd grade through 12th grade about homework stress, parent help availability, and what makes learning click. From Maya (8) struggling with multiplication to Sam (17) cramming for SATs — three patterns emerged across every age group.
          </p>
        </motion.div>

        {/* Research Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              n: "01",
              title: "The Homework Meltdown",
              desc: "From 3rd graders crying over math worksheets to seniors stuck on calculus — kids hit walls at every age. Parents are busy, embarrassed to ask teachers, and YouTube is overwhelming. They need patient help that meets them where they are.",
            },
            {
              n: "02",
              title: "The Easy Way Out Trap",
              desc: "8-year-olds use calculators. 12-year-olds copy from TikTok. 17-year-olds ask ChatGPT for essays. Kids want to learn but shortcuts are everywhere. They need a guide who explains without doing the work for them.",
              highlight: true,
            },
            {
              n: "03",
              title: "Studying Alone Sucks",
              desc: "After school, clubs, dinner — homework starts at 8 PM. Siblings are noisy, parents are working, friends are busy. From elementary to high school, kids study in isolation. They crave someone interactive who makes learning feel social.",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
              className={`relative p-6 rounded-2xl border ${
                card.highlight
                  ? "border-[rgba(90,170,255,0.3)] shadow-[0_0_0_1px_rgba(74,214,255,0.08),0_30px_70px_-40px_rgba(0,0,0,0.8)]"
                  : "border-[rgba(180,200,222,0.12)]"
              } bg-[linear-gradient(180deg,rgba(12,22,40,0.72),rgba(7,12,24,0.55))] overflow-hidden`}
            >
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r rounded-tr-2xl opacity-50 border-[#3da5ff]" />

              <div className="font-mono text-[11px] tracking-[0.2em] text-[#3da5ff] uppercase">
                {card.n}
              </div>
              <h3 className="font-mono font-bold text-xl tracking-[0.02em] text-[#eef2f7] mt-2.5 mb-2">
                {card.title}
              </h3>
              <p className="text-[#c3d6ea] text-sm leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
