"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import type { SessionData } from "@/app/api/session/route";

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
  const lastMarkerRef  = useRef<number>(-1);
  const cleanupRef     = useRef<(() => void) | undefined>(undefined);

  const [status, setStatus]           = useState<"loading" | "active" | "error">("loading");
  const [detected, setDetected]       = useState(false);
  const [cameras, setCameras]         = useState<MediaDeviceInfo[]>([]);
  const [activeCameraId, setActiveCameraId] = useState<string | undefined>();

  // ── Fetch session when new marker is detected ──────────────────────────────
  const fetchSession = useCallback(async (markerId: number) => {
    try {
      const res = await fetch(`/api/session?markerId=${markerId}`);
      const data = await res.json();
      if (data.ok) sessionRef.current = data.session;
    } catch { /* silent */ }
  }, []);

  // ── Particle helpers ───────────────────────────────────────────────────────
  const spawnParticles = useCallback((cx: number, topY: number, af: number) => {
    const count = Math.round(Math.min(Math.max(af / 5, 3), 10));
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x: cx + (Math.random() - 0.5) * 70,
        y: topY + Math.random() * 10,
        vx: (Math.random() - 0.5) * 1.4,
        vy: -(Math.random() * 2 + 0.8),
        life: Math.random() * 130 + 100,
        maxLife: 230,
        size: Math.random() * 32 + 18,
      });
    }
    if (particlesRef.current.length > 500)
      particlesRef.current = particlesRef.current.slice(-500);
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
      const top = bounds.y - bounds.h * 0.5;

      spawnParticles(cx, top, session.annualFootprint);

      // Draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx + (Math.random() - 0.5) * 0.4;
        p.y += p.vy;
        p.vy *= 0.99;
        p.life--;
        if (p.life <= 0) { particlesRef.current.splice(i, 1); continue; }
        const alpha = Math.min(p.life / p.maxLife, 0.55);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(93,202,165,${alpha})`;
        ctx.fill();
      }

      // Phone silhouette
      const ph = bounds.h * 3;
      const pw = bounds.w * 1.3;
      ctx.strokeStyle = "rgba(93,202,165,0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cx - pw / 2, bounds.y + bounds.h / 2 - ph / 2, pw, ph, 14);
      ctx.stroke();

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
        p.life -= 4;
        if (p.life <= 0) { particlesRef.current.splice(i, 1); continue; }
        const alpha = Math.min(p.life / p.maxLife, 0.55);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(93,202,165,${alpha})`;
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

  // ── ArUco scan loop ────────────────────────────────────────────────────────
  const scanMarker = useCallback(() => {
    const canvas = canvasRef.current;
    const video  = videoRef.current;
    if (!canvas || !video || video.readyState < 2) return;

    const off = document.createElement("canvas");
    off.width = canvas.width; off.height = canvas.height;
    const octx = off.getContext("2d")!;
    octx.drawImage(video, 0, 0, off.width, off.height);
    const imageData = octx.getImageData(0, 0, off.width, off.height);

    import("js-aruco2").then(({ AR }) => {
      const detector = new AR.Detector();
      const markers  = detector.detect(imageData);

      if (markers.length > 0) {
        const m = markers[0];
        const xs = m.corners.map((c: {x:number}) => c.x);
        const ys = m.corners.map((c: {y:number}) => c.y);
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

        // Only handle IDs we actually assign (0-9); ignore false positives from environment
        if (m.id >= 0 && m.id <= 9 && m.id !== lastMarkerRef.current) {
          lastMarkerRef.current = m.id;
          fetchSession(m.id);
        }

        lostFramesRef.current = 0;
        setDetected(true);
      } else {
        lostFramesRef.current++;
        if (lostFramesRef.current > 12) {
          markerBoundsRef.current = null;
          lastMarkerRef.current   = -1;
          setDetected(false);
        }
      }
    });
  }, [fetchSession]);

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

      const scanInterval = setInterval(scanMarker, 120);
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
  }, [drawFrame, scanMarker]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    startCamera().then((fn) => { cleanup = fn; });
    return () => { cleanup?.(); cancelAnimationFrame(animRef.current); };
  }, [startCamera]);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
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
          Código detectado
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
    </div>
  );
}
