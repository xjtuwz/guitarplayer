import React, { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Play, Pause, Plus, Minus } from "lucide-react"

interface MetronomeProps {
  initialBpm?: number
  className?: string
}

export const Metronome: React.FC<MetronomeProps> = ({
  initialBpm = 80,
  className,
}) => {
  const [bpm, setBpm] = useState(initialBpm)
  const [isPlaying, setIsPlaying] = useState(false)
  const [beat, setBeat] = useState(0)
  const [beatsPerMeasure] = useState(4)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const playClick = useCallback(
    (isAccent: boolean) => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext()
      }
      const ctx = audioCtxRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.frequency.value = isAccent ? 1000 : 600
      gain.gain.setValueAtTime(isAccent ? 0.4 : 0.2, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.1)
    },
    []
  )

  useEffect(() => {
    if (isPlaying) {
      const interval = (60 / bpm) * 1000
      timerRef.current = setInterval(() => {
        setBeat((prev) => {
          const next = (prev + 1) % beatsPerMeasure
          playClick(next === 0)
          return next
        })
      }, interval)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      setBeat(0)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isPlaying, bpm, beatsPerMeasure, playClick])

  const adjustBpm = (delta: number) => {
    setBpm((prev) => Math.max(40, Math.min(240, prev + delta)))
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 flex flex-col items-center gap-4",
        className
      )}
    >
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        节拍器
      </h3>

      {/* Beat indicators */}
      <div className="flex gap-3">
        {Array.from({ length: beatsPerMeasure }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-4 h-4 rounded-full transition-all duration-100",
              beat === i
                ? i === 0
                  ? "bg-guitar-amber scale-125 shadow-glow"
                  : "bg-guitar-amber/70 scale-110"
                : "bg-muted"
            )}
          />
        ))}
      </div>

      {/* BPM Display */}
      <div className="text-5xl font-bold font-mono text-foreground tabular-nums">
        {bpm}
        <span className="text-lg font-normal text-muted-foreground ml-1">BPM</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => adjustBpm(-5)}
          className="w-10 h-10 rounded-full border border-border bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200",
            isPlaying
              ? "bg-guitar-red hover:bg-guitar-red/90 shadow-lg"
              : "bg-guitar-amber hover:bg-guitar-amber/90 shadow-glow"
          )}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-guitar-dark ml-0.5" />
          )}
        </button>

        <button
          onClick={() => adjustBpm(5)}
          className="w-10 h-10 rounded-full border border-border bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Slider */}
      <input
        type="range"
        min="40"
        max="240"
        value={bpm}
        onChange={(e) => setBpm(Number(e.target.value))}
        className="w-full max-w-[200px] accent-guitar-amber cursor-pointer"
      />
    </div>
  )
}

export default Metronome
