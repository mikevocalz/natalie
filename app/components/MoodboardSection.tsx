"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink, ImageOff } from "lucide-react";

// Behance FUI/Holographic reference images
const moodboardImages = [
  {
    url: "https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/cf68fa197005007.66291b32b65a1.png",
    title: "Holographic Interface",
    source: "Perception",
    link: "https://www.behance.net/gallery/197005007/Black-Panther-Wakanda-Forever-Light-Based-UI",
  },
  {
    url: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/4d3f25192599459.65de42c77d957.jpg",
    title: "Abstract Light Forms",
    source: "Perception",
    link: "https://www.behance.net/gallery/192599459/The-Marvels-Map-Hologram",
  },
  {
    url: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/396f2b188629495.659ed4b57b2a1.png",
    title: "Neural Vision",
    source: "Perception",
    link: "https://www.behance.net/gallery/188629495/Intel-AI-Visualization",
  },
  {
    url: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/15fdc1173529569.6491d52fb2b6c.jpg",
    title: "HUD Design System",
    source: "Jayse Hansen",
    link: "https://www.behance.net/gallery/173529569/Captain-America-The-Winter-Soldier-Fury-HUD",
  },
  {
    url: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/5cf2f4183610905.6542b484803e5.jpg",
    title: "Sci-Fi Interface",
    source: "Perception",
    link: "https://www.behance.net/gallery/183610905/Guardians-of-the-Galaxy-Vol-3-OrgoCorp-UI",
  },
  {
    url: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/f02b83171405487.646e25ea5c31e.png",
    title: "Holographic Display",
    source: "Cantina Creative",
    link: "https://www.behance.net/gallery/171405487/Civil-War-Spider-Man-Hologram-Design",
  },
];

const referenceLinks = [
  { name: "Perception", url: "https://www.behance.net/exp-perception" },
  { name: "Doctor Strange UI", url: "https://www.behance.net/gallery/176169927/Doctor-Strange-Medical-Interface-Design" },
  { name: "Jayse Hansen", url: "https://www.jayse.tv" },
  { name: "Cantina Creative", url: "https://www.cantinacreative.com" },
  { name: "Territory Studio", url: "https://territorystudio.com" },
  { name: "HUDS+GUIS", url: "https://www.hudsandguis.com" },
];

interface ImageCardProps {
  image: {
    url: string;
    title: string;
    source: string;
    link: string;
  };
  i: number;
  isInView: boolean;
}

function ImageCard({ image, i, isInView }: ImageCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.a
      href={image.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.1 + i * 0.08, duration: 0.6 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative aspect-4/3 rounded-2xl overflow-hidden border border-[rgba(180,200,222,0.12)] bg-[#0e0f17]"
    >
      {/* Image or Fallback */}
      {!imgError ? (
        <img
          src={image.url}
          alt={image.title}
          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[linear-gradient(135deg,rgba(61,165,255,0.1),rgba(61,165,255,0.05))]">
          <ImageOff className="w-12 h-12 text-[#3da5ff]/40 mb-2" />
          <span className="text-xs text-[#6c7e90]">Visual Reference</span>
        </div>
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-[#08090f] via-[#08090f]/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#3da5ff] mb-1">
              {image.source}
            </div>
            <div className="text-sm text-[#eef2f7] font-medium leading-tight">
              {image.title}
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-[#6c7e90] group-hover:text-[#3da5ff] transition-colors" />
        </div>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 border-2 border-[#3da5ff]/30 rounded-2xl" />
      </div>
    </motion.a>
  );
}

export default function MoodboardSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="moodboard" className="py-20 sm:py-24 border-b border-[rgba(180,200,222,0.12)]">
      <div ref={ref} className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
        >
          {/* Kicker */}
          <div className="flex items-center gap-2.5 mb-3.5">
            <span className="w-6 h-px bg-[#3da5ff]" />
            <span className="font-mono text-[11px] tracking-[0.32em] uppercase text-[#3da5ff]">
              08 — Visual language
            </span>
          </div>

          {/* Title */}
          <h2 className="font-mono font-bold tracking-[-0.01em] text-[clamp(26px,4.5vw,42px)] leading-[1.12] text-[#eef2f7] mb-6">
            Moodboard — holographic FUI
          </h2>

          {/* Lead */}
          <p className="text-[clamp(17px,2.4vw,21px)] text-[#cfe2f5] font-light max-w-[62ch] leading-relaxed mb-10">
            The visual language draws from cinematic FUI (fictional user interfaces) — light-based, volumetric, and spatially aware. Blue holographic signatures, particle-based forms, and glass-density transparency.
          </p>
        </motion.div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {moodboardImages.map((image, i) => (
            <ImageCard key={i} image={image} i={i} isInView={isInView} />
          ))}
        </div>

        {/* Reference Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 p-6 rounded-2xl border border-[rgba(180,200,222,0.12)] bg-[linear-gradient(180deg,rgba(12,22,40,0.72),rgba(7,12,24,0.55))]"
        >
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#3da5ff] mb-4">
            Full Reference Index
          </div>
          <p className="text-[13px] text-[#a2b2c2] mb-4 leading-relaxed">
            Study the design language — motion grammar, line weight, color logic, density. 
            Re-author original geometry; don&apos;t trace layouts or reuse marks.
          </p>
          <div className="flex flex-wrap gap-2">
            {referenceLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(61,165,255,0.1)] border border-[rgba(61,165,255,0.2)] text-[#a2b2c2] hover:text-[#eef2f7] hover:border-[rgba(61,165,255,0.4)] transition-all text-xs"
              >
                {link.name}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
