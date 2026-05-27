// iOS Safari routes Web Audio API output to the earpiece (receiver) by default.
// This module unlocks the speaker output by playing a silent HTMLAudioElement
// on the first user interaction, which switches the audio session to "playback" mode.

let unlocked = false

// Create a tiny silent WAV as a data URI
const SILENCE_URI =
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="

/**
 * Must be called from a user gesture (click/tap).
 * On iOS, this switches the audio routing from earpiece to speaker.
 * Safe to call multiple times — only runs once.
 */
export function unlockIOSAudio(): Promise<void> {
  if (unlocked) return Promise.resolve()

  return new Promise((resolve) => {
    const audio = new Audio()
    audio.src = SILENCE_URI
    audio.volume = 1

    const onEnd = () => {
      unlocked = true
      cleanup()
      resolve()
    }

    const onError = () => {
      // Even on error, the audio session may be unlocked
      unlocked = true
      cleanup()
      resolve()
    }

    const cleanup = () => {
      audio.removeEventListener("ended", onEnd)
      audio.removeEventListener("error", onError)
    }

    audio.addEventListener("ended", onEnd)
    audio.addEventListener("error", onError)

    const playPromise = audio.play()
    if (playPromise) {
      playPromise.catch(() => {
        // Autoplay blocked — will be unlocked on next user gesture
        cleanup()
        resolve()
      })
    }
  })
}

/**
 * Ensure an AudioContext is set to the correct destination for speaker output.
 * Call this after getting/resuming the context.
 */
export function ensureSpeakerOutput(audioCtx: AudioContext): void {
  // On iOS Safari, the AudioContext destination already routes correctly
  // once the audio session has been unlocked via HTMLAudioElement.
  // This is a no-op placeholder for any future platform-specific adjustments.
  if (audioCtx.state === "suspended") {
    audioCtx.resume()
  }
}
