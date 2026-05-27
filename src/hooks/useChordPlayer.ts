import { useRef, useCallback } from "react"

// Standard guitar tuning frequencies (open strings)
const OPEN_STRING_FREQS = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63]

function getFrequency(stringIndex: number, fret: number): number {
  if (stringIndex < 0 || stringIndex > 5) return 0
  return OPEN_STRING_FREQS[stringIndex] * Math.pow(2, fret / 12)
}

// Create a plucked-string sound using Karplus-Strong-like synthesis
function playPluckedString(
  audioCtx: AudioContext,
  destination: AudioNode,
  frequency: number,
  startTime: number,
  duration: number = 2.0
) {
  // Use multiple harmonics for richer tone
  const harmonics = [
    { ratio: 1, gain: 0.4, decay: duration },
    { ratio: 2, gain: 0.15, decay: duration * 0.6 },
    { ratio: 3, gain: 0.08, decay: duration * 0.35 },
    { ratio: 4, gain: 0.04, decay: duration * 0.2 },
  ]

  harmonics.forEach(({ ratio, gain: harmGain, decay }) => {
    const freq = frequency * ratio
    if (freq > 8000) return // Skip inaudible harmonics

    const osc = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()

    osc.type = ratio === 1 ? "triangle" : "sine"
    osc.frequency.setValueAtTime(freq, startTime)

    // Pluck envelope: sharp attack, exponential decay
    gainNode.gain.setValueAtTime(0, startTime)
    gainNode.gain.linearRampToValueAtTime(harmGain, startTime + 0.005)
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + decay)

    osc.connect(gainNode)
    gainNode.connect(destination)
    osc.start(startTime)
    osc.stop(startTime + decay)
  })
}

export function useChordPlayer() {
  const audioCtxRef = useRef<AudioContext | null>(null)

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new AudioContext()
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }, [])

  const playChord = useCallback(
    (positions: (number | null)[], strumDelay: number = 0.04) => {
      const ctx = getAudioContext()

      // Create a compressor for cleaner mix
      const compressor = ctx.createDynamicsCompressor()
      compressor.threshold.setValueAtTime(-20, ctx.currentTime)
      compressor.knee.setValueAtTime(10, ctx.currentTime)
      compressor.ratio.setValueAtTime(4, ctx.currentTime)
      compressor.attack.setValueAtTime(0.003, ctx.currentTime)
      compressor.release.setValueAtTime(0.1, ctx.currentTime)

      // Reverb-like effect using delay
      const delay = ctx.createDelay()
      delay.delayTime.setValueAtTime(0.03, ctx.currentTime)
      const feedback = ctx.createGain()
      feedback.gain.setValueAtTime(0.15, ctx.currentTime)
      const wetGain = ctx.createGain()
      wetGain.gain.setValueAtTime(0.2, ctx.currentTime)

      delay.connect(feedback)
      feedback.connect(delay)
      delay.connect(wetGain)

      const mixBus = ctx.createGain()
      mixBus.gain.setValueAtTime(0.7, ctx.currentTime)

      mixBus.connect(compressor)
      mixBus.connect(delay)
      wetGain.connect(compressor)
      compressor.connect(ctx.destination)

      const now = ctx.currentTime + 0.02

      // Strum from low to high string with slight delays
      let stringCount = 0
      for (let i = 0; i < 6; i++) {
        const fret = positions[i]
        if (fret === null) continue

        const freq = fret === 0 ? OPEN_STRING_FREQS[i] : getFrequency(i, fret)
        if (freq <= 0) continue

        const delayOffset = stringCount * strumDelay
        playPluckedString(ctx, mixBus, freq, now + delayOffset, 2.5)
        stringCount++
      }
    },
    [getAudioContext]
  )

  const playString = useCallback(
    (stringIndex: number, fret: number | null) => {
      if (fret === null || stringIndex < 0 || stringIndex > 5) return

      const ctx = getAudioContext()
      const gainNode = ctx.createGain()
      gainNode.gain.setValueAtTime(0.5, ctx.currentTime)
      gainNode.connect(ctx.destination)

      const freq = fret === 0 ? OPEN_STRING_FREQS[stringIndex] : getFrequency(stringIndex, fret)
      if (freq <= 0) return

      playPluckedString(ctx, gainNode, freq, ctx.currentTime + 0.01, 1.5)
    },
    [getAudioContext]
  )

  return { playChord, playString }
}
