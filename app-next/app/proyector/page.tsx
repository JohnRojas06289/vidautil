"use client";
import { useEffect, useRef, useState, useCallback } from "react";

interface QRPayload {
  m: string;   // model
  y: number;   // years
  co2: number; // totalAvoidedCO2
  af: number;  // annualFootprint
  cost: number;
  months: number;
  medal: "bronze" | "silver" | "gold";
  km: number;
  trees: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  dark: boolean;
}

const MEDAL_LABEL = { bronze: "Bronce", silver: "Plata", gold: "Oro" };
const MEDAL_COLOR = { bronze: "#D4A574", silver: "#D3D1C7", gold: "#F4D67E" };

function decodeQRData(raw: string): QRPayload | null {
  try {
    const url = new URL(raw);
    const d = url.searchParams.get("d");
    if (!d) return null;
    const p = JSON.parse(atob(d));
    // Normalize short keys to full keys
    return {
      m: p.m,
      y: p.y,
      co2: p.c ?? p.co2,
      af: p.a ?? p.af,
      cost: p.cost ?? 0,
      months: p.months ?? 0,
      medal: p.x === "g" ? "gold" : p.x === "s" ? "silver" : p.medal ?? "bronze",
      km: p.km ?? 0,
      trees: p.trees ?? 0,
    };
  } catch {
    return null;
  }
}

export default function ProyectorPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const dataRef = useRef<QRPayload | null>(null);
  const qrBoundsRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null);
  const lostFramesRef = useRef<number>(0);
  const animFrameRef = useRef<number>(0);
  const [status, setStatus] = useState<"idle" | "loading" | "active" | "error">("idle");
  const [detected, setDetected] = useState(false);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [activeCameraId, setActiveCameraId] = useState<string | undefined>(undefined);
  const cleanupRef = useRef<(() => void) | undefined>(undefined);

  const spawnParticles = useCallback((cx: number, topY: number, af: number) => {
    const count = Math.round(Math.min(Math.max(af / 6, 2), 8));
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x: cx + (Math.random() - 0.5) * 60,
        y: topY + Math.random() * 10,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -(Math.random() * 1.8 + 0.8),
        life: Math.random() * 120 + 100,
        maxLife: 220,
        size: Math.random() * 28 + 16,
        dark: false,
      });
    }
    // Cap particle count
    if (particlesRef.current.length > 400) {
      particlesRef.current = particlesRef.current.slice(-400);
    }
  }, []);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // Mirror the video (front-facing feel)
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -W, 0, W, H);
    ctx.restore();

    const bounds = qrBoundsRef.current;
    const data = dataRef.current;

    if (bounds && data) {
      const cx = W - (bounds.x + bounds.w / 2); // mirrored X
      const topY = bounds.y - bounds.h * 0.6;

      // Spawn new particles every frame
      spawnParticles(cx, topY, data.af);

      // Draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx + (Math.random() - 0.5) * 0.4;
        p.y += p.vy;
        p.vy *= 0.99;
        p.life--;

        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        const alpha = Math.min(p.life / p.maxLife, 0.5) * 0.8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(93, 202, 165, ${alpha})`;
        ctx.fill();
      }

      // Phone outline around QR
      const px = W - (bounds.x + bounds.w / 2);
      const py = bounds.y + bounds.h / 2;
      const pw = bounds.w * 1.4;
      const ph = bounds.h * 2.8;
      ctx.strokeStyle = "rgba(93, 202, 165, 0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(px - pw / 2, py - ph / 2, pw, ph, 12);
      ctx.stroke();

      // QR corner highlights
      ctx.strokeStyle = "#5DCAA5";
      ctx.lineWidth = 3;
      const corners = [
        { x: W - bounds.x, y: bounds.y },
        { x: W - (bounds.x + bounds.w), y: bounds.y },
        { x: W - bounds.x, y: bounds.y + bounds.h },
        { x: W - (bounds.x + bounds.w), y: bounds.y + bounds.h },
      ];
      const cSize = 18;
      for (const c of corners) {
        const sx = c.x < W / 2 ? 1 : -1;
        const sy = c.y < H / 2 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y + sy * cSize);
        ctx.lineTo(c.x, c.y);
        ctx.lineTo(c.x + sx * cSize, c.y);
        ctx.stroke();
      }

      // HUD — CO2 counter top-right
      ctx.fillStyle = "rgba(4, 52, 44, 0.75)";
      ctx.beginPath();
      ctx.roundRect(W - 220, 20, 200, 100, 12);
      ctx.fill();

      ctx.fillStyle = "#5DCAA5";
      ctx.font = "bold 42px system-ui";
      ctx.textAlign = "right";
      ctx.fillText(String(data.co2), W - 28, 78);

      ctx.fillStyle = "#9FE1CB";
      ctx.font = "13px system-ui";
      ctx.fillText("kg CO₂ evitados", W - 28, 100);

      // Medal badge bottom-left
      const mc = MEDAL_COLOR[data.medal];
      ctx.fillStyle = "rgba(4, 52, 44, 0.75)";
      ctx.beginPath();
      ctx.roundRect(20, H - 110, 190, 90, 12);
      ctx.fill();

      ctx.fillStyle = mc;
      ctx.font = "bold 16px system-ui";
      ctx.textAlign = "left";
      ctx.fillText(`Medalla ${MEDAL_LABEL[data.medal]}`, 36, H - 78);

      ctx.fillStyle = "#E1F5EE";
      ctx.font = "13px system-ui";
      ctx.fillText(data.m, 36, H - 58);

      ctx.fillStyle = "#9FE1CB";
      ctx.font = "12px system-ui";
      ctx.fillText(`${data.y} ${data.y === 1 ? "año" : "años"} contigo`, 36, H - 38);
    } else {
      // Fade out particles when QR is lost
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.life -= 3;
        if (p.life <= 0) { particlesRef.current.splice(i, 1); continue; }
        const alpha = Math.min(p.life / p.maxLife, 0.5) * 0.8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(93, 202, 165, ${alpha})`;
        ctx.fill();
      }

      // Instruction overlay
      ctx.fillStyle = "rgba(4, 52, 44, 0.6)";
      ctx.fillRect(0, H / 2 - 36, W, 56);
      ctx.fillStyle = "#E1F5EE";
      ctx.font = "18px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Apunta la cámara al código del celular", W / 2, H / 2 + 2);
    }

    animFrameRef.current = requestAnimationFrame(drawFrame);
  }, [spawnParticles]);

  const scanQR = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || video.readyState < 2) return;

    // Use offscreen canvas for QR scanning (non-mirrored)
    const offscreen = document.createElement("canvas");
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const octx = offscreen.getContext("2d")!;
    octx.drawImage(video, 0, 0, offscreen.width, offscreen.height);
    const imageData = octx.getImageData(0, 0, offscreen.width, offscreen.height);

    import("jsqr").then(({ default: jsQR }) => {
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "attemptBoth",
      });

      if (code) {
        const decoded = decodeQRData(code.data);
        if (decoded) {
          dataRef.current = decoded;
          const tl = code.location.topLeftCorner;
          const br = code.location.bottomRightCorner;
          const newBounds = {
            x: tl.x,
            y: tl.y,
            w: br.x - tl.x,
            h: br.y - tl.y,
          };
          // Lerp bounds for smoother tracking
          if (qrBoundsRef.current) {
            const k = 0.4;
            qrBoundsRef.current = {
              x: qrBoundsRef.current.x + (newBounds.x - qrBoundsRef.current.x) * k,
              y: qrBoundsRef.current.y + (newBounds.y - qrBoundsRef.current.y) * k,
              w: qrBoundsRef.current.w + (newBounds.w - qrBoundsRef.current.w) * k,
              h: qrBoundsRef.current.h + (newBounds.h - qrBoundsRef.current.h) * k,
            };
          } else {
            qrBoundsRef.current = newBounds;
          }
          setDetected(true);
        }
      } else {
        // Don't immediately clear — keep last position for 10 frames
        if (qrBoundsRef.current) {
          lostFramesRef.current = (lostFramesRef.current ?? 0) + 1;
          if (lostFramesRef.current > 10) {
            qrBoundsRef.current = null;
            setDetected(false);
          }
        }
      }
    });
  }, []);

  const startCamera = useCallback(async (deviceId?: string) => {
    cleanupRef.current?.();
    setStatus("loading");
    try {
      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
          : { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      // Enumerate cameras after permission is granted
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((d) => d.kind === "videoinput");
      setCameras(videoDevices);
      const activeTrack = stream.getVideoTracks()[0];
      setActiveCameraId(activeTrack.getSettings().deviceId);

      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();

      const canvas = canvasRef.current!;
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;

      setStatus("active");

      // QR scan interval — 100ms for more responsive tracking
      const scanInterval = setInterval(scanQR, 100);
      animFrameRef.current = requestAnimationFrame(drawFrame);

      const cleanup = () => {
        clearInterval(scanInterval);
        cancelAnimationFrame(animFrameRef.current);
        stream.getTracks().forEach((t) => t.stop());
      };
      cleanupRef.current = cleanup;
      return cleanup;
    } catch {
      setStatus("error");
    }
  }, [drawFrame, scanQR]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    startCamera().then((fn) => { cleanup = fn; });
    return () => {
      cleanup?.();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [startCamera]);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      <video ref={videoRef} className="hidden" playsInline muted />
      <canvas ref={canvasRef} className="w-full h-full object-cover" />

      {/* Status overlays */}
      {status === "loading" && (
        <div className="absolute inset-0 bg-vu-bg flex items-center justify-center">
          <div className="text-center flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-vu-accent border-t-transparent animate-spin" />
            <p className="text-vu-textSecondary text-sm">Activando cámara...</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 bg-vu-bg flex items-center justify-center px-8">
          <div className="text-center flex flex-col items-center gap-4 max-w-sm">
            <p className="text-vu-textPrimary text-lg font-medium">Sin acceso a la cámara</p>
            <p className="text-vu-textSecondary text-sm">
              Permite el acceso a la cámara en el navegador e intenta de nuevo.
            </p>
            <button
              onClick={() => startCamera()}
              className="px-6 py-3 bg-vu-accent text-vu-bg rounded-xl text-sm font-medium"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      )}

      {/* Detected badge */}
      {status === "active" && detected && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-vu-accent/90 text-vu-bg text-xs font-medium px-4 py-2 rounded-full">
          Celular detectado
        </div>
      )}

      {/* Camera selector */}
      {status === "active" && cameras.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {cameras.map((cam, i) => (
            <button
              key={cam.deviceId}
              onClick={() => { setActiveCameraId(cam.deviceId); startCamera(cam.deviceId); }}
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

      {/* VidaÚtil watermark */}
      {status === "active" && (
        <div className="absolute bottom-4 right-4 text-vu-textSecondary/40 text-xs">
          VidaÚtil
        </div>
      )}
    </div>
  );
}
