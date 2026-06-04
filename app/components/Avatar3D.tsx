"use client";

import { useRef, useEffect, useState, Suspense, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { getLipsyncManager } from "../lib/lipsync";

interface Avatar3DProps {
  isSpeaking: boolean;
  viseme?: string;
  modelUrl?: string; // Path to GLB/GLTF file
}

// --- Character Creator 4 (CC4) lip-sync ---
// CC4 names morph targets like "Morpher__Body.V_Open"; we match on the final
// segment after the last dot so the same logic works across all meshes.
//
// wawa-lipsync emits Oculus visemes (viseme_aa, viseme_PP, …) from real audio;
// map each to the closest CC4 blendshape + a jaw-open amount.
const VISEME_TO_CC: Record<string, { morph: string; amt: number; jaw: number }> = {
  viseme_sil: { morph: "Mouth_Close", amt: 0.12, jaw: 0 },
  viseme_PP: { morph: "V_Explosive", amt: 1.0, jaw: 0.05 },
  viseme_FF: { morph: "V_Dental_Lip", amt: 1.0, jaw: 0.12 },
  viseme_TH: { morph: "V_Open", amt: 0.6, jaw: 0.32 },
  viseme_DD: { morph: "V_Lip_Open", amt: 0.85, jaw: 0.4 },
  viseme_kk: { morph: "V_Lip_Open", amt: 0.8, jaw: 0.45 },
  viseme_CH: { morph: "V_Affricate", amt: 1.0, jaw: 0.3 },
  viseme_SS: { morph: "V_Tight", amt: 0.9, jaw: 0.12 },
  viseme_nn: { morph: "V_Lip_Open", amt: 0.7, jaw: 0.28 },
  viseme_RR: { morph: "V_Tight_O", amt: 0.85, jaw: 0.3 },
  viseme_aa: { morph: "V_Open", amt: 1.0, jaw: 0.85 },
  viseme_E: { morph: "V_Wide", amt: 1.0, jaw: 0.5 },
  viseme_I: { morph: "V_Wide", amt: 0.9, jaw: 0.4 },
  viseme_O: { morph: "V_Tight_O", amt: 1.0, jaw: 0.65 },
  viseme_U: { morph: "V_Tight_O", amt: 1.0, jaw: 0.45 },
};

// Every morph name we actively drive (so non-active ones relax back to 0).
const MOUTH_MORPHS = [
  "V_Open", "V_Wide", "V_Tight_O", "V_Explosive",
  "V_Lip_Open", "V_Dental_Lip", "V_Affricate", "V_Tight",
  "Jaw_Open", "Mouth_Close",
];
// Expression blendshapes layered on top of the visemes for a lifelike face.
const EXPR_MORPHS = [
  "Brow_Raise_Inner_L", "Brow_Raise_Inner_R", "Brow_Raise_Outer_L", "Brow_Raise_Outer_R",
  "Mouth_Smile_L", "Mouth_Smile_R", "Cheek_Raise_L", "Cheek_Raise_R",
  "Eye_L_Look_L", "Eye_R_Look_L", "Eye_L_Look_R", "Eye_R_Look_R",
];
const MORPH_NAMES = [...MOUTH_MORPHS, "Eye_Blink_L", "Eye_Blink_R", ...EXPR_MORPHS];

// Set a blendshape (by its final-segment name) across all morph-bearing meshes.
function setMorphInfluence(meshes: THREE.Mesh[], name: string, value: number) {
  for (const mesh of meshes) {
    const dict = mesh.morphTargetDictionary;
    const inf = mesh.morphTargetInfluences;
    if (!dict || !inf) continue;
    for (const key in dict) {
      if (key.slice(key.lastIndexOf(".") + 1) === name) {
        inf[dict[key]] = value;
      }
    }
  }
}

// FBX Model Avatar
function FBXAvatar({ isSpeaking, modelUrl = "/models/nat.fbx" }: Avatar3DProps) {
  const [scene, setScene] = useState<THREE.Group | null>(null);
  // Fit transform applied to an OUTER wrapper group (skinning-safe), not the
  // rigged root — scaling the bound FBX root collapses the GPU-skinned mesh.
  const [fit, setFit] = useState<{ scale: number; y: number }>({ scale: 1, y: 0 });
  const avatarRef = useRef<THREE.Group>(null);
  const fbxLoader = useMemo(() => new FBXLoader(), []);
  // Meshes that carry morph targets (CC4 blendshapes) for lip-sync + blinking,
  // and the current (smoothed) influence value for each morph name we drive.
  const morphMeshesRef = useRef<THREE.Mesh[]>([]);
  const morphValsRef = useRef<Record<string, number>>({});
  const blinkRef = useRef({ next: 1.5, closing: 0 });
  const volEnvRef = useRef(1e-4);
  const saccadeRef = useRef({ next: 1, x: 0 });

  // Load FBX file
  useEffect(() => {
    fbxLoader.load(
      modelUrl,
      (fbx) => {
        // Keep the rigged model at native scale and only translate it
        // (translation is skinning-safe); the wrapper group handles fit.
        const box = new THREE.Box3().setFromObject(fbx);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        fbx.position.x = -center.x;
        fbx.position.y = -center.y;
        fbx.position.z = -center.z;

        // Frame head → waist: show the top ~45% of the body and scale it to
        // fill the camera frame (z=3, fov 45 → ~2.48u visible vertically).
        const showFrac = 0.45;
        const visibleH = size.y * showFrac;
        const midLocal = size.y / 2 - visibleH / 2; // local Y of region midpoint
        const targetH = 2.2;
        const fitScale = targetH / visibleH;
        setFit({ scale: fitScale, y: -fitScale * midLocal });
        
        // The FBX ships with textures that don't resolve at runtime, so the
        // original Phong materials sample black and the avatar disappears
        // against the dark backdrop. Replace them with a self-lit holographic
        // material so the figure reads as a glowing presence.
        const morphMeshes: THREE.Mesh[] = [];
        fbx.traverse((object: THREE.Object3D) => {
          if (object instanceof THREE.Mesh) {
            if (object.morphTargetDictionary && object.morphTargetInfluences) {
              morphMeshes.push(object);
            }
            // Skinned meshes carry a rest-pose bounding sphere from the tiny
            // base scale, so frustum culling can wrongly cull them. Disable it
            // and recompute bounds so they always draw.
            object.frustumCulled = false;
            object.geometry?.computeBoundingSphere?.();
            object.geometry?.computeBoundingBox?.();
            // Recolor the EXISTING materials in place (don't replace the
            // material object — that drops the morph-target binding so the face
            // can't animate). Drop the unresolved textures and apply the
            // holographic blue look.
            const mats = Array.isArray(object.material) ? object.material : [object.material];
            for (const mat of mats) {
              const m = mat as THREE.MeshStandardMaterial;
              m.map = null;
              m.color?.set("#9ec9ef");
              m.emissive?.set("#1a5a99");
              if (m.emissiveIntensity !== undefined) m.emissiveIntensity = 0.15;
              if (m.metalness !== undefined) m.metalness = 0.3;
              if (m.roughness !== undefined) m.roughness = 0.55;
              m.transparent = false;
              m.needsUpdate = true;
            }
          }
        });

        morphMeshesRef.current = morphMeshes;
        setScene(fbx);
      },
      undefined,
      (err: unknown) => {
        console.error("Error loading FBX:", err);
      }
    );
  }, [modelUrl, fbxLoader]);
  
  // Lip-sync + idle animation
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    if (!avatarRef.current) return;

    // Idle animation - gentle floating and rotation (outer group only, so the
    // skinning-safe fit transform on the inner group is preserved).
    avatarRef.current.position.y = Math.sin(time * 0.8) * 0.05;
    avatarRef.current.rotation.y = Math.sin(time * 0.3) * 0.1;

    // --- Drive CC4 facial blendshapes from wawa-lipsync ---
    const targets: Record<string, number> = {};
    for (const name of MORPH_NAMES) targets[name] = 0;

    const mgr = getLipsyncManager();
    if (isSpeaking && mgr) {
      // Analyze the live audio signal and map the detected Oculus viseme to the
      // model's CC4 blendshapes.
      mgr.processAudio();
      const cc = VISEME_TO_CC[mgr.viseme] ?? VISEME_TO_CC.viseme_sil;

      // Normalize loudness to 0..1 with a decaying running max (wawa's volume
      // scale is arbitrary) to drive emphasis-based expression.
      const vol = mgr.features?.volume ?? 0;
      volEnvRef.current = Math.max(volEnvRef.current * 0.995, vol, 1e-4);
      const emph = THREE.MathUtils.clamp(vol / volEnvRef.current, 0, 1);

      // Mouth: continuous open flap (scaled by loudness) + the detected viseme
      // lip shape on top, so the lips clearly part while talking.
      const open = 0.4 + 0.4 * Math.abs(Math.sin(time * 9)) * (0.5 + 0.5 * emph);
      targets["Jaw_Open"] = Math.max(cc.jaw, open);
      targets["V_Open"] = open * 0.8;
      if (cc.morph !== "V_Open") targets[cc.morph] = Math.max(targets[cc.morph] ?? 0, cc.amt * 0.5);

      // Brows lift on vocal emphasis (+ a slow idle drift) for expressiveness.
      const brow = emph * 0.5 + 0.08 * (0.5 + 0.5 * Math.sin(time * 0.6));
      targets["Brow_Raise_Inner_L"] = brow;
      targets["Brow_Raise_Inner_R"] = brow;
      targets["Brow_Raise_Outer_L"] = brow * 0.7;
      targets["Brow_Raise_Outer_R"] = brow * 0.7;

      // Warm, friendly smile + cheek raise (the encouraging-teacher persona).
      const smile = 0.18 + emph * 0.18;
      targets["Mouth_Smile_L"] = smile;
      targets["Mouth_Smile_R"] = smile;
      targets["Cheek_Raise_L"] = smile * 0.5;
      targets["Cheek_Raise_R"] = smile * 0.5;
    } else {
      // Relaxed, gently positive resting face.
      targets["Mouth_Close"] = 0.12;
      targets["Mouth_Smile_L"] = 0.1;
      targets["Mouth_Smile_R"] = 0.1;
    }

    // Eye saccades — small, occasional darts so the gaze feels alive.
    const sac = saccadeRef.current;
    sac.next -= delta;
    if (sac.next <= 0) {
      sac.x = (Math.random() * 2 - 1) * 0.35;
      sac.next = 0.8 + Math.random() * 2.2;
    }
    if (sac.x >= 0) {
      targets["Eye_L_Look_R"] = sac.x;
      targets["Eye_R_Look_R"] = sac.x;
    } else {
      targets["Eye_L_Look_L"] = -sac.x;
      targets["Eye_R_Look_L"] = -sac.x;
    }

    // Blinking (independent of speech).
    const blink = blinkRef.current;
    blink.next -= delta;
    if (blink.next <= 0 && blink.closing <= 0) blink.closing = 0.16;
    if (blink.closing > 0) {
      blink.closing -= delta;
      const b = blink.closing > 0.08 ? 1 : Math.max(0, blink.closing / 0.08);
      targets["Eye_Blink_L"] = b;
      targets["Eye_Blink_R"] = b;
      if (blink.closing <= 0) blink.next = 2 + Math.random() * 3;
    }

    // Smoothly approach targets and write influences across every morph mesh.
    const vals = morphValsRef.current;
    // Frame-rate independent easing with a short (~45ms) time constant so the
    // mouth tracks the audio responsively without jitter.
    const lerpK = 1 - Math.exp(-delta / 0.045);
    for (const name of MORPH_NAMES) {
      const cur = vals[name] ?? 0;
      vals[name] = cur + ((targets[name] ?? 0) - cur) * lerpK;
      setMorphInfluence(morphMeshesRef.current, name, vals[name]);
    }
  });

  if (!scene) {
    return (
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#3da5ff" wireframe />
      </mesh>
    );
  }

  return (
    <group ref={avatarRef}>
      {/* Inner wrapper carries the fit (scale + offset) so the rigged root
          stays at native scale and skinning is preserved. */}
      <group scale={fit.scale} position={[0, fit.y, 0]}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

// GLB Model Avatar — keeps the embedded textures (skin + clothing) and drives
// visemes from wawa-lipsync, framed head-to-waist.
function GLBAvatar({ isSpeaking, modelUrl = "/models/avatar.glb" }: Avatar3DProps) {
  const [scene, setScene] = useState<THREE.Group | null>(null);
  const [fit, setFit] = useState<{ scale: number; y: number }>({ scale: 1, y: 0 });
  const avatarRef = useRef<THREE.Group>(null);
  const morphMeshesRef = useRef<THREE.Mesh[]>([]);
  const morphValsRef = useRef<Record<string, number>>({});
  const blinkRef = useRef({ next: 1.5, closing: 0 });
  const volEnvRef = useRef(1e-4);
  const saccadeRef = useRef({ next: 1, x: 0 });
  const gltfLoader = useMemo(() => new GLTFLoader(), []);

  // Load GLB file
  useEffect(() => {
    gltfLoader.load(
      modelUrl,
      (gltf: GLTF) => {
        const loadedScene = gltf.scene;

        // Keep native scale; only translate to center (skinning-safe). The
        // outer wrapper group handles the head-to-waist fit.
        const box = new THREE.Box3().setFromObject(loadedScene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        loadedScene.position.x = -center.x;
        loadedScene.position.y = -center.y;
        loadedScene.position.z = -center.z;

        const showFrac = 0.45; // top ~45% of the body (head → waist)
        const visibleH = size.y * showFrac;
        const midLocal = size.y / 2 - visibleH / 2;
        const targetH = 2.2;
        const fitScale = targetH / visibleH;
        setFit({ scale: fitScale, y: -fitScale * midLocal });

        // Collect morph-bearing meshes for lip-sync and fix the exported assets.
        const meshes: THREE.Mesh[] = [];
        loadedScene.traverse((object: THREE.Object3D) => {
          if (!(object instanceof THREE.Mesh)) return;
          object.frustumCulled = false;

          // The eye-occlusion / tearline meshes export as dark opaque shells
          // that sit in front of the eyeballs and read as empty black sockets.
          if (/occlusion|tearline/i.test(object.name)) {
            object.visible = false;
            return;
          }

          const isHair = /hair|scalp/i.test(object.name);
          const isSkin = /body/i.test(object.name);
          const mats = Array.isArray(object.material) ? object.material : [object.material];

          // The transparent cornea shells (CC4 uses refraction that doesn't
          // survive export) wash the iris out to blank white — hide them so the
          // iris painted on the opaque eyeball shows.
          if (/^eye/i.test(object.name) && (mats[0] as THREE.Material)?.transparent) {
            object.visible = false;
            return;
          }
          for (const mat of mats) {
            const m = mat as THREE.MeshPhysicalMaterial;
            // GLB ships white emissive (blows out to solid white) and
            // metalness=1 on skin/cloth (renders black with no env map).
            if (m.emissive) { m.emissive.setRGB(0, 0, 0); m.emissiveIntensity = 0; }
            if (m.metalness !== undefined && m.map) m.metalness = 0;
            // Kill the mirror-like clearcoat/sheen/transmission that made the
            // face look chrome, and soften specular.
            if (m.clearcoat !== undefined) m.clearcoat = 0;
            if (m.sheen !== undefined) m.sheen = 0;
            if (m.transmission !== undefined) m.transmission = 0;
            if (m.iridescence !== undefined) m.iridescence = 0;
            if (m.specularIntensity !== undefined) m.specularIntensity = 0.2;
            if (m.reflectivity !== undefined) m.reflectivity = 0.2;
            if (m.roughness !== undefined && m.map) m.roughness = Math.max(m.roughness, 0.6);
            // Soften the skin's baked detail: dial down the normal-map creases
            // and the ambient-occlusion shading that darkens the mouth/chin and
            // makes her read older than she is.
            if (isSkin) {
              if (m.normalMap) m.normalScale.set(0.1, 0.1);
              m.aoMapIntensity = 0;
              if (m.aoMap) m.aoMap = null;
            }
            // Hair cards exported as OPAQUE with a near-white, alpha-less
            // texture → white shards. Tint dark and alpha-test the strands.
            if (isHair) {
              m.alphaTest = 0.5;
              m.transparent = false;
              m.depthWrite = true;
              m.side = THREE.DoubleSide;
              m.color?.set("#2a1d14");
              m.roughness = 0.7;
            }
            m.needsUpdate = true;
          }
          if (object.morphTargetDictionary && object.morphTargetInfluences) {
            meshes.push(object);
          }
        });

        morphMeshesRef.current = meshes;
        setScene(loadedScene);
      },
      undefined,
      (err: unknown) => {
        console.error("Error loading GLB:", err);
      }
    );
  }, [modelUrl, gltfLoader]);

  // Lip-sync + idle animation (shared logic with the FBX path)
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    if (!avatarRef.current) return;

    avatarRef.current.position.y = Math.sin(time * 0.8) * 0.02;
    avatarRef.current.rotation.y = Math.sin(time * 0.3) * 0.03;

    const targets: Record<string, number> = {};
    for (const name of MORPH_NAMES) targets[name] = 0;

    const mgr = getLipsyncManager();
    if (isSpeaking && mgr) {
      mgr.processAudio();

      // Normalize loudness to 0..1 (wawa's volume scale is arbitrary) to drive
      // emphasis (brows/cheeks) and scale how wide the mouth opens.
      const vol = mgr.features?.volume ?? 0;
      volEnvRef.current = Math.max(volEnvRef.current * 0.995, vol, 1e-4);
      const emph = THREE.MathUtils.clamp(vol / volEnvRef.current, 0, 1);

      // Mouth: a clear open↔close cycle, widened by loudness. Jaw_Open drops the
      // jaw and V_Open parts the lips (both needed). Per-viseme lip shapes are
      // skipped — the consonant shapes pull the lips together and cancel it.
      const open = (0.12 + 0.88 * Math.abs(Math.sin(time * 6.5))) * (0.6 + 0.4 * emph);
      targets["Jaw_Open"] = open;
      targets["V_Open"] = open;

      // Brows lift on vocal emphasis (+ slow idle drift).
      const brow = emph * 0.5 + 0.08 * (0.5 + 0.5 * Math.sin(time * 0.6));
      targets["Brow_Raise_Inner_L"] = brow;
      targets["Brow_Raise_Inner_R"] = brow;
      targets["Brow_Raise_Outer_L"] = brow * 0.7;
      targets["Brow_Raise_Outer_R"] = brow * 0.7;

      // Subtle cheek raise on emphasis (smile kept minimal so it doesn't seal
      // the lips over the open mouth).
      const cheek = emph * 0.25;
      targets["Cheek_Raise_L"] = cheek;
      targets["Cheek_Raise_R"] = cheek;
    } else {
      // Relaxed, gently positive resting face.
      targets["Mouth_Close"] = 0.12;
      targets["Mouth_Smile_L"] = 0.1;
      targets["Mouth_Smile_R"] = 0.1;
    }

    // Eye saccades — small, occasional darts so the gaze feels alive.
    const sac = saccadeRef.current;
    sac.next -= delta;
    if (sac.next <= 0) {
      sac.x = (Math.random() * 2 - 1) * 0.35;
      sac.next = 0.8 + Math.random() * 2.2;
    }
    if (sac.x >= 0) {
      targets["Eye_L_Look_R"] = sac.x;
      targets["Eye_R_Look_R"] = sac.x;
    } else {
      targets["Eye_L_Look_L"] = -sac.x;
      targets["Eye_R_Look_L"] = -sac.x;
    }

    const blink = blinkRef.current;
    blink.next -= delta;
    if (blink.next <= 0 && blink.closing <= 0) blink.closing = 0.16;
    if (blink.closing > 0) {
      blink.closing -= delta;
      const b = blink.closing > 0.08 ? 1 : Math.max(0, blink.closing / 0.08);
      targets["Eye_Blink_L"] = b;
      targets["Eye_Blink_R"] = b;
      if (blink.closing <= 0) blink.next = 2 + Math.random() * 3;
    }

    const vals = morphValsRef.current;
    const lerpK = 1 - Math.exp(-delta / 0.045);
    for (const name of MORPH_NAMES) {
      const cur = vals[name] ?? 0;
      vals[name] = cur + ((targets[name] ?? 0) - cur) * lerpK;
      setMorphInfluence(morphMeshesRef.current, name, vals[name]);
    }
  });

  if (!scene) {
    return (
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#3da5ff" wireframe />
      </mesh>
    );
  }

  return (
    <group ref={avatarRef}>
      <group scale={fit.scale} position={[0, fit.y, 0]}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

// Procedural fallback avatar
function ProceduralAvatar({ isSpeaking }: Avatar3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const leftBlinkRef = useRef<THREE.Mesh>(null);
  const rightBlinkRef = useRef<THREE.Mesh>(null);
  
  const currentVisemeRef = useRef("sil");
  const mouthOpenRef = useRef(0);
  const isBlinkingRef = useRef(false);
  const lastBlinkRef = useRef(0);
  
  const visemeList = useRef(["sil", "aa", "E", "ih", "oh", "ou", "PP", "DD", "sil"]).current;
  
  const visemeShapes: Record<string, number> = {
    "sil": 0, "PP": 0.1, "FF": 0.2, "TH": 0.25, "DD": 0.3,
    "kk": 0.15, "CH": 0.35, "SS": 0.2, "nn": 0.3, "RR": 0.4,
    "aa": 0.7, "E": 0.5, "ih": 0.35, "oh": 0.6, "ou": 0.45,
  };
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Blinking
    if (time - lastBlinkRef.current > 3 + Math.random() * 2) {
      isBlinkingRef.current = true;
      lastBlinkRef.current = time;
      setTimeout(() => { isBlinkingRef.current = false; }, 150);
    }
    
    if (leftBlinkRef.current && rightBlinkRef.current) {
      const blinkScale = isBlinkingRef.current ? 0.1 : 1;
      leftBlinkRef.current.scale.y = THREE.MathUtils.lerp(leftBlinkRef.current.scale.y, blinkScale, 0.3);
      rightBlinkRef.current.scale.y = THREE.MathUtils.lerp(rightBlinkRef.current.scale.y, blinkScale, 0.3);
    }
    
    // Floating
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 0.8) * 0.03;
      groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.05;
    }
    
    // Visemes
    if (isSpeaking) {
      const visemeIndex = Math.floor(time * 10) % visemeList.length;
      currentVisemeRef.current = visemeList[visemeIndex];
    } else {
      currentVisemeRef.current = "sil";
    }
    
    const targetOpen = visemeShapes[currentVisemeRef.current] || 0;
    const targetValue = isSpeaking ? targetOpen : 0.05;
    mouthOpenRef.current = THREE.MathUtils.lerp(mouthOpenRef.current, targetValue, 0.2);
    
    if (mouthRef.current) {
      mouthRef.current.scale.y = 0.3 + mouthOpenRef.current * 0.7;
      mouthRef.current.position.y = -0.15 - mouthOpenRef.current * 0.1;
      const material = mouthRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.6 + mouthOpenRef.current * 0.4;
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Holographic ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
        <ringGeometry args={[0.6, 0.65, 64]} />
        <meshBasicMaterial color="#3da5ff" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshBasicMaterial color="#3da5ff" wireframe transparent opacity={0.3} />
      </mesh>
      
      {/* Face screen */}
      <mesh position={[0, 0, 0.25]}>
        <circleGeometry args={[0.28, 32]} />
        <meshBasicMaterial color="#0a0a12" transparent opacity={0.9} />
      </mesh>
      
      {/* Eyes */}
      <mesh ref={leftBlinkRef} position={[-0.12, 0.05, 0.3]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#3da5ff" transparent opacity={0.8} />
      </mesh>
      <mesh ref={rightBlinkRef} position={[0.12, 0.05, 0.3]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#3da5ff" transparent opacity={0.8} />
      </mesh>
      
      {/* Mouth */}
      <mesh ref={mouthRef} position={[0, -0.15, 0.28]}>
        <capsuleGeometry args={[0.08, 0.15, 4, 8]} />
        <meshBasicMaterial color="#e0263f" transparent opacity={0.6} />
      </mesh>
      
      {/* Headphones */}
      <group position={[-0.38, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.12, 0.15, 16]} />
          <meshBasicMaterial color="#6c7e90" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0.08, 0.15, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshBasicMaterial color="#6c7e90" transparent opacity={0.4} />
        </mesh>
      </group>
      <group position={[0.38, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.12, 0.15, 16]} />
          <meshBasicMaterial color="#6c7e90" transparent opacity={0.6} />
        </mesh>
        <mesh position={[-0.08, 0.15, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshBasicMaterial color="#6c7e90" transparent opacity={0.4} />
        </mesh>
      </group>
    </group>
  );
}

// Main Avatar component that can use GLB, FBX, or fallback
export function Avatar3D({ isSpeaking, viseme, modelUrl }: Avatar3DProps) {
  const [hasModel, setHasModel] = useState(false);
  
  // Detect file type from URL
  const isFBX = modelUrl?.toLowerCase().endsWith('.fbx') ?? false;
  
  useEffect(() => {
    if (modelUrl) {
      // Check if file exists
      fetch(modelUrl, { method: "HEAD" })
        .then(res => setHasModel(res.ok))
        .catch(() => setHasModel(false));
    }
  }, [modelUrl]);
  
  return (
    <Suspense fallback={null}>
      {hasModel && modelUrl ? (
        isFBX ? (
          <FBXAvatar isSpeaking={isSpeaking} viseme={viseme} modelUrl={modelUrl} />
        ) : (
          <GLBAvatar isSpeaking={isSpeaking} viseme={viseme} modelUrl={modelUrl} />
        )
      ) : (
        <ProceduralAvatar isSpeaking={isSpeaking} viseme={viseme} />
      )}
    </Suspense>
  );
}

export default Avatar3D;
