import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Metronome } from "./Metronome"
import { ChordDiagram } from "./ChordDiagram"
import { Tablature } from "./Tablature"
import { PitchPractice } from "./PitchPractice"
import { useChordPlayer } from "@/hooks/useChordPlayer"
import { Clock, Music, AudioLines, Guitar, Activity, Volume2, Play } from "lucide-react"

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

interface ScaleConfig {
  name: string
  key: string
  notes: string
  description: string
  strings: (number | null)[][]
  // Ordered notes for playback (string index 0-5, fret)
  playNotes: { stringIndex: number; fret: number }[]
}

const scales: ScaleConfig[] = [
  {
    name: "A小调五声音阶",
    key: "A",
    notes: "A C D E G",
    description: "最常用的吉他音阶，摇滚、布鲁斯和流行Solo的基础。五声音阶省略了4级和7级音，不容易弹错。",
    strings: [
      [5, 8, null, null, null, null],
      [5, 7, null, null, null, null],
      [5, 7, null, null, null, null],
      [5, 7, null, null, null, null],
      [5, 8, null, null, null, null],
      [5, 8, null, null, null, null],
    ],
    playNotes: [
      { stringIndex: 5, fret: 5 }, { stringIndex: 5, fret: 8 },
      { stringIndex: 4, fret: 5 }, { stringIndex: 4, fret: 8 },
      { stringIndex: 3, fret: 5 }, { stringIndex: 3, fret: 7 },
      { stringIndex: 2, fret: 5 }, { stringIndex: 2, fret: 7 },
      { stringIndex: 1, fret: 5 }, { stringIndex: 1, fret: 7 },
      { stringIndex: 0, fret: 5 }, { stringIndex: 0, fret: 8 },
    ],
  },
  {
    name: "E小调五声音阶",
    key: "E",
    notes: "E G A B D",
    description: "电吉他最经典的小调音阶，开放位置极易弹奏，大量经典Riff基于此音阶。",
    strings: [
      [0, 3, null, null, null, null],
      [0, 2, null, null, null, null],
      [0, 2, null, null, null, null],
      [0, 2, null, null, null, null],
      [0, 3, null, null, null, null],
      [0, 3, null, null, null, null],
    ],
    playNotes: [
      { stringIndex: 5, fret: 0 }, { stringIndex: 5, fret: 3 },
      { stringIndex: 4, fret: 0 }, { stringIndex: 4, fret: 2 },
      { stringIndex: 3, fret: 0 }, { stringIndex: 3, fret: 2 },
      { stringIndex: 2, fret: 0 }, { stringIndex: 2, fret: 2 },
      { stringIndex: 1, fret: 0 }, { stringIndex: 1, fret: 3 },
      { stringIndex: 0, fret: 0 }, { stringIndex: 0, fret: 3 },
    ],
  },
  {
    name: "G小调五声音阶",
    key: "G",
    notes: "G B♭ C D F",
    description: "布鲁斯风格常用音阶，沉稳有力的音色适合慢速Solo和情感表达。",
    strings: [
      [3, 6, null, null, null, null],
      [3, 5, null, null, null, null],
      [3, 5, null, null, null, null],
      [3, 5, null, null, null, null],
      [3, 6, null, null, null, null],
      [3, 6, null, null, null, null],
    ],
    playNotes: [
      { stringIndex: 5, fret: 3 }, { stringIndex: 5, fret: 6 },
      { stringIndex: 4, fret: 3 }, { stringIndex: 4, fret: 5 },
      { stringIndex: 3, fret: 3 }, { stringIndex: 3, fret: 5 },
      { stringIndex: 2, fret: 3 }, { stringIndex: 2, fret: 5 },
      { stringIndex: 1, fret: 3 }, { stringIndex: 1, fret: 6 },
      { stringIndex: 0, fret: 3 }, { stringIndex: 0, fret: 6 },
    ],
  },
  {
    name: "B小调五声音阶",
    key: "B",
    notes: "B D E F♯ A",
    description: "第7把位音阶，音域较高，适合弹奏旋律感强的Solo段落。",
    strings: [
      [7, 10, null, null, null, null],
      [7, 9, null, null, null, null],
      [7, 9, null, null, null, null],
      [7, 9, null, null, null, null],
      [7, 10, null, null, null, null],
      [7, 10, null, null, null, null],
    ],
    playNotes: [
      { stringIndex: 5, fret: 7 }, { stringIndex: 5, fret: 10 },
      { stringIndex: 4, fret: 7 }, { stringIndex: 4, fret: 9 },
      { stringIndex: 3, fret: 7 }, { stringIndex: 3, fret: 9 },
      { stringIndex: 2, fret: 7 }, { stringIndex: 2, fret: 9 },
      { stringIndex: 1, fret: 7 }, { stringIndex: 1, fret: 10 },
      { stringIndex: 0, fret: 7 }, { stringIndex: 0, fret: 10 },
    ],
  },
  {
    name: "D小调五声音阶",
    key: "D",
    notes: "D F G A C",
    description: "古典与金属风格常用音阶，阴暗厚重的色彩，适合速弹和力量感Riff。",
    strings: [
      [10, 13, null, null, null, null],
      [10, 12, null, null, null, null],
      [10, 12, null, null, null, null],
      [10, 12, null, null, null, null],
      [10, 12, null, null, null, null],
      [10, 13, null, null, null, null],
    ],
    playNotes: [
      { stringIndex: 5, fret: 10 }, { stringIndex: 5, fret: 13 },
      { stringIndex: 4, fret: 10 }, { stringIndex: 4, fret: 12 },
      { stringIndex: 3, fret: 10 }, { stringIndex: 3, fret: 12 },
      { stringIndex: 2, fret: 10 }, { stringIndex: 2, fret: 12 },
      { stringIndex: 1, fret: 10 }, { stringIndex: 1, fret: 12 },
      { stringIndex: 0, fret: 10 }, { stringIndex: 0, fret: 13 },
    ],
  },
]

export const PracticeView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ToolTab>("metronome")
  const [selectedChord, setSelectedChord] = useState(0)
  const [selectedScale, setSelectedScale] = useState(0)
  const { playChord, playString, playScale } = useChordPlayer()

  const handleSelectChord = (index: number) => {
    setSelectedChord(index)
    playChord(commonChords[index].positions)
  }

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
                    onClick={() => handleSelectChord(i)}
                  >
                    {chord.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="order-1 lg:order-2 lg:col-span-2 flex flex-col items-center justify-center min-h-[320px] md:min-h-[400px]">
            <ChordDiagram
              chordName={commonChords[selectedChord].name}
              positions={commonChords[selectedChord].positions}
              barre={commonChords[selectedChord].barre}
              onStringClick={playString}
              className="py-6 md:py-8"
            />
            <Button
              variant="outline"
              size="sm"
              className="mb-4 border-guitar-amber/30 text-guitar-amber hover:bg-guitar-amber/10 gap-1.5"
              onClick={() => playChord(commonChords[selectedChord].positions)}
            >
              <Volume2 className="w-4 h-4" />
              试听和弦
            </Button>
          </Card>
        </div>
      )}

      {/* Scales */}
      {activeTab === "scales" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm md:text-base flex items-center gap-2">
              <Guitar className="w-4 h-4 text-guitar-amber" />
              小调五声音阶
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6 pt-0">
            {/* Scale selector */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {scales.map((scale, i) => (
                <button
                  key={scale.key}
                  className={cn(
                    "shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all active:scale-95",
                    selectedScale === i
                      ? "bg-guitar-amber text-guitar-dark"
                      : "bg-secondary text-muted-foreground"
                  )}
                  onClick={() => setSelectedScale(i)}
                >
                  {scale.key}小调
                </button>
              ))}
            </div>

            {/* Current scale info */}
            <div className="flex items-center justify-between">
              <h3 className="text-base md:text-lg font-bold">{scales[selectedScale].name}</h3>
              <Button
                variant="outline"
                size="sm"
                className="border-guitar-amber/30 text-guitar-amber hover:bg-guitar-amber/10 gap-1.5"
                onClick={() => playScale(scales[selectedScale].playNotes)}
              >
                <Play className="w-4 h-4" />
                播放音阶
              </Button>
            </div>

            {/* Tablature */}
            <div className="bg-secondary/50 rounded-lg p-3 md:p-6 overflow-x-auto">
              <Tablature
                strings={scales[selectedScale].strings}
                className="min-w-[300px]"
              />
            </div>

            {/* Scale details */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 text-sm">
              <div className="bg-secondary/30 rounded-lg p-3 md:p-4">
                <p className="text-muted-foreground mb-1 text-xs md:text-sm">根音</p>
                <p className="text-base md:text-lg font-bold text-guitar-amber">{scales[selectedScale].key}</p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3 md:p-4">
                <p className="text-muted-foreground mb-1 text-xs md:text-sm">构成音</p>
                <p className="text-base md:text-lg font-bold">{scales[selectedScale].notes}</p>
              </div>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              {scales[selectedScale].description}
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
