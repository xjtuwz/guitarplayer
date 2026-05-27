import React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tablature } from "./Tablature"
import { ChordDiagram } from "./ChordDiagram"
import { Metronome } from "./Metronome"
import type { Course, Exercise, TabContent } from "@/data/courses"
import { CheckCircle2, Lock, BookOpen, Dumbbell, ArrowLeft } from "lucide-react"

interface CourseDetailProps {
  course: Course
  onBack: () => void
  onComplete: (id: number) => void
}

const ExerciseRenderer: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
  switch (exercise.type) {
    case "tab":
      return (
        <div className="space-y-3">
          <div className="bg-secondary/50 rounded-lg p-3 md:p-4 overflow-x-auto">
            <Tablature
              strings={(exercise.content as TabContent).strings}
              className="min-w-[280px]"
            />
          </div>
          {(exercise.content as { bpm?: number }).bpm && (
            <p className="text-xs text-muted-foreground text-center">
              建议速度: {(exercise.content as { bpm?: number }).bpm} BPM
            </p>
          )}
        </div>
      )
    case "chord":
      const chord = exercise.content as {
        chordName: string
        positions: (number | null)[]
        barre?: { fret: number; from: number; to: number }
      }
      return (
        <div className="bg-secondary/50 rounded-lg p-4">
          <ChordDiagram
            chordName={chord.chordName}
            positions={chord.positions}
            barre={chord.barre}
          />
        </div>
      )
    case "rhythm":
      const rhythm = exercise.content as {
        pattern: string[]
        bpm: number
        description: string
      }
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {rhythm.pattern.map((dir, i) => (
              <div
                key={i}
                className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-xs md:text-sm font-bold",
                  dir === "下"
                    ? "bg-guitar-amber/20 text-guitar-amber border border-guitar-amber/30"
                    : "bg-guitar-red/20 text-guitar-red border border-guitar-red/30"
                )}
              >
                {dir}
              </div>
            ))}
          </div>
          <p className="text-xs md:text-sm text-muted-foreground text-center">
            {rhythm.description} · {rhythm.bpm} BPM
          </p>
          <Metronome initialBpm={rhythm.bpm} />
        </div>
      )
    default:
      return (
        <div className="text-sm text-muted-foreground bg-secondary/50 rounded-lg p-4">
          练习内容即将推出
        </div>
      )
  }
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
