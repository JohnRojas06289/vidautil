"use client";
import { useEffect, useRef } from "react";

// ARUCO_MIP_36h12 — js-aruco2 default dictionary (nBits=36, 6×6 inner grid)
// Bit patterns precomputed from codeList hex values, MSB-first, row-major.
// Each array has 36 elements: Row0=[0..5], Row1=[6..11], ..., Row5=[30..35]
const ARUCO_MIP: Record<number, number[]> = {
  0: [1,1,0,1,0,0,1,0,1,0,1,1,0,1,1,0,0,0,1,1,1,0,1,0,0,0,0,0,1,0,0,1,1,1,0,1],
  1: [0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,1,0,1,0,0,1,1,1,0,0,1,0,1],
  2: [0,0,0,1,0,0,1,0,0,0,0,0,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,0,1,1,1,0,0,1,0],
  3: [1,1,1,1,1,1,1,1,1,0,0,0,1,0,1,0,1,1,0,1,0,1,1,0,1,1,0,0,1,0,1,1,0,1,0,0],
  4: [1,0,0,0,0,1,0,1,1,1,0,1,1,0,1,0,1,0,0,1,1,0,1,1,1,1,0,0,0,1,0,0,1,0,0,1],
  5: [1,0,1,1,0,1,0,0,0,1,1,0,0,0,0,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,0,1,1,1,0,0],
  6: [0,1,1,0,1,1,0,1,1,0,1,1,0,1,0,1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,1,0,0,1,1],
  7: [0,1,0,1,0,0,1,0,0,1,0,0,1,0,0,0,1,1,0,0,0,1,0,1,0,1,0,0,0,0,0,1,1,1,1,1],
  8: [0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,1,0,0,1,1,0,1,0,0,0,1,0,1,0,0,0,0,0,0,1,1],
  9: [1,0,0,0,1,1,1,0,1,0,1,0,0,1,0,0,0,1,1,0,0,0,1,0,1,1,1,0,1,1,0,0,1,1,1,0],
};

interface Props {
  markerId: number;
  size?: number;
}

export function ArucoMarker({ markerId, size = 280 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const bits = ARUCO_MIP[markerId] ?? ARUCO_MIP[0];

    const cells = 8; // 6 data + 1 border each side = 8×8 total
    const cell = size / cells;

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    // Black border (outer ring)
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, size, cell);           // top
    ctx.fillRect(0, size - cell, size, cell); // bottom
    ctx.fillRect(0, 0, cell, size);           // left
    ctx.fillRect(size - cell, 0, cell, size); // right

    // Inner 6×6 data bits
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        const bit = bits[row * 6 + col];
        ctx.fillStyle = bit === 1 ? "#000000" : "#ffffff";
        ctx.fillRect(
          (col + 1) * cell,
          (row + 1) * cell,
          cell,
          cell
        );
      }
    }
  }, [markerId, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="rounded-lg"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
