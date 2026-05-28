import { useState, useMemo, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"
import { unlockIOSAudio } from "@/lib/iosAudioUnlock"
import { MobileNav } from "@/components/MobileNav"
import { HomeView } from "@/components/HomeView"
import { CourseCard } from "@/components/CourseCard"
import { CourseDetail } from "@/components/CourseDetail"
import { PracticeView } from "@/components/PracticeView"
import { courses as initialCourses } from "@/data/courses"
import type { Course } from "@/data/courses"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Lock, Trophy, Flame, Star, Guitar, RotateCw } from "lucide-react"

export type View = "home" | "courses" | "practice" | "achievements" | "settings"

function App() {
  const [currentView, setCurrentView] = useState<View>("home")
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem("soundEnabled") !== "false")
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem("highContrast") === "true")

  // High contrast mode: toggle CSS class on document
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
    localStorage.setItem("highContrast", String(highContrast))
  }, [highContrast])

  useEffect(() => {
    localStorage.setItem("soundEnabled", String(soundEnabled))
  }, [soundEnabled])

  // Global iOS audio unlock on first user interaction
  useEffect(() => {
    const unlock = () => {
      unlockIOSAudio()
      document.removeEventListener("touchstart", unlock)
      document.removeEventListener("click", unlock)
    }
    document.addEventListener("touchstart", unlock, { once: true })
    document.addEventListener("click", unlock, { once: true })
    return () => {
      document.removeEventListener("touchstart", unlock)
      document.removeEventListener("click", unlock)
    }
  }, [])

  const progress = useMemo(() => {
    const completed = courses.filter((c) => c.completed).length
    return Math.round((completed / courses.length) * 100)
  }, [courses])

  const completedCount = useMemo(
    () => courses.filter((c) => c.completed).length,
    [courses]
  )

  const selectedCourse = useMemo(
    () => courses.find((c) => c.id === selectedCourseId) || null,
    [courses, selectedCourseId]
  )

  const handleCourseClick = useCallback(
    (course: Course) => {
      if (course.locked) return
      setSelectedCourseId(course.id)
    },
    []
  )

  const handleBack = useCallback(() => {
    setSelectedCourseId(null)
  }, [])

  const handleComplete = useCallback(
    (id: number) => {
      setCourses((prev) => {
        const next = prev.map((c) =>
          c.id === id ? { ...c, completed: true } : c
        )
        const nextCourse = next.find((c) => c.id === id + 1)
        if (nextCourse) {
          const idx = next.findIndex((c) => c.id === id + 1)
          next[idx] = { ...next[idx], locked: false }
        }
        return next
      })
      setSelectedCourseId(null)
      setCurrentView("courses")
    },
    []
  )

  const handleStartLearning = useCallback(() => {
    setCurrentView("courses")
    const firstUncompleted = courses.find((c) => !c.completed && !c.locked)
    if (firstUncompleted) {
      setSelectedCourseId(firstUncompleted.id)
    }
  }, [courses])

  const handleBrowseCourses = useCallback(() => {
    setCurrentView("courses")
    setSelectedCourseId(null)
  }, [])

  const handleViewChange = useCallback((view: View) => {
    setCurrentView(view)
    if (view === "courses") {
      const nextCourse = courses.find((c) => !c.completed && !c.locked)
      if (nextCourse) {
        setSelectedCourseId(nextCourse.id)
      } else {
        setSelectedCourseId(null)
      }
    } else {
      setSelectedCourseId(null)
    }
  }, [courses])

  const renderContent = () => {
    switch (currentView) {
      case "home":
        return (
          <HomeView
            onStartLearning={handleStartLearning}
            onBrowseCourses={handleBrowseCourses}
            progress={progress}
            completedCount={completedCount}
          />
        )
      case "courses":
        if (selectedCourse) {
          return (
            <CourseDetail
              course={selectedCourse}
              onBack={handleBack}
              onComplete={handleComplete}
            />
          )
        }
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold">课程体系</h2>
            <p className="text-muted-foreground">
              12周系统化课程，从零开始掌握电吉他
            </p>
            <div className="grid grid-cols-1 gap-4">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isActive={selectedCourseId === course.id}
                  onClick={() => handleCourseClick(course)}
                />
              ))}
            </div>
          </div>
        )
      case "practice":
        return <PracticeView soundEnabled={soundEnabled} />
      case "achievements":
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold">成就</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: CheckCircle2,
                  title: "初出茅庐",
                  desc: "完成第1门课程",
                  unlocked: completedCount >= 1,
                  color: "text-emerald-400",
                },
                {
                  icon: Flame,
                  title: "渐入佳境",
                  desc: "完成第3门课程",
                  unlocked: completedCount >= 3,
                  color: "text-amber-400",
                },
                {
                  icon: Trophy,
                  title: "学有所成",
                  desc: "完成第6门课程",
                  unlocked: completedCount >= 6,
                  color: "text-guitar-amber",
                },
                {
                  icon: Star,
                  title: "吉他高手",
                  desc: "完成第9门课程",
                  unlocked: completedCount >= 9,
                  color: "text-sky-400",
                },
                {
                  icon: Trophy,
                  title: "大师之路",
                  desc: "完成全部12门课程",
                  unlocked: completedCount >= 12,
                  color: "text-guitar-red",
                },
                {
                  icon: Lock,
                  title: "持之以恒",
                  desc: "连续练习7天",
                  unlocked: false,
                  color: "text-muted-foreground",
                },
              ].map((achievement, i) => {
                const Icon = achievement.icon
                return (
                  <Card
                    key={i}
                    className={
                      achievement.unlocked
                        ? "border-guitar-amber/30"
                        : "opacity-50 border-muted"
                    }
                  >
                    <CardContent className="p-6 flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          achievement.unlocked
                            ? "bg-guitar-amber/10"
                            : "bg-muted"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${achievement.color}`}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {achievement.desc}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )
      case "settings":
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold">设置</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">音效</p>
                    <p className="text-xs text-muted-foreground">
                      启用练习时的音效反馈
                    </p>
                  </div>
                  <button
                    className={cn(
                      "w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-200",
                      soundEnabled ? "bg-guitar-amber" : "bg-muted"
                    )}
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    aria-label="切换音效"
                  >
                    <div
                      className={cn(
                        "w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-all duration-200",
                        soundEnabled ? "right-0.5" : "left-0.5"
                      )}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">高对比度</p>
                    <p className="text-xs text-muted-foreground">
                      提高界面对比度以便阅读
                    </p>
                  </div>
                  <button
                    className={cn(
                      "w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-200",
                      highContrast ? "bg-guitar-amber" : "bg-muted"
                    )}
                    onClick={() => setHighContrast(!highContrast)}
                    aria-label="切换高对比度"
                  >
                    <div
                      className={cn(
                        "w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-all duration-200",
                        highContrast ? "right-0.5" : "left-0.5"
                      )}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">重置进度</p>
                    <p className="text-xs text-muted-foreground">
                      清除所有学习进度
                    </p>
                  </div>
                  <button
                    className="text-xs text-guitar-red hover:underline px-3 py-1.5 rounded-md active:bg-guitar-red/10"
                    onClick={() => {
                      if (
                        confirm("确定要重置所有进度吗？此操作不可撤销。")
                      ) {
                        setCourses(initialCourses)
                      }
                    }}
                  >
                    重置
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border safe-area-pt">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-guitar-amber flex items-center justify-center">
              <Guitar className="w-4 h-4 text-guitar-dark" />
            </div>
            <h1 className="font-bold text-base tracking-tight"><span className="text-guitar-amber">小米</span>的电吉他学习之旅</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {progress}%
            <button
              className="p-1 rounded-md hover:bg-secondary active:bg-secondary/80 transition-colors"
              onClick={() => window.location.reload()}
              aria-label="刷新页面"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 pb-24">
        {renderContent()}
      </main>

      {/* Bottom navigation */}
      <MobileNav currentView={currentView} onViewChange={handleViewChange} />
    </div>
  )
}

export default App
