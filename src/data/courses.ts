export interface Course {
  id: number
  title: string
  subtitle: string
  description: string
  duration: string
  difficulty: "入门" | "基础" | "进阶" | "高级"
  icon: string
  topics: string[]
  exercises: Exercise[]
  completed: boolean
  locked: boolean
}

export interface Exercise {
  id: string
  name: string
  type: "tab" | "chord" | "scale" | "rhythm" | "technique"
  content: TabContent | ChordContent | ScaleContent | RhythmContent | TechniqueContent
}

export interface TabContent {
  strings: (number | null)[][]
  bpm?: number
}

export interface ChordContent {
  chordName: string
  positions: (number | null)[]
  barre?: { fret: number; from: number; to: number }
}

export interface ScaleContent {
  scaleName: string
  key: string
  pattern: number[]
  strings: number[][]
}

export interface RhythmContent {
  pattern: string[]
  bpm: number
  description: string
}

export interface TechniqueContent {
  name: string
  description: string
  steps: string[]
}

export const courses: Course[] = [
  {
    id: 1,
    title: "认识电吉他",
    subtitle: "基础持琴姿势",
    description: "熟悉电吉他各部件名称，建立正确的演奏姿势。学习坐姿与站姿持琴，左右手基本姿势。",
    duration: "1周",
    difficulty: "入门",
    icon: "Guitar",
    topics: ["电吉他结构认知", "持琴姿势", "左手按弦姿势", "右手拨弦姿势", "空弦拨弦练习"],
    exercises: [
      {
        id: "c1-e1",
        name: "空弦拨弦练习",
        type: "tab",
        content: {
          strings: [
            [0, null, null, null, null, null],
            [null, 0, null, null, null, null],
            [null, null, 0, null, null, null],
            [null, null, null, 0, null, null],
            [null, null, null, null, 0, null],
            [null, null, null, null, null, 0],
          ],
          bpm: 60,
        } as TabContent,
      },
    ],
    completed: true,
    locked: false,
  },
  {
    id: 2,
    title: "六线谱入门",
    subtitle: "TAB谱与基础乐理",
    description: "掌握吉他最常用的六线谱阅读方法，理解基础乐理概念。",
    duration: "1-2周",
    difficulty: "入门",
    icon: "Music",
    topics: ["六线谱结构", "数字含义", "独奏记谱", "扫弦谱", "音符时值"],
    exercises: [
      {
        id: "c2-e1",
        name: "小星星",
        type: "tab",
        content: {
          strings: [
            [null, null, null, 0, null, null],
            [null, null, null, 0, null, null],
            [null, null, null, 0, null, null],
            [null, null, null, 0, null, null],
            [null, null, 0, null, null, null],
            [null, 0, null, null, null, null],
            [null, null, 0, null, null, null],
            [null, null, null, 0, null, null],
          ],
          bpm: 80,
        } as TabContent,
      },
    ],
    completed: false,
    locked: false,
  },
  {
    id: 3,
    title: "手指独立性训练",
    subtitle: "半音阶与爬格子",
    description: "提升左手四指的独立性、力量和灵活性。",
    duration: "2-3周",
    difficulty: "基础",
    icon: "Hand",
    topics: ["半音阶练习", "保留指原则", "爬格子变体", "跨弦练习", "左手消音"],
    exercises: [
      {
        id: "c3-e1",
        name: "爬格子 1-2-3-4",
        type: "tab",
        content: {
          strings: [
            [1, 2, 3, 4, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
          ],
          bpm: 60,
        } as TabContent,
      },
    ],
    completed: false,
    locked: false,
  },
  {
    id: 4,
    title: "开放和弦",
    subtitle: "Open Chords",
    description: "掌握最常用的开放位置和弦，能流畅转换。",
    duration: "3-4周",
    difficulty: "基础",
    icon: "CircleDot",
    topics: ["C大调和弦", "G大调和弦", "A小调和弦", "和弦转换", "横按和弦初探"],
    exercises: [
      {
        id: "c4-e1",
        name: "C和弦",
        type: "chord",
        content: {
          chordName: "C",
          positions: [null, 3, 2, 0, 1, 0],
        } as ChordContent,
      },
      {
        id: "c4-e2",
        name: "G和弦",
        type: "chord",
        content: {
          chordName: "G",
          positions: [3, 2, 0, 0, 0, 3],
        } as ChordContent,
      },
      {
        id: "c4-e3",
        name: "Am和弦",
        type: "chord",
        content: {
          chordName: "Am",
          positions: [null, 0, 2, 2, 1, 0],
        } as ChordContent,
      },
      {
        id: "c4-e4",
        name: "Em和弦",
        type: "chord",
        content: {
          chordName: "Em",
          positions: [0, 2, 2, 0, 0, 0],
        } as ChordContent,
      },
    ],
    completed: false,
    locked: false,
  },
  {
    id: 5,
    title: "基础节奏训练",
    subtitle: "节拍器与扫弦",
    description: "建立稳定的节奏感，掌握常见的基础节奏型。",
    duration: "3-5周",
    difficulty: "基础",
    icon: "Clock",
    topics: ["节拍器使用", "四分音符", "八分音符", "基础扫弦", "闷音基础"],
    exercises: [
      {
        id: "c5-e1",
        name: "基础扫弦节奏",
        type: "rhythm",
        content: {
          pattern: ["下", "上", "下", "上"],
          bpm: 80,
          description: "八分音符基础扫弦",
        } as RhythmContent,
      },
    ],
    completed: false,
    locked: true,
  },
  {
    id: 6,
    title: "C大调与A小调音阶",
    subtitle: "基础音阶",
    description: "掌握最基础的音阶指型，理解音阶在指板上的分布。",
    duration: "4-5周",
    difficulty: "基础",
    icon: "Scale",
    topics: ["C大调音阶", "A小调音阶", "指板音符记忆", "音阶与和弦", "上行下行"],
    exercises: [],
    completed: false,
    locked: true,
  },
  {
    id: 7,
    title: "五声音阶",
    subtitle: "Pentatonic Scale",
    description: "掌握吉他上最常用的音阶，这是摇滚/布鲁斯/流行Solo的基础。",
    duration: "5-6周",
    difficulty: "进阶",
    icon: "Waves",
    topics: ["A小调五声音阶", "五个指型", "滑弦推弦预备", "根音定位", "即兴入门"],
    exercises: [],
    completed: false,
    locked: true,
  },
  {
    id: 8,
    title: "推弦、滑弦、勾击弦",
    subtitle: "基础技巧入门",
    description: "掌握电吉他标志性的表现技巧。",
    duration: "6-7周",
    difficulty: "进阶",
    icon: "Zap",
    topics: ["滑弦", "推弦", "击弦", "勾弦", "击勾弦组合"],
    exercises: [],
    completed: false,
    locked: true,
  },
  {
    id: 9,
    title: "大调音阶指型",
    subtitle: "CAGED系统",
    description: "掌握大调音阶在指板上的五个指型，深化指板认知。",
    duration: "7-8周",
    difficulty: "进阶",
    icon: "LayoutGrid",
    topics: ["CAGED系统", "五个指型", "指型连接", "任意调", "模进练习"],
    exercises: [],
    completed: false,
    locked: true,
  },
  {
    id: 10,
    title: "强力和弦与七和弦",
    subtitle: "和弦深化",
    description: "扩展和弦库，掌握电吉他特有的和弦类型。",
    duration: "8-9周",
    difficulty: "进阶",
    icon: "AudioLines",
    topics: ["强力和弦", "横按和弦", "封闭和弦", "七和弦", "和弦琶音"],
    exercises: [],
    completed: false,
    locked: true,
  },
  {
    id: 11,
    title: "节奏进阶",
    subtitle: "风格化节奏",
    description: "掌握更复杂的节奏型，适应不同音乐风格。",
    duration: "9-10周",
    difficulty: "高级",
    icon: "Drum",
    topics: ["十六分音符", "切分音", "Funk节奏", "摇滚节奏", "Shuffle节奏"],
    exercises: [],
    completed: false,
    locked: true,
  },
  {
    id: 12,
    title: "综合应用",
    subtitle: "完整曲目与即兴",
    description: "将所学知识整合，能演奏完整歌曲，开始尝试简单的即兴。",
    duration: "10周+",
    difficulty: "高级",
    icon: "Trophy",
    topics: ["完整曲目", "歌曲结构", "即兴入门", "录音评估", "长期计划"],
    exercises: [],
    completed: false,
    locked: true,
  },
]

export const difficultyColors: Record<string, string> = {
  "入门": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  "基础": "text-sky-400 bg-sky-400/10 border-sky-400/20",
  "进阶": "text-amber-400 bg-amber-400/10 border-amber-400/20",
  "高级": "text-rose-400 bg-rose-400/10 border-rose-400/20",
}
