import React, { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PitchMeter } from "./PitchMeter"
import { usePitchDetector } from "@/hooks/usePitchDetector"
import { Mic, MicOff, ChevronRight, RotateCcw, CheckCircle2 } from "lucide-react"

interface PracticeTarget {
  note: string
  octave: number
  string?: string
}

const OPEN_STRINGS: PracticeTarget[] = [
  { note: "E", octave: 2, string: "6弦" },
  { note: "A", octave: 2, string: "5弦" },
  { note: "D", octave: 3, string: "4弦" },
  { note: "G", octave: 3, string: "3弦" },
  { note: "B", octave: 3, string: "2弦" },
  { note: "E", octave: 4, string: "1弦" },
]

const C_MAJOR_SCALE: PracticeTarget[] = [
  { note: "C", octave: 3 },
  { note: "D", octave: 3 },
  { note: "E", octave: 3 },
  { note: "F", octave: 3 },
  { note: "G", octave: 3 },
  { note: "A", octave: 3 },
  { note: "B", octave: 3 },
  { note: "C", octave: 4 },
]

const A_MINOR_PENTATONIC: PracticeTarget[] = [
  { note: "A", octave: 3 },
  { note: "C", octave: 4 },
  { note: "D", octave: 4 },
  { note: "E", octave: 4 },
  { note: "G", octave: 4 },
  { note: "A", octave: 4 },
]

const LITTLE_STAR: PracticeTarget[] = [
  { note: "C", octave: 4 },
  { note: "C", octave: 4 },
  { note: "G", octave: 4 },
  { note: "G", octave: 4 },
  { note: "A", octave: 4 },
  { note: "A", octave: 4 },
  { note: "G", octave: 4 },
]

type ExerciseMode = "open-strings" | "c-major" | "a-minor-pentatonic" | "little-star" | "free"

interface ExerciseConfig {
  id: ExerciseMode
  name: string
  description: string
  targets: PracticeTarget[]
}

const EXERCISES: ExerciseConfig[] = [
  {
    id: "open-strings",
    name: "空弦音准",
    description: "依次弹奏6根空弦，核对每根弦的音准",
    targets: OPEN_STRINGS,
  },
  {
    id: "c-major",
    name: "C大调音阶",
    description: "C大调上行音阶，从低音C到高音C",
    targets: C_MAJOR_SCALE,
  },
  {
    id: "a-minor-pentatonic",
    name: "A小调五声音阶",
    description: "最常用的吉他音阶，适合Solo练习",
    targets: A_MINOR_PENTATONIC,
  },
  {
    id: "little-star",
    name: "小星星",
    description: "经典入门曲目，简单旋律音准核对",
    targets: LITTLE_STAR,
  },
]

export const PitchPractice: React.FC = () => {
  const { isListening, pitchData, error, start, stop } = usePitchDetector()
  const [mode, setMode] = useState<ExerciseMode>("open-strings")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completedNotes, setCompletedNotes] = useState<Set<number>>(new Set())
  const [lastStablePitch, setLastStablePitch] = useState<string | null>(null)
  const [, setStableCount] = useState(0)

  const currentExercise = EXERCISES.find((e) => e.id === mode)
  const targets = currentExercise?.targets ?? []
  const currentTarget = targets[currentIndex]
  const isFreeMode = mode === "free"

  // Detect stable pitch and auto-advance
  useEffect(() => {
    if (!pitchData || !currentTarget || isFreeMode) return

    const key = `${pitchData.noteName}${pitchData.octave}`
    const targetKey = `${currentTarget.note}${currentTarget.octave}`

    if (key === targetKey && Math.abs(pitchData.cents) <= 15) {
      if (lastStablePitch === key) {
        setStableCount((prev) => {
          const next = prev + 1
          if (next >= 8) {
            // Note held long enough
            setCompletedNotes((prevSet) => new Set([...prevSet, currentIndex]))
            if (currentIndex < targets.length - 1) {
              setCurrentIndex((prev) => prev + 1)
            }
            return 0
          }
          return next
        })
      } else {
        setLastStablePitch(key)
        setStableCount(1)
      }
    } else {
      setLastStablePitch(null)
      setStableCount(0)
    }
  }, [pitchData, currentTarget, lastStablePitch, currentIndex, targets.length, isFreeMode])

  const handleReset = useCallback(() => {
    setCurrentIndex(0)
    setCompletedNotes(new Set())
    setLastStablePitch(null)
    setStableCount(0)
  }, [])

  const handleNext = useCallback(() => {
    if (currentIndex < targets.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }, [currentIndex, targets.length])

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }, [currentIndex])

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      {/* Mode selector */}
      <div className="grid grid-cols-5 gap-1.5">
        {[
          ...EXERCISES.map((e) => ({ id: e.id, label: e.name })),
          { id: "free" as ExerciseMode, label: "自由检测" },
        ].map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex items-center justify-center py-2.5 px-1 rounded-xl text-[11px] leading-tight font-medium transition-all active:scale-95",
              mode === item.id
                ? "bg-guitar-amber text-guitar-dark"
                : "bg-secondary text-muted-foreground"
            )}
            onClick={() => {
              setMode(item.id)
              handleReset()
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Description */}
      {currentExercise && (
        <p className="text-xs md:text-sm text-muted-foreground">
          {currentExercise.description}
        </p>
      )}

      {/* Mic control */}
      <div className="flex justify-center">
        <Button
          size="lg"
          className={cn(
            "h-14 px-8 rounded-full text-base font-semibold transition-all",
            isListening
              ? "bg-guitar-red hover:bg-guitar-red/90 text-white"
              : "bg-guitar-amber hover:bg-guitar-amber/90 text-guitar-dark shadow-glow"
          )}
          onClick={isListening ? stop : start}
        >
          {isListening ? (
            <>
              <MicOff className="w-5 h-5 mr-2" />
              停止监听
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 mr-2" />
              开始监听
            </>
          )}
        </Button>
      </div>

      {error && (
        <p className="text-xs text-guitar-red text-center">{error}</p>
      )}

      {/* Pitch Meter */}
      <Card>
        <CardContent className="p-6 md:p-8">
          <PitchMeter
            pitchData={pitchData}
            targetNote={currentTarget?.note}
            targetOctave={currentTarget?.octave}
          />
        </CardContent>
      </Card>

      {/* Target note display (for exercise modes) */}
      {!isFreeMode && currentTarget && (
        <Card className="border-guitar-amber/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm md:text-base">目标音符</CardTitle>
              <span className="text-xs text-muted-foreground">
                {currentIndex + 1} / {targets.length}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {/* Progress bar */}
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-guitar-amber rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / targets.length) * 100}%` }}
              />
            </div>

            {/* Target note cards */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {targets.map((target, i) => {
                const isCurrent = i === currentIndex
                const isCompleted = completedNotes.has(i)
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={cn(
                      "flex flex-col items-center min-w-[60px] md:min-w-[72px] py-2 px-2 rounded-lg border transition-all active:scale-95",
                      isCurrent
                        ? "border-guitar-amber bg-guitar-amber/10 text-guitar-amber"
                        : isCompleted
                        ? "border-emerald-400/30 bg-emerald-400/5 text-emerald-400"
                        : "border-border bg-card text-muted-foreground"
                    )}
                  >
                    <span className="text-lg md:text-xl font-bold font-mono">
                      {target.note}
                    </span>
                    <span className="text-[10px] md:text-xs">
                      {target.octave}
                    </span>
                    {target.string && (
                      <span className="text-[10px] text-muted-foreground">
                        {target.string}
                      </span>
                    )}
                    {isCompleted && (
                      <CheckCircle2 className="w-3 h-3 mt-0.5 text-emerald-400" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="ghost"
                size="sm"
                disabled={currentIndex === 0}
                onClick={handlePrev}
              >
                上一个
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-guitar-amber"
                onClick={handleReset}
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                重置
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={currentIndex >= targets.length - 1}
                onClick={handleNext}
              >
                下一个
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion message */}
      {!isFreeMode && completedNotes.size === targets.length && targets.length > 0 && (
        <Card className="border-emerald-400/30 bg-emerald-400/5">
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-emerald-400">练习完成!</h3>
            <p className="text-sm text-muted-foreground mt-1">
              所有音符音准核对通过
            </p>
            <Button
              variant="outline"
              className="mt-3 border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10"
              onClick={handleReset}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              再练一次
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Free mode hint */}
      {isFreeMode && (
        <Card className="border-dashed border-muted">
          <CardContent className="p-4 text-center text-sm text-muted-foreground">
            自由检测模式下，弹奏任意音符即可查看音高和音准
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PitchPractice
