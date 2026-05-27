import React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { difficultyColors } from "@/data/courses"
import type { Course } from "@/data/courses"
import {
  Guitar,
  Music,
  Hand,
  CircleDot,
  Clock,
  Scale,
  Waves,
  Zap,
  LayoutGrid,
  AudioLines,
  Drum,
  Trophy,
  Lock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react"

const iconMap: Record<string, React.ElementType> = {
  Guitar,
  Music,
  Hand,
  CircleDot,
  Clock,
  Scale,
  Waves,
  Zap,
  LayoutGrid,
  AudioLines,
  Drum,
  Trophy,
}

interface CourseCardProps {
  course: Course
  isActive: boolean
  onClick: () => void
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, isActive, onClick }) => {
  const Icon = iconMap[course.icon] || Guitar
  const diffStyle = difficultyColors[course.difficulty] || ""

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-300 group",
        isActive && "border-guitar-amber/50 shadow-glow",
        course.locked && "opacity-60"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
              isActive
                ? "bg-guitar-amber text-guitar-dark"
                : "bg-secondary text-muted-foreground group-hover:text-guitar-amber"
            )}
          >
            {course.locked ? (
              <Lock className="w-5 h-5" />
            ) : course.completed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <Icon className="w-5 h-5" />
            )}
          </div>
          <span
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-full border",
              diffStyle
            )}
          >
            {course.difficulty}
          </span>
        </div>
        <CardTitle className="text-base mt-3">{course.title}</CardTitle>
        <CardDescription className="text-sm">{course.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {course.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{course.duration}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-guitar-amber hover:text-guitar-amber hover:bg-guitar-amber/10"
          >
            {course.locked ? "锁定" : isActive ? "学习中" : "开始学习"}
            <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default CourseCard
