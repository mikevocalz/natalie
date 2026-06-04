import { Lipsync } from "wawa-lipsync";

// Single shared analyzer: DemoSection connects the <audio> element to it, and
// Avatar3D reads the current viseme from it inside the render loop. Created
// lazily on the client only (Lipsync builds an AudioContext, unavailable in SSR).
let manager: Lipsync | null = null;

export function getLipsyncManager(): Lipsync | null {
  if (typeof window === "undefined") return null;
  if (!manager) {
    manager = new Lipsync({ fftSize: 1024, historySize: 8 });
  }
  return manager;
}
