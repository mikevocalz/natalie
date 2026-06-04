"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useInView } from "framer-motion";
import { MessageSquare, Mic, User, Sparkles } from "lucide-react";
import { Avatar3D } from "./Avatar3D";
import { getLipsyncManager } from "../lib/lipsync";

// Floating holographic rings
function HologramRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.sin(time * 0.3) * 0.1;
      ring1Ref.current.rotation.y += 0.005;
      ring1Ref.current.position.y = Math.sin(time * 0.5) * 0.1;
    }
    
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = Math.cos(time * 0.4) * 0.15;
      ring2Ref.current.rotation.y -= 0.003;
      ring2Ref.current.position.y = Math.cos(time * 0.3) * 0.15 - 0.5;
    }
    
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = Math.sin(time * 0.2) * 0.1;
      ring3Ref.current.rotation.x += 0.002;
      ring3Ref.current.position.y = Math.sin(time * 0.4) * 0.08 + 0.5;
    }
  });

  return (
    <>
      <mesh ref={ring1Ref} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.6, 0.002, 16, 100]} />
        <meshBasicMaterial color="#3da5ff" transparent opacity={0.3} />
      </mesh>
      <mesh ref={ring2Ref} position={[0, -0.5, 0]} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[0.8, 0.002, 16, 100]} />
        <meshBasicMaterial color="#9ec9ef" transparent opacity={0.2} />
      </mesh>
      <mesh ref={ring3Ref} position={[0, 0.5, 0]} rotation={[Math.PI / 1.8, 0, 0]}>
        <torusGeometry args={[0.5, 0.002, 16, 100]} />
        <meshBasicMaterial color="#3da5ff" transparent opacity={0.25} />
      </mesh>
    </>
  );
}

// Scene setup
function Scene({ isSpeaking }: { isSpeaking: boolean }) {
  return (
    <>
      {/* Soft, frontal lighting for the GLB's PBR skin — keeps the face even
          and youthful (steep light deepens sockets/folds and ages the face). */}
      <ambientLight intensity={0.75} />
      <directionalLight position={[0.5, 1.5, 6]} color="#fff1e0" intensity={1.1} />
      <directionalLight position={[-4, 1, 2]} color="#bcd6f5" intensity={0.4} />
      <pointLight position={[0, 1.5, 3]} color="#ffffff" intensity={0.5} distance={15} />
      <Avatar3D isSpeaking={isSpeaking} viseme="sil" modelUrl="/models/nat.glb" />
      {/* Rings sit behind the avatar so she reads in front of them. */}
      <group position={[0, 0, -1.8]}>
        <HologramRings />
      </group>
    </>
  );
}

const demoPrompts = [
  {
    id: 1,
    prompt: "Natalie, I don't get this multiplication problem. Can you help?",
    response: "Of course! Let me see... This is 24 times 13. Instead of giving you the answer, let's break it down. What is 24 times 10? That's easy, right? Now what about 24 times 3? You're doing great!",
    action: "Shows visual breakdown + step-by-step guidance + encouragement",
  },
  {
    id: 2,
    prompt: "Help me plan my science fair project on volcanoes!",
    response: "Volcanoes are awesome! Let's make a plan. First, we'll research how they work. Then build a model. Then create your presentation. I'll check in every day to keep you on track. You've got this!",
    action: "Generates timeline with milestones + daily check-ins + resources",
  },
  {
    id: 3,
    prompt: "I'm so stuck on this algebra homework. It's confusing!",
    response: "Algebra can be tricky at first, but I know you can do it. Let's look at this equation together. What do you think we should do first? Try moving the numbers to one side... you're getting it!",
    action: "Displays problem + asks guiding questions + celebrates progress",
  },
  {
    id: 4,
    prompt: "Quiz me on my vocabulary words for tomorrow's test!",
    response: "Let's do it! Spell 'photosynthesis' and tell me what it means. Nice! Now 'chlorophyll' — think about the color of plants. You're nailing these! One more: what's 'mitochondria'?",
    action: "Voice quiz with instant feedback + encouragement + score tracking",
  },
];

function ResponseBubble({ promptId, className = "" }: { promptId: number; className?: string }) {
  const prompt = demoPrompts.find(p => p.id === promptId);
  if (!prompt) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-2xl bg-[rgba(12,22,40,0.9)] border border-[rgba(61,165,255,0.3)] backdrop-blur-xl ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[rgba(61,165,255,0.2)] shrink-0">
          <Sparkles className="w-4 h-4 text-[#3da5ff]" />
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#3da5ff] mb-1">
            Natalie
          </div>
          <p className="text-sm text-[#eef2f7] leading-relaxed">
            {prompt.response}
          </p>
          <div className="mt-2 text-[11px] text-[#6c7e90]">
            Action: {prompt.action}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function DemoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activePrompt, setActivePrompt] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Pause playback if the component unmounts.
  useEffect(() => {
    const audio = audioRef.current;
    return () => { audio?.pause(); };
  }, []);

  const play = (id: number) => {
    const audio = audioRef.current;
    if (!audio || !voiceEnabled) return;

    audio.src = `/audio/response-${id}.m4a`;
    audio.currentTime = 0;
    // Feed this element into the shared wawa-lipsync analyzer (the element
    // needs a valid src first). Re-calling with the same element is a no-op.
    getLipsyncManager()?.connectAudio(audio);
    audio.play().catch(() => setIsSpeaking(false));
  };

  const handlePromptClick = (id: number) => {
    const prompt = demoPrompts.find(p => p.id === id);
    if (!prompt) return;

    setActivePrompt(id);
    play(id);
  };

  const toggleVoice = () => {
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      audio.pause();
      setIsSpeaking(false);
    }
    setVoiceEnabled((v) => !v);
  };

  return (
    <section id="try" className="py-20 sm:py-24 border-b border-[rgba(180,200,222,0.12)]">
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
              09 — Interactive demo
            </span>
          </div>

          {/* Title */}
          <h2 className="font-mono font-bold tracking-[-0.01em] text-[clamp(26px,4.5vw,42px)] leading-[1.12] text-[#eef2f7] mb-6">
            Ask Natalie something
          </h2>

          {/* Lead */}
          <p className="text-[clamp(17px,2.4vw,21px)] text-[#cfe2f5] font-light max-w-[62ch] leading-relaxed mb-8">
            A scripted taste of the interaction model — voice-first, spatial-result. 
            Tap a prompt and watch how a request resolves into action in the space, not a wall of text.
          </p>
        </motion.div>

        {/* Demo Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* 3D Hologram Viewport */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative aspect-square lg:aspect-auto lg:h-[500px] rounded-3xl overflow-hidden border border-[rgba(180,200,222,0.12)] bg-[radial-gradient(ellipse_at_center,_rgba(61,165,255,0.1)_0%,_transparent_70%)]"
          >
            {/* Three.js Canvas */}
            <Canvas
              camera={{ position: [0, 0, 3], fov: 45 }}
              className="absolute inset-0"
            >
              <Scene isSpeaking={isSpeaking} />
            </Canvas>

            {/* Voice audio — analyzed by wawa-lipsync to drive the visemes */}
            <audio
              ref={audioRef}
              onPlay={() => setIsSpeaking(true)}
              onEnded={() => setIsSpeaking(false)}
              onPause={() => setIsSpeaking(false)}
              className="hidden"
            />

            {/* UI Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#3da5ff]/30 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#3da5ff]/30 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#3da5ff]/30 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#3da5ff]/30 rounded-br-lg" />

              {/* Status indicator with voice toggle */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(8,9,15,0.8)] border border-[rgba(61,165,255,0.2)] backdrop-blur-sm">
                <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-[#3da5ff] animate-pulse' : voiceEnabled ? 'bg-[#5af0c0]' : 'bg-[#6c7e90]'} `} />
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#a2b2c2]">
                  {isSpeaking ? 'Speaking...' : voiceEnabled ? 'Voice On' : 'Muted'}
                </span>
              </div>

              {/* Voice toggle button */}
              <button
                onClick={toggleVoice}
                className="absolute top-4 right-4 p-2 rounded-lg bg-[rgba(8,9,15,0.8)] border border-[rgba(61,165,255,0.2)] backdrop-blur-sm hover:border-[rgba(61,165,255,0.4)] transition-colors pointer-events-auto"
                aria-label={voiceEnabled ? "Mute voice" : "Enable voice"}
              >
                {voiceEnabled ? (
                  <svg className="w-4 h-4 text-[#3da5ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-[#6c7e90]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                )}
              </button>

              {/* Voice wave animation when speaking */}
              {isSpeaking && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-[#3da5ff] rounded-full"
                      animate={{
                        height: [8, 24, 8],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Response bubble */}
            <AnimatePresence>
              {activePrompt !== null && (
                <ResponseBubble
                  promptId={activePrompt}
                  className="hidden sm:block absolute bottom-20 left-4 right-4"
                />
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {activePrompt !== null && (
              <ResponseBubble promptId={activePrompt} className="sm:hidden -mt-3" />
            )}
          </AnimatePresence>

          {/* Prompts Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <Mic className="w-4 h-4 text-[#3da5ff]" />
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#6c7e90]">
                Voice Prompts
              </span>
            </div>

            {demoPrompts.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                onClick={() => handlePromptClick(item.id)}
                className={`group text-left p-4 rounded-xl border transition-all duration-300 ${
                  activePrompt === item.id
                    ? "bg-[rgba(61,165,255,0.15)] border-[rgba(61,165,255,0.4)]"
                    : "bg-[rgba(12,22,40,0.6)] border-[rgba(180,200,222,0.08)] hover:border-[rgba(61,165,255,0.2)]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors ${
                    activePrompt === item.id ? "bg-[#3da5ff]" : "bg-[rgba(61,165,255,0.1)]"
                  }`}>
                    <User className={`w-4 h-4 transition-colors ${
                      activePrompt === item.id ? "text-white" : "text-[#3da5ff]"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#6c7e90] mb-1">
                      Example {String(i + 1).padStart(2, '0')}
                    </div>
                    <p className={`text-sm transition-colors ${
                      activePrompt === item.id ? "text-[#eef2f7]" : "text-[#a2b2c2] group-hover:text-[#cfe2f5]"
                    }`}>
                      &ldquo;{item.prompt}&rdquo;
                    </p>
                  </div>
                  <MessageSquare className={`w-4 h-4 shrink-0 transition-all ${
                    activePrompt === item.id 
                      ? "text-[#3da5ff] scale-110" 
                      : "text-[#6c7e90] group-hover:text-[#3da5ff]"
                  }`} />
                </div>
              </motion.button>
            ))}

            <div className="mt-auto p-4 rounded-xl border border-[rgba(180,200,222,0.08)] bg-[rgba(7,12,24,0.5)]">
              <p className="text-[11px] text-[#6c7e90] leading-relaxed">
                <span className="text-[#a2b2c2]">Note:</span> This is a scripted prototype demonstration. 
                In production, N.A.T.A.L.I.E. would process natural language through on-device 
                Gemini Nano + cloud inference for complex tasks.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
