import React from "react"
import { cn } from "@/lib/utils"
import type { PitchData } from "@/hooks/usePitchDetector"

interface PitchMeterProps {
  pitchData: PitchData | null
  targetNote?: string
  targetOctave?: number
  className?: string
}

export const PitchMeter: React.FC<PitchMeterProps> = ({
  pitchData,
  targetNote,
  targetOctave,
  className,
}) => {
  const hasTarget = targetNote !== undefined && targetOctave !== undefined

  let comparison: { match: boolean; diffCents: number; direction: "none" | "in-tune" | "sharp" | "flat" } = { match: false, diffCents: 0, direction: "none" }

  if (hasTarget && pitchData) {
    const targetFreq =
      440 * Math.pow(2, ((targetOctave + 1) * 12 + noteToIndex(targetNote) - 69) / 12)
    if (targetFreq > 0) {
      const detectedMidi = 69 + 12 * Math.log2(pitchData.frequency / 440)
      const targetMidi = 69 + 12 * Math.log2(targetFreq / 440)
      const diffCents = Math.round((detectedMidi - targetMidi) * 100)
      const noteMatch = pitchData.noteName === targetNote && pitchData.octave === targetOctave

      if (noteMatch && Math.abs(diffCents) <= 15) {
        comparison = { match: true, diffCents, direction: "in-tune" }
      } else if (diffCents > 15) {
        comparison = { match: false, diffCents, direction: "sharp" }
      } else if (diffCents < -15) {
        comparison = { match: false, diffCents, direction: "flat" }
      }
    }
  }

  // Gauge visualization: -50 to +50 cents
  const gaugeValue = pitchData ? Math.max(-50, Math.min(50, pitchData.cents)) : 0
  const gaugePercent = ((gaugeValue + 50) / 100) * 100

  const statusColor = comparison.match
    ? "text-emerald-400"
    : comparison.direction === "sharp"
    ? "text-guitar-red"
    : comparison.direction === "flat"
    ? "text-sky-400"
    : "text-muted-foreground"

  const statusBg = comparison.match
    ? "bg-emerald-400"
    : comparison.direction === "sharp"
    ? "bg-guitar-red"
    : comparison.direction === "flat"
    ? "bg-sky-400"
    : "bg-muted-foreground"

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Main note display */}
      <div className="relative flex flex-col items-center">
        <div
          className={cn(
            "text-7xl md:text-8xl font-bold font-mono tabular-nums transition-colors duration-150",
            pitchData ? statusColor : "text-muted-foreground/30"
          )}
        >
          {pitchData ? pitchData.noteName : "—"}
        </div>
        {pitchData && (
          <div className="flex items-baseline gap-1">
            <span className={cn("text-xl font-medium", statusColor)}>
              {pitchData.octave}
            </span>
            <span className="text-xs text-muted-foreground ml-2">
              {pitchData.frequency} Hz
            </span>
          </div>
        )}
      </div>

      {/* Comparison indicator */}
      {hasTarget && (
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-muted-foreground">
            目标: {targetNote}{targetOctave}
          </span>
          {pitchData && (
            <span
              className={cn(
                "text-sm font-bold px-3 py-1 rounded-full transition-colors",
                comparison.match
                  ? "bg-emerald-400/10 text-emerald-400"
                  : comparison.direction === "sharp"
                  ? "bg-guitar-red/10 text-guitar-red"
                  : comparison.direction === "flat"
                  ? "bg-sky-400/10 text-sky-400"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {comparison.match
                ? "音准 ✓"
                : comparison.direction === "sharp"
                ? `偏高 ${comparison.diffCents}¢`
                : comparison.direction === "flat"
                ? `偏低 ${Math.abs(comparison.diffCents)}¢`
                : "弹奏中..."}
            </span>
          )}
        </div>
      )}

      {/* Cents gauge */}
      <div className="w-full max-w-[280px] space-y-1">
        <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
          {/* Center mark */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-foreground/20 -translate-x-1/2 z-10" />
          {/* In-tune zone */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[30%] bg-emerald-400/10 -translate-x-1/2" />
          {/* Indicator */}
          {pitchData && (
            <div
              className={cn(
                "absolute top-0 bottom-0 w-1.5 rounded-full transition-all duration-100",
                statusBg
              )}
              style={{ left: `${gaugePercent}%`, transform: "translateX(-50%)" }}
            />
          )}
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>-50¢</span>
          <span>准</span>
          <span>+50¢</span>
        </div>
      </div>

      {/* Clarity bar */}
      {pitchData && (
        <div className="w-full max-w-[280px] space-y-1">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>音量</span>
            <span>{pitchData.clarity}%</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-guitar-amber/60 rounded-full transition-all duration-100"
              style={{ width: `${pitchData.clarity}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function noteToIndex(note: string): number {
  const map: Record<string, number> = {
    C: 0, "C#": 1, Db: 1,
    D: 2, "D#": 3, Eb: 3,
    E: 4,
    F: 5, "F#": 6, Gb: 6,
    G: 7, "G#": 8, Ab: 8,
    A: 9, "A#": 10, Bb: 10,
    B: 11,
  }
  return map[note] ?? 0
}

export default PitchMeter
