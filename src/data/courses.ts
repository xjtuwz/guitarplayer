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
        name: "认识吉他各部位",
        type: "technique",
        content: {
          name: "吉他结构认知",
          description: "了解电吉他的主要部件及其功能",
          steps: [
            "琴头(Headstock)：安装弦钮，调节弦的音高",
            "琴颈(Neck)：正面为指板，上面嵌有品丝",
            "品丝(Frets)：将指板划分为不同音高的区域",
            "琴身(Body)：安装拾音器、音量音色旋钮和输出接口",
            "拾音器(Pickups)：将弦的振动转化为电信号，分为单线圈和双线圈",
            "摇把(Whammy Bar)：改变弦的张力产生颤音效果",
          ],
        } as TechniqueContent,
      },
      {
        id: "c1-e2",
        name: "正确持琴姿势",
        type: "technique",
        content: {
          name: "持琴姿势",
          description: "坐姿与站姿的正确持琴方式",
          steps: [
            "坐姿：将琴身凹陷处放在右大腿上，琴颈与地面约呈45度角",
            "右手：前臂自然搭在琴身上方，手腕放松",
            "左手：拇指抵住琴颈背面中轴线，其余四指自然弯曲朝向指板",
            "站姿：使用背带，调整高度使琴身位置与坐姿时相近",
            "注意：避免琴颈过度下垂，保持手腕自然放松",
            "练习：分别用坐姿和站姿各持琴5分钟，感受舒适度",
          ],
        } as TechniqueContent,
      },
      {
        id: "c1-e3",
        name: "右手拨片握法与拨弦",
        type: "technique",
        content: {
          name: "右手拨弦基础",
          description: "学习使用拨片的正确握法和拨弦方式",
          steps: [
            "用拇指和食指捏住拨片，露出约1/3的拨片尖端",
            "手腕保持放松，以手腕为轴心上下运动",
            "下拨(↓)：手腕向下转动，拨片从上到下划过琴弦",
            "上拨(↑)：手腕向上转动，拨片从下到上划过琴弦",
            "拨弦力度适中，让拨片自然弹过琴弦而非硬压",
            "先在单根弦上练习下拨，熟练后再尝试上下交替拨弦",
          ],
        } as TechniqueContent,
      },
      {
        id: "c1-e4",
        name: "空弦拨弦练习 - 下拨",
        type: "tab",
        content: {
          strings: [
            [0, null, null, null, null, null],
            [null, 0, null, null, null, null],
            [null, null, 0, null, null, null],
            [null, null, null, 0, null, null],
            [null, null, null, null, 0, null],
            [null, null, null, null, null, 0],
            [null, null, null, null, 0, null],
            [null, null, null, 0, null, null],
            [null, null, 0, null, null, null],
            [null, 0, null, null, null, null],
            [0, null, null, null, null, null],
          ],
          bpm: 60,
        } as TabContent,
      },
      {
        id: "c1-e5",
        name: "空弦交替拨弦",
        type: "tab",
        content: {
          strings: [
            [0, 0, null, null, null, null],
            [null, null, 0, 0, null, null],
            [null, null, null, null, 0, 0],
            [0, 0, null, null, null, null],
            [null, null, 0, 0, null, null],
            [null, null, null, null, 0, 0],
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
        name: "六线谱基础认知",
        type: "technique",
        content: {
          name: "六线谱阅读方法",
          description: "学习如何阅读吉他六线谱(TAB)",
          steps: [
            "六线谱从上到下代表1弦到6弦（最细到最粗）",
            "线上的数字表示按在对应弦的第几品",
            "0表示弹奏空弦（不按任何品）",
            "竖线上数字上下对齐表示同时弹奏",
            "数字从左到右表示演奏的先后顺序",
            "X表示按和弦时弹奏该弦（用于扫弦谱）",
          ],
        } as TechniqueContent,
      },
      {
        id: "c2-e2",
        name: "单弦旋律练习",
        type: "tab",
        content: {
          strings: [
            [0, 1, 2, 3, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
          ],
          bpm: 60,
        } as TabContent,
      },
      {
        id: "c2-e3",
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
      {
        id: "c2-e4",
        name: "欢乐颂（简化版）",
        type: "tab",
        content: {
          strings: [
            [null, null, 0, null, null, null],
            [null, null, 0, null, null, null],
            [null, 0, null, null, null, null],
            [null, null, 0, null, null, null],
            [0, null, null, null, null, null],
            [null, null, 0, null, null, null],
            [0, null, null, null, null, null],
            [null, null, 0, null, null, null],
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
        name: "基础爬格子 1-2-3-4（6弦）",
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
      {
        id: "c3-e2",
        name: "爬格子 1-2-3-4（全弦）",
        type: "tab",
        content: {
          strings: [
            [1, 2, 3, 4, null, null],
            [1, 2, 3, 4, null, null],
            [1, 2, 3, 4, null, null],
            [1, 2, 3, 4, null, null],
            [1, 2, 3, 4, null, null],
            [1, 2, 3, 4, null, null],
          ],
          bpm: 50,
        } as TabContent,
      },
      {
        id: "c3-e3",
        name: "保留指练习要点",
        type: "technique",
        content: {
          name: "保留指原则",
          description: "爬格子最重要的原则——保留指",
          steps: [
            "保留指原则：按下的手指不要抬起，直到必须移动时才松开",
            "食指按第1品后保持不动，中指按第2品后也不抬起",
            "无名指按第3品，小指按第4品，四指同时按住",
            "全部按完后，从4指到1指依次抬起，感受每个手指的控制",
            "初学小指力量弱很正常，坚持每天练习5-10分钟",
            "速度不重要，准确性优先——每个音都要清晰饱满",
          ],
        } as TechniqueContent,
      },
      {
        id: "c3-e4",
        name: "跨弦爬格子",
        type: "tab",
        content: {
          strings: [
            [1, null, 2, null, 3, null],
            [null, 1, null, 2, null, 3],
            [4, null, 1, null, 2, null],
            [null, 4, null, 1, null, 2],
          ],
          bpm: 50,
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
      {
        id: "c4-e5",
        name: "D和弦",
        type: "chord",
        content: {
          chordName: "D",
          positions: [null, null, 0, 2, 3, 2],
        } as ChordContent,
      },
      {
        id: "c4-e6",
        name: "A和弦",
        type: "chord",
        content: {
          chordName: "A",
          positions: [null, 0, 2, 2, 2, 0],
        } as ChordContent,
      },
      {
        id: "c4-e7",
        name: "E和弦",
        type: "chord",
        content: {
          chordName: "E",
          positions: [0, 2, 2, 1, 0, 0],
        } as ChordContent,
      },
      {
        id: "c4-e8",
        name: "Dm和弦",
        type: "chord",
        content: {
          chordName: "Dm",
          positions: [null, null, 0, 2, 3, 1],
        } as ChordContent,
      },
      {
        id: "c4-e9",
        name: "和弦转换练习要点",
        type: "technique",
        content: {
          name: "和弦转换技巧",
          description: "如何流畅地在和弦之间切换",
          steps: [
            "先单独练习每个和弦的按法，确保每个音都能清晰发声",
            "找到两个和弦之间的\"共同指\"——不需要移动的手指",
            "先慢速练习转换，每次转换用节拍器设定2拍的时间",
            "Em→G：中指和无名指整体平移到6弦和5弦",
            "C→Am：食指和中指保持形状，整体下移一根弦",
            "G→C：整个手型重组，先落食指再调整其余手指",
          ],
        } as TechniqueContent,
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
        name: "四分音符下拨",
        type: "rhythm",
        content: {
          pattern: ["下", "下", "下", "下"],
          bpm: 80,
          description: "每拍一下拨，四分音符基础节奏",
        } as RhythmContent,
      },
      {
        id: "c5-e2",
        name: "八分音符交替拨弦",
        type: "rhythm",
        content: {
          pattern: ["下", "上", "下", "上", "下", "上", "下", "上"],
          bpm: 80,
          description: "每拍两下，下上交替拨弦",
        } as RhythmContent,
      },
      {
        id: "c5-e3",
        name: "扫弦节奏型1（流行）",
        type: "rhythm",
        content: {
          pattern: ["下", "下", "上", "上", "下", "上"],
          bpm: 80,
          description: "经典流行扫弦节奏：下 下上 上下上",
        } as RhythmContent,
      },
      {
        id: "c5-e4",
        name: "扫弦节奏型2（民谣）",
        type: "rhythm",
        content: {
          pattern: ["下", "上", "上", "下", "上"],
          bpm: 70,
          description: "民谣常用扫弦节奏：下上 上下上",
        } as RhythmContent,
      },
      {
        id: "c5-e5",
        name: "手掌闷音基础",
        type: "technique",
        content: {
          name: "手掌闷音(Palm Mute)",
          description: "电吉他最重要的基础技巧之一",
          steps: [
            "右手手掌外侧（靠近手腕处）轻轻搭在琴桥处的琴弦上",
            "手掌位置要靠近琴桥，太靠前会完全消除声音",
            "下拨时保持手掌位置不变，产生\"噌噌\"的闷音效果",
            "闷音时音高仍可辨认，只是声音变得短促有力",
            "在5弦和6弦上练习闷音，这是电吉他最常用的闷音弦",
            "交替练习闷音和开放音：闷-闷-开-闷，感受对比",
          ],
        } as TechniqueContent,
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
    exercises: [
      {
        id: "c6-e1",
        name: "C大调第一把位音阶",
        type: "scale",
        content: {
          scaleName: "C大调",
          key: "C",
          pattern: [0, 2, 4],
          strings: [
            [0, 1, 3],
            [0, 2, 3],
            [0, 2, 3],
            [0, 2, 3],
            [0, 2, 3],
            [0, 1, 3],
          ],
        } as ScaleContent,
      },
      {
        id: "c6-e2",
        name: "A小调自然音阶",
        type: "scale",
        content: {
          scaleName: "A小调",
          key: "Am",
          pattern: [0, 2, 3],
          strings: [
            [0, 1, 3],
            [0, 2, 3],
            [0, 2, 3],
            [0, 2, 3],
            [0, 2, 3],
            [0, 1, 3],
          ],
        } as ScaleContent,
      },
      {
        id: "c6-e3",
        name: "音阶上行练习",
        type: "tab",
        content: {
          strings: [
            [0, 1, 3, null, null, null],
            [null, null, null, 0, 2, 3],
            [0, 2, 3, null, null, null],
            [null, null, null, 0, 2, 3],
            [0, 2, 3, null, null, null],
            [null, null, null, 0, 1, 3],
          ],
          bpm: 60,
        } as TabContent,
      },
      {
        id: "c6-e4",
        name: "音阶与和弦关系",
        type: "technique",
        content: {
          name: "音阶与和弦的关系",
          description: "理解为什么这些和弦搭配这些音阶",
          steps: [
            "C大调音阶的音符：C D E F G A B",
            "从C大调音阶中每隔一个音取一个，就得到C和弦(C-E-G)",
            "同理得到Dm(D-F-A)、Em(E-G-B)、F(F-A-C)、G(G-B-D)、Am(A-C-E)",
            "C大调的自然和弦：C Dm Em F G Am",
            "A小调是C大调的关系小调，使用完全相同的音符，只是起始音不同",
            "练习：用C大调音阶的音符，在C→Am→F→G进行上尝试简单旋律",
          ],
        } as TechniqueContent,
      },
    ],
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
    exercises: [
      {
        id: "c7-e1",
        name: "A小调五声第一指型（5品）",
        type: "scale",
        content: {
          scaleName: "A小调五声",
          key: "Am",
          pattern: [1, 4],
          strings: [
            [5, 8],
            [5, 7],
            [5, 7],
            [5, 7],
            [5, 8],
            [5, 8],
          ],
        } as ScaleContent,
      },
      {
        id: "c7-e2",
        name: "G大调五声第一指型（3品）",
        type: "scale",
        content: {
          scaleName: "G大调五声",
          key: "G",
          pattern: [1, 4],
          strings: [
            [3, 5],
            [3, 5],
            [3, 5],
            [3, 5],
            [3, 5],
            [3, 6],
          ],
        } as ScaleContent,
      },
      {
        id: "c7-e3",
        name: "五声音阶练习乐句",
        type: "tab",
        content: {
          strings: [
            [5, 8, 5, null, null, null],
            [null, null, null, 5, 7, 5],
            [5, 7, 5, null, null, null],
            [null, null, null, 5, 7, 5],
            [5, 8, 5, null, null, null],
            [null, null, null, 5, 8, 5],
          ],
          bpm: 70,
        } as TabContent,
      },
      {
        id: "c7-e4",
        name: "即兴演奏入门",
        type: "technique",
        content: {
          name: "即兴入门方法",
          description: "用五声音阶开始你的第一次即兴演奏",
          steps: [
            "先熟悉A小调五声第一指型的所有音符位置",
            "找到所有根音位置（5弦空弦A和6弦5品A）",
            "从根音开始，随意弹奏指型内的音符，不必按固定顺序",
            "节奏比音符更重要——尝试用不同节奏弹同样的几个音",
            "重复是好的：弹一个乐句后重复2-3次，形成\"动机\"",
            "配合Am→Dm→Em→Am的伴奏进行练习",
          ],
        } as TechniqueContent,
      },
    ],
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
    exercises: [
      {
        id: "c8-e1",
        name: "滑弦(Slide)技巧",
        type: "technique",
        content: {
          name: "滑弦技巧",
          description: "从一个音滑到另一个音，产生连贯的音高变化",
          steps: [
            "滑弦：按住一个音，手指不离开指板滑动到目标品",
            "上行滑弦：从低品位滑到高品位，如5品滑到7品",
            "下行滑弦：从高品位滑到低品位，如7品滑到5品",
            "滑弦过程中保持按弦力度，确保音持续不断",
            "目标音要落在节拍上，滑动过程占用前一个音的时间",
            "练习：在2弦5→7、5→8、7→10上练习滑弦",
          ],
        } as TechniqueContent,
      },
      {
        id: "c8-e2",
        name: "滑弦练习",
        type: "tab",
        content: {
          strings: [
            [5, 7, 5, 7, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [5, 7, 5, 8, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
          ],
          bpm: 60,
        } as TabContent,
      },
      {
        id: "c8-e3",
        name: "推弦(Bend)技巧",
        type: "technique",
        content: {
          name: "推弦技巧",
          description: "电吉他最具表现力的技巧——推弦",
          steps: [
            "推弦：将弦向与指板平行的方向推拉，使音高升高",
            "半音推弦：推到比原音高半音的位置（1品的距离）",
            "全音推弦：推到比原音高全音的位置（2品的距离）",
            "推弦时利用手腕转动发力，不要只用手指硬推",
            "可以借助其他手指一起推，例如无名指推弦时中指辅助",
            "练习：2弦7品推全音（目标音=9品音高），先弹9品对比音高",
          ],
        } as TechniqueContent,
      },
      {
        id: "c8-e4",
        name: "击弦与勾弦",
        type: "technique",
        content: {
          name: "击弦(Hammer-on)与勾弦(Pull-off)",
          description: "连奏技巧——不使用拨片快速演奏音符",
          steps: [
            "击弦(HO)：拨片弹响低音后，用左手手指用力敲击高品发出声音",
            "勾弦(PO)：左手按弦手指勾离琴弦时带动琴弦发声",
            "击弦练习：5品拨弦→7品击弦（不拨），听7品是否清晰",
            "勾弦练习：7品拨弦→勾向5品，7品手指向外侧勾出",
            "击勾组合(trill)：快速反复击弦和勾弦，如5h7p5h7p5",
            "关键：击弦要果断有力，勾弦要方向正确（向下方勾出）",
          ],
        } as TechniqueContent,
      },
      {
        id: "c8-e5",
        name: "击勾弦练习",
        type: "tab",
        content: {
          strings: [
            [5, 7, 5, 7, 5, 7],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [5, 7, 5, 8, 5, 7],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
          ],
          bpm: 70,
        } as TabContent,
      },
    ],
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
    exercises: [
      {
        id: "c9-e1",
        name: "CAGED系统概述",
        type: "technique",
        content: {
          name: "CAGED系统",
          description: "用5个开放和弦形状理解整个指板",
          steps: [
            "CAGED代表C、A、G、E、D五种开放和弦形状",
            "每种形状对应一个音阶指型，在指板上依次排列",
            "C形状在最低把位，D形状在最高把位（或反过来循环）",
            "相邻形状有重叠区域，连接它们就能覆盖整个指板",
            "先学C形状和A形状的音阶指型，这是最常用的两个",
            "掌握CAGED后，你能在任何位置找到任何调的音阶",
          ],
        } as TechniqueContent,
      },
      {
        id: "c9-e2",
        name: "C指型音阶",
        type: "scale",
        content: {
          scaleName: "C指型大调音阶",
          key: "C",
          pattern: [1, 3],
          strings: [
            [0, 1, 3],
            [0, 2, 3],
            [0, 2],
            [0, 2, 3],
            [0, 2, 3],
            [0, 1, 3],
          ],
        } as ScaleContent,
      },
      {
        id: "c9-e3",
        name: "A指型音阶",
        type: "scale",
        content: {
          scaleName: "A指型大调音阶",
          key: "A",
          pattern: [1, 3],
          strings: [
            [2, 3, 5],
            [2, 3, 5],
            [2, 4, 5],
            [2, 4, 5],
            [2, 3, 5],
            [2, 3, 5],
          ],
        } as ScaleContent,
      },
      {
        id: "c9-e4",
        name: "模进练习方法",
        type: "technique",
        content: {
          name: "音阶模进",
          description: "用模进(sequence)方式练习音阶，提升技巧和乐感",
          steps: [
            "三音模进：1-2-3, 2-3-4, 3-4-5, 4-5-6... 依次向上",
            "四音模进：1-2-3-4, 2-3-4-5, 3-4-5-6... 以此类推",
            "模进让音阶练习更有音乐性，不像单纯上下行那么枯燥",
            "先在C指型上练三音模进，速度从60BPM开始",
            "每个模进组要均匀，节奏不能忽快忽慢",
            "熟练后在A指型上也做同样练习，逐步提速到100BPM",
          ],
        } as TechniqueContent,
      },
    ],
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
    exercises: [
      {
        id: "c10-e1",
        name: "强力和弦(Power Chord)",
        type: "technique",
        content: {
          name: "强力和弦",
          description: "摇滚乐的灵魂和弦——只需两个手指",
          steps: [
            "强力和弦只包含根音和五度音，没有三度音，因此既不是大调也不是小调",
            "食指按根音（5弦或6弦），无名指按高两根弦高2品的位置",
            "E5：6弦空弦+5弦2品+4弦2品（可选）",
            "A5：5弦空弦+4弦2品+3弦2品（可选）",
            "强力和弦可以沿指板移动：5弦3品=C5，5弦5品=D5",
            "配合失真效果器使用，是摇滚和金属乐的基础",
          ],
        } as TechniqueContent,
      },
      {
        id: "c10-e2",
        name: "E5强力和弦",
        type: "chord",
        content: {
          chordName: "E5",
          positions: [0, 2, 2, null, null, null],
        } as ChordContent,
      },
      {
        id: "c10-e3",
        name: "A5强力和弦",
        type: "chord",
        content: {
          chordName: "A5",
          positions: [null, 0, 2, 2, null, null],
        } as ChordContent,
      },
      {
        id: "c10-e4",
        name: "F横按和弦",
        type: "chord",
        content: {
          chordName: "F",
          positions: [1, 3, 3, 2, 1, 1],
          barre: { fret: 1, from: 1, to: 6 },
        } as ChordContent,
      },
      {
        id: "c10-e5",
        name: "Bm横按和弦",
        type: "chord",
        content: {
          chordName: "Bm",
          positions: [null, 2, 4, 4, 3, 2],
          barre: { fret: 2, from: 1, to: 5 },
        } as ChordContent,
      },
      {
        id: "c10-e6",
        name: "七和弦入门",
        type: "technique",
        content: {
          name: "七和弦",
          description: "给和弦增加色彩——七和弦",
          steps: [
            "七和弦在三和弦基础上增加一个七度音，使声音更丰富",
            "大七和弦(Maj7)：明亮柔和，如Cmaj7 (C-E-G-B)",
            "属七和弦(7)：有张力感，需要解决，如G7 (G-B-D-F)",
            "小七和弦(m7)：忧郁柔和，如Am7 (A-C-E-G)",
            "开放Am7指法：6弦x-5弦0-4弦2-3弦0-2弦0-1弦3（简化版）",
            "七和弦在爵士、蓝调、流行中大量使用",
          ],
        } as TechniqueContent,
      },
      {
        id: "c10-e7",
        name: "Am7和弦",
        type: "chord",
        content: {
          chordName: "Am7",
          positions: [null, 0, 2, 0, 1, 3],
        } as ChordContent,
      },
    ],
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
    exercises: [
      {
        id: "c11-e1",
        name: "十六分音符练习",
        type: "rhythm",
        content: {
          pattern: ["下", "上", "下", "上", "下", "上", "下", "上", "下", "上", "下", "上", "下", "上", "下", "上"],
          bpm: 70,
          description: "每拍四个音，十六分音符经济拨弦",
        } as RhythmContent,
      },
      {
        id: "c11-e2",
        name: "摇滚节奏型",
        type: "rhythm",
        content: {
          pattern: ["下", "下", "上", "下", "上"],
          bpm: 100,
          description: "经典摇滚强力和弦节奏",
        } as RhythmContent,
      },
      {
        id: "c11-e3",
        name: "Funk节奏型",
        type: "rhythm",
        content: {
          pattern: ["下", "上", "上", "下", "上", "上", "下", "上"],
          bpm: 90,
          description: "Funk风格：大量闷音+偶尔开放音",
        } as RhythmContent,
      },
      {
        id: "c11-e4",
        name: "Shuffle节奏",
        type: "rhythm",
        content: {
          pattern: ["下", "上", "下", "上", "下", "上"],
          bpm: 80,
          description: "蓝调Shuffle节奏：长-短-长-短的摇摆感",
        } as RhythmContent,
      },
      {
        id: "c11-e5",
        name: "切分音练习",
        type: "technique",
        content: {
          name: "切分音(Syncopation)",
          description: "打破正拍规律，制造节奏张力",
          steps: [
            "切分音：在非强拍上弹奏重音，打破听众的节拍预期",
            "先练习数拍时只念反拍：1-and-2-and-3-and-4-and",
            "在'and'上弹奏重音而非数字拍上——这就是切分",
            "闷音扫弦是制造切分感的好方法：大部分弹闷音，只在关键位置开放",
            "Funk音乐大量使用切分：听James Brown的吉他节奏",
            "练习：用节拍器，先在正拍弹，然后移到反拍弹，感受差异",
          ],
        } as TechniqueContent,
      },
    ],
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
    exercises: [
      {
        id: "c12-e1",
        name: "歌曲结构认知",
        type: "technique",
        content: {
          name: "歌曲结构",
          description: "理解流行音乐的常见结构",
          steps: [
            "Intro(前奏)：通常4-8小节，引入歌曲的动机和氛围",
            "Verse(主歌)：讲述故事的部分，旋律和伴奏较简单",
            "Chorus(副歌)：歌曲的高潮和记忆点，旋律最抓耳的部分",
            "Bridge(桥段)：连接两段副歌，提供对比和变化",
            "常见结构：Intro→Verse→Chorus→Verse→Chorus→Bridge→Chorus→Outro",
            "练习：听一首喜欢的歌，标记出每个段落的位置和长度",
          ],
        } as TechniqueContent,
      },
      {
        id: "c12-e2",
        name: "12小节蓝调进行",
        type: "rhythm",
        content: {
          pattern: ["下", "上", "下", "上", "下", "上", "下", "上"],
          bpm: 80,
          description: "12小节蓝调：I-I-I-I-IV-IV-I-I-V-IV-I-V，Am即为Am-Am-Am-Am-Dm-Dm-Am-Am-Em-Dm-Am-Em",
        } as RhythmContent,
      },
      {
        id: "c12-e3",
        name: "综合练习曲（Am五声）",
        type: "tab",
        content: {
          strings: [
            [5, 8, 5, null, null, null],
            [null, null, null, 5, 7, 5],
            [7, 5, null, null, null, null],
            [null, null, 5, 7, 5, null],
            [5, 8, 5, null, null, null],
            [null, null, null, 5, 8, null],
            [5, null, null, null, null, null],
            [null, null, null, null, null, null],
          ],
          bpm: 80,
        } as TabContent,
      },
      {
        id: "c12-e4",
        name: "即兴演奏方法",
        type: "technique",
        content: {
          name: "即兴演奏综合指南",
          description: "将所有技巧融会贯通，开始真正的即兴",
          steps: [
            "即兴=有组织的自由——在音阶和和弦的框架内自由发挥",
            "步骤1：选定一个进行（如Am→F→C→G），用节拍器设定速度",
            "步骤2：先用五声音阶弹简单旋律，只使用2-3个音符",
            "步骤3：加入节奏变化——同样的音用不同节奏弹效果完全不同",
            "步骤4：加入技巧——推弦、滑弦、勾击弦让旋律更生动",
            "步骤5：录音回听——这是进步最快的方法，客观听到自己的优缺点",
            "长期计划：每天练习30分钟即兴，持续3个月会有质的飞跃",
          ],
        } as TechniqueContent,
      },
      {
        id: "c12-e5",
        name: "持续进步计划",
        type: "technique",
        content: {
          name: "长期学习计划",
          description: "完成12周课程后的持续进步指南",
          steps: [
            "每日热身（10分钟）：爬格子+音阶上下行，速度逐步提高",
            "技巧练习（15分钟）：推弦、滑弦、速弹等专项训练",
            "歌曲学习（20分钟）：学习喜欢的歌曲的吉他部分",
            "即兴演奏（15分钟）：跟着伴奏即兴，录音回听",
            "每周学一首完整的歌，从简到难逐步提升",
            "多听不同风格的音乐，拓宽音乐视野和审美",
          ],
        } as TechniqueContent,
      },
    ],
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
