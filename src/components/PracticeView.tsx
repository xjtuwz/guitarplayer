import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Metronome } from "./Metronome"
import { ChordDiagram } from "./ChordDiagram"
import { Tablature } from "./Tablature"
import { PitchPractice } from "./PitchPractice"
import { Clock, Music, AudioLines, Guitar, Activity } from "lucide-react"

type ToolTab = "metronome" | "chords" | "scales" | "pitch"

const commonChords = [
  { name: "C", positions: [null, 3, 2, 0, 1, 0] as (number | null)[] },
  { name: "G", positions: [3, 2, 0, 0, 0, 3] as (number | null)[] },
  { name: "Am", positions: [null, 0, 2, 2, 1, 0] as (number | null)[] },
  { name: "Em", positions: [0, 2, 2, 0, 0, 0] as (number | null)[] },
  { name: "D", positions: [null, null, 0, 2, 3, 2] as (number | null)[] },
  { name: "A", positions: [null, 0, 2, 2, 2, 0] as (number | null)[] },
  { name: "E", positions: [0, 2, 2, 1, 0, 0] as (number | null)[] },
  { name: "F", positions: [1, 3, 3, 2, 1, 1] as (number | null)[], barre: { fret: 1, from: 0, to: 5 } },
]

const scalePattern = {
  name: "A小调五声音阶",
  strings: [
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
  ] as (number | null)[][],
}

export const PracticeView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ToolTab>("metronome")
  const [selectedChord, setSelectedChord] = useState(0)

  const tabs: { id: ToolTab; label: string; icon: React.ElementType }[] = [
    { id: "metronome", label: "节拍器", icon: Clock },
    { id: "chords", label: "和弦库", icon: AudioLines },
    { id: "scales", label: "音阶", icon: Music },
    { id: "pitch", label: "音准", icon: Activity },
  ]

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <h2 className="text-xl md:text-2xl font-bold">练习工具</h2>

      {/* Tab selector */}
      <div className="grid grid-cols-4 gap-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2.5 px-1 rounded-xl text-xs font-medium transition-all active:scale-95",
                activeTab === tab.id
                  ? "bg-guitar-amber text-guitar-dark"
                  : "bg-secondary text-muted-foreground"
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Metronome */}
      {activeTab === "metronome" && (
        <div className="max-w-md mx-auto">
          <Metronome />
        </div>
      )}

      {/* Chords */}
      {activeTab === "chords" && (
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-6">
          <Card className="order-2 lg:order-1 lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm md:text-base">常用和弦</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-4 md:grid-cols-2 gap-2">
                {commonChords.map((chord, i) => (
                  <Button
                    key={chord.name}
                    variant={selectedChord === i ? "default" : "ghost"}
                    className={cn(
                      "h-12 md:h-12 text-base md:text-lg font-bold",
                      selectedChord === i
                        ? "bg-guitar-amber text-guitar-dark"
                        : "text-foreground"
                    )}
                    onClick={() => setSelectedChord(i)}
                  >
                    {chord.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="order-1 lg:order-2 lg:col-span-2 flex items-center justify-center min-h-[320px] md:min-h-[400px]">
            <ChordDiagram
              chordName={commonChords[selectedChord].name}
              positions={commonChords[selectedChord].positions}
              barre={commonChords[selectedChord].barre}
              className="py-6 md:py-8"
            />
          </Card>
        </div>
      )}

      {/* Scales */}
      {activeTab === "scales" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm md:text-base flex items-center gap-2">
              <Guitar className="w-4 h-4 text-guitar-amber" />
              {scalePattern.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6 pt-0">
            <div className="bg-secondary/50 rounded-lg p-3 md:p-6 overflow-x-auto">
              <Tablature
                strings={[
                  [5, 8, null, null, null, null],
                  [5, 7, null, null, null, null],
                  [5, 7, null, null, null, null],
                  [5, 7, null, null, null, null],
                  [5, 8, null, null, null, null],
                  [5, 8, null, null, null, null],
                ]}
                className="min-w-[300px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-4 text-sm">
              <div className="bg-secondary/30 rounded-lg p-3 md:p-4">
                <p className="text-muted-foreground mb-1 text-xs md:text-sm">根音</p>
                <p className="text-base md:text-lg font-bold text-guitar-amber">A</p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3 md:p-4">
                <p className="text-muted-foreground mb-1 text-xs md:text-sm">构成音</p>
                <p className="text-base md:text-lg font-bold">A C D E G</p>
              </div>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              五声音阶省略了4级和7级音，不容易弹错，是摇滚、布鲁斯和流行Solo的基础。
              建议从慢速开始，确保每个音都清晰饱满。
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pitch Detection */}
      {activeTab === "pitch" && <PitchPractice />}
    </div>
  )
}

export default PracticeView
