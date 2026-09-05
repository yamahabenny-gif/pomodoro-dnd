'use client'

import { useEffect, useRef } from 'react'

/**
 * Plays one looping ambience/music cue for as long as `active` is true.
 * Audio must never block the focus flow (docs/PHASE1-ART-AUDIO-HANDOFF.md),
 * so every failure — autoplay blocked, file missing, codec unsupported — is
 * swallowed. Muted playback and a missing production audio file both look
 * exactly like "quiet room," which is the correct fallback for a Fokus-Screen.
 */
export function useSceneAudio(src: string, active: boolean, muted: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(src)
    audio.loop = true
    audio.preload = 'auto'
    audio.addEventListener('error', () => {
      // Missing/undelivered asset — stay silent, never surface a broken UI.
    })
    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [src])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = muted

    if (active) {
      audio.play().catch(() => {
        // Autoplay policies or a 404 — silence is an acceptable fallback here.
      })
    } else {
      audio.pause()
    }
  }, [active, muted])
}
