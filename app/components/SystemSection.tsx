"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const specs = [
  { category: "Platform", items: ["Android XR (Samsung Galaxy XR)", "Meta Quest (OpenXR)", "Apple visionOS (future port)"] },
  { category: "Rendering", items: ["ReactVision 2.55+", "ViroReact scene graph", "Custom holographic shader pipeline"] },
  { category: "AI Stack", items: ["Gemini Nano (on-device)", "Gemini Pro (cloud, optional)", "Local LLM fallback (Llama 3.2 3B)"] },
  { category: "Input", items: ["Voice (primary)", "Gaze tracking", "Hand gestures (secondary)", "Bluetooth keyboard (productivity)"] },
  { category: "Memory", items: ["SQLite + vector DB (on-device)", "Encrypted at rest", "User-controlled retention"] },
  { category: "Network", items: ["Offline-first operation", "End-to-end encrypted sync (optional)", "No telemetry by default"] },
];

export default function SystemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="system" className="py-20 sm:py-24 border-b border-[rgba(180,200,222,0.12)]">
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
              07 — System architecture
            </span>
          </div>

          {/* Title */}
          <h2 className="font-mono font-bold tracking-[-0.01em] text-[clamp(26px,4.5vw,42px)] leading-[1.12] text-[#eef2f7] mb-6">
            Built for the real world
          </h2>

          {/* Lead */}
          <p className="text-[clamp(17px,2.4vw,21px)] text-[#cfe2f5] font-light max-w-[62ch] leading-relaxed mb-8">
            N.A.T.A.L.I.E. runs on proven stacks: ReactVision for spatial UI, Gemini for intelligence, and a privacy-first architecture that works offline.
          </p>
        </motion.div>

        {/* Specs Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="overflow-x-auto"
        >
          <table className="w-full border-collapse text-sm">
            <tbody>
              {specs.map((spec, i) => (
                <tr key={i} className="border-b border-[rgba(180,200,222,0.12)]">
                  <th className="text-left py-3 px-3 font-mono text-[10px] tracking-[0.16em] uppercase text-[#3da5ff] whitespace-nowrap">
                    {spec.category}
                  </th>
                  <td className="py-3 px-3 text-[#c3d6ea]">
                    <div className="flex flex-wrap gap-2">
                      {spec.items.map((item, j) => (
                        <span
                          key={j}
                          className="inline-block font-mono text-[10px] tracking-[0.14em] uppercase text-[#a2b2c2] border border-[rgba(180,200,222,0.12)] rounded-full px-2.5 py-1"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
