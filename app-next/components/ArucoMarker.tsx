"use client";
import { useEffect, useRef } from "react";

// 4x4_50 ArUco dictionary — bit patterns for IDs 0-9
// Each entry is 16 bits (4x4 inner grid), row-major
const ARUCO_4X4: Record<number, number[]> = {
  0:  [0,1,0,0, 0,1,1,0, 0,0,1,0, 0,0,0,1],
  1:  [1,1,0,1, 1,0,0,0, 0,1,0,0, 1,1,0,1],
  2:  [0,0,1,1, 0,0,1,0, 1,0,0,1, 0,0,1,1],
  3:  [1,0,1,0, 0,1,0,1, 1,0,1,0, 0,1,0,1],
  4:  [1,1,0,0, 1,0,1,1, 0,1,1,0, 0,0,1,1],
  5:  [0,1,1,0, 1,1,0,0, 0,0,1,1, 0,1,0,1],
  6:  [1,0,0,1, 0,0,1,1, 1,1,0,0, 1,0,0,1],
  7:  [0,0,1,0, 1,0,0,1, 0,1,1,0, 1,1,0,0],
  8:  [1,1,1,0, 0,1,0,0, 1,0,1,1, 0,0,0,1],
  9:  [0,1,0,1, 1,0,1,0, 0,1,0,1, 1,0,1,0],
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
    const bits = ARUCO_4X4[markerId] ?? ARUCO_4X4[0];

    const cells = 6; // 4 data + 1 border each side
    const cell = size / cells;

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    // Black border (outer ring)
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, size, cell);              // top
    ctx.fillRect(0, size - cell, size, cell);    // bottom
    ctx.fillRect(0, 0, cell, size);              // left
    ctx.fillRect(size - cell, 0, cell, size);    // right

    // Inner 4x4 data bits
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const bit = bits[row * 4 + col];
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
