"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "20", label: "students interviewed from 3rd to 12th grade — every age needs homework help but parents are busy", source: "(Our Research, 2026)", highlight: false },
  { value: "$60/hr", label: "average tutoring cost — too expensive for most families who need help 3-4 times per week", source: "", highlight: false },
  { value: "8 PM", label: "when kids actually start homework — after clubs, sports, dinner — when everyone's tired", source: "", highlight: true },
];

export default function ThesisSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="thesis" className="py-20 sm:py-24 border-b border-[rgba(180,200,222,0.12)]">
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
              02 — The thesis
            </span>
          </div>

          {/* Title */}
          <h2 className="font-mono font-bold tracking-[-0.01em] text-[clamp(26px,4.5vw,42px)] leading-[1.12] text-[#eef2f7] mb-6">
            Every kid hits homework walls. Parents can&apos;t always help.
          </h2>

          {/* Lead */}
          <p className="text-[clamp(17px,2.4vw,21px)] text-[#cfe2f5] font-light max-w-[64ch] leading-relaxed mb-8">
            From Maya (8) stuck on multiplication to Sam (17) cramming for SATs — 20 kids, 10 years apart, same struggle. Mom is at work, Dad doesn&apos;t remember algebra, and tutors cost $60/hour. The gap isn&apos;t information. It&apos;s someone patient, available, and affordable to guide them through.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
              className={`relative p-5 rounded-2xl border ${
                stat.highlight
                  ? "border-[rgba(224,38,63,0.4)] bg-[linear-gradient(180deg,rgba(40,20,24,0.4),rgba(20,10,12,0.4))]"
                  : "border-[rgba(180,200,222,0.12)] bg-[linear-gradient(180deg,rgba(12,22,40,0.72),rgba(7,12,24,0.55))]"
              } overflow-hidden`}
            >
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r rounded-tr-2xl opacity-50"
                style={{ borderColor: stat.highlight ? "#e0263f" : "#3da5ff" }} />

              <div className={`font-mono font-bold text-[clamp(34px,6vw,54px)] leading-none ${
                stat.highlight ? "text-[#e0263f]" : "text-[#3da5ff]"
              }`}>
                {stat.value}
              </div>
              <div className="text-[13px] text-[#a2b2c2] mt-2 leading-relaxed">
                {stat.label}{" "}
                {stat.source && <span className="text-[#6c7e90]">{stat.source}</span>}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 text-[#c3d6ea] max-w-[64ch]"
        >
          This isn&apos;t a hardware problem to wait out. It&apos;s a <b>product-vision vacuum</b>. And the platform makers have already named what they think fills it.
        </motion.p>
      </div>
    </section>
  );
}
