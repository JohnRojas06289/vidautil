"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import jsQR from "jsqr";
interface SessionData {
  modelName: string;
  years: number;
  co2: number;
  annualFootprint: number;
  medal: string;
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
}

const MEDAL_LABEL = { bronze: "Bronce", silver: "Plata", gold: "Oro" };
const MEDAL_COLOR = { bronze: "#D4A574", silver: "#D3D1C7", gold: "#F4D67E" };

export default function ProyectorPage() {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef   = useRef<Particle[]>([]);
  const sessionRef     = useRef<SessionData | null>(null);
  const markerBoundsRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null);
  const lostFramesRef  = useRef(0);
  const animRef        = useRef(0);
  const lastQRRef      = useRef<string>("");
  const cleanupRef     = useRef<(() => void) | undefined>(undefined);
  const audioCtxRef    = useRef<AudioContext | null>(null);
  const scanMarkerRef  = useRef<() => void>(() => {});

  // ── Detection sound (Web Audio API — no external files) ───────────────────
  const playDetectSound = useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);

    // Two-tone chime: base note + minor third up
    [440, 523].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.07);
      osc.connect(gain);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.35);
    });
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
  }, []);

  const [status, setStatus]           = useState<"loading" | "active" | "error">("loading");
  const [detected, setDetected]       = useState(false);
  const [cameras, setCameras]         = useState<MediaDeviceInfo[]>([]);
  const [activeCameraId, setActiveCameraId] = useState<string | undefined>();
  const [demoMode, setDemoMode]       = useState(false);

  // ── Mago de Oz: press D to inject demo session (no QR needed) ─────────────
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "d" && e.key !== "D") return;
      const DEMO_SESSIONS: SessionData[] = [
        { modelName: "iPhone 12", years: 4, co2: 130, annualFootprint: 19, medal: "gold" },
        { modelName: "Galaxy S21", years: 3, co2: 65, annualFootprint: 22, medal: "silver" },
        { modelName: "Redmi Note 12", years: 2, co2: 20, annualFootprint: 17, medal: "bronze" },
      ];
      const pick = DEMO_SESSIONS[Math.floor(Math.random() * DEMO_SESSIONS.length)];
      sessionRef.current = pick;
      const W = canvasRef.current?.width ?? 1280;
      const H = canvasRef.current?.height ?? 720;
      markerBoundsRef.current = { x: W / 2 - 60, y: H / 2 - 80, w: 120, h: 120 };
      lastQRRef.current = "demo";
      setDemoMode(true);
      setDetected(true);
      playDetectSound();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playDetectSound]);

  // ── Parse session data directly from QR payload ───────────────────────────
  const parseQR = useCallback((raw: string) => {
    try {
      const p = JSON.parse(atob(raw));
      sessionRef.current = {
        modelName: p.m,
        years: p.y,
        co2: p.c,
        annualFootprint: p.a,
        medal: p.x,
      };
    } catch { /* malformed QR — ignore */ }
  }, []);

  // ── Particle helpers ───────────────────────────────────────────────────────
  const spawnParticles = useCallback((
    pLeft: number, pRight: number, pTop: number, pBottom: number, af: number
  ) => {
    const pCx = (pLeft + pRight) / 2;
    const pCy = (pTop + pBottom) / 2;
    const pw  = pRight - pLeft;
    const ph  = pBottom - pTop;
    const count = Math.round(Math.min(Math.max(af / 4, 6), 18));

    for (let i = 0; i < count; i++) {
      // Random point on phone perimeter
      const perimeter = 2 * (pw + ph);
      const t = Math.random() * perimeter;
      let sx: number, sy: number;
      if (t < pw)             { sx = pLeft + t;            sy = pTop; }
      else if (t < pw + ph)   { sx = pRight;               sy = pTop + (t - pw); }
      else if (t < 2*pw + ph) { sx = pRight - (t-pw-ph);  sy = pBottom; }
      else                    { sx = pLeft;                sy = pBottom - (t-2*pw-ph); }

      // Outward velocity from center
      const dx = sx - pCx, dy = sy - pCy;
      const d  = Math.sqrt(dx*dx + dy*dy) || 1;
      const speed = Math.random() * 1.3 + 0.5;

      particlesRef.current.push({
        x: sx + (Math.random() - 0.5) * 6,
        y: sy + (Math.random() - 0.5) * 6,
        vx: (dx / d) * speed + (Math.random() - 0.5) * 0.25,
        vy: (dy / d) * speed + (Math.random() - 0.5) * 0.25,
        life: Math.random() * 90 + 70,
        maxLife: 160,
        size: Math.random() * 48 + 24,
      });
    }
    if (particlesRef.current.length > 700)
      particlesRef.current = particlesRef.current.slice(-700);
  }, []);

  // ── Main render loop ───────────────────────────────────────────────────────
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const video  = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;

    // Mirror video
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -W, 0, W, H);
    ctx.restore();

    const bounds  = markerBoundsRef.current;
    const session = sessionRef.current;

    if (bounds && session) {
      const cx  = W - (bounds.x + bounds.w / 2);
      const ph  = bounds.h * 3;
      const pw  = bounds.w * 1.3;
      const pLeft   = cx - pw / 2;
      const pRight  = cx + pw / 2;
      const pTop    = bounds.y + bounds.h / 2 - ph / 2;
      const pBottom = pTop + ph;

      spawnParticles(pLeft, pRight, pTop, pBottom, session.annualFootprint);

      // Draw particles — radial gradient blobs
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x  += p.vx + (Math.random() - 0.5) * 0.25;
        p.y  += p.vy + (Math.random() - 0.5) * 0.25;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.life--;
        if (p.life <= 0) { particlesRef.current.splice(i, 1); continue; }

        const t = p.life / p.maxLife;                       // 1→0
        const alpha = t < 0.25 ? t / 0.25 * 0.52 : t * 0.52;
        const r = p.size / 2;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0,   `rgba(93,202,165,${alpha})`);
        g.addColorStop(0.5, `rgba(93,202,165,${alpha * 0.45})`);
        g.addColorStop(1,   `rgba(93,202,165,0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }

      // Phone silhouette — glow + outline
      ctx.save();
      ctx.shadowBlur  = 18;
      ctx.shadowColor = "rgba(93,202,165,0.55)";
      ctx.strokeStyle = "rgba(93,202,165,0.75)";
      ctx.lineWidth   = 2;
      ctx.beginPath();
      ctx.roundRect(pLeft, pTop, pw, ph, 14);
      ctx.stroke();
      ctx.restore();

      // Marker corner brackets
      const corners = [
        { x: W - bounds.x,            y: bounds.y },
        { x: W - (bounds.x + bounds.w), y: bounds.y },
        { x: W - bounds.x,            y: bounds.y + bounds.h },
        { x: W - (bounds.x + bounds.w), y: bounds.y + bounds.h },
      ];
      const cs = 20;
      ctx.strokeStyle = "#5DCAA5";
      ctx.lineWidth = 3;
      for (const c of corners) {
        const sx = c.x < W / 2 ? 1 : -1;
        const sy = c.y < H / 2 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y + sy * cs);
        ctx.lineTo(c.x, c.y);
        ctx.lineTo(c.x + sx * cs, c.y);
        ctx.stroke();
      }

      // ── HUD ──
      const medal = session.medal as keyof typeof MEDAL_COLOR;

      // CO₂ — top right
      ctx.fillStyle = "rgba(4,52,44,0.78)";
      ctx.beginPath(); ctx.roundRect(W - 230, 16, 214, 110, 12); ctx.fill();
      ctx.fillStyle = "#5DCAA5";
      ctx.font = "bold 48px system-ui";
      ctx.textAlign = "right";
      ctx.fillText(String(session.co2), W - 24, 82);
      ctx.fillStyle = "#9FE1CB";
      ctx.font = "13px system-ui";
      ctx.fillText("kg CO₂ evitados", W - 24, 106);

      // Medal + model — bottom left
      ctx.fillStyle = "rgba(4,52,44,0.78)";
      ctx.beginPath(); ctx.roundRect(16, H - 118, 220, 102, 12); ctx.fill();
      ctx.fillStyle = MEDAL_COLOR[medal] ?? "#9FE1CB";
      ctx.font = "bold 15px system-ui";
      ctx.textAlign = "left";
      ctx.fillText(`Medalla ${MEDAL_LABEL[medal] ?? ""}`, 32, H - 86);
      ctx.fillStyle = "#E1F5EE";
      ctx.font = "14px system-ui";
      ctx.fillText(session.modelName, 32, H - 64);
      ctx.fillStyle = "#9FE1CB";
      ctx.font = "12px system-ui";
      ctx.fillText(`${session.years} ${session.years === 1 ? "año" : "años"} contigo`, 32, H - 44);

    } else {
      // Fade remaining particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x  += p.vx * 0.5;
        p.y  += p.vy * 0.5;
        p.life -= 5;
        if (p.life <= 0) { particlesRef.current.splice(i, 1); continue; }
        const alpha = (p.life / p.maxLife) * 0.4;
        const r = p.size / 2;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0,   `rgba(93,202,165,${alpha})`);
        g.addColorStop(0.5, `rgba(93,202,165,${alpha * 0.4})`);
        g.addColorStop(1,   `rgba(93,202,165,0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }

      // Instruction
      ctx.fillStyle = "rgba(4,52,44,0.65)";
      ctx.fillRect(0, H / 2 - 38, W, 60);
      ctx.fillStyle = "#E1F5EE";
      ctx.font = "18px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Mostrá el código frente a la cámara", W / 2, H / 2 + 4);
    }

    animRef.current = requestAnimationFrame(drawFrame);
  }, [spawnParticles]);

  // ── QR scan loop ──────────────────────────────────────────────────────────
  const scanMarker = useCallback(() => {
    const canvas = canvasRef.current;
    const video  = videoRef.current;
    if (!canvas || !video || video.readyState < 2) return;

    const off = document.createElement("canvas");
    off.width = canvas.width; off.height = canvas.height;
    const octx = off.getContext("2d")!;
    octx.drawImage(video, 0, 0, off.width, off.height);
    const imageData = octx.getImageData(0, 0, off.width, off.height);

    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      const loc = code.location;
      const xs = [loc.topLeftCorner.x, loc.topRightCorner.x, loc.bottomLeftCorner.x, loc.bottomRightCorner.x];
      const ys = [loc.topLeftCorner.y, loc.topRightCorner.y, loc.bottomLeftCorner.y, loc.bottomRightCorner.y];
      const x  = Math.min(...xs), y = Math.min(...ys);
      const w  = Math.max(...xs) - x, h = Math.max(...ys) - y;
      const newBounds = { x, y, w, h };

      if (markerBoundsRef.current) {
        const k = 0.35;
        markerBoundsRef.current = {
          x: markerBoundsRef.current.x + (newBounds.x - markerBoundsRef.current.x) * k,
          y: markerBoundsRef.current.y + (newBounds.y - markerBoundsRef.current.y) * k,
          w: markerBoundsRef.current.w + (newBounds.w - markerBoundsRef.current.w) * k,
          h: markerBoundsRef.current.h + (newBounds.h - markerBoundsRef.current.h) * k,
        };
      } else {
        markerBoundsRef.current = newBounds;
      }

      if (code.data !== lastQRRef.current) {
        lastQRRef.current = code.data;
        playDetectSound();
        parseQR(code.data);
      }

      lostFramesRef.current = 0;
      setDetected(true);
    } else {
      lostFramesRef.current++;
      if (lostFramesRef.current > 12) {
        markerBoundsRef.current = null;
        lastQRRef.current       = "";
        setDetected(false);
      }
    }
  }, [parseQR, playDetectSound]);

  // Keep ref in sync so the interval always calls the latest scanMarker
  useEffect(() => { scanMarkerRef.current = scanMarker; });

  // ── Start camera ───────────────────────────────────────────────────────────
  const startCamera = useCallback(async (deviceId?: string) => {
    cleanupRef.current?.();
    setStatus("loading");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: deviceId
          ? { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
          : { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      const devices = await navigator.mediaDevices.enumerateDevices();
      setCameras(devices.filter((d) => d.kind === "videoinput"));

      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();

      const canvas = canvasRef.current!;
      canvas.width  = video.videoWidth  || 1280;
      canvas.height = video.videoHeight || 720;
      setActiveCameraId(stream.getVideoTracks()[0].getSettings().deviceId);
      setStatus("active");

      const scanInterval = setInterval(() => scanMarkerRef.current(), 120);
      animRef.current = requestAnimationFrame(drawFrame);

      const cleanup = () => {
        clearInterval(scanInterval);
        cancelAnimationFrame(animRef.current);
        stream.getTracks().forEach((t) => t.stop());
      };
      cleanupRef.current = cleanup;
      return cleanup;
    } catch {
      setStatus("error");
    }
  }, [drawFrame]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    startCamera().then((fn) => { cleanup = fn; });
    return () => { cleanup?.(); cancelAnimationFrame(animRef.current); };
  }, [startCamera]);

  return (
    <main id="main-content" className="proyector-root relative w-screen h-screen bg-black overflow-hidden">
      <video ref={videoRef} className="hidden" playsInline muted />
      <canvas ref={canvasRef} className="w-full h-full object-cover" />

      {status === "loading" && (
        <div className="absolute inset-0 bg-vu-bg flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-vu-accent border-t-transparent animate-spin" />
            <p className="text-vu-textSecondary text-sm">Activando cámara...</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 bg-vu-bg flex items-center justify-center px-8">
          <div className="text-center flex flex-col gap-4 max-w-sm">
            <p className="text-vu-textPrimary text-lg font-medium">Sin acceso a la cámara</p>
            <p className="text-vu-textSecondary text-sm">Permitir acceso e intentar de nuevo.</p>
            <button onClick={() => startCamera()} className="px-6 py-3 bg-vu-accent text-vu-bg rounded-xl text-sm font-medium">
              Reintentar
            </button>
          </div>
        </div>
      )}

      {status === "active" && detected && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-vu-accent/90 text-vu-bg text-xs font-medium px-4 py-2 rounded-full">
          {demoMode ? "🎭 Modo demo activo" : "Código detectado"}
        </div>
      )}

      {/* Mago de Oz hint — only shown when no session active */}
      {status === "active" && !detected && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white/70 text-xs bg-black/35 px-3 py-1.5 rounded-full backdrop-blur-sm">
          Presioná D para modo demo
        </div>
      )}

      {status === "active" && cameras.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {cameras.map((cam, i) => (
            <button
              key={cam.deviceId}
              onClick={() => startCamera(cam.deviceId)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCameraId === cam.deviceId
                  ? "bg-vu-accent text-vu-bg"
                  : "bg-vu-bg/70 text-vu-textSecondary border border-vu-bgAlt"
              }`}
            >
              {cam.label || `Cámara ${i + 1}`}
            </button>
          ))}
        </div>
      )}

      <div className="absolute bottom-5 right-5 text-vu-textSecondary/30 text-xs">VidaÚtil</div>
    </main>
  );
}
