import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { courses } from "@/data/courses"
import { Guitar, ArrowRight, Flame, Target, Zap } from "lucide-react"

interface HomeViewProps {
  onStartLearning: () => void
  progress: number
  completedCount: number
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartLearning,
  progress,
  completedCount,
}) => {
  const currentCourse = courses.find((c) => !c.completed && !c.locked)

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden -mx-4 md:mx-0">
        <img
          src="/images/guitar-hero.png"
          alt="电吉他"
          className="w-full h-56 md:h-72 object-cover"
        />
        <div className="absolute inset-0 bg-guitar-dark/70" />
        <div className="absolute inset-0 flex flex-col justify-center p-5 md:p-8">
          <h2 className="text-xl md:text-3xl font-bold text-white mb-2">
            开启你的<span className="text-guitar-amber">电吉他</span>之旅
          </h2>
          <p className="text-white/70 text-sm md:text-base max-w-lg mb-4 md:mb-6 line-clamp-2">
            从基础持琴姿势到完整曲目演奏，12周系统化课程带你从零开始掌握电吉他。
          </p>
          <div className="flex gap-2 md:gap-3">
            <Button
              size="default"
              className="bg-guitar-amber hover:bg-guitar-amber/90 text-guitar-dark font-semibold h-10 md:h-11"
              onClick={onStartLearning}
            >
              <Guitar className="w-4 h-4 mr-1.5" />
              {completedCount > 0 ? "继续学习" : "开始学习"}
            </Button>
            <Button
              size="default"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 h-10 md:h-11"
              onClick={onStartLearning}
            >
              浏览课程
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <Card className="border-guitar-amber/20">
          <CardContent className="p-3 md:p-6 flex items-center gap-2 md:gap-4">
            <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-guitar-amber/10 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4 md:w-6 md:h-6 text-guitar-amber" />
            </div>
            <div className="min-w-0">
              <p className="text-lg md:text-2xl font-bold">{progress}%</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">总进度</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-guitar-red/20">
          <CardContent className="p-3 md:p-6 flex items-center gap-2 md:gap-4">
            <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-guitar-red/10 flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4 md:w-6 md:h-6 text-guitar-red" />
            </div>
            <div className="min-w-0">
              <p className="text-lg md:text-2xl font-bold">{completedCount}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">已完成</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-sky-400/20">
          <CardContent className="p-3 md:p-6 flex items-center gap-2 md:gap-4">
            <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-sky-400/10 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 md:w-6 md:h-6 text-sky-400" />
            </div>
            <div className="min-w-0">
              <p className="text-lg md:text-2xl font-bold">{12 - completedCount}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">待学习</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Course */}
      {currentCourse && (
        <Card className="border-guitar-amber/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm md:text-base flex items-center gap-2">
              <Guitar className="w-4 h-4 text-guitar-amber" />
              当前学习
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between pt-0">
            <div className="min-w-0 mr-3">
              <h3 className="font-semibold text-base md:text-lg truncate">{currentCourse.title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground truncate">
                {currentCourse.subtitle}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-guitar-amber/30 text-guitar-amber hover:bg-guitar-amber/10 shrink-0"
              onClick={onStartLearning}
            >
              继续
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Learning Image */}
      <div className="rounded-2xl overflow-hidden -mx-4 md:mx-0">
        <img
          src="/images/guitar-learning.png"
          alt="吉他学习"
          className="w-full h-36 md:h-48 object-cover opacity-80"
        />
      </div>
    </div>
  )
}

export default HomeView
