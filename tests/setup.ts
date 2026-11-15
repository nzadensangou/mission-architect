import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})

// jsdom ne fournit pas ces API utilisées par le moteur audio
if (!('AudioContext' in window)) {
  class MockAudioContext {
    currentTime = 0
    state = 'running'
    destination = {}
    createGain() {
      return { gain: { value: 0, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }, connect: vi.fn(), disconnect: vi.fn() }
    }
    createOscillator() {
      return {
        type: 'sine',
        frequency: { value: 0, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      }
    }
    resume() {
      return Promise.resolve()
    }
  }
  Object.defineProperty(window, 'AudioContext', { writable: true, value: MockAudioContext })
}

if (!('scrollTo' in window)) {
  Object.defineProperty(window, 'scrollTo', { writable: true, value: vi.fn() })
}
