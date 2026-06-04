"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ImageOff, X, ZoomIn } from "lucide-react";

const natalieGallery = [
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3GxHL8-Z3uaWGiONDI_g0vFnPQpG2wsWVkw&s",
    title: "Natalie v1.0",
    source: "Comic Series #1",
    desc: "First appearance - The holographic study companion",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFZ7jpeEvmteZkKeLobg-oPgnesfO4I4JCyA&s",
    title: "The Lab Sessions",
    source: "Comic Series #3",
    desc: "Natalie helping Maya with fractions",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU7Z1Cu5FjX6LlnRyE9nRefsjjPHGeHRA2nDbSgelqkg&s",
    title: "The Upgrade",
    source: "Comic Series #8",
    desc: "Natalie 2.0 with enhanced viseme recognition",
  },
];

const natalieTVSeries = [
  {
    url: "/images/tv-series/Natalie_Washington_Infobox.webp",
    title: "Series Premiere",
    source: "Disney+ S1:E1",
    desc: "Natalie awakens in the study lab",
  },
  {
    url: "/images/tv-series/Natalie-in-Ironheart.webp",
    title: "The Study Group",
    source: "Disney+ S1:E4",
    desc: "Natalie mentors the after-school club",
  },
  {
    url: "https://m.media-amazon.com/images/M/MV5BZDU2MDIyZjgtNGI0OS00ZGI5LTg5MWMtMzlmNzExMDEyYWI4XkEyXkFqcGc@._V1_.jpg",
    title: "Holographic Helper",
    source: "Disney+ S1:E7",
    desc: "Visual learning with spatial projections",
  },
  {
    url: "https://static0.polygonimages.com/wordpress/wp-content/uploads/2025/06/ironheart-marvel-1.jpg",
    title: "Season Finale",
    source: "Disney+ S1:E10",
    desc: "Natalie saves finals week",
  },
];

const conceptSketches = [
  {
    url: "/images/concept/natalie-sketch.png",
    title: "Natalie AI Assistant",
    source: "Pencil Sketch",
    desc: "Early concept sketch showing holographic tutoring session",
  },
  {
    url: "/images/concept/natalie-render.png",
    title: "N.A.T.A.L.I.E. AI Tutor",
    source: "Production Art",
    desc: "Final rendered concept with holographic interface",
  },
];

const pillars = [
  {
    n: "1",
    title: "Show & Learn",
    desc: "Maya (8) holds up her math worksheet. Natalie scans it, identifies she's struggling with fractions, and creates a lesson plan right then. No typing, no searching — just show and learn. From elementary phonics to high school calculus, she adapts to every level.",
    color: "#3da5ff",
  },
  {
    n: "2",
    title: "Never Gives the Answer",
    desc: "When Jordan (12) asks for the answer to his volcano project, Natalie doesn't tell him. Instead: \"What do you think makes magma rise?\" She guides, asks questions, celebrates breakthroughs. Kids learn by thinking, not copying. That's real understanding.",
    color: "#9ec9ef",
  },
  {
    n: "3",
    title: "Voice-First Help",
    desc: "Alex (15) is sketching a diagram and stuck on step 3. \"Natalie, what's next?\" he asks, hands covered in pencil dust. She narrates the explanation while he keeps working. No stopping to type, no broken focus — just talk and learn.",
    color: "#5af0c0",
  },
];

interface GalleryImage {
  url: string;
  title: string;
  source: string;
  desc: string;
}

function GalleryCard({ image, i, isInView, onClick }: { image: GalleryImage; i: number; isInView: boolean; onClick?: () => void }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
      className="group relative aspect-4/3 rounded-xl overflow-hidden border border-[rgba(180,200,222,0.12)] bg-[#0e0f17] cursor-pointer"
      onClick={onClick}
    >
      {!imgError ? (
        <img
          src={image.url}
          alt={image.title}
          className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[linear-gradient(135deg,rgba(61,165,255,0.1),rgba(61,165,255,0.05))]">
          <ImageOff className="w-10 h-10 text-[#3da5ff]/40 mb-2" />
          <span className="text-xs text-[#6c7e90]">Comic Panel</span>
        </div>
      )}

      <div className="absolute inset-0 bg-linear-to-t from-[#08090f] via-[#08090f]/40 to-transparent" />

      {/* Zoom icon on hover */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="p-2 rounded-full bg-[rgba(8,9,15,0.8)] border border-[rgba(61,165,255,0.3)]">
          <ZoomIn className="w-4 h-4 text-[#3da5ff]" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#3da5ff] mb-1">
          {image.source}
        </div>
        <div className="text-sm text-[#eef2f7] font-medium mb-1">
          {image.title}
        </div>
        <div className="text-xs text-[#a2b2c2] leading-relaxed">
          {image.desc}
        </div>
      </div>
    </motion.div>
  );
}

// Lightbox Component
function Lightbox({ image, isOpen, onClose }: { image: GalleryImage | null; isOpen: boolean; onClose: () => void }) {
  if (!image) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(8,9,15,0.95)] backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-3 rounded-full bg-[rgba(61,165,255,0.1)] border border-[rgba(61,165,255,0.3)] hover:bg-[rgba(61,165,255,0.2)] transition-colors z-10"
          >
            <X className="w-6 h-6 text-[#3da5ff]" />
          </button>

          {/* Image container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-[90vw] max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={image.url}
              alt={image.title}
              className="max-w-full max-h-[85vh] object-contain rounded-lg border border-[rgba(61,165,255,0.3)]"
            />

            {/* Image info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-[#08090f] to-transparent rounded-b-lg">
              <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#3da5ff] mb-2">
                {image.source}
              </div>
              <div className="text-xl text-[#eef2f7] font-bold mb-2">
                {image.title}
              </div>
              <div className="text-sm text-[#a2b2c2]">
                {image.desc}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ConceptSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
  };

  return (
    <section id="concept" className="py-20 sm:py-24 border-b border-[rgba(180,200,222,0.12)]">
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
              05 — The concept
            </span>
          </div>

          {/* Title */}
          <h2 className="font-mono font-bold tracking-[-0.01em] text-[clamp(26px,4.5vw,42px)] leading-[1.12] text-[#eef2f7] mb-6">
            How Natalie helps kids learn
          </h2>

          {/* Lead */}
          <p className="text-[clamp(17px,2.4vw,21px)] text-[#cfe2f5] font-light max-w-[62ch] leading-relaxed mb-8">
            From 3rd grade multiplication to 12th grade SAT prep, Natalie adapts to every age. She&apos;s not just an AI tutor — she&apos;s a patient study buddy who explains, encourages, and never gives away the answers.
          </p>
        </motion.div>

        {/* Pillars */}
        <div className="space-y-5 mt-8">
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
              className="flex gap-4 items-start"
            >
              {/* Dot */}
              <div
                className="flex-shrink-0 w-11 h-11 rounded-full grid place-items-center font-mono font-bold text-[#02121a] text-lg"
                style={{ backgroundColor: pillar.color }}
              >
                {pillar.n}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <h3 className="font-mono font-bold text-xl tracking-[0.02em] text-[#eef2f7] mb-2">
                  {pillar.title}
                </h3>
                <p className="text-[#c3d6ea] leading-relaxed max-w-[64ch]">
                  {pillar.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Concept Sketches & Art Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-16 pt-12 border-t border-[rgba(180,200,222,0.12)]"
        >
          {/* Gallery Header */}
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-6 h-px bg-[#9ec9ef]" />
            <span className="font-mono text-[11px] tracking-[0.32em] uppercase text-[#9ec9ef]">
              Behind the Design
            </span>
          </div>

          <h3 className="font-mono font-bold text-2xl tracking-[0.02em] text-[#eef2f7] mb-3">
            Concept Sketches & Art
          </h3>

          <p className="text-[#a2b2c2] leading-relaxed max-w-[62ch] mb-8">
            From early wireframe holograms to the final character design, explore the 
            artistic journey of creating Natalie&apos;s visual identity.
          </p>

          {/* Sketches Gallery Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {conceptSketches.map((image, i) => (
              <GalleryCard key={i} image={image} i={i} isInView={isInView} onClick={() => openLightbox(image)} />
            ))}
          </div>

          {/* Lightbox for Concept Sketches */}
          <Lightbox image={selectedImage} isOpen={lightboxOpen} onClose={closeLightbox} />
        </motion.div>

        {/* Natalie Comic Series Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-12 pt-12 border-t border-[rgba(180,200,222,0.12)]"
        >
          {/* Gallery Header */}
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-6 h-px bg-[#5af0c0]" />
            <span className="font-mono text-[11px] tracking-[0.32em] uppercase text-[#5af0c0]">
              Comic Series
            </span>
          </div>

          <h3 className="font-mono font-bold text-2xl tracking-[0.02em] text-[#eef2f7] mb-3">
            Natalie in the Comics
          </h3>

          <p className="text-[#a2b2c2] leading-relaxed max-w-[62ch] mb-8">
            From her first appearance as a holographic study companion to the latest series, 
            see how Natalie has evolved across 8 comic issues helping kids learn.
          </p>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {natalieGallery.map((image, i) => (
              <GalleryCard key={i} image={image} i={i + 4} isInView={isInView} onClick={() => openLightbox(image)} />
            ))}
          </div>
        </motion.div>

        {/* Natalie Disney+ TV Series Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="mt-12 pt-12 border-t border-[rgba(180,200,222,0.12)]"
        >
          {/* Gallery Header */}
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-6 h-px bg-[#3da5ff]" />
            <span className="font-mono text-[11px] tracking-[0.32em] uppercase text-[#3da5ff]">
              Disney+ Original
            </span>
          </div>

          <h3 className="font-mono font-bold text-2xl tracking-[0.02em] text-[#eef2f7] mb-3">
            Natalie: The Series
          </h3>

          <p className="text-[#a2b2c2] leading-relaxed max-w-[62ch] mb-8">
            Streaming now on Disney+. Follow Natalie as she helps students tackle 
            challenges from science fairs to standardized tests across 10 episodes.
          </p>

          {/* TV Series Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {natalieTVSeries.map((image, i) => (
              <GalleryCard key={i} image={image} i={i + 8} isInView={isInView} onClick={() => openLightbox(image)} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
