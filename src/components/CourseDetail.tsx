import React, { useState, useRef, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tablature } from "./Tablature"
import { ChordDiagram } from "./ChordDiagram"
import { Metronome } from "./Metronome"
import { useChordPlayer } from "@/hooks/useChordPlayer"
import type { Course, Exercise, TabContent, TechniqueContent, ScaleContent, ChordContent } from "@/data/courses"
import { CheckCircle2, Lock, BookOpen, Dumbbell, ArrowLeft, Play, Square } from "lucide-react"

// Extract playable notes from tab/scale data (column by column, left to right)
function extractTabNotes(strings: (number | null)[][]): { stringIndex: number; fret: number; colIndex: number }[] {
  const notes: { stringIndex: number; fret: number; colIndex: number }[] = []
  if (strings.length === 0) return notes
  const maxCols = Math.max(...strings.map(s => s.length))

  for (let col = 0; col < maxCols; col++) {
    const colNotes: { stringIndex: number; fret: number; colIndex: number }[] = []
    for (let row = 0; row < strings.length; row++) {
      const fret = strings[row]?.[col]
      if (fret !== null && fret !== undefined) {
        colNotes.push({ stringIndex: row, fret, colIndex: col })
      }
    }
    // If a column has multiple notes (chord), add them all; they'll play as one beat
    notes.push(...colNotes)
  }
  return notes
}

// Playback hook for tab/scale exercises with highlight tracking
function useTabPlayback(strings: (number | null)[][], bpm?: number) {
  const { playScale } = useChordPlayer()
  const [isPlaying, setIsPlaying] = useState(false)
  const [highlightCol, setHighlightCol] = useState<number | null>(null)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const stop = useCallback(() => {
    timersRef.current.forEach(t => clearTimeout(t))
    timersRef.current = []
    setIsPlaying(false)
    setHighlightCol(null)
  }, [])

  useEffect(() => {
    return () => { timersRef.current.forEach(t => clearTimeout(t)) }
  }, [])

  const play = useCallback(async () => {
    stop()
    const notes = extractTabNotes(strings)
    if (notes.length === 0) return

    setIsPlaying(true)
    const interval = bpm ? (60 / bpm) * 1000 : 400 // ms per beat

    // Group notes by column index to determine timing
    const colGroups = new Map<number, { stringIndex: number; fret: number }[]>()
    notes.forEach(n => {
      if (!colGroups.has(n.colIndex)) colGroups.set(n.colIndex, [])
      colGroups.get(n.colIndex)!.push({ stringIndex: n.stringIndex, fret: n.fret })
    })

    const sortedCols = Array.from(colGroups.keys()).sort((a, b) => a - b)

    // Play scale-like (sequential notes) — but also highlight each column
    const scaleNotes = notes
      .sort((a, b) => a.colIndex === b.colIndex ? a.stringIndex - b.stringIndex : a.colIndex - b.colIndex)
      .map(n => ({ stringIndex: n.stringIndex, fret: n.fret }))

    playScale(scaleNotes, interval / 1000)

    // Schedule highlights for each column
    sortedCols.forEach((col, i) => {
      const timer = setTimeout(() => {
        setHighlightCol(col)
      }, i * interval)
      timersRef.current.push(timer)
    })

    // End playback after last note
    const endTimer = setTimeout(() => {
      setIsPlaying(false)
      setHighlightCol(null)
    }, (sortedCols.length) * interval + 500)
    timersRef.current.push(endTimer)
  }, [strings, bpm, playScale, stop])

  return { isPlaying, highlightCol, play, stop }
}

// Playback hook for chord exercises
function useChordPlayback(positions: (number | null)[]) {
  const { playChord } = useChordPlayer()
  const [isPlaying, setIsPlaying] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  const play = useCallback(async () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setIsPlaying(true)
    await playChord(positions)
    timerRef.current = setTimeout(() => setIsPlaying(false), 2000)
  }, [positions, playChord])

  const stop = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setIsPlaying(false)
  }, [])

  return { isPlaying, play, stop }
}

// Play button component
const PlayButton: React.FC<{ isPlaying: boolean; onPlay: () => void; onStop: () => void; label?: string }> = ({
  isPlaying, onPlay, onStop, label = "播放"
}) => (
  <button
    onClick={isPlaying ? onStop : onPlay}
    className={cn(
      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
      isPlaying
        ? "bg-guitar-red/20 text-guitar-red border border-guitar-red/30"
        : "bg-guitar-amber/20 text-guitar-amber border border-guitar-amber/30 hover:bg-guitar-amber/30"
    )}
  >
    {isPlaying ? (
      <>
        <Square className="w-3 h-3 fill-current" />
        停止
      </>
    ) : (
      <>
        <Play className="w-3 h-3 fill-current" />
        {label}
      </>
    )}
  </button>
)

// --- Exercise Renderers ---

const TabExercise: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
  const content = exercise.content as TabContent
  const { isPlaying, highlightCol, play, stop } = useTabPlayback(content.strings, content.bpm)

  return (
    <div className="space-y-3">
      <div className="bg-secondary/50 rounded-lg p-3 md:p-4 overflow-x-auto">
        <Tablature
          strings={content.strings}
          highlightCol={highlightCol}
          className="min-w-[280px]"
        />
      </div>
      <div className="flex items-center justify-between">
        <PlayButton isPlaying={isPlaying} onPlay={play} onStop={stop} />
        {content.bpm && (
          <p className="text-xs text-muted-foreground">
            建议速度: {content.bpm} BPM
          </p>
        )}
      </div>
    </div>
  )
}

const ChordExercise: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
  const chord = exercise.content as ChordContent
  const { isPlaying, play, stop } = useChordPlayback(chord.positions)

  return (
    <div className="space-y-2">
      <div className="bg-secondary/50 rounded-lg p-4">
        <ChordDiagram
          chordName={chord.chordName}
          positions={chord.positions}
          barre={chord.barre}
        />
      </div>
      <PlayButton isPlaying={isPlaying} onPlay={play} onStop={stop} label="试听和弦" />
    </div>
  )
}

const ScaleExercise: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
  const scale = exercise.content as ScaleContent
  const tabStrings = scale.strings.map(row => row.map(n => n as number | null))
  const { isPlaying, highlightCol, play, stop } = useTabPlayback(tabStrings, 80)

  return (
    <div className="space-y-3">
      <div className="bg-secondary/50 rounded-lg p-3 md:p-4 overflow-x-auto">
        <div className="text-center mb-2">
          <span className="text-xs text-muted-foreground">{scale.scaleName}</span>
          <span className="text-xs text-muted-foreground mx-1">·</span>
          <span className="text-xs text-guitar-amber font-medium">{scale.key}</span>
        </div>
        <Tablature
          strings={tabStrings}
          highlightCol={highlightCol}
          className="min-w-[280px]"
        />
      </div>
      <PlayButton isPlaying={isPlaying} onPlay={play} onStop={stop} label="播放音阶" />
    </div>
  )
}

const RhythmExercise: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
  const rhythm = exercise.content as { pattern: string[]; bpm: number; description: string }
  const [highlightBeat, setHighlightBeat] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const { playChord } = useChordPlayer()

  useEffect(() => {
    return () => { timersRef.current.forEach(t => clearTimeout(t)) }
  }, [])

  const play = useCallback(async () => {
    timersRef.current.forEach(t => clearTimeout(t))
    setIsPlaying(true)

    const interval = (60 / rhythm.bpm) * 1000
    // Play a simple Em strum pattern
    const emPositions: (number | null)[] = [0, 2, 2, 0, 0, 0]

    rhythm.pattern.forEach((_, i) => {
      const timer = setTimeout(() => {
        setHighlightBeat(i)
        playChord(emPositions, 0.02)
      }, i * interval)
      timersRef.current.push(timer)
    })

    const endTimer = setTimeout(() => {
      setIsPlaying(false)
      setHighlightBeat(null)
    }, rhythm.pattern.length * interval + 300)
    timersRef.current.push(endTimer)
  }, [rhythm, playChord])

  const stop = useCallback(() => {
    timersRef.current.forEach(t => clearTimeout(t))
    setIsPlaying(false)
    setHighlightBeat(null)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {rhythm.pattern.map((dir, i) => (
          <div
            key={i}
            className={cn(
              "w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-150",
              highlightBeat === i
                ? "bg-guitar-amber text-guitar-dark scale-110 shadow-lg"
                : dir === "下"
                  ? "bg-guitar-amber/20 text-guitar-amber border border-guitar-amber/30"
                  : "bg-guitar-red/20 text-guitar-red border border-guitar-red/30"
            )}
          >
            {dir}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <PlayButton isPlaying={isPlaying} onPlay={play} onStop={stop} label="播放节奏" />
        <p className="text-xs md:text-sm text-muted-foreground">
          {rhythm.description} · {rhythm.bpm} BPM
        </p>
      </div>
      <Metronome initialBpm={rhythm.bpm} />
    </div>
  )
}

const TechniqueExercise: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
  const tech = exercise.content as TechniqueContent
  return (
    <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
      <p className="text-sm text-foreground/80">{tech.description}</p>
      <ol className="space-y-2">
        {tech.steps.map((step, i) => (
          <li key={i} className="flex gap-2.5 text-sm">
            <span className="w-5 h-5 rounded-full bg-guitar-amber/20 text-guitar-amber text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
              {i + 1}
            </span>
            <span className="text-foreground/80 leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

// Main Exercise Renderer
const ExerciseRenderer: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
  switch (exercise.type) {
    case "tab":
      return <TabExercise exercise={exercise} />
    case "chord":
      return <ChordExercise exercise={exercise} />
    case "scale":
      return <ScaleExercise exercise={exercise} />
    case "rhythm":
      return <RhythmExercise exercise={exercise} />
    case "technique":
      return <TechniqueExercise exercise={exercise} />
    default:
      return (
        <div className="text-sm text-muted-foreground bg-secondary/50 rounded-lg p-4">
          练习内容即将推出
        </div>
      )
  }
}

// Course Detail Page
interface CourseDetailProps {
  course: Course
  onBack: () => void
  onComplete: (id: number) => void
}

export const CourseDetail: React.FC<CourseDetailProps> = ({
  course,
  onBack,
  onComplete,
}) => {
  return (
    <div className="space-y-4 md:space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3 md:gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0 w-9 h-9 md:w-10 md:h-10">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="min-w-0">
          <h2 className="text-lg md:text-2xl font-bold truncate">{course.title}</h2>
          <p className="text-xs md:text-base text-muted-foreground truncate">{course.subtitle}</p>
        </div>
        {course.completed ? (
          <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-emerald-400 ml-auto shrink-0" />
        ) : course.locked ? (
          <Lock className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground ml-auto shrink-0" />
        ) : null}
      </div>

      {/* Description */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <p className="text-sm md:text-base text-foreground/80 leading-relaxed">{course.description}</p>
          <div className="flex items-center gap-3 md:gap-4 mt-3 md:mt-4 text-xs md:text-sm text-muted-foreground">
            <span>时长: {course.duration}</span>
            <span>难度: {course.difficulty}</span>
          </div>
        </CardContent>
      </Card>

      {/* Topics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm md:text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-guitar-amber" />
            学习内容
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {course.topics.map((topic, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm text-foreground/80 bg-secondary/50 rounded-lg px-3 py-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-guitar-amber/20 text-guitar-amber text-xs flex items-center justify-center font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="text-xs md:text-sm">{topic}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exercises */}
      {course.exercises.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm md:text-base flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-guitar-red" />
              练习
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6 pt-0">
            {course.exercises.map((exercise) => (
              <div key={exercise.id} className="space-y-2 md:space-y-3">
                <h4 className="text-sm font-medium text-guitar-amber">
                  {exercise.name}
                </h4>
                <ExerciseRenderer exercise={exercise} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Complete button */}
      {!course.locked && !course.completed && (
        <Button
          className="w-full h-12 md:h-14 text-base bg-guitar-amber hover:bg-guitar-amber/90 text-guitar-dark font-semibold active:scale-[0.98] transition-transform"
          onClick={() => onComplete(course.id)}
        >
          <CheckCircle2 className="w-5 h-5 mr-2" />
          标记为已完成
        </Button>
      )}
    </div>
  )
}

export default CourseDetail
