import React from "react"
import { cn } from "@/lib/utils"
import type { View } from "@/components/Sidebar"
import {
  Home,
  BookOpen,
  Music,
  Trophy,
  Settings,
} from "lucide-react"

interface MobileNavProps {
  currentView: View
  onViewChange: (view: View) => void
}

const navItems: { view: View; label: string; icon: React.ElementType }[] = [
  { view: "home", label: "首页", icon: Home },
  { view: "courses", label: "课程", icon: BookOpen },
  { view: "practice", label: "练习", icon: Music },
  { view: "achievements", label: "成就", icon: Trophy },
  { view: "settings", label: "设置", icon: Settings },
]

export const MobileNav: React.FC<MobileNavProps> = ({
  currentView,
  onViewChange,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border safe-area-pb md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.view
          return (
            <button
              key={item.view}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-16 h-full active:scale-95 transition-all duration-200",
                isActive ? "text-guitar-amber" : "text-muted-foreground"
              )}
              onClick={() => onViewChange(item.view)}
            >
              <Icon
                className={cn(
                  "w-6 h-6 transition-transform",
                  isActive && "scale-110"
                )}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span className="text-[10px] font-medium leading-none">
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileNav
