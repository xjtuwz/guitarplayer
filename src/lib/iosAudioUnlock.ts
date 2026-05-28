// iOS Safari routes Web Audio API output to the earpiece (receiver) by default.
// This module unlocks the speaker output by keeping a looping HTMLAudioElement
// alive, which forces the iOS audio session category to "playback" (speaker).

// We must keep a reference to the audio element to prevent garbage collection.
// If the element is GC'd, iOS reverts the audio session to earpiece routing.
// Exported to satisfy noUnusedLocals — the GC root "reads" it.
export let keeperAudio: HTMLAudioElement | null = null
let unlocked = false

// Generate a longer silent WAV (1 second) to give iOS time to switch audio route
// 44100Hz, 16-bit, mono, 1 second = 44100 samples * 2 bytes + 44 byte header
function generateSilentWavUri(): string {
  const sampleRate = 44100
  const numSamples = sampleRate * 1 // 1 second
  const dataSize = numSamples * 2 // 16-bit mono
  const buffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(buffer)

  // RIFF header
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
  }
  writeString(0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true) // chunk size
  view.setUint16(20, 1, true) // PCM
  view.setUint16(22, 1, true) // mono
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true) // byte rate
  view.setUint16(32, 2, true) // block align
  view.setUint16(34, 16, true) // bits per sample
  writeString(36, 'data')
  view.setUint32(40, dataSize, true)
  // samples are already zeroed (silence)

  const blob = new Blob([buffer], { type: 'audio/wav' })
  return URL.createObjectURL(blob)
}

let silentWavUri: string | null = null

/**
 * Must be called from a user gesture (click/tap).
 * On iOS, this switches the audio routing from earpiece to speaker
 * by playing a looping silent audio element that keeps the audio
 * session in "playback" mode.
 * Safe to call multiple times — only runs once.
 */
export async function unlockIOSAudio(): Promise<void> {
  if (unlocked) return

  try {
    if (!silentWavUri) {
      silentWavUri = generateSilentWavUri()
    }

    const audio = new Audio()
    audio.src = silentWavUri
    audio.volume = 0.01 // Near-silent but not zero (iOS may ignore zero volume)
    audio.loop = true // Keep playing to maintain the audio session
    audio.setAttribute('playsinline', '')
    audio.setAttribute('webkit-playsinline', '')

    await audio.play()

    // Keep the audio element alive so iOS doesn't revert to earpiece
    keeperAudio = audio
    unlocked = true
  } catch {
    // Autoplay may be blocked — retry on next user gesture
    // Don't set unlocked = true so we'll try again
  }
}

/**
 * Create an AudioContext that routes to the speaker on iOS.
 * Should be called AFTER unlockIOSAudio().
 */
export function createSpeakerAudioContext(): AudioContext {
  const ctx = new AudioContext()
  if (ctx.state === 'suspended') {
    ctx.resume()
  }
  return ctx
}

/**
 * Ensure an existing AudioContext is active and routing to speaker.
 */
export function ensureSpeakerOutput(audioCtx: AudioContext): void {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
}
