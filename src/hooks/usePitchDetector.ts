import { useState, useRef, useCallback, useEffect } from "react"

export interface PitchData {
  frequency: number
  noteName: string
  octave: number
  cents: number
  clarity: number
}

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

function frequencyToNoteName(frequency: number): { name: string; octave: number; cents: number; midi: number } {
  if (frequency <= 0) {
    return { name: "—", octave: 0, cents: 0, midi: 0 }
  }
  const midi = 69 + 12 * Math.log2(frequency / 440)
  const roundedMidi = Math.round(midi)
  const cents = Math.round((midi - roundedMidi) * 100)
  const noteIndex = ((roundedMidi % 12) + 12) % 12
  const octave = Math.floor(roundedMidi / 12) - 1
  return {
    name: NOTE_NAMES[noteIndex],
    octave,
    cents,
    midi: roundedMidi,
  }
}

// Autocorrelation pitch detection
function autoCorrelate(buf: Float32Array, sampleRate: number): { frequency: number; clarity: number } {
  const SIZE = buf.length
  const rms = Math.sqrt(
    buf.reduce((sum, val) => sum + val * val, 0) / SIZE
  )

  // Silence threshold
  if (rms < 0.01) {
    return { frequency: 0, clarity: 0 }
  }

  let r1 = 0
  let r2 = SIZE - 1
  const threshold = 0.2

  // Trim buffer to find first downward zero-crossing
  for (let i = 0; i < SIZE / 2; i++) {
    if (buf[i] < 0) {
      r1 = i
      break
    }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (buf[r1 + i] >= 0) {
      r2 = r1 + i
      break
    }
  }

  // Trim
  const trimmed = buf.slice(r1, r2)
  const c = new Array(trimmed.length).fill(0)

  for (let i = 0; i < trimmed.length; i++) {
    for (let j = 0; j < trimmed.length - i; j++) {
      c[i] += trimmed[j] * trimmed[j + i]
    }
  }

  let d = 0
  while (c[d] > c[d + 1]) d++
  let maxval = -1
  let maxpos = -1

  for (let i = d; i < trimmed.length; i++) {
    if (c[i] > maxval) {
      maxval = c[i]
      maxpos = i
    }
  }

  let T0 = maxpos

  // Parabolic interpolation for better precision
  const x1 = c[T0 - 1]
  const x2 = c[T0]
  const x3 = c[T0 + 1]
  const a = (x1 + x3 - 2 * x2) / 2
  const b = (x3 - x1) / 2

  if (a !== 0) {
    T0 = T0 - b / (2 * a)
  }

  const frequency = sampleRate / T0
  const clarity = maxval / c[0]

  if (frequency > 0 && frequency < 2000 && clarity > threshold) {
    return { frequency, clarity }
  }

  return { frequency: 0, clarity: 0 }
}

export function usePitchDetector() {
  const [isListening, setIsListening] = useState(false)
  const [pitchData, setPitchData] = useState<PitchData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number>(0)
  const bufferRef = useRef<Float32Array | null>(null)

  const analyze = useCallback(() => {
    if (!analyserRef.current || !bufferRef.current) return

    analyserRef.current.getFloatTimeDomainData(bufferRef.current)
    const { frequency, clarity } = autoCorrelate(
      bufferRef.current,
      audioContextRef.current?.sampleRate || 44100
    )

    if (frequency > 0 && clarity > 0.5) {
      const note = frequencyToNoteName(frequency)
      setPitchData({
        frequency: Math.round(frequency),
        noteName: note.name,
        octave: note.octave,
        cents: note.cents,
        clarity: Math.round(clarity * 100),
      })
    } else {
      setPitchData(null)
    }

    rafRef.current = requestAnimationFrame(analyze)
  }, [])

  const start = useCallback(async () => {
    try {
      setError(null)

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
        },
      })
      mediaStreamRef.current = stream

      const audioContext = new AudioContext()
      audioContextRef.current = audioContext

      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 2048
      source.connect(analyser)

      analyserRef.current = analyser
      bufferRef.current = new Float32Array(analyser.fftSize)

      setIsListening(true)
      rafRef.current = requestAnimationFrame(analyze)
    } catch (err) {
      setError("无法访问麦克风，请检查权限设置")
      console.error("Microphone access error:", err)
    }
  }, [analyze])

  const stop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop())
      mediaStreamRef.current = null
    }

    analyserRef.current = null
    bufferRef.current = null
    setIsListening(false)
    setPitchData(null)
  }, [])

  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  return { isListening, pitchData, error, start, stop }
}

// Utility: get target frequency for a note
export function getNoteFrequency(noteName: string, octave: number): number {
  const noteIndex = NOTE_NAMES.indexOf(noteName)
  if (noteIndex === -1) return 0
  const midi = (octave + 1) * 12 + noteIndex
  return 440 * Math.pow(2, (midi - 69) / 12)
}

// Utility: compare detected pitch with target
export function comparePitch(
  detected: PitchData | null,
  targetNote: string,
  targetOctave: number
): {
  match: boolean
  diffCents: number
  direction: "flat" | "sharp" | "in-tune" | "none"
} {
  if (!detected) {
    return { match: false, diffCents: 0, direction: "none" }
  }

  const targetFreq = getNoteFrequency(targetNote, targetOctave)
  if (targetFreq <= 0) {
    return { match: false, diffCents: 0, direction: "none" }
  }

  const detectedMidi = 69 + 12 * Math.log2(detected.frequency / 440)
  const targetMidi = 69 + 12 * Math.log2(targetFreq / 440)
  const diffCents = Math.round((detectedMidi - targetMidi) * 100)

  const noteMatch = detected.noteName === targetNote && detected.octave === targetOctave

  if (noteMatch && Math.abs(diffCents) <= 15) {
    return { match: true, diffCents, direction: "in-tune" }
  } else if (diffCents > 15) {
    return { match: false, diffCents, direction: "sharp" }
  } else if (diffCents < -15) {
    return { match: false, diffCents, direction: "flat" }
  }

  return { match: false, diffCents, direction: "none" }
}
