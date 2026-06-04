"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="py-16 sm:py-24 text-[13px] text-[#6c7e90]">
      <div className="mx-auto max-w-[1080px] px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col gap-4"
        >
          {/* Disclaimer */}
          <div className="p-5 rounded-xl border border-[rgba(180,200,222,0.12)] bg-[rgba(7,12,24,0.5)] text-[12.5px] leading-relaxed">
            <b className="text-[#a2b2c2] font-mono tracking-[0.12em]">DISCLAIMER</b> — 
            This is a concept proposal based on Marvel&apos;s Ironheart and the character N.A.T.A.L.I.E. 
            All references to Marvel properties are for illustrative purposes. This is not an official 
            Marvel or Disney product. Android XR and Galaxy XR are trademarks of Google and Samsung respectively.
          </div>

          {/* Sources */}
          <div className="text-[12px] text-[#6c7e90] leading-relaxed space-y-1">
            <p><b className="text-[#a2b2c2] font-mono tracking-[0.06em]">SOURCES</b></p>
            <p>Marvel Studios — Ironheart (2026)</p>
            <p>Google — Android XR Developer Documentation</p>
            <p>Samsung — Galaxy XR Product Specifications</p>
            <p>ReactVision / ViroReact — Spatial UI Framework</p>
          </div>

          {/* Copyright */}
          <div className="pt-4 border-t border-[rgba(180,200,222,0.12)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <p>© 2026 N.A.T.A.L.I.E. Concept Proposal. Built for Android XR.</p>
            <p className="font-mono text-[10px] tracking-[0.16em] uppercase">
              <span className="text-[#3da5ff]">◈</span> Not affiliated with Marvel or Disney
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
