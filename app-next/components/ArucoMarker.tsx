"use client";
import { useEffect, useRef } from "react";

// ARUCO_MIP_36h12 dictionary — js-aruco2 default (nBits=36, 6×6 inner grid, 8×8 total)
// codeList values are 36-bit hex numbers stored MSB-first, row-major.
// BigInt is required because values exceed 2^32.
function hexToBits36(hex: bigint): number[] {
  const bits: number[] = [];
  for (let i = 35; i >= 0; i--) bits.push(Number((hex >> BigInt(i)) & 1n));
  return bits;
}

const ARUCO_MIP: Record<number, number[]> = {
  0: hexToBits36(0xd2b63a09dn),
  1: hexToBits36(0x6001134e5n),
  2: hexToBits36(0x1206fbe72n),
  3: hexToBits36(0xff8ad6cb4n),
  4: hexToBits36(0x85da9bc49n),
  5: hexToBits36(0xb461afe9cn),
  6: hexToBits36(0x6db51fe13n),
  7: hexToBits36(0x5248c541fn),
  8: hexToBits36(0x8f34503n),
  9: hexToBits36(0x8ea462ecen),
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

    const cells = 8; // 6 data + 1 border each side
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
