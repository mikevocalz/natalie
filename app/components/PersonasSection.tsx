"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const personas = [
  {
    n: "01",
    name: "Maya, 8",
    grade: "3rd Grade",
    frustration: "Math word problems are confusing. Mom is busy with work. Needs someone patient to explain in a fun way.",
    solution: "\"Natalie, help me understand this story problem!\" She breaks it down with visual aids, uses encouraging language, and celebrates each step. Never gives the answer, always guides.",
  },
  {
    n: "02",
    name: "Jordan, 12",
    grade: "7th Grade",
    frustration: "Science fair project due tomorrow. Overwhelmed by research. Doesn't know where to start or how to organize ideas.",
    solution: "\"Natalie, help me plan my volcano project!\" She creates a step-by-step timeline, suggests experiments, and checks in daily. Turns panic into manageable chunks.",
    highlight: true,
  },
  {
    n: "03",
    name: "Alex, 15",
    grade: "10th Grade",
    frustration: "Algebra II is kicking his butt. Embarrassed to ask in class. Needs help at 10 PM when tutors are asleep.",
    solution: "\"Natalie, walk me through factoring.\" She explains concepts multiple ways, gives practice problems, and builds confidence. Like a private tutor who never judges.",
  },
  {
    n: "04",
    name: "Sam, 17",
    grade: "12th Grade",
    frustration: "SAT prep is brutal. Can't focus with phone notifications. Needs accountability and structured study sessions.",
    solution: "\"Natalie, quiz me on vocabulary.\" She runs flashcard drills, tracks progress, and keeps phone locked away. The study partner who actually keeps you on track.",
  },
];

export default function PersonasSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="personas" className="py-20 sm:py-24 border-b border-[rgba(180,200,222,0.12)]">
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
              04 — Who it&apos;s for
            </span>
          </div>

          {/* Title */}
          <h2 className="font-mono font-bold tracking-[-0.01em] text-[clamp(26px,4.5vw,42px)] leading-[1.12] text-[#eef2f7] mb-6">
            Meet the kids we talked to
          </h2>
        </motion.div>

        {/* Personas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
          {personas.map((persona, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.6 }}
              className={`relative p-6 rounded-2xl border ${
                persona.highlight
                  ? "border-[rgba(90,170,255,0.3)]"
                  : "border-[rgba(180,200,222,0.12)]"
              } bg-[linear-gradient(180deg,rgba(12,22,40,0.72),rgba(7,12,24,0.55))] overflow-hidden`}
            >
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r rounded-tr-2xl opacity-50 border-[#3da5ff]" />

              <div className="font-mono text-[11px] tracking-[0.2em] text-[#3da5ff] uppercase">
                Student {persona.n} · {persona.name}
              </div>
              <h3 className="font-mono font-bold text-xl tracking-[0.02em] text-[#eef2f7] mt-2.5 mb-2">
                {persona.grade}
              </h3>
              <p className="text-[13px] text-[#a2b2c2] mb-4">
                {persona.frustration}
              </p>

              <ul className="list-none p-0 m-0 space-y-2">
                <li className="pl-5 relative text-[#c3d6ea] text-sm">
                  <span className="absolute left-0 text-[#3da5ff]">▸</span>
                  <b>Frustration:</b> {persona.frustration}
                </li>
                <li className="pl-5 relative text-[#c3d6ea] text-sm">
                  <span className="absolute left-0 text-[#3da5ff]">▸</span>
                  <b>N.A.T.A.L.I.E.:</b> {persona.solution}
                </li>
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
