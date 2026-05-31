"use client";

interface Props {
  markerId: number;
}

export function FiducialMarker({ markerId }: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 inline-flex flex-col items-center gap-3 shadow-lg">
      <div
        style={{
          width: 280,
          height: 280,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/markers/marker_${markerId}.svg`}
          alt={`Marker fiducial ID ${markerId}`}
          width={280}
          height={280}
          style={{ objectFit: "contain" }}
          onError={(e) => {
            const img = e.currentTarget;
            img.style.display = "none";
            const placeholder = img.nextElementSibling as HTMLElement;
            if (placeholder) placeholder.style.display = "flex";
          }}
        />
        <div
          style={{
            display: "none",
            width: 280,
            height: 280,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#f9f9f9",
            border: "2px dashed #ccc",
            borderRadius: 8,
            gap: 12,
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <div style={{ fontSize: 64, lineHeight: 1 }}>◼◻◼◻◼</div>
          <div style={{ fontSize: 11, color: "#888", textAlign: "center" }}>
            Placeholder — reemplazar con
            <br />
            marker real ID {markerId}
          </div>
        </div>
      </div>
      <span style={{ fontSize: 11, color: "#aaa", fontFamily: "monospace" }}>
        marker #{markerId}
      </span>
    </div>
  );
}
