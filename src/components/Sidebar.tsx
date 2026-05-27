import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Guitar,
  Home,
  BookOpen,
  Settings,
  Music,
  Trophy,
} from "lucide-react"

export type View = "home" | "courses" | "practice" | "achievements" | "settings"

interface SidebarProps {
  currentView: View
  onViewChange: (view: View) => void
  progress: number
}

const navItems: { view: View; label: string; icon: React.ElementType }[] = [
  { view: "home", label: "首页", icon: Home },
  { view: "courses", label: "课程", icon: BookOpen },
  { view: "practice", label: "练习工具", icon: Music },
  { view: "achievements", label: "成就", icon: Trophy },
  { view: "settings", label: "设置", icon: Settings },
]

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  progress,
}) => {
  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-guitar-amber flex items-center justify-center">
            <Guitar className="w-5 h-5 text-guitar-dark" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight"><span className="text-guitar-amber">小米</span>的电吉他</h1>
            <p className="text-xs text-muted-foreground">学习之旅</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.view
          return (
            <Button
              key={item.view}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 h-11 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-guitar-amber/10 text-guitar-amber hover:bg-guitar-amber/15"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
              onClick={() => onViewChange(item.view)}
            >
              <Icon className={cn("w-4 h-4", isActive && "text-guitar-amber")} />
              {item.label}
            </Button>
          )
        })}
      </nav>

      {/* Progress */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>总进度</span>
          <span className="text-guitar-amber font-bold">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-guitar-amber transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
