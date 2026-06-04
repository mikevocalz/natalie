"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Eye, Lock, Trash2 } from "lucide-react";

const trustPrinciples = [
  {
    icon: Eye,
    title: "Always visible",
    desc: "Natalie is always present as a visual avatar — never hidden or disguised as human. Kids always know they're talking to AI.",
  },
  {
    icon: Lock,
    title: "Powered by Google Gemini",
    desc: "Built on Google Gemini's enterprise-grade security infrastructure. All conversations are encrypted end-to-end, and no data is used to train models.",
  },
  {
    icon: Shield,
    title: "COPPA & FERPA compliant",
    desc: "Designed for kids 8-18 with strict privacy controls. No data sharing with third parties. Parental dashboard gives full visibility.",
  },
  {
    icon: Trash2,
    title: "Your data, your control",
    desc: "One command wipes everything: \"Forget everything.\" All session data auto-deletes after 30 days. Export or delete anytime.",
  },
];

export default function TrustSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="trust" className="py-20 sm:py-24 border-b border-[rgba(180,200,222,0.12)]">
      <div ref={ref} className="mx-auto max-w-[1080px] px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
        >
          {/* Kicker */}
          <div className="flex items-center gap-2.5 mb-3.5">
            <span className="w-6 h-px bg-[#5af0c0]" />
            <span className="font-mono text-[11px] tracking-[0.32em] uppercase text-[#5af0c0]">
              06 — Trust & safety
            </span>
          </div>

          {/* Title */}
          <h2 className="font-mono font-bold tracking-[-0.01em] text-[clamp(26px,4.5vw,42px)] leading-[1.12] text-[#eef2f7] mb-6">
            Enterprise-grade privacy for your family
          </h2>

          {/* Lead */}
          <p className="text-[clamp(17px,2.4vw,21px)] text-[#cfe2f5] font-light max-w-[62ch] leading-relaxed mb-10">
            Powered by Google Gemini&apos;s secure infrastructure, Natalie brings the same enterprise-level privacy protections used by schools and businesses to your home. Built from the ground up for kids — with safety guardrails, content filtering, and complete parental transparency.
          </p>
        </motion.div>

        {/* Trust Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trustPrinciples.map((principle, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
              className="relative p-5 rounded-2xl border border-[rgba(90,240,192,0.25)] bg-[linear-gradient(180deg,rgba(20,40,36,0.4),rgba(8,16,22,0.4))] overflow-hidden"
            >
              <div className="text-[#5af0c0] mb-3">
                <principle.icon className="w-6 h-6" />
              </div>
              <div className="font-mono text-[11px] tracking-[0.2em] text-[#5af0c0] uppercase mb-2">
                {principle.title}
              </div>
              <p className="text-[#c3d6ea] text-sm leading-relaxed">
                {principle.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Safe indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-8 p-4 rounded-xl border border-[rgba(90,240,192,0.25)] bg-[rgba(7,12,24,0.5)] text-[12.5px] text-[#a2b2c2] leading-relaxed"
        >
          <b className="text-[#5af0c0] font-mono tracking-[0.12em]">GOOGLE GEMINI SECURE</b> — 
          Natalie runs on Google Gemini&apos;s enterprise infrastructure with SOC 2 compliance, end-to-end encryption, and strict data isolation. 
          Your child&apos;s learning data is never used to train models and can be deleted instantly.
        </motion.div>
      </div>
    </section>
  );
}
