export type SoundName = 'click' | 'add' | 'alert' | 'success' | 'fail'

interface ToneSpec {
  frequency: number
  duration: number
  type: OscillatorType
  gain: number
  delay?: number
  sweepTo?: number
}

const PRESETS: Record<SoundName, ToneSpec[]> = {
  click: [{ frequency: 660, duration: 0.05, type: 'triangle', gain: 0.08 }],
  add: [
    { frequency: 520, duration: 0.08, type: 'sine', gain: 0.1 },
    { frequency: 780, duration: 0.1, type: 'sine', gain: 0.09, delay: 0.07 },
  ],
  alert: [
    { frequency: 440, duration: 0.18, type: 'square', gain: 0.06 },
    { frequency: 330, duration: 0.22, type: 'square', gain: 0.06, delay: 0.16 },
  ],
  success: [
    { frequency: 523, duration: 0.14, type: 'sine', gain: 0.1 },
    { frequency: 659, duration: 0.14, type: 'sine', gain: 0.1, delay: 0.12 },
    { frequency: 784, duration: 0.28, type: 'sine', gain: 0.11, delay: 0.24 },
  ],
  fail: [
    { frequency: 300, duration: 0.2, type: 'sawtooth', gain: 0.06, sweepTo: 160 },
    { frequency: 150, duration: 0.3, type: 'sawtooth', gain: 0.05, delay: 0.18, sweepTo: 90 },
  ],
}

/** Moteur audio synthétique — aucun fichier externe (§23) */
class AudioEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private musicGain: GainNode | null = null
  private musicNodes: OscillatorNode[] = []
  private volume = 0.7
  private effectsEnabled = true
  private musicEnabled = false

  configure(options: { volume: number; soundEffects: boolean; music: boolean }): void {
    this.volume = Math.max(0, Math.min(1, options.volume / 100))
    this.effectsEnabled = options.soundEffects
    this.musicEnabled = options.music
    if (this.master) this.master.gain.value = this.volume * 0.6
    if (this.musicEnabled) this.startMusic()
    else this.stopMusic()
  }

  /** À appeler sur la première interaction utilisateur */
  unlock(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume()
      return
    }
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return
    this.ctx = new Ctor()
    this.master = this.ctx.createGain()
    this.master.gain.value = this.volume * 0.6
    this.master.connect(this.ctx.destination)
  }

  play(name: SoundName): void {
    if (!this.effectsEnabled) return
    this.unlock()
    if (!this.ctx || !this.master) return
    const now = this.ctx.currentTime
    for (const tone of PRESETS[name]) {
      const start = now + (tone.delay ?? 0)
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = tone.type
      osc.frequency.setValueAtTime(tone.frequency, start)
      if (tone.sweepTo) {
        osc.frequency.exponentialRampToValueAtTime(tone.sweepTo, start + tone.duration)
      }
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(tone.gain, start + 0.012)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + tone.duration)
      osc.connect(gain)
      gain.connect(this.master)
      osc.start(start)
      osc.stop(start + tone.duration + 0.02)
    }
  }

  private startMusic(): void {
    if (!this.ctx || !this.master || this.musicNodes.length > 0) return
    this.musicGain = this.ctx.createGain()
    this.musicGain.gain.value = 0.035
    this.musicGain.connect(this.master)

    const frequencies = [110, 164.81, 220, 277.18]
    frequencies.forEach((frequency, index) => {
      if (!this.ctx || !this.musicGain) return
      const osc = this.ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = frequency
      const lfo = this.ctx.createOscillator()
      const lfoGain = this.ctx.createGain()
      lfo.frequency.value = 0.04 + index * 0.017
      lfoGain.gain.value = 0.012
      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)
      osc.connect(this.musicGain)
      osc.start()
      lfo.start()
      this.musicNodes.push(osc, lfo)
    })
  }

  private stopMusic(): void {
    for (const node of this.musicNodes) {
      try {
        node.stop()
      } catch {
        /* déjà arrêté */
      }
    }
    this.musicNodes = []
    this.musicGain?.disconnect()
    this.musicGain = null
  }
}

export const audio = new AudioEngine()
