import React, { useState } from "react"
import { cn } from "@/lib/utils"

interface ChordDiagramProps {
  chordName: string
  positions: (number | null)[]
  barre?: { fret: number; from: number; to: number }
  className?: string
}

const STRING_LABELS = ["E", "A", "D", "G", "B", "e"]

export const ChordDiagram: React.FC<ChordDiagramProps> = ({
  chordName,
  positions,
  barre,
  className,
}) => {
  const [activeString, setActiveString] = useState<number | null>(null)
  const maxFret = Math.max(1, ...positions.filter((p): p is number => p !== null))
  const firstFret = Math.min(...positions.filter((p): p is number => p !== null && p > 0))
  const displayStart = firstFret > 3 ? firstFret - 1 : 0
  const displayRows = Math.min(5, maxFret - displayStart + 2)

  return (
    <div className={cn("flex flex-col items-center w-full", className)}>
      <h4 className="text-lg font-bold text-guitar-amber mb-3">{chordName}</h4>
      <div className="relative w-full max-w-[200px]">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 180 ${displayRows * 28 + 40}`}
          className="select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* String labels */}
          {STRING_LABELS.map((label, i) => (
            <text
              key={`label-${i}`}
              x={15 + i * 30}
              y={20}
              textAnchor="middle"
              className="fill-muted-foreground text-xs"
              style={{ fontSize: "12px", fontFamily: "Inter, sans-serif" }}
            >
              {label}
            </text>
          ))}

          {/* Nut or fret number */}
          {displayStart === 0 ? (
            <rect x="10" y="28" width="160" height="6" rx="2" fill="hsl(var(--foreground))" opacity="0.8" />
          ) : (
            <text
              x="6"
              y="42"
              textAnchor="middle"
              className="fill-guitar-amber"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              {displayStart + 1}
            </text>
          )}

          {/* Fret lines */}
          {Array.from({ length: displayRows }).map((_, i) => (
            <line
              key={`fret-${i}`}
              x1="10"
              y1={34 + i * 28}
              x2="170"
              y2={34 + i * 28}
              stroke="hsl(var(--foreground))"
              strokeOpacity="0.3"
              strokeWidth="1"
            />
          ))}

          {/* Strings */}
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={`string-${i}`}
              x1={15 + i * 30}
              y1="34"
              x2={15 + i * 30}
              y2={34 + (displayRows - 1) * 28}
              stroke="hsl(var(--foreground))"
              strokeOpacity={0.15 + (5 - i) * 0.05}
              strokeWidth={1 + (5 - i) * 0.3}
            />
          ))}

          {/* Barre */}
          {barre && (
            <rect
              x={10 + barre.from * 30}
              y={26 + (barre.fret - displayStart - 1) * 28}
              width={(barre.to - barre.from) * 30}
              height="10"
              rx="5"
              fill="hsl(var(--guitar-red))"
              opacity="0.7"
            />
          )}

          {/* Finger positions */}
          {positions.map((fret, i) => {
            if (fret === null) {
              return (
                <text
                  key={`mute-${i}`}
                  x={15 + i * 30}
                  y={22}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  style={{ fontSize: "14px" }}
                >
                  ×
                </text>
              )
            }
            if (fret === 0) {
              return (
                <circle
                  key={`open-${i}`}
                  cx={15 + i * 30}
                  cy={22}
                  r="4"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth="1.5"
                  fill="none"
                />
              )
            }
            const row = fret - displayStart - 1
            return (
              <g key={`fret-${i}`}>
                <circle
                  cx={15 + i * 30}
                  cy={48 + row * 28}
                  r="11"
                  fill={activeString === i ? "hsl(var(--guitar-amber))" : "hsl(var(--guitar-red))"}
                  className="cursor-pointer transition-all duration-200"
                  onClick={() => setActiveString(activeString === i ? null : i)}
                  style={{ filter: activeString === i ? "brightness(1.3)" : "none" }}
                />
                <text
                  x={15 + i * 30}
                  y={52 + row * 28}
                  textAnchor="middle"
                  className="fill-white"
                  style={{ fontSize: "11px", fontWeight: "bold", pointerEvents: "none" }}
                >
                  {fret}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
      {activeString !== null && (
        <p className="text-xs text-guitar-amber mt-2 animate-fade-in">
          {STRING_LABELS[activeString]}弦第{positions[activeString]}品
        </p>
      )}
    </div>
  )
}

export default ChordDiagram
